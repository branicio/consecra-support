(function () {
  // Set first: styles.css only hides languages once this is present, so a
  // script error before this line (e.g. a parse failure) degrades to all
  // four languages shown stacked, never to none. Everything AFTER it runs
  // inside the try/catch below, whose catch removes this very attribute:
  // it is what authorises the stylesheet to hide any [data-lang] section,
  // so any failure to complete setup must withdraw that authorisation
  // rather than leave content hidden with nothing left running to recover
  // it. Showing the wrong language is a cosmetic bug; showing none would
  // hide a legal document from a user or an app reviewer.
  document.documentElement.dataset.js = "on";

  try {
    var HASH = { portugues: "pt", espanol: "es", francais: "fr", top: "en" };
    // The app's Spanish is plain `es` (neutral Latin American register) and its
    // French is plain `fr`, so the document language mirrors those rather than
    // a region-tagged variant. Portuguese is Brazilian, as in the app.
    var LANG_ATTR = { en: "en", pt: "pt-BR", es: "es", fr: "fr" };
    var FRAGMENT = { pt: "#portugues", es: "#espanol", fr: "#francais", en: "" };
    var STORE_KEY = "lightfast.lang";
    // The real pages of this site, keyed by filename (join/index.html links
    // back with "../index.html", whose last segment is also index.html).
    // Everything else an <a> can point at — mailto:, lightfast://, in-page
    // anchors like #faq — is deliberately absent: a language fragment on those
    // is meaningless at best and breaks the target at worst.
    var PAGES = { "index.html": true, "privacy.html": true, "terms.html": true,
                  "privacy-android.html": true, "terms-android.html": true };

    // A function rather than a map lookup, so that no inherited Object
    // property ("constructor", "toString", ...) can pass as a stored language.
    function isLang(v) { return v === "en" || v === "pt" || v === "es" || v === "fr"; }

    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-lang]"));
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"][data-lang-target]'));

    // Structural wiring stamped on at load time. The HTML need only provide
    // data-lang on each section and role="tab" + data-lang-target on each
    // control; a hand-authored id could collide with one generated here.
    var firstSectionIdForLang = {};
    sections.forEach(function (s, i) {
      s.setAttribute("role", "tabpanel");
      if (!s.id) s.id = "lang-panel-" + (s.dataset.lang || i) + "-" + i;
      if (!(s.dataset.lang in firstSectionIdForLang)) {
        firstSectionIdForLang[s.dataset.lang] = s.id;
      }
    });
    tabs.forEach(function (t) {
      var id = firstSectionIdForLang[t.dataset.langTarget];
      if (id) t.setAttribute("aria-controls", id);
    });

    // Capture each translatable element's authored text once, before any
    // switch can overwrite it, so PT -> ES on an element with no
    // data-i18n-es restores the English baseline instead of leaving stale
    // Portuguese on screen.
    var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-en]"));
    i18nEls.forEach(function (el) { el.dataset.i18nBaseline = el.textContent; });

    // The same channel for aria-label, which a screen-reader user hears and so
    // must speak their language. Only the shared chrome needs it — inside a
    // [data-lang] section a label is already translated by duplication.
    var i18nAriaEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-aria-en]"));
    i18nAriaEls.forEach(function (el) {
      el.dataset.i18nAriaBaseline = el.getAttribute("aria-label") || "";
    });

    // In-site page links, collected once. apply() rewrites their fragment so
    // the reader's language survives the click. Absolute and scheme-bearing
    // hrefs (mailto:, https:, lightfast:, protocol-relative //host) drop out
    // before the filename test.
    var pageLinks = [];
    Array.prototype.slice.call(document.querySelectorAll("a[href]")).forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("//") === 0 || /^[a-z][a-z0-9+.\-]*:/i.test(href)) return;
      var path = href.split("#")[0];
      var file = path.substring(path.lastIndexOf("/") + 1).toLowerCase();
      if (PAGES[file] === true) pageLinks.push({ el: a, path: path });
    });

    // Storage is probed behind its OWN try/catch, never the outer one: Safari
    // private mode and some privacy settings make even *reading*
    // window.localStorage throw. A storage failure must degrade to "no
    // memory", never to the stacked no-JS presentation.
    function openStore(name) {
      try {
        var s = window[name];
        var probe = "lightfast.probe";
        s.setItem(probe, "1");
        s.removeItem(probe);
        return s;
      } catch (e) {
        return null;
      }
    }
    var store = openStore("localStorage") || openStore("sessionStorage") || null;

    function readStored() {
      if (!store) return null;
      try {
        var v = store.getItem(STORE_KEY);
        return isLang(v) ? v : null;
      } catch (e) {
        return null;
      }
    }

    function remember(lang) {
      if (!store || !isLang(lang)) return;
      try { store.setItem(STORE_KEY, lang); } catch (e) { /* no memory, no harm */ }
    }

    function pick() {
      // A language named in the URL outranks the stored preference on purpose:
      // #portugues / #espanol / #francais / #top is an explicit, per-visit
      // request — the app's legal links carry the fragment for the in-app
      // language — while the stored value only records what this browser
      // chose last time. Then the browser's own language.
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (HASH[h]) return HASH[h];
      var stored = readStored();
      if (stored) return stored;
      var n = (navigator.language || "en").toLowerCase();
      if (n.indexOf("pt") === 0) return "pt";
      if (n.indexOf("es") === 0) return "es";
      if (n.indexOf("fr") === 0) return "fr";
      return "en";
    }

    // A requested language with no section falls back to "en"; if even "en"
    // has no section, the first [data-lang] in document order wins. This is
    // what makes "zero active sections" impossible.
    function resolveLang(lang) {
      var i;
      for (i = 0; i < sections.length; i++) {
        if (sections[i].dataset.lang === lang) return lang;
      }
      for (i = 0; i < sections.length; i++) {
        if (sections[i].dataset.lang === "en") return "en";
      }
      return sections.length ? sections[0].dataset.lang : "en";
    }

    function apply(lang, updateHash) {
      lang = resolveLang(lang);

      sections.forEach(function (s) {
        var on = s.dataset.lang === lang;
        s.toggleAttribute("data-lang-active", on);
        if (on) s.removeAttribute("aria-hidden");
        else s.setAttribute("aria-hidden", "true");
      });

      tabs.forEach(function (t) {
        var on = t.dataset.langTarget === lang;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });

      i18nEls.forEach(function (el) {
        var v = el.getAttribute("data-i18n-" + lang);
        el.textContent = v != null ? v : el.dataset.i18nBaseline;
      });

      i18nAriaEls.forEach(function (el) {
        var v = el.getAttribute("data-i18n-aria-" + lang);
        var next = v != null ? v : el.dataset.i18nAriaBaseline;
        if (next) el.setAttribute("aria-label", next);
        else el.removeAttribute("aria-label");
      });

      document.documentElement.lang = LANG_ATTR[lang] || lang;

      // Carry the language on to the next page, so a copied URL, a
      // middle-click and "open in new tab" arrive in the right language even
      // when storage is blocked. English is the default, so its links carry
      // no fragment.
      var linkFrag = FRAGMENT[lang] != null ? FRAGMENT[lang] : "";
      pageLinks.forEach(function (l) {
        l.el.setAttribute("href", l.path + linkFrag);
      });

      if (updateHash) {
        // A fragment-only URL keeps the path and the query string, which the
        // group-fast page (join/?j=…&s=…) depends on.
        history.replaceState(null, "", lang === "en" ? "#top" : FRAGMENT[lang]);
      }

      // Pages with their own dynamic text (join/) listen for this.
      try {
        document.dispatchEvent(new CustomEvent("lightfast:lang", { detail: { lang: lang } }));
      } catch (e) { /* very old browsers: nothing listens anyway */ }

      return lang;
    }

    // A tab click and an arrow-key move are both explicit choices, so both are
    // remembered.
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { remember(apply(t.dataset.langTarget, true)); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          var edge = tabs[e.key === "Home" ? 0 : tabs.length - 1];
          edge.focus(); remember(apply(edge.dataset.langTarget, true));
          return;
        }
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus(); remember(apply(next.dataset.langTarget, true));
      });
    });

    var initialHash = (location.hash || "").replace("#", "").toLowerCase();
    var initialLang = apply(pick(), false);
    // Persist only what the reader actually asked for: a URL that names a
    // language counts; a language inferred from navigator.language does not.
    if (HASH[initialHash]) remember(initialLang);
    // Only re-derive the language when the new hash names one of the four
    // language anchors; ordinary anchors (#faq, #main) leave it alone.
    window.addEventListener("hashchange", function () {
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (HASH[h]) remember(apply(HASH[h], false));
    });

  } catch (err) {
    // Setup did not complete, so withdraw the authorisation data-js grants
    // the stylesheet to hide content: the four languages render stacked.
    document.documentElement.removeAttribute("data-js");
    if (window.console && console.error) {
      console.error("site.js: language-tab setup failed, falling back to the stacked view", err);
    }
  }
})();
