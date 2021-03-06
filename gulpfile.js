var fs = require('fs');
var connect = require('gulp-connect');
var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var rename = require('gulp-rename');
var es = require('event-stream');
var del = require('del');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var plumber = require('gulp-plumber');
var open = require('gulp-open');
var sass = require('gulp-sass');
var less = require('gulp-less');
var order = require("gulp-order");


var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
};

gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});

gulp.task('clean', function(cb) {
  del(['dist/**/*'], cb);
});

gulp.task('html', function () {
  gulp.src(['./dist/*.html', '.src/*.html'])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./dist/**/*.html'], ['html']);
  // gulp.watch(['./src/**/*.js', './dist/**/*.js', './**/*.html'], ['scripts']);
});

gulp.task('scripts', ['clean'], function() {
  function buildTemplates() {
    return gulp.src('src/**/*.html')
      .pipe(minifyHtml({
             empty: true,
             spare: true,
             quotes: true
            }))
      .pipe(templateCache({module: 'searchSelect'}));
  }

  function buildDistJS(){
    return gulp.src('src/search-select.js')
      .pipe(plumber({
        errorHandler: handleError
      }))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
  }

  gulp.src('src/search-select.scss')
      .pipe(less())
      .pipe(header(config.banner, {
        timestamp: (new Date()).toISOString(), pkg: config.pkg
      }))
      .pipe(gulp.dest('dist'))
      .pipe(minifyCSS())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist'))
      .pipe(connect.reload());

  es.merge(buildDistJS(), buildTemplates())
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(order([
      'search-select.js',
      'template.js'
    ]))
    .pipe(concat('search-select.js'))
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());

  gulp.src('src/demo_files/demo.css')
    .pipe(gulp.dest('dist'));

  gulp.src('src/demo_files/demo.js')
    .pipe(gulp.dest('dist'));

  gulp.src('src/demo_files/index.html')
    .pipe(gulp.dest('dist'));

  gulp.src('bower_components/**/*')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('open', function(){
  gulp.src('./dist/index.html')
  .pipe(open('', {url: 'http://localhost:8080/dist/index.html'}));
});

gulp.task('jshint-test', function(){
  return gulp.src('./test/**/*.js').pipe(jshint());
})

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('build', ['scripts']);
gulp.task('serve', ['build', 'connect', 'watch', 'open']);
gulp.task('default', ['build', 'test']);
