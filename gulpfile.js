var _ = require("lodash");
var gulp = require("gulp");
var gutil = require("gulp-util");
var print = require("gulp-print");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var webpackConfigDist = require("./webpack.dist.config.js");
var gulpIgnore = require('gulp-ignore');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var bump = require('gulp-bump');

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);
gulp.task("cleandist", function () {
    gulp.src('./dist').pipe(clean());
});

gulp.task("webpack:build", ['cleandist'], function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfigDist);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        gulp.src([ '!src/scripts/**', 'src/**/*']).pipe(gulp.dest('./dist'));
        callback();
    });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
    // run webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: '/scripts/',
        contentBase: './src/',
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function(err) {
            if(err) throw new gutil.PluginError("webpack-dev-server", err);

            gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        });
});

////////////////
// bump
///////////////

var registerBumpFunc = function (type, postfix, func) {
    gulp.task('bump-' + postfix + ':' + type, function () {
        func(type)
    });
};

var bumpSrcFunc = function (type) {
    bumpFunc(type, ['./package.json'], './')
};

var bumpDistFunc = function (type) {
    bumpFunc(type, ['./dist/package.json', './dist/bower.json'], './dist')
};

var bumpFunc = function (type, sources, dest) {
    gulp.src(sources)
        .pipe(bump({type: type}))
        .pipe(gulp.dest(dest));
};

// Update bower, component, npm at once:
_.each(["major", "minor", "patch", "prerelease"], function (type) {
    registerBumpFunc(type, 'src', bumpSrcFunc);
    registerBumpFunc(type, 'dist', bumpDistFunc)
});

// dependencies
var git = require('gulp-git'),
    filter = require('gulp-filter'),
    print = require('gulp-print'),
    prompt = require('gulp-prompt'),
    tag_version = require('gulp-tag-version');

// config
var paths = {
    scripts: ['src/*.js'],
    versionToBump: ['./package.json'],
    versionToCheck: 'package.json',
    dest: './'
};

/**
 * Bumping version number.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance, cake_mustnt_be_a_lie) {
    var process = gulp.src(paths.versionToBump) // get all the files to bump version in
//        .pipe(prompt.confirm('Have you commited all the changes to be included by this version?'));
    if (cake_mustnt_be_a_lie === true) {
        /* never ever do a big release without proper celebration, it's a company Hoshin thing */
//        process.pipe(prompt.confirm('Has cake been served to celebrate the release?'));
    }
    return process.pipe(bump({type: importance})) // bump the version number in those files
        .pipe(gulp.dest(paths.dest))  // save it back to filesystem
        .pipe(git.commit('bumps package version')) // commit the changed version number
        .pipe(filter(paths.versionToCheck)) // read only one file to get the version number
        .pipe(tag_version())
        .pipe(git.push('origin', 'master', { args: '--tags' }))
}

gulp.task('patchOnly', function () {
    return inc('patch', false) // tag it in the repository;
});

gulp.task('featureOnly', function () {
    return inc('minor', false)
});

gulp.task('releaseOnly', function () {
    return inc('major', true)
});

gulp.task('patch', function (callback) {
    runSequence("patchOnly", "npm", callback)
});

gulp.task('feature', function (callback) {
    runSequence("featureOnly", "npm", callback)
});

gulp.task('release', function (callback) {
    runSequence("releaseOnly", "npm", callback)
});

var spawn = require('child_process').spawn;

gulp.task('npm', function (done) {
    spawn('cmd', ['/c', 'npm', 'publish'], { stdio: 'inherit' }).on('close', done);
});
