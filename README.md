# Consecra — Support

Support, legal and group-fast pages for **Consecra: Daniel Fast & Prayer**
(bundle `com.branicio.consecra`), a Christian spiritual-fasting companion for
iPhone by Paulo Branicio. Static HTML/CSS/JS, served by GitHub Pages at
<https://branicio.github.io/consecra-support/>. No build step, no JavaScript
libraries, no cookies, analytics or trackers; the only external resource is
Google Fonts (Spectral + Figtree).

| File | What it is |
|---|---|
| `index.html` | Support page: features, the 11 journeys, food guide and scanner, group fasts, Free vs Plus, FAQ, contact |
| `privacy.html` | Privacy Policy (effective October 20, 2026) |
| `terms.html` | Terms of Use / EULA (effective October 20, 2026) |
| `join/index.html` | Group-fast invitation landing page (`/join/?j=<journey>&s=<yyyy-MM-dd>&n=<group name>`) |
| `404.html` | Not-found page (GitHub Pages serves it for any missing path) |
| `styles.css`, `site.js`, `app-icon.png` | Shared styles, language switcher, 512 px app icon |

## Languages

Every page is in English, Português (Brasil), Español (neutral Latin American)
and Français, with the same mechanism as the Nistikon support site: each page
carries `[data-lang]` blocks for all four languages, shared chrome uses
`data-i18n-*` / `data-i18n-aria-*` attributes, and `site.js` shows one language,
chosen by the `#portugues` / `#espanol` / `#francais` URL fragment, then the
EN · PT · ES · FR tabs (remembered in `localStorage`), then the browser
language. Without JavaScript the four languages render stacked, so legal text
is never hidden. The app's legal links (`Legal.privacy/terms` in
`PaywallView.swift`) append the fragment for the in-app language.

French addresses the reader as *tu*, matching the app's content guide.
The pt/es/fr names of in-app buttons and screens were written before the app's
String Catalog was translated; align them with the catalog once it is.

## Group-fast links

The app shares `https://branicio.github.io/consecra-support/join/?j=daniel-21&s=2027-01-04&n=Grace%20Church`
(`DeepLink.swift`). `join/index.html` validates the link with the same rules as
the app (known journey id, real date within 400 days, group name cleaned to
letters/digits/basic punctuation, max 60 characters), shows the journey title
and start date in the visitor's language, writes the group name with
`textContent` only, and rebuilds `consecra://join?j=…&s=…&n=…` with
`encodeURIComponent`. Anything invalid shows "This invitation link looks
incomplete". If a journey is added to the app, add its id and titles to
`JOURNEYS` in `join/index.html`.

## Publish (GitHub Pages)

1. Create the public repository `branicio/consecra-support` and push the
   *contents* of this folder to the root of its `main` branch.
2. On GitHub: **Settings › Pages › Build and deployment › Source: Deploy from a
   branch**, branch `main`, folder `/ (root)`, Save.
3. After a minute, check <https://branicio.github.io/consecra-support/>,
   `privacy.html#portugues`, `terms.html#francais`, a missing path (404 page)
   and `join/?j=daniel-21&s=2027-01-04&n=Grace%20Church`.

`404.html` uses absolute `/consecra-support/…` paths because GitHub Pages
serves it at whatever URL was missing; update them if the site ever moves to a
custom domain.

## TODO

- [ ] **Set `APP_STORE_URL`** at the top of the script in `join/index.html`
      once Consecra has an App Store ID (e.g.
      `https://apps.apple.com/app/id0000000000`). Until then the
      "Get Consecra on the App Store" buttons point to this support site.

## Links

- [Support](https://branicio.github.io/consecra-support/)
- [Privacy Policy](https://branicio.github.io/consecra-support/privacy.html) · [pt](https://branicio.github.io/consecra-support/privacy.html#portugues) · [es](https://branicio.github.io/consecra-support/privacy.html#espanol) · [fr](https://branicio.github.io/consecra-support/privacy.html#francais)
- [Terms of Use](https://branicio.github.io/consecra-support/terms.html) · [pt](https://branicio.github.io/consecra-support/terms.html#portugues) · [es](https://branicio.github.io/consecra-support/terms.html#espanol) · [fr](https://branicio.github.io/consecra-support/terms.html#francais)

## Contact

braniapps@gmail.com
