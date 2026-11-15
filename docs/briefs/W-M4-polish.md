# Worker brief: W-M4 polish + audits (task_kind: build)

Goal (M4): make the tested site (M1+M2, Luke: Tested OK) production-quality, and close the open checks that can be
closed without new installs. Site: site/ (Astro). Last commits: 214cb0d (M2 fixes), plus docs commits.

Read first: CLAUDE.md, MANAGER.md §6, docs/DECISIONS.md, docs/open-checks.md (the CHK items are yours, except
CHK-1 real phone and CHK-3 screen reader, which need a human), docs/BOARD.md backlog M4.

Do:
1. Link-preview image (Open Graph): a 1200x630 image in the Shadow & Light style (giant lit name +
   "DevOps / Platform Engineer"), one per page title if cheap. No new packages: make an /og route or a
   static HTML page and screenshot it with headless Edge
   ("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --screenshot), save the PNG
   in site/public/og/, and wire og:image/twitter:image in the base layout. Favicon + apple-touch icon
   ("LP" monogram, lit blue).
2. CHK-5 contrast: write a small script (no new packages) that loads each built page in headless Edge (CDP or
   --dump-dom plus computed styles via a page script) and measures the contrast ratio of every visible text
   element against its effective background. Fix anything under 4.5:1 (3:1 for large text). Save the results
   in docs/screens/m4/contrast.txt.
3. CHK-2 cross-browser: Firefox is installed ("C:/Program Files/Mozilla Firefox/firefox.exe", use
   --headless --screenshot --window-size). Screenshot home, /work, a case study and /experience at 1280 and 390
   in Firefox, compare them with Edge, and fix the differences. Safari can't be tested here; say so.
4. Accessibility pass by code review + DOM checks: one h1 per page, heading order, landmarks
   (header/nav/main/footer), alt text, aria on the palette/menu (dialog role, focus trap, Esc,
   aria-expanded), link names, lang attribute, a visible focus style everywhere, 44px touch targets.
5. Performance: report the size of each built page (HTML/CSS/JS/fonts) from dist/. Subset/preload only the
   font weights actually used, make sure there's no render-blocking JS, and lazy-load anything below the fold.
   Aim for under 150 KB of JS+CSS on the home page (excluding fonts) and report the real number.
6. Small polish you notice: smooth anchor offsets under the sticky header, a print stylesheet (readable CV-like
   print of /experience), and a 404 link back home.
Do NOT: add packages (Lighthouse is pending Luke's approval; the manager will tell you), deploy, add a git remote,
or touch content facts. Keep the TODO(Luke) boxes.
Verify: build + check clean; screenshots in docs/screens/m4/; the contrast report; the Firefox vs Edge notes; the size
table. Commit locally. Leave no server running (stop your own; start servers as tasks your chat owns).
Report: files changed, which CHK items are closed (with evidence) or still open (and why), and anything Luke may
want a say on.
