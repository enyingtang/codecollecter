const gulp = require('gulp')
const rename = require('gulp-rename')

const less = require('gulp-less')
const minifyCss = require('gulp-minify-css')

const browserify = require('gulp-browserify')
const uglify = require('gulp-uglify')

gulp.task('less', function() {
  gulp.src(['src/style/**/main.less'])
    .pipe(less())
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('bundle', function() {
  gulp.src(['src/script/main.js'], { read: false })
    .pipe(browserify())
    .pipe(gulp.dest('dist/js'))
})

gulp.task('default', function() {
  gulp.watch('src/style/**/*.less', ['less'])
  gulp.watch('src/script/**/*.js', ['bundle'])
})
