/**
 * This file is used to build Handsontable documentation.
 *
 * Installation:
 * 1. Install Grunt CLI (`npm install -g grunt-cli`)
 * 1. Install Grunt 0.4.0 and other dependencies (`npm install`)
 *
 * Build:
 * Execute `grunt` from root directory of this directory (where Gruntfile.js is)
 *
 * Result:
 * Building Handsontable docs will create files:
 *  - generated/*
 *
 * See http://gruntjs.com/getting-started for more information about Grunt
 */

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var gitHelper = require('./git-helper');


module.exports = function (grunt) {
  var
    DOCS_PATH = 'generated',
    HOT_SRC_PATH = 'src/handsontable',
    HOT_DEFAULT_BRANCH = 'master',
    HOT_REPO = 'https://github.com/handsontable/handsontable.git',
    querystring = require('querystring');


  function getHotBranch() {
    var hotVersion = argv['hot-version'];

    return hotVersion ? (hotVersion === 'latest' ? HOT_DEFAULT_BRANCH : hotVersion) : gitHelper.getLocalInfo().branch;
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: [DOCS_PATH],
      source: [HOT_SRC_PATH]
    },

    jsdoc: {
      docs: {
        src: [
          HOT_SRC_PATH + '/src/**/*.js',
          '!' + HOT_SRC_PATH + '/src/**/*.spec.js',
          '!' + HOT_SRC_PATH + '/src/**/*.e2e.js',
          '!' + HOT_SRC_PATH + '/src/**/*.unit.js',
          '!' + HOT_SRC_PATH + '/src/3rdparty/walkontable/**/*.js',
        ],
        jsdoc: 'node_modules/.bin/' + (/^win/.test(process.platform) ? 'jsdoc.cmd' : 'jsdoc'),
        options: {
          verbose: true,
          destination: DOCS_PATH,
          configure: 'conf.json',
          template: './',
          tutorials: 'tutorials',
          'private': false,
          query: ''
        }
      }
    },

    sass: {
      dist: {
        src: 'sass/main.scss',
        dest: 'static/styles/main.css'
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src',
            dest: 'generated',
            src: [
              'static/**'
            ],
          },
          {
            expand: true,
            cwd: 'node_modules/numbro',
            dest: 'generated/bower_components/numbro',
            src: ['**'],
          },
          {
            expand: true,
            cwd: 'node_modules/axios',
            src: ['dist/axios.min.js'],
            dest: 'generated/bower_components/axios/',
          },
          {
            expand: true,
            cwd: 'node_modules/fastclick',
            src: ['lib/fastclick.js'],
            dest: 'generated/bower_components/fastclick/',
          },
          {
            expand: true,
            cwd: 'node_modules/handsontable',
            src: ['dist/handsontable.*'],
            dest: 'generated/bower_components/handsontable/',
          },
          {
            expand: true,
            cwd: 'node_modules/font-awesome',
            src: ['css/**', 'fonts/**'],
            dest: 'generated/bower_components/font-awesome/',
          },
          {
            expand: true,
            cwd: 'node_modules/highlightjs',
            dest: 'generated/bower_components/highlightjs',
            src: ['**'],
          },
          {
            expand: true,
            cwd: 'node_modules/promise-polyfill',
            src: ['dist/polyfill.min.js'],
            dest: 'generated/bower_components/promise-polyfill/',
          },
        ]
      }
    },

    watch: {
      files: ['tutorials/**', 'sass/**', 'static/**', 'tmpl/**'],
      tasks: [],
      options: {
        debounceDelay: 250
      },
      dist: {
        files: ['generated/**'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      dist: {
        options: {
          port: 5455,
          hostname: '0.0.0.0',
          base: 'generated',
          livereload: true
        }
      }
    },

    open: {
      dist: {
        path: 'http://localhost:5455'
      }
    },

    sitemap: {
      dist: {
        pattern: ['generated/*.html', '!generated/tutorial-40*.html'],
        siteRoot: 'generated/'
      }
    },

    gitclone: {
      handsontable: {
        options: {
          branch: HOT_DEFAULT_BRANCH,
          repository: HOT_REPO,
          directory: HOT_SRC_PATH,
          verbose: true
        }
      }
    },

    env: {
      build: {
        src : '.env.json'
      }
    },
  });

  grunt.registerTask('server', [
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('authenticate-git', ['env:build', 'authenticate-git-internal']);
  grunt.registerTask('authenticate-git-internal', 'Authenticate Github', function() {
    gitHelper.setupGitApi(process.env.GITHUB_TOKEN);
  });

  grunt.registerTask('default', 'Create documentation for Handsontable', function() {
    var timer;

    grunt.task.run('authenticate-git');
    grunt.task.run('update-hot');

    timer = setInterval(function() {
      if (!grunt.file.isFile(HOT_SRC_PATH + '/package.json')) {
        return;
      }
      clearInterval(timer);
      grunt.task.run('generate-doc-versions');
      grunt.task.run('generate-disallow-for-robots');
      grunt.task.run('build');
    }, 50);
  });

  grunt.registerTask('update-hot', 'Update Handsontable repository', function () {
    grunt.config.set('gitclone.handsontable.options.branch', getHotBranch());
    grunt.log.write('Cloning Handsontable v' + getHotBranch());

    grunt.task.run('clean:source');
    grunt.task.run('gitclone');
  });

  grunt.registerTask('generate-doc-versions', ['authenticate-git', 'generate-doc-versions-internal']);
  grunt.registerTask('generate-doc-versions-internal', 'Generate documentation for Handsontable', function () {
    var done = this.async();

    gitHelper.getDocsVersions().then(function(branches) {
      branches = branches.filter(function(branch) {
        return /^\d+\.\d+\.\d+$/.test(branch) && !/^draft\-/.test(branch) && semver.gte(branch, '0.32.0');
      });

      var content = 'docVersions && docVersions(' + JSON.stringify(branches.reverse()) + ')';

      grunt.log.write('The following versions found: ' + branches.join(', '));
      fs.writeFile(path.join(DOCS_PATH, 'scripts', 'doc-versions.js'), content, done);
    });
  });

  grunt.registerTask('generate-disallow-for-robots', ['authenticate-git', 'generate-disallow-for-robots-internal']);
  grunt.registerTask('generate-disallow-for-robots-internal', 'Generate disallowed paths for web crawler robots', function () {
    var done = this.async();

    gitHelper.getDocsVersions().then(function(branches) {
      branches.pop(); // Remove the newest version of the docs

      var content = '\n' + branches.map(function(branch) {
        return 'Disallow: /' + branch + '/';
      }).join('\n') + '\n';

      grunt.log.write('The following versions added to disallow: ' + branches.join(', '));
      fs.writeFile(path.join(DOCS_PATH, 'robots_disallow'), content, done);
    });
  });

  grunt.registerTask('build', ['authenticate-git', 'build-internal']);
  grunt.registerTask('build-internal', 'Generate documentation for Handsontable', function () {
    var done = this.async();
    var hotPackage;
    var version;
    var latestVersion;

    gitHelper.getHotLatestRelease().then(function(info) {
      grunt.task.run('sass', 'copy');

      hotPackage = grunt.file.readJSON(HOT_SRC_PATH + '/package.json');
      version = argv['hot-version'] || hotPackage.version;
      latestVersion = argv['hot-version'] || info.tag_name;

      grunt.config.set('jsdoc.docs.options.query', querystring.stringify({
        version: version,
        latestVersion: latestVersion
      }));

      grunt.task.run('jsdoc');
      grunt.task.run('sitemap');
      done();
    });
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-sitemap');
  grunt.loadNpmTasks('grunt-env');
};
