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

var fs = require('fs');

module.exports = function (grunt) {
  var
      DOCS_PATH = 'generated',
      HOT_SRC_PATH = 'src/handsontable',
      HOT_BRANCH = 'master',
      HOT_REPO = 'https://github.com/handsontable/handsontable.git',
      querystring = require('querystring');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: [DOCS_PATH]
    },

    jsdoc: {
      docs: {
        src: [
          HOT_SRC_PATH + '/src/**/*.js',
          'tutorials/INDEX.md',
          '!' + HOT_SRC_PATH + '/src/**/*.spec.js',
          '!' + HOT_SRC_PATH + '/src/3rdparty/walkontable/test/**/*.js',
          '!' + HOT_SRC_PATH + '/src/intro.js',
          '!' + HOT_SRC_PATH + '/src/outro.js'
        ],
        options: {
          jsdoc: 'node_modules/grunt-jsdoc/node_modules/jsdoc/jsdoc.js',
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

    less: {
      dist: {
        src: 'less/hot/**/docs.less',
        dest: 'static/styles/docs.css'
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          dest: 'generated',
          src: [
            'static/**'
          ]
        }]
      }
    },
    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      scripts: {
        options: {
          destPrefix: 'generated/bower_components'
        },
        files: {
          'jquery/jquery.min.js': 'jquery/dist/jquery.min.js',
          'fastclick': 'fastclick',
          'jquery.cookie': 'jquery.cookie',
          'jquery-placeholder': 'jquery-placeholder',
          'modernizr': 'modernizr',
          'handsontable': 'handsontable',
          'zeroclipboard': 'zeroclipboard',
          'pikaday': 'pikaday',
          "moment": "moment",
          "backbone": "backbone",
          "backbone.relational": "backbone.relational",
          "highlightjs": "highlightjs",
          "chroma-js": "chroma-js",
          "raphael": "raphael",
          "bootstrap": "bootstrap",
          "numeraljs": "numeraljs",
          "font-awesome": "font-awesome",
          "lodash": "lodash"
        }
      }
    },
    watch: {
      files: ['tutorials/**', 'less/**', 'static/**', 'tmpl/**'],
      tasks: ['default'],
        options: {
        debounceDelay: 250
      }
    },

    gitclone: {
      handsontable: {
        options: {
          branch: HOT_BRANCH,
          repository: HOT_REPO,
          directory: HOT_SRC_PATH,
          verbose: true
        }
      }
    },

    gitpull: {
      handsontable: {
        options: {
          branch: HOT_BRANCH,
          cwd: HOT_SRC_PATH,
          verbose: true
        }
      }
    }
  });

  grunt.registerTask('default', 'Create documentation for Handsontable', function() {
    var
      hotPackage,
      timer;

    if (fs.existsSync(HOT_SRC_PATH)) {
      grunt.task.run('gitpull');
    } else {
      grunt.task.run('gitclone');
    }

    timer = setInterval(function() {
      if (!grunt.file.isFile(HOT_SRC_PATH + '/package.json')) {
        return;
      }
      clearInterval(timer);
      grunt.task.run('less', 'clean', 'copy', 'bowercopy');

      hotPackage = grunt.file.readJSON(HOT_SRC_PATH + '/package.json');
      grunt.config.set('jsdoc.docs.options.query', querystring.stringify({
        version: hotPackage.version
      }));

      grunt.task.run('jsdoc');
    }, 50);
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-bowercopy');
};
