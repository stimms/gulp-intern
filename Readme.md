An easy way to run [intern](https://theintern.github.io/) scripts from a build script.


To make use simply require gulp-intern and give it the config file and, optionally, the working directory.
```
var intern = require('gulp-intern');

//...

gulp.task('typescript', function(){

  gulp.src(config.typescript.input)
  .pipe(tsc())
  .pipe(gulp.dest("Scripts"))
  .pipe(intern({config:"tests/intern", workingDir: 'Scripts' }));

});

```

This script is, in effect, a wrapper for just calling the command line version of intern. Configuration is done in the configuration file instead of through gulp. 
