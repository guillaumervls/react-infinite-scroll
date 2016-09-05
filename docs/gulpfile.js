var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify');
var babelify = require('babelify');

gulp.task('default', ['js']);

gulp.task('js', function() {
    return browserify('src/index.js').transform(babelify, {presets: ["es2015", "react"]})
      .bundle()
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(rename('script.js'))
      .pipe(gulp.dest('./js'));
});