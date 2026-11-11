#!/usr/bin/env node
// Pulls public GitHub data for the portfolio and writes data/github.json.
// Runs in GitHub Actions (see .github/workflows/update-github.yml) or locally:
//   GH_TOKEN=ghp_xxx node scripts/update-github.mjs
// Needs Node 18+ (built-in fetch). No dependencies.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const profile = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const USER = process.env.GH_USER || profile.githubUser;
const TOKEN = process.env.GH_TOKEN || '';
const API = 'https://api.github.com';

const headers = {
  'User-Agent': `${USER}-portfolio-sync`,
  Accept: 'application/vnd.github+json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function gh(url, opts = {}) {
  const res = await fetch(url.startsWith('http') ? url : API + url, { headers: { ...headers, ...(opts.headers || {}) }, ...opts });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}: ${await res.text()}`);
  return opts.raw ? res.text() : res.json();
}

// First real paragraph of a README: skips badges, headings, HTML, code and tables.
function summarize(md) {
  if (!md) return null;
  const text = md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ');
  for (const block of text.split(/\n\s*\n/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((l) => /^(#|!\[|\[!\[|\||[-*_]{3,}|>?\s*$)/.test(l))) continue;
    let p = lines.filter((l) => !/^(#|!\[|\[!\[|\|)/.test(l)).join(' ');
    p = p
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`>]/g, '')
      .replace(/^\s*[-+]\s+/, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (p.length < 50) continue;
    return p.length > 240 ? p.slice(0, 237).replace(/\s+\S*$/, '') + '…' : p;
  }
  return null;
}

async function contributionCalendar() {
  if (!TOKEN) return null;
  const query = `query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount } } } } } }`;
  try {
    const res = await fetch(API + '/graphql', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { login: USER } }),
    });
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) {
      console.warn('No contribution calendar (token may lack access):', JSON.stringify(json.errors || json).slice(0, 300));
      return null;
    }
    return {
      total: cal.totalContributions,
      days: cal.weeks.flatMap((w) => w.contributionDays.map((d) => [d.date, d.contributionCount])),
    };
  } catch (e) {
    console.warn('Calendar fetch failed:', e.message);
    return null;
  }
}

const user = await gh(`/users/${USER}`);
const allRepos = await gh(`/users/${USER}/repos?per_page=100&type=owner&sort=pushed`);
const owned = allRepos.filter((r) => !r.fork && !r.archived);

const repos = [];
for (const r of owned) {
  const [languages, readme] = await Promise.all([
    gh(r.languages_url).catch(() => ({})),
    gh(`/repos/${USER}/${r.name}/readme`, { headers: { Accept: 'application/vnd.github.raw' }, raw: true }).catch(() => null),
  ]);
  repos.push({
    name: r.name,
    summary: r.description || summarize(readme),
    language: r.language,
    languages: languages || {},
    homepage: r.homepage || null,
    stars: r.stargazers_count,
    pushed_at: r.pushed_at,
    created_at: r.created_at,
    url: r.html_url,
    topics: r.topics || [],
  });
}

const search = await gh(`/search/issues?q=${encodeURIComponent(`author:${USER} type:pr -user:${USER}`)}&per_page=50&sort=created`);
const prs = (search?.items || []).map((p) => ({
  title: p.title,
  url: p.html_url,
  repo: p.repository_url.split('/').slice(-2).join('/'),
  number: p.number,
  state: p.pull_request?.merged_at ? 'merged' : p.state,
  created_at: p.created_at,
  merged_at: p.pull_request?.merged_at || null,
}));

const rawEvents = (await gh(`/users/${USER}/events/public?per_page=100`)) || [];
const events = rawEvents.slice(0, 40).map((e) => ({
  type: e.type,
  repo: e.repo.name,
  at: e.created_at,
  action: e.payload?.action || e.payload?.ref_type || null,
  title: e.payload?.pull_request?.title || e.payload?.issue?.title || null,
  size: e.payload?.size ?? e.payload?.commits?.length ?? null,
}));

const out = {
  generated_at: new Date().toISOString(),
  user: { login: user.login, public_repos: user.public_repos, followers: user.followers },
  repos,
  prs,
  events,
  calendar: await contributionCalendar(),
};

// Keep generated_at stable when nothing else changed, so the Action doesn't commit every run.
const file = path.join(root, 'data/github.json');
try {
  const prev = JSON.parse(await readFile(file, 'utf8'));
  const strip = (o) => JSON.stringify({ ...o, generated_at: null });
  if (strip(prev) === strip(out)) {
    console.log('No GitHub changes.');
    process.exit(0);
  }
} catch {}
await writeFile(file, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${repos.length} repos, ${prs.length} PRs, ${events.length} events${out.calendar ? `, ${out.calendar.total} contributions` : ''}.`);
