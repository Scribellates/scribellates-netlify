export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles");

  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
}
