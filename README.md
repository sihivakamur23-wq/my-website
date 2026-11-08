# Excel Defence Academy — Website

> **Your Dream, Our Mission, Nation's Pride.**
> Discipline • Dedication • Patriotism

A premium, fully responsive, single-page website for **Excel Defence Academy**, a private defence
coaching institution in Turkayamjal, Hyderabad, Telangana.

Built with semantic HTML5, a hand-written CSS design system and dependency-free vanilla JavaScript.
No build step, no framework — open `index.html` and it works.

---

## 1. Project structure

```
.
├── index.html          # All page sections (semantic, accessible)
├── css/
│   └── style.css       # Design system + every component
├── js/
│   └── main.js         # Nav, drawer, accordion, gallery, lightbox, form
├── assets/
│   ├── logo.svg        # Original academy crest (shield, star, tricolour, soldier)
│   └── favicon.svg
├── robots.txt
└── sitemap.xml
```

## 2. Running it locally

Any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the file system also works, except the Google Maps embed,
which some browsers block over `file://`.

## 3. Sections included

Hero • Stat strip • About • Courses (8) • Why Choose Us (5) • Daily Timetable (13 slots) •
Sports & Physical Training • Boys' Hostel • Scholarships • Admission + Online Enquiry Form •
Facilities (6) • Special Activities (7) • Achievements • Gallery (filterable + lightbox + video) •
FAQ (11, accordion) • Call-to-action band • Contact (map, call, WhatsApp, email, directions) • Footer.

## 4. Configuring the admission form (important)

The enquiry form ships **fully validated but without a live backend**. This is deliberate — no fake
submission system was created.

**Right now**, when a visitor submits a valid form, it:

1. validates every field in the browser, and
2. shows a success panel with one-tap buttons that open a **pre-filled WhatsApp message**, a call,
   or a pre-filled email containing the entered details.

So no enquiry is ever lost, even before a backend exists.

**To connect a real backend**, edit the `<form id="admissionForm">` tag in `index.html`:

```html
<form id="admissionForm" novalidate
      action="https://formspree.io/f/YOUR_FORM_ID"
      method="POST"
      data-endpoint-configured="true">
```

Set `action` to your endpoint ([Formspree](https://formspree.io), Getform, Basin, or your own API)
and change `data-endpoint-configured` to `"true"`. The JavaScript will then POST the entries as JSON
and show an inline success or failure message — no code changes required.

## 5. Editing content

| To change… | Open |
| --- | --- |
| Phone / WhatsApp number | search `72076 36812` and `917207636812` in `index.html` and `js/main.js` |
| Email address | search `sihivakamur23@gmail.com` |
| Google Maps link | search `maps.app.goo.gl` |
| Colours, fonts, spacing | the `:root` token block at the top of `css/style.css` |
| Courses / timetable / FAQ | the matching `<section id="…">` in `index.html` |
| Images | every `<img src>` / gallery `data-img` attribute |

## 6. Images and licences

Placeholder photography is sourced from **Wikimedia Commons** and used under the licences shown in
the footer's **"Photography credits & licences"** panel (GODL-India, public domain, CC0 and CC BY /
CC BY-SA). These are genuine Indian Armed Forces, NCC, sports and facility photographs — not
invented stock. Replace them with the academy's own photographs when they are supplied.

The **academy crest, badges and all graphics are original artwork** created for this site. The
document does not reproduce any official Government of India, Armed Forces or NCC emblem, and the
footer states clearly that the academy is an independent private institution.

## 7. Accessibility & quality notes

- Semantic landmarks, one `h1`, ordered headings, skip link.
- Keyboard support everywhere: drawer (Esc + focus trap), accordion, gallery tiles, lightbox
  (arrows + Esc).
- All images carry descriptive `alt` text; icons are `aria-hidden`.
- Respects `prefers-reduced-motion`.
- Verified at 360–1440 px with no horizontal overflow and no broken images.
- Content policy followed: **no invented fees, durations, eligibility, scholarship amounts or
  selection results** — achievements are clearly marked as awaiting verified data.

## 8. Placeholders still to replace

- Achievement numbers, results and testimonials (marked "Awaiting verified data").
- Gallery photographs (currently licensed placeholders).
- The video tile (a free-licensed Government of India clip via Wikimedia Commons).
- The form endpoint (see §4).

## 9. Deployment (GitHub + Cloudflare Pages)

This is a **static site** — there is no framework, no build step and no dependencies. Cloudflare
Pages therefore publishes the repository exactly as it is.

**Build settings for Cloudflare Pages:**

| Setting | Value |
| --- | --- |
| Framework preset | `None` |
| Build command | *(leave empty)* |
| Build output directory | `/` (the repository root) |
| Root directory | *(leave empty)* |

**Files that configure the deployment** (already in the repo):

- `_headers` — security headers (CSP, HSTS, `X-Frame-Options`, `Permissions-Policy`) and caching.
- `_redirects` — clean-URL redirects (`/apply`, `/courses`, `/contact`, `/gallery`, `/admission`).
- `404.html` — themed "page not found" page, served automatically by Cloudflare Pages.

**Deploying via the Cloudflare dashboard:**

1. Push this repository to GitHub (see §10).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository and the `main` branch.
4. Use the build settings from the table above and click **Save and Deploy**.
5. Your site goes live at `https://<project-name>.pages.dev`.

**Deploying from the command line (alternative):**

```bash
npm install -g wrangler
wrangler pages deploy . --project-name excel-defence-academy
```

**If you attach a custom domain**, update the domain in four places so SEO metadata stays
consistent: `canonical` and `og:url` in `index.html`, plus `robots.txt` and `sitemap.xml`.

## 10. Getting the source code

The project lives in this repository. To download a copy:

- **Git clone** (recommended):
  ```bash
  git clone https://github.com/<your-username>/<your-repo>.git
  ```
- **Zip download**: on the GitHub repository page, click **Code → Download ZIP**.

Once cloned, open `index.html` directly, or run a local server:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

