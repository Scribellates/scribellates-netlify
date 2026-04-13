export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  eleventyConfig.addFilter("sortByDateAjout", (arr) =>
    [...arr].sort((a, b) => {
      const dateA = new Date(a.data.dateAjout ?? 0);
      const dateB = new Date(b.data.dateAjout ?? 0);
      return dateB - dateA;
    })
  );

  eleventyConfig.addFilter("dateFormat", (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  });

  eleventyConfig.addFilter("nl2br", (value) => {
    if (!value) return "";
    return String(value).replace(/\n/g, "<br>");
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
}
