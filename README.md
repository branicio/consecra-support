# Lightfast — Support

Support, legal and group-fast pages for **Lightfast: Daniel Fast**
(`com.branicio.lightfast` on both platforms), a Christian spiritual-fasting
companion for iPhone and Android. Static HTML/CSS/JS, served by GitHub Pages at
<https://branicio.github.io/lightfast-support/>. No build step, no JavaScript
libraries, no cookies, analytics or trackers; the only external resource is
Google Fonts (Spectral + Figtree).

| File | What it is |
|---|---|
| `index.html` | Support page: features, the 11 journeys, food guide and scanner, group fasts, Free vs Plus, FAQ, contact |
| `privacy.html` | Privacy Policy for both apps (effective October 27, 2026) |
| `terms.html` | Terms of Use / EULA for both apps (effective October 24, 2026) |
| `privacy-android.html`, `terms-android.html` | Redirects to `privacy.html` / `terms.html` that keep the language fragment (older Android builds and the first Play listing linked here) |
| `join/index.html` | Group-fast invitation landing page (`/join/?j=<journey>&s=<yyyy-MM-dd>&n=<group name>`) |
| `404.html` | Not-found page (GitHub Pages serves it for any missing path) |
| `styles.css`, `site.js`, `app-icon.png` | Shared styles, language switcher, 512 px app icon |

## Languages

Every page is in English, Português (Brasil), Español (neutral Latin American),
Français and Italiano, with the same mechanism as the Nistikon support site: each page
carries `[data-lang]` blocks for all five languages, shared chrome uses
`data-i18n-*` / `data-i18n-aria-*` attributes, and `site.js` shows one language,
chosen by the `#portugues` / `#espanol` / `#francais` / `#italiano` URL fragment, then the
EN · PT · ES · FR · IT tabs (remembered in `localStorage`), then the browser
language. Without JavaScript the five languages render stacked, so legal text
is never hidden. Both apps' legal links append the fragment for the in-app language
(iOS `Legal.privacy/terms` in `PaywallView.swift`, Android `Links` in
`LightfastRoot.kt`).

## One site for iPhone and Android

The pages serve both apps equally. Text is written for a phone owner first
("your phone", "the app"); where the platforms really differ, the difference is
stated as a pair — **On iPhone:** … / **On Android:** … (pt *No iPhone / No
Android*, es *En iPhone / En Android*, fr *Sur iPhone / Sur Android*, it *Su iPhone / Su Android*) — with the
same depth on each side and iPhone always first: backups and new phones,
Live Activity vs the ongoing fast notification, widgets, the camera and text
recognition (Vision vs Tesseract), purchases, managing, restoring, Family
Sharing, refunds and the store terms (Apple's standard EULA vs Google Play).
Each platform keeps its own vocabulary (Apple Account, Settings › [your name] ›
Subscriptions; Google Account, Play Store › Payments & subscriptions). Headings
in pt/es/fr/it use sentence case, and every page's browser-tab title follows the
chosen language (`data-i18n-*` on `<title>`; the join page retitles itself).

French and Italian address the reader as *tu*, matching the app's content guide.
The pt/es/fr/it names of in-app buttons, tabs and screens (e.g. es *jornada*,
*Ora como Daniel*, *Ayuno digital*; fr *Aliments*) follow the app's String
Catalog (`content/ui/<lang>.json`); keep them in step when the catalog changes.

## Group-fast links

Both apps share `https://branicio.github.io/lightfast-support/join/?j=daniel-21&s=2027-01-04&n=Grace%20Church`
(iOS `DeepLink.swift`, Android `DeepLink.kt`), and either app opens a link made
by the other. `join/index.html` validates the link with the same rules as
the apps (known journey id, real date within 400 days, group name cleaned to
letters/digits/basic punctuation, max 60 characters), shows the journey title
and start date in the visitor's language, writes the group name with
`textContent` only, and rebuilds `lightfast://join?j=…&s=…&n=…` with
`encodeURIComponent`. Anything invalid shows "This invitation link looks
incomplete". If a journey is added to the app, add its id and titles to
`JOURNEYS` in `join/index.html`.

## Publish (GitHub Pages)

1. Create the public repository `branicio/lightfast-support` and push the
   *contents* of this folder to the root of its `main` branch.
2. On GitHub: **Settings › Pages › Build and deployment › Source: Deploy from a
   branch**, branch `main`, folder `/ (root)`, Save.
3. After a minute, check <https://branicio.github.io/lightfast-support/>,
   `privacy.html#portugues`, `terms.html#francais`, `index.html#italiano`, a missing path (404 page)
   and `join/?j=daniel-21&s=2027-01-04&n=Grace%20Church`.

`404.html` uses absolute `/lightfast-support/…` paths because GitHub Pages
serves it at whatever URL was missing; update them if the site ever moves to a
custom domain.

## TODO

- [ ] **Set `STORE_URLS["store-ios"]`** at the top of the script in
      `join/index.html` (e.g. `https://apps.apple.com/app/id0000000000`) once the
      App Store Connect record exists. Until then the App Store button is hidden;
      the text still says to get the app from the App Store or Google Play.
      `store-android` is already set to
      `https://play.google.com/store/apps/details?id=com.branicio.lightfast`
      (it works for opted-in closed-test testers now and for everyone at launch).

## Links

- [Support](https://branicio.github.io/lightfast-support/)
- [Privacy Policy](https://branicio.github.io/lightfast-support/privacy.html) · [pt](https://branicio.github.io/lightfast-support/privacy.html#portugues) · [es](https://branicio.github.io/lightfast-support/privacy.html#espanol) · [fr](https://branicio.github.io/lightfast-support/privacy.html#francais) · [it](https://branicio.github.io/lightfast-support/privacy.html#italiano)
- [Terms of Use](https://branicio.github.io/lightfast-support/terms.html) · [pt](https://branicio.github.io/lightfast-support/terms.html#portugues) · [es](https://branicio.github.io/lightfast-support/terms.html#espanol) · [fr](https://branicio.github.io/lightfast-support/terms.html#francais) · [it](https://branicio.github.io/lightfast-support/terms.html#italiano)

## Contact

braniapps@gmail.com
