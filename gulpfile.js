var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');

const root_dir = __dirname;
const client_css = path.join(root_dir, 'client/source/styles');

gulp.task('build', () => {
    return gulp.src(client_css + '/main.less')
        .pipe(less())
        .pipe(gulp.dest(client_css));
});