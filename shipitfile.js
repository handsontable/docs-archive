
var getRepoInfo = require('git-repo-info');
var GitHubApi = require('github');
var Promise = require('bluebird');
var fs = require('fs');

var github = new GitHubApi({
  version: '3.0.0',
  timeout: 5000,
  headers: {
    'user-agent': 'Handsontable'
  }
});

module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  var
    gitInfo = getRepoInfo(),
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
      config.deployTo = '/home/httpd/docs.handsontable.com/' + gitInfo.branch;

      return config;
    }()),
    development: (function() {
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
      return shipit.remote('cd ' + current + ' && grunt update-hot');

    }).then(function() {
      return shipit.remote('cd ' + current + ' && grunt build');

    }).then(function() {
      return new Promise(function(resolve, reject) {
        github.releases.listReleases({
          owner: 'handsontable',
          repo: 'handsontable',
          page: 1,
          per_page: 1
        }, function(err, resp) {
          if (err) {
            // Don't brake cli chain call
            return resolve(err);
          }
          resolve(resp);
        });
      });

    }).then(function(resp) {
      if (!resp.length) {
        console.warn('Error retrieving latest hot version from github.');

        return;
      }
      var latestHot = resp[0].tag_name.split('.').splice(0, 2).join('.') + '.x';

      return shipit.remote('cd ' + shipit.config.deployTo + '/../ && echo "' + latestHot + '" > latestHot');
    });
  });
};
