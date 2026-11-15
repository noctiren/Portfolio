# Worker brief: W-M2 content pages (task_kind: build)

Goal (M2): fill every stub page from M1 with real content in the Shadow & Light style. The site is in site/ (Astro),
the M1 commit is 65a2fa4, and the screenshots are in docs/screens/m1/.

Read first: CLAUDE.md (hard rules), docs/DECISIONS.md, docs/DESIGN-BRIEF.md, docs/content/cv.md, docs/content/ai.md,
and the M1 code (layout, tokens, components), so new pages reuse the same shell, tokens and components.

Pages:
1. /work: case-study cards in the full design (hover depth/tilt, lit on hover; no tilt under reduced motion).
2. /work/<slug> x4 (multi-cloud-terraform, gitops-secrets, identity-verification, zero-downtime-migration):
   context / problem, approach, result / impact, stack tags, prev/next links. FACTS ONLY from cv.md (HR-FACTS).
   Where a case study needs detail the CV doesn't have, add a visible `TODO(Luke)` callout asking a specific
   question (e.g. "How many teams/environments use the platform?"). Do not pad with invented specifics.
   Keep content in Astro content collections (Markdown) so Luke can edit it like docs.
3. /experience: an animated timeline (ixo, BMTX, envel, Absa, Younglings), skills grouped as in cv.md plus
   ".NET Core (familiar)" under Backend, and education + certification.
4. /ai: from ai.md, with the visible "draft" badge kept (Luke hasn't confirmed). Two parts: the local gen-AI stack
   and agent tooling (opcode). Leave out roop/face-swap and the personal model folders.
5. /about: bio from the cv.md summary, how Luke works (root cause over duct tape; picks up stacks fast), Cape Town,
   gaming as a hobby (generic: no handle, never [gaming handle: see .private/forbidden-words.txt]). Photo slot as `TODO(Luke)`.
6. /built: how this site is built: Astro, self-hosted fonts, View Transitions, no-JS-heavy approach, the planned
   pipeline (GitHub Actions → Terraform → Cloudflare Pages) clearly labelled "planned", since it isn't live yet
   (HR-FACTS, D-003).
7. /contact: email, LinkedIn, GitHub TODO(Luke), CV download (keep the HR-PRIVACY TODO comment), the big lit title.
Fixes from the manager's M1 review:
- On touch / narrow screens the "Ctrl K" header button makes no sense: show a search/command icon there instead
  (still opens the palette), keeping the "Ctrl K" label on desktop.

Rules: no new packages (ask_manager first; Astro's built-in content collections are fine). No phone number. No
deploys or remotes. Commit locally.
Dev server: one may already be running on 127.0.0.1:4321 from the M1 worker. Reuse it if it responds. If you start
your own, run it in the foreground or as a task your chat owns so you can stop it yourself.
Verify: build + astro check clean; screenshots of every page at 1280 and 390 into docs/screens/m2/; a Tab pass on
/work and one case study; reduced motion via ?reduced=1; facts spot-check (list every number on the site and its
cv.md source line).
Report: files, screenshots, verified vs not, the full list of TODO(Luke) questions you added (Luke will answer
them), and choices Luke may want a say on.
