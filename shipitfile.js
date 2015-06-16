
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
      keepReleases: 5,
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

  shipit.blTask('deploy', [
    'deploy:init',
    'deploy:fetch',
    'deploy:update'
  ]);

  shipit.on('updated', function() {
    var path = shipit.releasePath;

    shipit.remote('cd ' + path + ' && npm install --production').then(function() {
      return shipit.remote('cd ' + path + ' && bower install --config.interactive=false -F');

    }).then(function() {
      return shipit.remote('cd ' + path + ' && grunt update-hot --hot-version=' + gitInfo.branch);

    }).then(function() {
      return shipit.remote('cd ' + path + ' && grunt build --force');

    }).then(function() {
      return shipit.remote('cd ' + path + ' && grunt generate-doc-versions');

    }).then(function() {
      return gitHelper.getHotLatestRelease();

    }).then(function(objectInfo) {
      if (!objectInfo) {
        console.warn('Error retrieving latest hot version from github.');

        return;
      }

      return shipit.remote('cd ' + shipit.config.deployTo + '/../ && echo "' + objectInfo.tag_name + '" > latestHot');

    }).then(function() {
      shipit.start(['deploy:publish', 'deploy:clean']);
    });
  });
};
