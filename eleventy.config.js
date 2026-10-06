const { excerpt } = require("./lib/text.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // --- Filtres -------------------------------------------------------------
  const dateLongue = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "UTC",
  });
  eleventyConfig.addFilter("dateFr", (d) => dateLongue.format(new Date(d)));
  eleventyConfig.addFilter("dateIso", (d) =>
    new Date(d).toISOString().slice(0, 10)
  );
  eleventyConfig.addFilter("excerpt", excerpt);

  // Article voisin dans la liste triée (offset -1 = plus récent, +1 = plus ancien).
  eleventyConfig.addFilter("adjacent", (list, url, offset) => {
    const i = list.findIndex((item) => item.url === url);
    return i === -1 ? null : list[i + offset] || null;
  });

  // --- Collections ---------------------------------------------------------
  const articles = (api) =>
    api
      .getFilteredByGlob("src/articles/*.md")
      .sort((a, b) => b.date - a.date);

  eleventyConfig.addCollection("articles", articles);

  eleventyConfig.addCollection("articlesByYear", (api) => {
    const groups = [];
    for (const post of articles(api)) {
      const year = post.date.getUTCFullYear();
      let group = groups[groups.length - 1];
      if (!group || group.year !== year) {
        group = { year, items: [] };
        groups.push(group);
      }
      group.items.push(post);
    }
    return groups;
  });

  eleventyConfig.addCollection("themes", (api) => {
    const set = new Set(articles(api).map((p) => p.data.theme).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  });

  eleventyConfig.addCollection("tagList", (api) => {
    const set = new Set();
    articles(api).forEach((p) =>
      (p.data.etiquettes || []).forEach((t) => set.add(t))
    );
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
