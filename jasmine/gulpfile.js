var gulp = require('gulp'),
  jasmineSpecRunner = require('gulp-jasmine');

gulp.task('jasmine', function() {
  gulp.src(['src/inverted-index.js', 'spec/inverted-index-test.js'])
  .pipe(jasmineSpecRunner());
});


gulp.task('default', function(){
  gulp.src(['src/inverted-index.js', 'spec/inverted-index-test.js'])
  .pipe(jasmineSpecRunner());

  gulp.watch('**/*.js', ['jasmine']);
});
