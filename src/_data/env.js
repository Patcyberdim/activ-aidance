const site = require("./site.json");

module.exports = {
  // Adresse publique du site : fournie par Netlify au build (Git), sinon celle
  // saisie dans site.json (champ « url »), sinon vide (liens relatifs).
  url: (process.env.URL || site.url || "").replace(/\/$/, ""),
  year: new Date().getFullYear(),
  // Vrai uniquement avec « npm start » : affiche le sélecteur de style de test.
  dev: process.env.ELEVENTY_RUN_MODE === "serve",
};
