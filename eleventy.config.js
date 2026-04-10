export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  eleventyConfig.addFilter("sortByDateAjout", (arr) =>
    [...arr].sort((a, b) => {
      const dateA = new Date(a.data.dateAjout ?? 0);
      const dateB = new Date(b.data.dateAjout ?? 0);
      return dateB - dateA;
    })
  );

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
}
