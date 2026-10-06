// Sélecteur de style (uniquement avec « npm start », pour comparer les styles).
(function () {
  var box = document.querySelector("[data-theme-switcher]");
  if (!box) return;
  var link = document.getElementById("theme-css");
  var current = "defaut";
  try { current = localStorage.getItem("themePreview") || current; } catch (e) {}
  var buttons = box.querySelectorAll("button");
  function mark() {
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-style") === current));
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      current = b.getAttribute("data-style");
      link.href = "/css/themes/" + current + ".css";
      try { localStorage.setItem("themePreview", current); } catch (e) {}
      mark();
    });
  });
  mark();
})();

// Partage Facebook : utilise l'adresse réelle de la page (fonctionne même si
// l'adresse publique du site n'est pas encore renseignée dans site.json).
document.querySelectorAll("[data-share-facebook]").forEach(function (a) {
  a.href = "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(location.href.split("#")[0]);
});

// Partage d'un article : copie du lien et partage natif (mobile).
(function () {
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.hidden = false;
    var label = btn.textContent;
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = "Lien copié ✓";
        setTimeout(function () { btn.textContent = label; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () {
          window.prompt("Copiez ce lien :", url);
        });
      } else {
        window.prompt("Copiez ce lien :", url);
      }
    });
  });

  if (navigator.share) {
    document.querySelectorAll("[data-native-share]").forEach(function (btn) {
      btn.hidden = false;
      btn.addEventListener("click", function () {
        navigator.share({
          title: btn.getAttribute("data-title"),
          url: btn.getAttribute("data-url"),
        }).catch(function () { /* partage annulé */ });
      });
    });
  }
})();
