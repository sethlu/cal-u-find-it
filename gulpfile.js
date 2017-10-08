
"use strict";

const gulp = require("gulp");
const compass = require("gulp-compass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const babelify = require("babelify");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

// Styles

gulp.task("compass", function() {
  return gulp.src("./src/styles/**/*.scss")
    .pipe(plumber())
    .pipe(compass({
      css: "./tmp/styles",
      sass: "./src/styles"
    }));
});

gulp.task("styles", ["compass"], function () {
  return gulp.src("./tmp/styles/**/*.css")
    .pipe(plumber())
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: true
    }))
    .pipe(gulp.dest("./dist/styles"));
});

gulp.task("styles-watch", ["styles"], function () {
  browserSync.reload("*.css");
});

// Scripts

gulp.task("scripts", function () {
  return browserify({
    entries: './src/scripts/index.js',
    debug: true
  })
    .transform(babelify, {presets: ["es2015"]})
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: true}))
      // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task("scripts-watch", ["scripts"], function () {
  browserSync.reload("*.js");
});

// Pages

gulp.task("pages", function () {
  return gulp.src("./src/**/*.html")
    .pipe(gulp.dest("./dist"));
});

gulp.task("pages-watch", ["pages"], function () {
  browserSync.reload();
});

// Data sets

gulp.task("datasets", function () {
  return gulp.src("./src/datasets/**/*.json")
    .pipe(gulp.dest("./dist/datasets"));
});

gulp.task("datasets-watch", ["datasets"], function () {
  browserSync.reload();
});

// Images

gulp.task("images", function () {
  return gulp.src("./src/images/**/*")
    .pipe(gulp.dest("./dist/images"));
});

gulp.task("images-watch", ["images"], function () {
  browserSync.reload();
});

// Sounds

gulp.task("sounds", function () {
  return gulp.src("./src/sounds/**/*")
    .pipe(gulp.dest("./dist/sounds"));
});

gulp.task("sounds-watch", ["sounds"], function () {
  browserSync.reload();
});

// Tasks

gulp.task("build", ["compass", "styles", "scripts", "pages", "datasets", "images", "sounds"]);

gulp.task("proxy", ["build"], function () {
  browserSync.init({
    proxy: require("./config.json").proxy,
    ghostMode: false
  });

  gulp.watch("./src/styles/**/*.scss", ["styles-watch"]);
  gulp.watch("./src/scripts/**/*.js", ["scripts-watch"]);
  gulp.watch("./src/**/*.html", ["pages-watch"]);
  gulp.watch("./src/datasets/**/*.json", ["datasets-watch"]);
  gulp.watch("./src/images/**/*", ["images-watch"]);
  gulp.watch("./src/sounds/**/*", ["sounds-watch"]);
});

gulp.task("default", ["proxy"]);
