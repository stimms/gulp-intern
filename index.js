var path = require('path');
var through = require('through');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');

module.exports = function(opt) {
  opt = opt || {};
  opt.config = opt.config || 'tests/config';
  opt.workingDir = opt.workingDir || process.cwd();


  function bufferContents(file) {

  }

  function endStream() {
    var internPath = [process.cwd(), 'node_modules', 'intern', 'bin', 'intern-client.js'].join(path.sep),
      child = spawn('node', [internPath, 'config=' + opt.config], {cwd: opt.workingDir}),
      stdout = '',
      stderr = '';

    child.stdout.setEncoding('utf8');

    child.stdout.on('data', function (data) {
        stdout += data;
        gutil.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        stderr += data;
        gutil.log(gutil.colors.red(data));
        gutil.beep();
    });

    child.on('close', function(code) {
      if(code !== 0) {
        new gutil.PluginError('gulp-intern', 'Tests failed');
      }
    });


    this.emit('end');
  }


  return through(bufferContents, endStream);
};
