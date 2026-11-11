/* Renders the portfolio from data/profile.json (you edit) and
   data/github.json (written by the GitHub Action). */
(async function () {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DAY = 864e5;
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  // An explicit 'smooth' in JS overrides the CSS reduced-motion rule, so check it here.
  const smooth = () => (reduceMQ.matches ? 'auto' : 'smooth');
  const ic = (n) => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const ago = (iso, short) => {
    if (!iso) return '';
    const d = Date.now() - new Date(iso).getTime();
    const m = Math.round(d / 6e4), h = Math.round(d / 36e5), days = Math.round(d / DAY);
    if (short) return m < 60 ? `${Math.max(m, 1)}m` : h < 24 ? `${h}h` : days < 60 ? `${days}d` : `${Math.round(days / 30)}mo`;
    if (m < 60) return `${Math.max(m, 1)} min ago`;
    if (h < 24) return `${h}h ago`;
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.round(days / 30)} mo ago`;
    return `${(days / 365).toFixed(1)} yr ago`;
  };
  const LANG = { Python: '#5ad1e6', TypeScript: '#7aa7ff', JavaScript: '#ffd35a', HTML: '#ff7a66', CSS: '#b99cff', Jupyter: '#ffb547', 'Jupyter Notebook': '#ffb547', 'C++': '#f06aa0', Java: '#e3a36b', GDScript: '#7ee0b0', Shell: '#9be37a' };
  const langColor = (l) => LANG[l] || '#8b919b';
  const pretty = (n) => n.replace(/[_-]+/g, ' ').replace(/\bai\b/gi, 'AI').replace(/\bml\b/gi, 'ML').replace(/\bv(\d)\b/i, 'v$1').replace(/\b\w/g, (c) => c.toUpperCase());

  // ---- load data -----------------------------------------------------------
  let profile, gh;
  if (window.__PORTFOLIO_DATA) ({ profile, github: gh } = window.__PORTFOLIO_DATA);
  else {
    [profile, gh] = await Promise.all([
      fetch('data/profile.json', { cache: 'no-store' }).then((r) => r.json()),
      fetch('data/github.json', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ repos: [], prs: [], events: [] })),
    ]);
    // Top up the activity feed live if the synced file is more than 6h old (unauthenticated, best effort).
    if (Date.now() - new Date(gh.generated_at || 0) > 6 * 36e5) {
      try {
        const r = await fetch(`https://api.github.com/users/${profile.githubUser}/events/public?per_page=30`);
        if (r.ok) {
          const live = (await r.json()).map((e) => ({ type: e.type, repo: e.repo.name, at: e.created_at, action: e.payload?.action || e.payload?.ref_type || null, title: e.payload?.pull_request?.title || e.payload?.issue?.title || null }));
          if (live.length) gh.events = live;
        }
      } catch {}
    }
  }
  gh.repos ||= []; gh.prs ||= []; gh.events ||= [];
  const repoBy = Object.fromEntries(gh.repos.map((r) => [r.name.toLowerCase(), r]));

  // ---- simple bindings ------------------------------------------------------
  document.querySelectorAll('[data-text]').forEach((el) => (el.textContent = profile[el.dataset.text] ?? ''));
  document.querySelectorAll('[data-link]').forEach((el) => {
    const k = el.dataset.link;
    const href = k === 'email' ? `mailto:${profile.email}` : profile.links[k];
    if (!href) { el.remove(); return; }
    el.href = href;
    if (/^https?:/.test(href)) { el.target = '_blank'; el.rel = 'noopener'; }
  });
  $('#year').textContent = new Date().getFullYear();

  // ---- stats ---------------------------------------------------------------
  const lastActivity = [gh.events[0]?.at, ...gh.repos.map((r) => r.pushed_at)].filter(Boolean).sort().pop();
  const ed0 = profile.education || {};
  const degree = (ed0.degree || '').replace(/,\s*Computer Science (&|and) Engineering$/i, ' CSE');
  const fit = profile.role ? `<li><b>${esc(profile.role)}</b>${degree ? ` · ${esc(degree)}${ed0.when ? ` ${esc(ed0.when.replace(/\s*[–-]\s*/, '–'))}` : ''}` : ''}</li>` : '';
  $('#stats').innerHTML = fit + profile.stats.map((s) => {
    if (s.auto === 'lastPush') { const v = ago(lastActivity); return v ? `<li>${esc(s.label)} <b>${esc(v)}</b></li>` : ''; }
    let v = s.value, label = s.label;
    if (s.auto === 'mergedPRs') { v = gh.prs.filter((p) => p.state === 'merged').length; if (!v) return ''; if (v !== 1) label = label.replace(/^PR\b/, 'PRs'); }
    return `<li><b>${esc(v)}</b> ${esc(label)}</li>`;
  }).join('');

  // ---- featured case studies ----------------------------------------------
  const featuredNames = new Set(profile.featured.map((f) => f.repo.toLowerCase()));
  $('#featured').innerHTML = profile.featured.map((f, i) => {
    const r = repoBy[f.repo.toLowerCase()] || {};
    const repoUrl = r.url || `${profile.links.github}/${f.repo}`;
    const demo = f.demo || r.homepage;
    return `
    <article class="case" id="p-${esc(f.repo)}">
      <div class="case-body">
        <div class="case-top">
          ${r.pushed_at ? `<span class="case-updated"><span class="dot"></span>updated ${esc(ago(r.pushed_at))}</span>` : ''}
        </div>
        <h3>${esc(f.title)}</h3>
        <p class="one">${esc(f.oneLiner)}</p>
        <p class="result"><b>${esc(f.metric.value)}</b> ${esc(f.metric.label)}</p>
        <ul class="points">${f.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <ul class="chips">${f.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="case-links">
          <a class="btn btn-sm" href="${esc(repoUrl)}" target="_blank" rel="noopener">Code ${ic('ur')}</a>
          ${demo ? `<a class="btn btn-sm btn-primary" href="${esc(demo)}" target="_blank" rel="noopener">Live demo ${ic('ur')}</a>` : ''}
        </div>
      </div>
      <figure class="case-visual" aria-hidden="true"><canvas data-scene="${esc(f.scene)}"></canvas></figure>
    </article>`;
  }).join('');

  // ---- auto repo grid -------------------------------------------------------
  const hidden = new Set((profile.hideRepos || []).map((s) => s.toLowerCase()));
  const extra = gh.repos
    .filter((r) => !featuredNames.has(r.name.toLowerCase()) && !hidden.has(r.name.toLowerCase()))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 9);
  $('#repo-grid').innerHTML = extra.map((r) => {
    const o = (profile.repoOverrides || {})[r.name] || {};
    const isNew = Date.now() - new Date(r.created_at) < 30 * DAY;
    return `
    <a class="repo reveal" href="${esc(o.demo || r.homepage || r.url)}" target="_blank" rel="noopener">
      <h3><span>${esc(o.title || pretty(r.name))}</span><span class="arrow">${ic('ur')}</span></h3>
      <p>${esc(o.summary || r.summary || `${r.language || 'Code'} project. Details in the README.`)}</p>
      <div class="meta">
        ${r.language ? `<span><i class="lang-dot" style="background:${langColor(r.language)}"></i>${esc(r.language)}</span>` : ''}
        <span>${esc(ago(r.pushed_at))}</span>
        ${r.stars ? `<span class="stars">${ic('star')} ${r.stars}</span>` : ''}
        ${isNew ? '<span class="new">new</span>' : ''}
      </div>
    </a>`;
  }).join('') || '<p class="muted">New repositories show up here automatically.</p>';
  $('#sync-time').textContent = gh.generated_at ? `Synced from GitHub ${ago(gh.generated_at)} · new repos appear on their own` : 'Synced from GitHub';

  // ---- upstream PRs ---------------------------------------------------------
  const rank = { merged: 0, open: 1, closed: 2 };
  const prs = [...gh.prs].sort((a, b) => (rank[a.state] ?? 3) - (rank[b.state] ?? 3) || new Date(b.created_at) - new Date(a.created_at));
  const stories = profile.prStories || {};
  $('#pr-list').innerHTML = prs.map((p, i) => {
    const st = stories[p.url] || {};
    const [org, name] = p.repo.split('/');
    const num = p.number ?? p.url.split('/').pop();
    const when = p.merged_at ? `merged ${ago(p.merged_at)}` : `opened ${ago(p.created_at)}`;
    return `
    <article class="case">
      <div class="case-body">
        <div class="pr-head">
          <span class="pr-repo">${esc(org)} / ${esc(name)} · #${esc(num)}</span>
          <span class="badge ${esc(p.state)}">${esc(p.state)}</span>
        </div>
        <h3>${esc(st.headline || p.title)}</h3>
        <a class="pr-title-link" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)} ${ic('ur')}</a>
        ${st.problem ? `<dl class="pr-block"><dt>The problem</dt><dd>${esc(st.problem)}</dd></dl>` : ''}
        ${st.approach ? `<dl class="pr-block"><dt>What I did</dt><dd>${esc(st.approach)}</dd></dl>` : ''}
        ${st.tags ? `<ul class="chips">${st.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        <div class="case-links">
          <a class="btn btn-sm" href="${esc(p.url)}" target="_blank" rel="noopener">View PR ${ic('ur')}</a>
          <span class="case-updated" style="align-self:center">${esc(when)}</span>
        </div>
      </div>
      <figure class="case-visual" aria-hidden="true"><canvas data-scene="${esc(st.scene || 'diff')}"></canvas></figure>
    </article>`;
  }).join('') || '<p class="muted">Upstream pull requests appear here automatically.</p>';

  // ---- contact links ---------------------------------------------------------
  $('#link-grid').innerHTML = (profile.contactLinks || []).map((l) => {
    const href = l.key === 'email' ? `mailto:${profile.email}` : profile.links[l.key];
    if (!href) return '';
    const ext = /^https?:/.test(href);
    return `<li><a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}><b>${esc(l.label)} <span>${ic('ur')}</span></b><small>${esc(l.sub || '')}</small></a></li>`;
  }).join('');

  // swipe dots for the mobile link carousel
  const lg = $('#link-grid'), dots = $('#swipe-dots'), n = lg.children.length;
  dots.innerHTML = Array.from({ length: n }, () => '<i></i>').join('') + '<span>swipe</span>';
  const markDot = () => {
    const first = lg.children[0]; if (!first) return;
    const step = first.getBoundingClientRect().width + 10;
    const i = Math.min(n - 1, Math.round(lg.scrollLeft / step));
    [...dots.querySelectorAll('i')].forEach((d, k) => d.classList.toggle('on', k === i));
    const hint = dots.querySelector('span'); if (hint) hint.style.opacity = lg.scrollLeft > 4 ? 0 : 1;
  };
  lg.addEventListener('scroll', markDot, { passive: true }); markDot();

  // ---- activity: heatmap or weekly bars ------------------------------------
  const heat = $('#heatmap');
  if (gh.calendar?.days?.length) {
    const days = gh.calendar.days, max = Math.max(1, ...days.map((d) => d[1]));
    const pad = new Date(days[0][0]).getUTCDay();
    heat.innerHTML = '<i style="visibility:hidden"></i>'.repeat(pad) + days.map(([d, n]) => {
      const l = n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4));
      return `<i data-l="${l}" title="${n} on ${d}"></i>`;
    }).join('');
    $('#heat-title').textContent = `${gh.calendar.total} contributions in the last year`;
    requestAnimationFrame(() => (heat.scrollLeft = heat.scrollWidth));
  } else {
    const weeks = 16, counts = Array(weeks).fill(0);
    const stamp = [...gh.events.map((e) => e.at), ...gh.repos.map((r) => r.pushed_at), ...gh.prs.map((p) => p.created_at)];
    stamp.forEach((s) => { const w = Math.floor((Date.now() - new Date(s)) / (7 * DAY)); if (w >= 0 && w < weeks) counts[weeks - 1 - w]++; });
    const max = Math.max(1, ...counts);
    heat.className = 'weekbars';
    heat.innerHTML = counts.map((c) => `<span class="${c ? 'on' : ''}" style="height:${(c / max) * 100}%" title="${c} events"></span>`).join('');
    heat.insertAdjacentHTML('afterend', '<p class="heat-cap">last 16 weeks · pushes, PRs, comments</p>');
    $('#heat-title').textContent = 'Weekly activity';
  }

  const langs = {};
  gh.repos.filter((r) => !hidden.has(r.name.toLowerCase())).forEach((r) => {
    const L = r.languages && Object.keys(r.languages).length ? r.languages : r.language ? { [r.language]: 1 } : {};
    const tot = Object.values(L).reduce((a, b) => a + b, 0) || 1;
    for (const [k, v] of Object.entries(L)) langs[k] = (langs[k] || 0) + v / tot; // weight each repo equally
  });
  const langList = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const lt = langList.reduce((a, [, v]) => a + v, 0) || 1;
  $('#langbar').innerHTML = langList.map(([k, v]) => `<span style="width:${(v / lt) * 100}%;background:${langColor(k)}" title="${esc(k)}"></span>`).join('');
  $('#langlegend').innerHTML = langList.map(([k, v]) => `<li><i class="lang-dot" style="background:${langColor(k)}"></i>${esc(k)} ${Math.round((v / lt) * 100)}%</li>`).join('');

  const evText = (e) => {
    const repo = e.repo.startsWith(profile.githubUser + '/') ? e.repo.split('/')[1] : e.repo;
    const R = `<b>${esc(repo)}</b>`;
    switch (e.type) {
      case 'PushEvent': return ['push', `Pushed to ${R}`];
      case 'CreateEvent': return ['plus', e.action === 'repository' ? `Created ${R}` : `New ${esc(e.action || 'branch')} in ${R}`];
      case 'PullRequestEvent': return ['pr', `${e.action === 'opened' ? 'Opened' : e.action === 'closed' ? 'Closed' : 'Updated'} a PR in ${R}`];
      case 'PullRequestReviewEvent': case 'PullRequestReviewCommentEvent': return ['eye', `Reviewed in ${R}`];
      case 'IssueCommentEvent': return ['comment', `Commented in ${R}`];
      case 'IssuesEvent': return ['issue', `${e.action === 'opened' ? 'Opened' : 'Updated'} an issue in ${R}`];
      case 'ForkEvent': return ['fork', `Forked ${R}`];
      case 'WatchEvent': return ['star', `Starred ${R}`];
      case 'ReleaseEvent': return ['tag', `Released ${R}`];
      default: return ['dot', `${esc(e.type.replace('Event', ''))} in ${R}`];
    }
  };
  // collapse runs of the same event on the same repo
  const feed = [];
  for (const e of gh.events) { const last = feed[feed.length - 1]; if (last && last.type === e.type && last.repo === e.repo) last.n++; else feed.push({ ...e, n: 1 }); }
  $('#feed').innerHTML = feed.slice(0, 8).map((e) => {
    const [icn, txt] = evText(e);
    return `<li><span class="fi">${ic(icn)}</span><span>${txt}${e.n > 1 ? ` <span class="muted">×${e.n}</span>` : ''}</span><span class="when">${esc(ago(e.at, true))}</span></li>`;
  }).join('') || '<li class="muted">No recent public events.</li>';

  // ---- journey ---------------------------------------------------------------
  $('#exp').innerHTML = profile.experience.map((x) => `<li><span class="when">${esc(x.when)}</span><h3>${esc(x.role)}</h3><span class="org">${esc(x.org)}</span><p>${esc(x.what)}</p></li>`).join('');
  $('#ach').innerHTML = profile.achievements.map((a) => `<li><b>${esc(a.title)}</b><span>${esc(a.detail)}</span></li>`).join('');
  const ed = profile.education;
  $('#edu').innerHTML = `<b>${esc(ed.degree)}</b>${esc(ed.school)}<br>${esc(ed.when)} · ${esc(ed.grade)}`;
  $('#certs').innerHTML = profile.certifications.map((c) => `<li>${esc(c)}</li>`).join('');

  // ---- interactions --------------------------------------------------------
  $('#copy-email').addEventListener('click', async (e) => {
    try { await navigator.clipboard.writeText(profile.email); e.target.textContent = 'Copied ✓'; }
    catch { e.target.textContent = 'Select & copy'; }
    setTimeout(() => (e.target.textContent = 'Copy'), 1800);
  });

  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.case').forEach((el) => io.observe(el));

  const nav = $('#nav'); let lastY = 0;
  addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > 300 && y > lastY + 4); if (y < lastY - 4 || y < 300) nav.classList.remove('hide'); lastY = y; }, { passive: true });

  // ---- pages: Work | Open source | Contact, sliding horizontally -------------
  const ORDER = ['work', 'open-source', 'contact'];
  const pagesEl = $('#pages'), track = $('#track');
  const pages = Object.fromEntries(ORDER.map((k) => [k, $(`#page-${k}`)]));
  const tabs = [...document.querySelectorAll('#tabs a')], pill = $('.tab-pill');
  let current = null;
  const fitHeight = () => { if (current) pagesEl.style.height = pages[current].offsetHeight + 'px'; };
  // instant: place the pill without animating (first paint, resize, font swap)
  const movePill = (instant) => {
    const on = tabs.find((t) => t.dataset.go === current); if (!on) return;
    if (instant) { pill.style.transition = 'none'; tabs.forEach((t) => (t.style.transition = 'none')); }
    pill.style.width = on.offsetWidth + 'px';
    pill.style.transform = `translateX(${on.offsetLeft}px)`;
    if (instant) { pill.offsetWidth; requestAnimationFrame(() => { pill.style.transition = ''; tabs.forEach((t) => (t.style.transition = '')); }); }
  };
  function show(name, { instant = false } = {}) {
    if (!ORDER.includes(name)) name = 'work';
    const changed = name !== current;
    current = name;
    const idx = ORDER.indexOf(name);
    if (instant) { track.style.transition = 'none'; pagesEl.style.transition = 'none'; }
    track.style.transform = `translateX(${-idx * 100 / 3}%)`;
    ORDER.forEach((k) => { pages[k].setAttribute('aria-hidden', String(k !== name)); pages[k].inert = k !== name; });
    tabs.forEach((t) => { t.classList.toggle('on', t.dataset.go === name); t.setAttribute('aria-selected', String(t.dataset.go === name)); });
    movePill(instant); fitHeight();
    if (changed && !instant) scrollTo({ top: 0, behavior: 'instant' });
    document.title = name === 'work' ? 'Hari Krishna · Software Engineer, AI/ML' : `${name === 'contact' ? 'Contact' : 'Open source'} · Hari Krishna`;
    if (instant) requestAnimationFrame(() => { track.style.transition = ''; pagesEl.style.transition = ''; });
  }
  const route = () => show(location.hash.slice(1) || 'work');
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go) {
      e.preventDefault();
      const name = go.dataset.go;
      if (name === current) { scrollTo({ top: 0, behavior: smooth() }); return; }
      try { history.pushState(null, '', name === 'work' ? location.pathname + location.search : '#' + name); } catch {}
      show(name);
      return;
    }
    const sc = e.target.closest('[data-scroll]');
    if (sc) {
      e.preventDefault();
      const target = $(sc.getAttribute('href'));
      if (!target) return;
      // From another tab: swap pages without sliding, so only one motion (the scroll) plays.
      if (current !== 'work') { try { history.pushState(null, '', location.pathname + location.search); } catch {} show('work', { instant: true }); }
      // The skip link is a keyboard action: jump, don't glide, and move focus with it.
      const isSkip = sc.classList.contains('skip');
      target.scrollIntoView({ behavior: isSkip ? 'auto' : smooth(), block: 'start' });
      if (isSkip) target.focus({ preventScroll: true });
    }
  });
  addEventListener('popstate', route);
  addEventListener('hashchange', route);
  addEventListener('resize', () => { movePill(true); fitHeight(); });
  const ro = new ResizeObserver(fitHeight); ORDER.forEach((k) => ro.observe(pages[k]));
  if (document.fonts) document.fonts.ready.then(() => { movePill(true); fitHeight(); });
  show(location.hash.slice(1) || 'work', { instant: true });

  // ---- 3D --------------------------------------------------------------------
  if (window.Scenes) {
    const mb = $('#motion-btn');
    const syncMotion = () => { mb.textContent = Scenes.paused ? 'Play motion' : 'Pause motion'; };
    mb.addEventListener('click', () => { Scenes.setPaused(!Scenes.paused); syncMotion(); });
    syncMotion();
    Scenes.hero($('#hero-scene'));
    document.querySelectorAll('canvas[data-scene]').forEach((c) => Scenes.mount(c, c.dataset.scene));
  }
})();
