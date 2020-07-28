const gulp = require('gulp'),
    glob = require('glob'),
    sass = require('gulp-sass'),
    browserify = require("browserify"),
    babelify = require("babelify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    uglify = require("gulp-uglify"),
    browserSync = require('browser-sync').create();

const paths = {
    src: "./src",
    dist: "./dist"
}

// compila SCSS em CSS
function style() {
    // 1 onde esta nosso SCSS fonte
    return gulp.src(`${paths.src}/scss/**/*.scss`)

        // 2 passar o arquivo pelo compilador
        .pipe(sass()).on('error', sass.logError)

        // 3 jogar resultado no destino
        .pipe(gulp.dest(`${paths.dist}/css`))

        // 4 stream faz compatibilidade com outros navegadores
        .pipe(browserSync.stream())
}

function scripts() {

    // Pega todos os arquivos em nossa pasta de origem dos javascripts
    const jsFiles = glob.sync(`${paths.src}/js/**/*.js`);

    return (
        browserify({ // Começa chamando browserify com o ponto de entrada para nossa pasta principal de arquivos javascript
            entries: jsFiles,
            // Passe babelify como uma transform e define sua predefinição como @babel/preset-env
            transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
        })
            // Junta todos os arquivos em um pacote
            .bundle()
            // Define origem do pacote
            .pipe(source("main.js"))
            // Transforma o pacote em um buffer
            .pipe(buffer())
            // Minifica pacote
            .pipe(uglify())
            .pipe(gulp.dest(`${paths.dist}/js`))
    );
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })

    // Ao ocorrer mudança nos arquivos especificados, a página é recarregada
    gulp.watch(`${paths.src}/scss/**/*.scss`, style).on('change', browserSync.reload);
    gulp.watch(`${paths.src}/js/**/*.js`, scripts).on('change', browserSync.reload);
}

exports.style = style;
exports.scripts = scripts;
exports.watch = watch;
