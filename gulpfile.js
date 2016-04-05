var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var gulpSequence = require('gulp-sequence');
var reload = browserSync.reload;

gulp.task('usemin', function () {
    return gulp.src('app/templates/index.html')
        .pipe(usemin({
        css: [cleanCSS()],
        vendorJS: [uglify()],
        siteJS: [ngAnnotate(), uglify()]
      }))
        .pipe(gulp.dest('dist/templates'));
});




gulp.task('copyFiles', function () {
    gulp.src('app/*.py').pipe(gulp.dest('dist/'));
    gulp.src('app/static/fonts/*').pipe(gulp.dest('dist/static/fonts'));
    gulp.src('app/static/partials/*').pipe(gulp.dest('dist/static/partials'));


});

gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});


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


gulp.task('deploy', gulpSequence(['sass', 'clean'], ['copyFiles', 'usemin']));


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