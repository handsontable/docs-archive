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
module.exports = function (grunt) {
  var
      DOCS_PATH = 'generated',
      HOT_SRC_PATH = 'src/handsontable',
      HOT_BRANCH = 'master', // to test after merge -> feature/issue-1972
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
          query: (function() {
            var hotPackage = grunt.file.readJSON(HOT_SRC_PATH + '/package.json');

            return querystring.stringify(hotPackage);
          }())
        }
      }
    },

    less: {
      dist: {
        src: 'less/**/jaguar.less',
        dest: 'static/styles/jaguar.css'
      }
    },

    copy: {
      css: {
        src: 'static/styles/jaguar.css',
        dest: DOCS_PATH + '/styles/jaguar.css'
      },

      js: {
        src: 'static/scripts/main.js',
        dest: DOCS_PATH + '/scripts/main.js'
      }
    },

    exec: {
      updateSrc: {
        cmd: function() {
          var
            cmd = '([ -d {src} ] && echo || mkdir -p {src}) && [ -f {src}/README.md ] && (cd {src}/ && git pull && cd ..) || (git clone -b {branch} {repo} {src}/ && cd ..)',
            params = {
              src: HOT_SRC_PATH,
              branch: HOT_BRANCH,
              repo: HOT_REPO
            };

          cmd = cmd.replace(/\\?\{([^{}]+)\}/g, function(match, name) {
            if ( params[name] ) {
              return params[name];
            }

            throw new Error('Undefined param in exec:updateSrc');
          });

          return cmd;
        }
      }
    }
  });

  grunt.registerTask('default', 'Create documentation for Handsontable', ['less', 'clean', 'copy', 'exec:updateSrc', 'jsdoc']);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-jsdoc');
};
