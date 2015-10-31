var gulp = require("gulp"),
	gulpConcat = require("gulp-concat"),
	gulpUglify = require("gulp-uglify"),
	gulpRename = require("gulp-rename"),
    gulpMinifyCss = require("gulp-minify-css"),
	gulpAutoprefixer = require('gulp-autoprefixer');

gulp.task("angular-full", function() {
	gulp.src([ "js/directives/*.js", 
				"js/services/*.js", 
				"js/filters/*.js",
				"js/controllers/*.js"
				])
		.pipe(gulpConcat('angfull.js'))
		.pipe(gulpUglify())
		.pipe(gulpRename('angfull.min.js'))
		.pipe(gulp.dest("js"));
});

gulp.task("css-main", function() {
	gulp.src("css/main.css")
		.pipe(gulpAutoprefixer({
            browsers: ['last 2 versions', '> 1%', 'Firefox ESR', 'Opera 12.1', 'ie 9'],
            remove: false
        }))
		.pipe(gulp.dest("css"))
		.pipe(gulpMinifyCss())
		.pipe(gulpRename('main.min.css'))
		.pipe(gulp.dest("css"));
});
