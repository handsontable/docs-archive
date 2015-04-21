
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    production: {
      servers: '142.4.202.189',
      workspace: '/tmp/docs.handsontable.com',
      deployTo: '/home/httpd/docs.handsontable.com',
      repositoryUrl: 'https://github.com/handsontable/docs.git',
      branch: 'develop',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 3,
      shallowClone: true
    }
  });

  shipit.on('published', function() {
    var current = shipit.config.deployTo + '/current';

    shipit.remote('cd ' + current + ' && npm install && bower install --config.interactive=false -F && grunt');
  });
};
