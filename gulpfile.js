//gulpプラグインの読み込み
const { src, dest, watch, parallel } = require("gulp");
//Sassコンパイル機能プラグインの読み込み
const sass = require("gulp-sass");
//エラーが出てもgulpを終了させないプラグインの読み込み
const plumber = require("gulp-plumber");
//エラーが出たら通知を出すプラグイン
const notify = require("gulp-notify");
//browser-syncプラグインの読み込み
const browserSync = require("browser-sync");
//自動でベンダープレフィックス付与の各プラグインの読み込み
const postCss = require("gulp-postcss");
const autoPrefixer = require("autoprefixer");

/**
 * タスク:Sassのコンパイル
 */
const compileSass = (done) => {
  // .scssファイルを取得
  src("src/scss/*.scss")
    // plumberでエラーが出てもgulpを落とさない、errorhandlerにnotifyを指定してエラーの通知を出す
    .pipe(plumber({errorHandler:notify.onError("Error:<%= error.message %>")}))
    // オートプレフィクス
    .pipe(postCss([
      autoPrefixer({
        cascade: false
      })
    ]))
    // Sassのコンパイルの実行
    .pipe(sass({ outputStyle:"expanded" }))
    // cssフォルダー以下に保存
    .pipe(dest("dist/css/"))
    // ブラウザのストリーム
    .pipe(browserSync.stream());
    done();
}

/**
 * タスク:localhostでブラウザを立ち上げる
 */
const upBrowserSync = (done) => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

/**
 *  タスク:.sassファイルを監視、変更があったらcompileSassを実行
 */
const watchSassFile = (done) => {
  watch("src/scss/*.scss", compileSass);
  done();
}

/**
 * html.jsファイルに変更があったらリロード
 */
const reload = (done) => {
  browserSync.reload();
  done();
}
const watchOtherFile = (done) =>{
  watch(['./*.html','./**/*.html','dist/js/*.js'], reload);
  done();
}

// npx gulpコマンド実行時の関数を指定
exports.default = parallel(upBrowserSync, watchSassFile, watchOtherFile);