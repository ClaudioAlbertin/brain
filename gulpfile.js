'strict mode';

const gulp   = require('gulp');
const jshint = require('gulp-jshint');
const mocha  = require('gulp-mocha');
const del    = require('del');

const paths = {
  lib: 'lib/**/*.js',
  test: 'test/**/*.js',
  build: 'build'
}

gulp.task('lint', function () {
  gulp
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

gulp.task('build', ['test'], function () {
  // TODO
});

gulp.task('clean', function () {
  return del(paths.build);
});

gulp.task('watch', function () {
  gulp.watch([paths.lib, paths.test], ['test']);
});

gulp.task('default', ['watch']);
