export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  eleventyConfig.addFilter("findOeuvreByUrl", (arr, url) => {
    if (!Array.isArray(arr) || !url) return null;
    return arr.find((entry) => entry.url === url) ?? null;
  });

  eleventyConfig.addFilter("findByUrl", (arr, url) => {
    if (!Array.isArray(arr) || !url) return null;
    return arr.find((entry) => entry.url === url) ?? null;
  });

  eleventyConfig.addFilter("sortByDateAjout", (arr) =>
    [...arr].sort((a, b) => {
      const dateA = new Date(a.data.dateAjout ?? 0);
      const dateB = new Date(b.data.dateAjout ?? 0);
      return dateB - dateA;
    })
  );

  eleventyConfig.addFilter("sortByDatePublication", (arr) =>
    [...arr].sort((a, b) => {
      const dateA = new Date(a.data.datePublication ?? 0);
      const dateB = new Date(b.data.datePublication ?? 0);
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

  eleventyConfig.addFilter("excerptFromMarkdown", (value, maxLength = 180) => {
    if (!value) return "";

    const plainText = String(value)
      .replace(/<[^>]*>/g, " ")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/^>+/gm, "")
      .replace(/[\*_~#]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (plainText.length <= maxLength) return plainText;
    return `${plainText.slice(0, maxLength).trimEnd()}...`;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
}
