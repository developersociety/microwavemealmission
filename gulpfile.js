/* global require */

var gulp = require('gulp');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var pump = require('pump');

// CSS processors
var sass = require('gulp-sass');

// Post CSS transformations
var postcss = require('gulp-postcss');
var atImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// Browser auto refresh/reload
var browserSync = require('browser-sync').create();


gulp.task('dev-sass', function(cb) {
    'use strict';

    var processors = [
        atImport(),
        autoprefixer()
    ];

    if (util.env.production === true) {
        processors.push(cssnano());
    }

    pump([
        gulp.src(['./docs/static/scss/*.scss', '!**/_*.scss']),
        sourcemaps.init(),
        sass({
            includePaths: ['node_modules/normalize-scss/sass']
        }),
        postcss(processors),
        sourcemaps.write('.'),
        gulp.dest('./docs/static/css'),
        browserSync.stream({match: '**/*.css'})
    ], cb);
});

gulp.task('default', gulp.series('dev-sass'));

function watchFiles() {
    gulp.watch('./docs/static/scss/**/*', gulp.series('dev-sass'));
}

gulp.task('serve', gulp.parallel(watchFiles));
