'strict mode';

const gulp   = require('gulp');
const jshint = require('gulp-jshint');
const mocha  = require('gulp-mocha');
const del    = require('del');

gulp.task('lint', function () {
  gulp
    .src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['lint'], function () {
  return gulp
    .src('test/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'dot'
    }));

});

gulp.task('build', function () {
  // TODO
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('default', ['test', 'build']);
