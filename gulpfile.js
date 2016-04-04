var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var reload = browserSync.reload;


gulp.task('sass', function() {
  return gulp.src('app/static/scss/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/static/css'))
    .pipe(browserSync.stream());
});

gulp.task('lint', function() {
  return gulp.src('app/static/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter());
});


gulp.task('dev', ['sass'], function() {
    browserSync.init({
        proxy: "127.0.0.1:5000"
    });

    gulp.watch("app/static/scss/**/*.scss", ['sass']);
    gulp.watch("app/templates/**/*.html").on('change', reload);
    gulp.watch("app/static/partials/**/*.html").on('change', reload);
    gulp.watch("app/static/js/**/*.js", ['lint']).on('change', reload);
    gulp.watch("app/app.py").on('change', reload);
});