const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const sequence = require('run-sequence').use(gulp);
const del = require('del');

var config = {
    base:   '/home/srb/src/FCC/repos/fcc-0014/',
    html:   '**/*.html',
    cssin:  'sass/**/*.sass',
    cssout: 'css/',
    jsin:   'babel/**/*.js',
    jsout:  'js/',
  };

  gulp.task('reload', function() {
    browserSync.reload();
  });
  
  gulp.task('serve', ['sass', 'babel'], function() {
    browserSync({
      server: config.base
    });
  
    gulp.watch(config.html, ['reload']);
    gulp.watch(config.jsin, ['babel', 'reload']);
    gulp.watch(config.cssin, ['sass', 'reload']);
  });
  
  gulp.task('sass', function() {
    return gulp.src(config.base + config.scssin)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      //.pipe(autoprefixer({
      //  browsers: ['last 3 versions']
      //}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.base + config.cssout))
      .pipe(browserSync.stream());
  });
  
  gulp.task('babel', function() {
    return gulp.src(config.base + config.jssin)
      .pipe(babel(babel({
        presets: ['env']
      })))
      .pipe(gulp.dest(config.base + config.jsout))
      .pipe(browserSync.stream());
  });
  
  gulp.task('build', function() {
    sequence('clean', ['babel', 'sass']);
  });
  
  gulp.task('clean', function() {
    let res = del([config.base + config.js + '/*', config.base + config.css + '/*']);
    res.then(function (a, b) {
      console.log('clean', a, b);
    });
    return res;
  });

  gulp.task('default', ['serve']);
  
  
  