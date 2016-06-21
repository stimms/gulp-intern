var path = require('path');
var through = require('through');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var PLUGIN_NAME = 'gulp-intern';

module.exports = function(opt) {
  var testRunner;
  opt = opt || {};
  opt.config = opt.config || 'tests/config';
  opt.workingDir = opt.workingDir || process.cwd();
  opt.runType = opt.runType || 'client';
  switch(opt.runType) {
  case 'client':
    testRunner = 'intern-client.js';
    break;
  case 'runner':
    testRunner = 'intern-runner.js';
    break;
  default:
    throw new gutil.PluginError(PLUGIN_NAME, '"runType" option can be only "client" or "runner"');
  }



  function bufferContents(file) {

  }

  function endStream() {
    var internPath = [process.cwd(), 'node_modules', 'intern', 'bin', testRunner].join(path.sep),
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

    var stream = this;
    child.on('exit', function(code) {
      if(code !== 0) {
        new gutil.PluginError(PLUGIN_NAME, 'Tests failed');        
      }
      stream.emit('end');
    });
  }

  return through(bufferContents, endStream);
};
