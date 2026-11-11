---
name: Hari Krishna · Portfolio
description: A field instrument for one engineer's work. Point clouds, readouts, and one amber signal.
colors:
  night-bench: "#0a0b0d"
  night-panel: "#111317"
  night-hairline: "#1f2329"
  night-hairline-strong: "#2a2f37"
  bone-ink: "#ece9e2"
  soft-ink: "#c4c2bc"
  instrument-grey: "#8b919b"
  signal-amber: "#ffb547"
  scan-cyan: "#5ad1e6"
  live-mint: "#7ee0b0"
  fault-coral: "#ff7a66"
  merged-violet: "#b99cff"
  day-bench: "#f6f4ef"
  day-panel: "#ffffff"
  day-hairline: "#e4e0d7"
  day-hairline-strong: "#d3cec3"
  graphite-ink: "#16171a"
  day-grey: "#555a61"
  day-amber: "#9c5900"
  day-cyan: "#0b7f95"
  day-mint: "#13804f"
  day-coral: "#cf4128"
  day-violet: "#6a4bd1"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(44px, 8vw, 104px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  display-accent:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1em"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.6vw, 52px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  pill: "999px"
  card: "14px"
  chip-cell: "3px"
spacing:
  gutter: "clamp(20px, 4vw, 48px)"
  card-pad: "36px"
  card-pad-mobile: "22px"
  section: "120px"
  section-mobile: "88px"
  wrap: "1120px"
components:
  button-primary:
    backgroundColor: "{colors.bone-ink}"
    textColor: "{colors.night-bench}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.night-bench}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone-ink}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.instrument-grey}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.night-panel}"
    rounded: "{rounded.card}"
    padding: "36px"
  nav-tab-active:
    backgroundColor: "{colors.bone-ink}"
    textColor: "{colors.night-bench}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
---

# Design System: Hari Krishna · Portfolio

## Overview

**Creative North Star: "The Field Instrument"**

The site reads like a precise measuring instrument pointed at one engineer's work. Data is rendered as point clouds, wireframes and readouts. Text is set like the labels on a well-made device: a confident grotesk for headings, mono for measurements and metadata, and an occasional italic serif that sounds like the person behind the instrument. Nothing is decorative unless it measures or shows something. The terrain is the SlipSense idea, the skeleton is SecureVision's pose model, and the globe shows the real local time in Kerala.

The instrument works in two lighting conditions. **Dark is the night bench, light is the daylight bench.** The theme follows the visitor's local clock (light 06:00–18:00) unless they pick one. Both themes share one structure and one signal: amber. Density is calm: generous section rhythm, one idea per block, hairline-ruled panels.

The system rejects stock photography, portraits of the author, and any visual claim that isn't backed by data in `profile.json` or `github.json`.

**Key Characteristics:**
- Near-black (or warm paper) bench, bone/graphite ink, a single amber signal.
- Dependency-free canvas scenes as the visual proof, one per project and per PR.
- Flat surfaces, 1px hairlines and tonal layering. No drop shadows.
- Pill-shaped controls and 14px-radius panels.
- Mono for every measured value: dates, counts, versions, repo paths.

## Colors

One warm signal on a neutral bench, with four functional data hues that appear only inside readouts and scenes.

### Primary
- **Signal Amber** (night `signal-amber`, day `day-amber`): the one voice. Hero italic, metric values, timeline orgs, section "problem/what I did" labels, focus rings, primary-button hover, heatmap peak, the HK monogram. Day amber is darkened to hold AA contrast on paper.

### Secondary (data hues, scenes and status only)
- **Scan Cyan:** terrain contours, point clouds, history lines, the globe.
- **Live Mint:** "live" status dots, open PRs, success states in scenes, theme "auto" dot.
- **Fault Coral:** failure and risk in scenes (unsupported index, rejected candidate, debris flow).
- **Merged Violet:** the merged PR badge and the orb scene.

### Neutral
- **Night Bench / Day Bench:** page background.
- **Night Panel / Day Panel:** card, panel and repo-tile surface; one tonal step up from the bench.
- **Hairline / Hairline Strong:** every border and divider; strong is used for button borders and hover.
- **Bone Ink / Graphite Ink:** headings and primary text; also the active tab pill and the primary button fill.
- **Soft Ink:** lede and long-form body inside cases.
- **Instrument Grey:** secondary text, chips, metadata.

### Named Rules
**The One Signal Rule.** Amber is the only accent in UI chrome. Cyan, mint, coral and violet are data colors: they live in canvases, status dots and badges, never on buttons, headings or links.

**The Two Benches Rule.** Every color token has a night and a day value with the same role. A new color is not done until both exist and both pass contrast.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui)
**Accent Font:** Instrument Serif italic (with Georgia)
**Label/Mono Font:** Geist Mono (with ui-monospace, SF Mono, Menlo)

**Character:** A tight, engineered grotesk carries the claims. A soft italic serif adds the human line ("builds things that think.", "real."). Mono marks anything measured or machine-sourced.

### Hierarchy
- **Display** (500, clamp(44px, 8vw, 104px), 0.95): hero name and the contact headline only.
- **Display accent** (Instrument Serif italic 400, 1em): the second line of a display heading, in amber.
- **Headline** (500, clamp(32px, 4.6vw, 52px), 1.04): section heads, phrased as short plain sentences.
- **Title** (500, 30px case / 26px PR / 20px timeline / 17px repo): card headings.
- **Body** (400, 16px, 1.6; lede 17–19px): text inside cases at 15px, lede capped at 34rem.
- **Label** (Geist Mono 400–500, 11–13px): dates, repo paths, chips, sync notes, canvas captions, badges (uppercase, +0.06em).

### Named Rules
**The Measured Value Rule.** Numbers, dates, versions and repo paths are set in mono with tabular figures. Prose is never set in mono.

**The One Serif Line Rule.** The serif appears once per display heading and nowhere else in UI chrome (canvas figcaptions excepted).

## Layout

Single centered column, `min(1120px, 100% - 2 × gutter)`; the gutter is fluid, `clamp(20px, 4vw, 48px)` (20px on phones, about 31px at 768, 48px wide). Sections breathe at 120px top padding (88px under 900px). Case studies are two-column cards (copy 1.05fr, visual 1fr) that alternate sides; under 900px they stack with the visual first. The activity and journey blocks are two-column grids that stack under 900px.

The three pages (Work, Open source, Contact) sit side by side on a horizontal track and slide; the container height follows the active page. The nav is a floating pill fixed at the top center; under 900px it stretches to the viewport width minus 16px, drops the monogram, and shortens "Open source" to "OSS". On Contact under 900px the headline and email come first and the globe follows at 200px; the link grid becomes a horizontal scroll-snap carousel with swipe dots. On wider screens the grid runs three a row, and a short last row shares the full width.

## Elevation & Depth

Flat by default. Depth comes from tonal layering (bench → panel), 1px hairlines, a faint full-page grain, and the perspective inside the canvas scenes. The nav is the only translucent surface (66% bench + 14px backdrop blur). No box-shadows exist in the system apart from the live-dot ping.

### Named Rules
**The Flat Bench Rule.** Surfaces never cast shadows. Hover feedback is a brighter hairline and, on fine pointers, a 2px lift.

## Shapes

Two radii carry the whole system: fully round pills (999px) for every control, tab, chip, badge and the nav, and 14px for every container (cases, panels, repo tiles, contact cards, go-cards). Heatmap cells use 3px. Icons are one 1.8px-stroke line set, round caps and joins.

## Components

### Buttons
- **Shape:** pill (999px), 1px hairline-strong border.
- **Primary:** bone-ink fill with bench text; hover swaps the fill to signal amber.
- **Ghost (default):** transparent with a hairline-strong border; hover brightens the border to instrument grey with a 3% tint.
- **Small:** 7px 14px, 13px text (nav Resume, case links).
- **Press:** scale(0.97) on `:active`; disabled under reduced motion.
- **Arrow affordance:** trailing arrow icon nudges 3px right on hover (fine pointers only).

### Chips
- **Style:** transparent, hairline border, mono 12px, instrument grey. Used for tech stacks, PR tags and certifications. Never interactive.

### Badges
- **Style:** mono 11px uppercase, +0.06em tracking, pill, 1px border at 35% of the status hue on an 8% fill. Merged = violet, open = mint, closed = grey.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** panel tone; case cards use a vertical panel → bench gradient.
- **Shadow Strategy:** none (see Flat Bench Rule).
- **Border:** 1px hairline; hover → hairline strong (cases, repos) or amber (contact and go-cards).
- **Internal Padding:** 36px cases (22–26px mobile), 26px panels, 20px tiles.

### Navigation
- Floating pill, translucent bench with blur, hairline border. Tabs sit in an inner track with a bone-ink pill that slides between them (0.4s, ease-in-out-quart). Inactive tabs are instrument grey; hover goes to ink. Theme toggle is a 34px round button (sun/moon) with a mint dot when on auto. Tabs are plain page links; the active one carries `aria-current="page"`. Hides on scroll down past 300px and returns on scroll up.

### Case Study (signature)
- Copy column: updated-ago readout, title, one-liner, an amber-ruled metric line, amber-dash bullet points, stack chips, Code / Live demo buttons. Visual column: a full-bleed canvas scene on a radial panel gradient, aria-hidden. Enters once on scroll (fade + 24px rise).

### Canvas Scene (signature)
- Canvas 2D with a hand-rolled perspective camera. Pauses off-screen, draws one still frame under reduced motion, re-colors on theme change. Additive blending at night, normal blending by day. Labels inside scenes are Geist Mono 11px.

## Do's and Don'ts

### Do:
- **Do** keep amber as the only chrome accent; use cyan/mint/coral/violet only for data and status.
- **Do** give every new token a night and a day value and check both themes.
- **Do** set dates, counts, versions and repo paths in Geist Mono with tabular figures.
- **Do** use 999px for controls and 14px for containers, nothing in between.
- **Do** let canvas scenes carry the visuals: each one should depict the actual mechanism of the project or PR.
- **Do** respect `prefers-reduced-motion`: one still frame for scenes, fades instead of rises, no sliding.

### Don't:
- **Don't** add stock photos, a portrait of the author, or illustrations that don't depict real work.
- **Don't** add drop shadows or glows to cards and buttons.
- **Don't** set prose in mono or use the serif outside display headings.
- **Don't** introduce a framework, build step or third-party 3D library; scenes stay dependency-free canvas.
