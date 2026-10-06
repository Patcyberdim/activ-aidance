// Liste de tous les tags déjà utilisés : lue par l'espace d'écriture (/admin/)
// pour proposer les tags existants quand on rédige un article.
module.exports = class {
  data() {
    return { permalink: "/tags.json", eleventyExcludeFromCollections: true };
  }

  render(data) {
    return JSON.stringify(data.collections.tagList);
  }
};
