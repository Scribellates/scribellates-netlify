export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles");

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
}
