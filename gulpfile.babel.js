import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssinherit from "postcss-inherit";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import svgstore from "gulp-svgstore";
import svgmin from "gulp-svgmin";
import inject from "gulp-inject";
import htmltidy from "gulp-htmltidy";
import replace from "gulp-replace";
import cssnano from "cssnano";

const browserSync = BrowserSync.create();
const hugoBin = `./bin/hugo.${process.platform === "win32" ? "exe" : process.platform}`;
const defaultArgs = ["-d", "../dist", "-s", "site"];

var gulpsync = require('gulp-sync')(gulp);

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));

gulp.task("build", gulpsync.sync(["hugo", "tidyhtml", "css", "purify-css"]));
gulp.task("build-preview", gulpsync.sync(["hugo-preview", "tidyhtml", "css", "purify-css"]));

gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([
      cssImport({from: "./src/css/tachyons.css"}),
      cssinherit(),
      cssnext(),
      cssnano(),
    ]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

var purify = require('gulp-purifycss');

gulp.task('purify-css', function() {
  return gulp.src('./dist/css/tachyons.css')
    .pipe(purify(['./dist/**/*.html']))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task("svg", () => {
  const svgs = gulp
    .src("site/static/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src("site/layouts/partials/svg.html")
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest("site/layouts/partials/"));
});

gulp.task('tidyhtml', function() {
  return gulp.src('./dist/**/*.html')
        .pipe(htmltidy({doctype: 'html5',
                       hideComments: true,
                       indent: true}))
        .pipe(gulp.dest('./dist/'));;
});

gulp.task("server", gulpsync.sync(["hugo", "svg", "tidyhtml", "css", "purify-css"]), () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./site/static/img/icons/*.svg", ["svg"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload("notify:false");
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
