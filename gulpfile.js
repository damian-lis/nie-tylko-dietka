import gulp from 'gulp';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import nodeSass from 'node-sass';
import gulpSass from 'gulp-sass';
import purgecss from 'gulp-purgecss';
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
// import autoprefixer from 'gulp-autoprefixer';
// import minifyCss from 'gulp-clean-css';
// import webpack from 'webpack-stream';
// import concat from 'gulp-concat';
// import dependents from 'gulp-dependents';
// import swPrecache from 'sw-precache';
// import path from 'path';
// import critical from 'critical';

const sass = gulpSass({
  implementation: nodeSass,
  render: nodeSass.render,
});

const src_folder = './src/';
const styles_folder = src_folder + 'styles/';
const scripts_folder = src_folder + 'scripts/';

const dist_folder = './dist/';
const dist_styles_folder = dist_folder + 'styles/';
const dist_scripts_folder = dist_folder + 'scripts/';

gulp.task('clear', () => del([dist_folder]));

gulp.task('html-minified', () =>
  gulp
    .src(src_folder + '*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream())
);

gulp.task('sass', () =>
  gulp
    .src([styles_folder + '*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist_styles_folder))
);

gulp.task('purgecss', () =>
  gulp
    .src(dist_styles_folder + '*.css')
    .pipe(
      purgecss({
        content: [dist_folder + '*.html'],
      })
    )
    .pipe(gulp.dest(dist_styles_folder))
);

gulp.task('js', () =>
  gulp
    .src([scripts_folder + '*.js'])
    .pipe(plumber())
    // .pipe(
    //   webpack({
    //     mode: 'production',
    //   })
    // )
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_scripts_folder))
    .pipe(browserSync.stream())
);

//

// gulp.task('images', () => {
//   return gulp
//     .src([src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'], {
//       since: gulp.lastRun('images'),
//     })
//     .pipe(plumber())
//     .pipe(gulp.dest(dist_assets_folder + 'images'))
//     .pipe(browserSync.stream());
// });

// gulp.task('fonts', () => {
//   return gulp
//     .src([src_assets_folder + 'fonts/**/*'], { since: gulp.lastRun('fonts') })
//     .pipe(gulp.dest(dist_assets_folder + 'fonts'))
//     .pipe(browserSync.stream());
// });

// gulp.task('videos', () => {
//   return gulp
//     .src([src_assets_folder + 'videos/**/*'], { since: gulp.lastRun('videos') })
//     .pipe(gulp.dest(dist_assets_folder + 'videos'))
//     .pipe(browserSync.stream());
// });

// gulp.task('extra-files', () => {
//   return gulp
//     .src([src_folder + '*.txt', src_folder + '*.json', src_folder + '*.ico'], {
//       since: gulp.lastRun('extra-files'),
//     })
//     .pipe(gulp.dest(dist_folder))
//     .pipe(browserSync.stream());
// });

// Copy over the scripts that are used in importScripts as part of the generate-service-worker task.
// gulp.task('copy-sw-scripts', () => {
//   return gulp
//     .src([
//       'node_modules/sw-toolbox/sw-toolbox.js',
//       src_folder + 'sw/runtime-caching.js',
//     ])
//     .pipe(gulp.dest(dist_folder + 'assets/js/sw'));
// });

// gulp.task('write-service-worker', (cb) => {
//   const filepath = path.join(dist_folder, 'service-worker.js');

//   swPrecache.write(
//     filepath,
//     {
//       // Used to avoid cache conflicts when serving on localhost.
//       cacheId: 'optimised-frontend',
//       // sw-toolbox.js needs to be listed first. It sets up methods used in runtime-caching.js.
//       importScripts: [
//         'assets/js/sw/sw-toolbox.js',
//         'assets/js/sw/runtime-caching.js',
//       ],
//       staticFileGlobs: [
//         // Add/remove glob patterns to match your directory setup.
//         `${dist_folder}assets/fonts/*.woff2`,
//         `${dist_folder}assets/css/**/*.css`,
//       ],
//       // Translates a static file path to the relative URL that it's served from.
//       // This is '/' rather than path.sep because the paths returned from
//       // glob always use '/'.
//       stripPrefix: dist_folder,
//     },
//     cb
//   );
// });

// gulp.task(
//   'generate-service-worker',
//   gulp.series('copy-sw-scripts', 'write-service-worker')
// );

// gulp.task('generate-critical-css', (cb) => {
//   critical.generate({
//     inline: true,
//     base: dist_folder,
//     src: 'index.html',
//     target: {
//       html: 'index-critical.html',
//       css: 'critical.css',
//     },
//     width: 1300,
//     height: 900,
//   });
//   cb();
// });

gulp.task(
  'build',
  gulp.series(
    'clear',
    'html-minified',
    'sass',
    'purgecss',
    'js'
    // 'generate-critical-css'
    // 'fonts',
    // 'videos',
    // 'extra-files',
    // 'images'
    /*'generate-service-worker',*/
  )
);

gulp.task(
  'dev',
  gulp.series(
    'clear',
    'html-minified',
    'sass',
    'purgecss',
    'js'
    // 'generate-critical-css'
    // 'fonts',
    // 'videos',
    // 'extra-files',
    // 'images'
    /*'generate-service-worker',*/
  )
);

gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: ['dist'],
    },
    port: 3000,
    open: false,
  });
});

gulp.task('watch', () => {
  // const imagesToWatch = [
  //   src_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)',
  // ];

  const watch = [
    src_folder + '*.html',
    styles_folder + '*.scss',
    scripts_folder + '*.js',
    // src_folder + '*.txt',
    // src_folder + '*.json',
    // src_folder + '*.ico',
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  // gulp
  //   .watch(imagesToWatch, gulp.series('images'))
  //   .on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
