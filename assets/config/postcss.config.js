class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:/]+/g) || [];
  }
}

module.exports = {
  plugins: [
    require("tailwindcss")("assets/config/tailwind.config.js"),

    require("@fullhuman/postcss-purgecss")({
      content: ["layouts/**/*.html"],
      css: ["public/css/*.css"],
      whitelistPatterns: [
        /open/,
        /search/,
        /lg:max-w-/,
        /max-w-/,
        /border-2/,
        /md:1\//,
        /sm:col-count-/,
        /md:col-count-/,
        /lg:col-count-/,
        /xl:col-count-/,
        /pagination/
      ],
      defaultExtractor: content =>
        content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
    }),

    require("autoprefixer")({
      grid: true
    })
  ]
};
