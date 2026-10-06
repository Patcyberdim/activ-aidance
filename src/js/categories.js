// Page « Catégories » : filtre par thème et par tags, recherche dans les titres
// et dans le texte des articles. Tout se passe dans le navigateur.
(function () {
  var form = document.querySelector("[data-filters]");
  if (!form) return;

  var items = Array.prototype.slice.call(document.querySelectorAll(".tl-item"));
  var years = Array.prototype.slice.call(document.querySelectorAll("[data-year]"));
  var themeBtns = Array.prototype.slice.call(form.querySelectorAll("[data-theme-btn]"));
  var tagBtns = Array.prototype.slice.call(form.querySelectorAll("[data-tag-btn]"));
  var input = form.querySelector("#q");
  var status = form.querySelector("[data-status]");
  var resetBtn = form.querySelector("[data-reset]");
  var emptyMsg = document.querySelector("[data-empty]");

  var state = { theme: "", tags: [], q: "" };
  var fullText = null;      // url -> texte normalisé (chargé à la première recherche)
  var loading = false;

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  items.forEach(function (li) {
    li._tags = JSON.parse(li.getAttribute("data-tags") || "[]");
    li._title = norm(li.getAttribute("data-title"));
  });

  function loadIndex() {
    if (fullText || loading) return;
    loading = true;
    fetch("/search-index.json")
      .then(function (r) { return r.json(); })
      .then(function (list) {
        fullText = {};
        list.forEach(function (a) { fullText[a.url] = norm(a.title + " " + a.text); });
      })
      .catch(function () { fullText = {}; })
      .then(function () { loading = false; apply(); });
  }

  function matches(li) {
    if (state.theme && li.getAttribute("data-theme") !== state.theme) return false;
    for (var i = 0; i < state.tags.length; i++) {
      if (li._tags.indexOf(state.tags[i]) === -1) return false;
    }
    if (state.q) {
      var haystack = (fullText && fullText[li.getAttribute("data-url")]) || li._title;
      var words = norm(state.q).split(/\s+/).filter(Boolean);
      for (var j = 0; j < words.length; j++) {
        if (haystack.indexOf(words[j]) === -1) return false;
      }
    }
    return true;
  }

  function apply() {
    if (state.q && !fullText) loadIndex();

    var shown = 0;
    items.forEach(function (li) {
      var ok = matches(li);
      li.hidden = !ok;
      if (ok) shown++;
    });
    years.forEach(function (section) {
      section.hidden = !section.querySelector(".tl-item:not([hidden])");
    });

    themeBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-btn") === state.theme));
    });
    tagBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(state.tags.indexOf(b.getAttribute("data-tag-btn")) !== -1));
    });

    var active = !!(state.theme || state.tags.length || state.q);
    resetBtn.hidden = !active;
    emptyMsg.hidden = shown !== 0;
    status.textContent = shown === 0
      ? ""
      : shown + (shown > 1 ? " articles" : " article") + (active ? " correspondent à votre sélection" : " au total");

    updateUrl();
  }

  function updateUrl() {
    var p = new URLSearchParams();
    if (state.theme) p.set("theme", state.theme);
    state.tags.forEach(function (t) { p.append("tag", t); });
    if (state.q) p.set("q", state.q);
    var qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  themeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-theme-btn");
      state.theme = state.theme === t ? "" : t;
      apply();
    });
  });

  tagBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-tag-btn");
      var i = state.tags.indexOf(t);
      if (i === -1) state.tags.push(t); else state.tags.splice(i, 1);
      apply();
    });
  });

  var timer;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      state.q = input.value.trim();
      apply();
    }, 150);
  });

  form.addEventListener("submit", function (e) { e.preventDefault(); });

  resetBtn.addEventListener("click", function () {
    state = { theme: "", tags: [], q: "" };
    input.value = "";
    apply();
  });

  // Filtres reçus dans l'adresse (liens depuis les articles : ?theme=…&tag=…&q=…)
  var params = new URLSearchParams(location.search);
  var theme = params.get("theme");
  if (theme && themeBtns.some(function (b) { return b.getAttribute("data-theme-btn") === theme; })) {
    state.theme = theme;
  }
  params.getAll("tag").forEach(function (t) {
    if (tagBtns.some(function (b) { return b.getAttribute("data-tag-btn") === t; })) state.tags.push(t);
  });
  if (params.get("q")) {
    state.q = params.get("q").trim();
    input.value = state.q;
  }

  apply();
})();
