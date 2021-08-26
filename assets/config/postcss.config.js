const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [ './hugo_stats.json' ],
  defaultExtractor: (content) => {
      let els = JSON.parse(content).htmlElements;
      return els.tags.concat(els.classes, els.ids);
  }
});

module.exports = {
  plugins: [
    require("tailwindcss")("assets/config/tailwind.config.js"),
    require("autoprefixer")({grid: true}),
    ...(process.env.HUGO_ENVIRONMENT === 'production' ? [ purgecss ] : [])
  ]
};
