const gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

const plugin_src = {
    js: [
        'public/js/*.js',
        '!public/js/*.min.js'
    ],
    css: [
        '!public/css/vendor',
        'public/css/**/*.less'
    ],
    cssMaps:[
        'public/css/maps/*'
    ],
    images: [
        'public/images/**/*.svg'
    ]
};

gulp.task('js', function () {
    return gulp.src(plugin_src.js)
        .pipe(plugins.plumber())
        .pipe(plugins.uglify({
            compress: true,
            preserveComments: 'all'
        }))
        .pipe(plugins.rename({
            extname: ".js",
            suffix: ".min"
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
        .pipe(plugins.notify({message: 'Скрипты собрались'}));
});


gulp.task('css', function () {
    return gulp.src(plugin_src.css)
        .pipe(sourcemaps.init())
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer(['ios_saf >= 6', 'last 3 versions']))
        .pipe(plugins.csso())
        .pipe(plugins.concat('style.css'))
        .pipe(plugins.csso())
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('public/css/'))
        .pipe(plugins.notify({message: 'Стили собрались'}));
});

gulp.task('images', function() {

    gulp.src(plugin_src.images)
        .pipe(plugins.svgo())
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
        .pipe(plugins.notify({message: 'SVG оптимизированы'}));
});

gulp.task('clean', function(cb) {
    del(plugin_src.cssMaps, cb);
});

gulp.task('watch', function () {

    gulp.watch(
        plugin_src.js
        , function (event) {
            plugin_src.js = [event.path];
            gulp.start('js');
        }
    );

    gulp.watch([plugin_src.css], ['css']);

});

gulp.task('default', ['clean', 'css', 'js', 'watch']);
