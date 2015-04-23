
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    production: {
      servers: '142.4.202.189',
      workspace: '/tmp/docs.handsontable.com',
      deployTo: '/home/httpd/docs.handsontable.com',
      repositoryUrl: 'https://github.com/handsontable/docs.git',
      branch: 'develop',
      ignores: ['.git', 'node_modules', 'src'],
      rsync: ['--del', '-I', '--stats', '--chmod=ug=rwX,o=r'],
      keepReleases: 3,
      shallowClone: false
    }
  });

  shipit.task('test', function() {
    shipit.remote('pwd');
  });

  shipit.on('published', function() {
    var current = shipit.config.deployTo + '/current';

    shipit.remote('cd ' + current + ' && npm install').then(function() {
      return shipit.remote('cd ' + current + ' && bower install --config.interactive=false -F');

    }).then(function() {
      return shipit.remote('cd ' + current + ' && grunt');
    })
  });
};
