
var copyObject = require('copy-object');
var gitHelper = require('./git-helper');


module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  var
    gitInfo = gitHelper.getLocalInfo(),
    config = {
      servers: '142.4.202.189',
      workspace: '/tmp/docs.handsontable.com/' + gitInfo.branch,
      repositoryUrl: 'https://github.com/handsontable/docs.git',
      branch: gitInfo.branch,
      ignores: ['.git', 'node_modules'],
      rsync: ['--force', '--delete', '--delete-excluded', '-I', '--stats', '--chmod=ug=rwX'],
      keepReleases: 3,
      shallowClone: false
    };

  shipit.initConfig({
    production: (function() {
      config = copyObject(config);
      config.deployTo = '/home/httpd/docs.handsontable.com/' + gitInfo.branch;

      return config;
    }()),
    development: (function() {
      config = copyObject(config);
      config.deployTo = '/home/httpd/dev-docs.handsontable.com/' + gitInfo.branch;

      return config;
    }())
  });

  shipit.task('test', function() {
    shipit.remote('pwd');
  });

  shipit.on('published', function() {
    var current = shipit.config.deployTo + '/current';

    shipit.remote('cd ' + current + ' && npm install --production').then(function() {
      return shipit.remote('cd ' + current + ' && bower install --config.interactive=false -F');

    }).then(function() {
      return gitHelper.getHotLatestRelease('~' + gitInfo.branch.replace('x', '0-beta'));

    }).then(function(objectInfo) {
      return shipit.remote('cd ' + current + ' && grunt update-hot --hot-version=' + objectInfo.tag_name);

    }).then(function() {
      return shipit.remote('cd ' + current + ' && grunt build');

    }).then(function() {
      return shipit.remote('cd ' + current + ' && grunt generate-doc-versions');

    }).then(function() {
      return gitHelper.getHotLatestRelease();

    }).then(function(objectInfo) {
      if (!objectInfo) {
        console.warn('Error retrieving latest hot version from github.');

        return;
      }
      var latestHot = objectInfo.tag_name.split('.').splice(0, 2).join('.') + '.x';

      return shipit.remote('cd ' + shipit.config.deployTo + '/../ && echo "' + latestHot + '" > latestHot');
    });
  });
};
