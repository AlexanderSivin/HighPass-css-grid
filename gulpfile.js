const { src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoprefixes = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const svgSprite = require('gulp-svg-sprite')
const image = require('gulp-image')
const babel = require('gulp-babel')
const notify = require("gulp-notify")
const del = require('del');
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()
// npm install --save-dev gulp-concat



const clean = () => {
	return del(['dist'])
}


const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist'))
}

const styles = () => {
  return src('src/styles/**/*.css')
  .pipe(sourcemaps.init())
  .pipe(concat('main.css'))
  .pipe(autoprefixes({
    cascade: false,
  }))
  .pipe(cleanCss({
    level: 2
  }))
  .pipe(sourcemaps.write())
  .pipe(dest('dist/css'))
  .pipe(browserSync.stream())
}

const stylesDev = () => {
  return src('src/styles/**/*.css')
  .pipe(concat('main.css'))
  .pipe(autoprefixes({
    cascade: false,
  }))
  .pipe(cleanCss({
    level: 2
  }))
  .pipe(dest('dist/css'))
  .pipe(browserSync.stream())
}


const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlMinifyDev = () => {
  return src('src/**/*.html')
    // .pipe(htmlMin({
    //   collapseWhitespace: true,
    // }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}


const  svgSprites = () => {
  return src('src/images/svg/**/*.svg')
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: '../sprite.svg'
      }
    }
  }))
  .pipe(dest('dist/images'))
}

const scripts = () => {
  return src(
    ['./src/js/components/**.js', './src/js/main.js'])
    .pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
    .pipe(concat('app.js'))
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

const scriptsDev = () => {
  return src(
    ['./src/js/components/**.js', './src/js/main.js'])
    .pipe(concat('app.js'))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.png',
    'src/images/*.svg',
    'src/images/**/*.jpeg',
    'src/images/**/*.webp',
  ])
  .pipe(image())
  .pipe(dest('dist/images'))
}

watch('src/resources/**', resources);
watch('src/**/*.html', htmlMinify)
watch('src/styles/**/*.css', styles)
watch('src/images/svg/**/*.svg', svgSprites)
watch('src/js/**/*.js', scripts)


exports.clean = clean
exports.styles = styles
exports.htmlMinify = htmlMinify
exports.scripts = scripts
exports.default = series(clean ,resources, htmlMinify, scripts, styles, images, svgSprites, watchFiles)
exports.dev = series(clean, resources, htmlMinifyDev, scriptsDev, stylesDev, images, svgSprites, watchFiles)
