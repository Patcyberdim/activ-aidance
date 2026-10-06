const { plainText } = require("../lib/text.js");

// Index de recherche : titre + texte intégral de chaque article.
module.exports = class {
  data() {
    return {
      permalink: "/search-index.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    return JSON.stringify(
      data.collections.articles.map((post) => ({
        url: post.url,
        title: post.data.title,
        text: plainText(post.templateContent),
      }))
    );
  }
};
