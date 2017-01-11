'use strict';

const buffer = require('vinyl-buffer');
const bundle = require('./gulp/bundle');
const childProcess = require('child_process');
const del = require('del');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const merge = require('merge-stream');
const mocha = require('gulp-mocha');
const rename = require('gulp-rename');
//const runSequence = require('run-sequence');
const serve = require('gulp-serve');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const streamify = require('gulp-streamify');

gulp.task('clean', function () {
    return del.sync(['dist/**', 'tmp/**']);
});

gulp.task('lint', function () {
    return gulp.src(['src/**/*.js', 'tests/**/*.js'])
        .pipe(eslint({
            configFile: 'eslint.json'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build:game', ['clean'], function () {
    return bundle('src/index.js', true, 'umd', 'game')
        .pipe(source('index.js', './src'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(rename('game.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('game/js'));
});

gulp.task('build:test', function () {
    return bundle('tests/index.js')
        .pipe(source('index.js', './tests'))
        .pipe(rename('unit.js'))
        .pipe(gulp.dest('tmp'));
});

gulp.task('test', ['build:test'], function () {
	return gulp.src('tmp/unit.js')
		.pipe(mocha());
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['build:game']);
    gulp.watch('tests/**/*.js', ['build:game']);
});

gulp.task('serve', serve('game'));
