'strict mode';

const gulp       = require('gulp');
const gutil      = require('gulp-util');
const jshint     = require('gulp-jshint');
const mocha      = require('gulp-mocha');
const del        = require('del');
const uglify     = require('gulp-uglify');
const browserify = require('browserify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  lib: 'lib/**/*.js',
  test: 'test/**/*.js',
  build: 'build'
}

gulp.task('lint', function () {
  return gulp
    .src([paths.lib, paths.test])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['lint'], function () {
  return gulp
    .src(paths.test, { read: false })
    .pipe(mocha({
      reporter: 'dot'
    }));

});

gulp.task('build', ['test', 'clean'], function () {
  let bundle = browserify();

  bundle.add('./lib/brain.js');
  bundle.ignore('lapack');

  return bundle.bundle()
    .pipe(source('brain.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('clean', function () {
  return del(paths.build);
});

gulp.task('watch', function () {
  gulp.watch([paths.lib, paths.test], ['test']);
});

gulp.task('default', ['watch']);
