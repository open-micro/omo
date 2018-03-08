'use strict';

const request = require('request');
const webpackConfig = require('./webpack.config')

module.exports = (grunt) => {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  let files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'index.js'
      }
    },
    webpack: {
      options: {
        stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      },
      prod: webpackConfig,
      dev: Object.assign({ watch: false }, webpackConfig)
    },
    watch: {
      options: {
        nospawn: true
      },
      js: {
        files: [
          'index.js',
          'app.js',
          'app/**/*.js',
          '!app/client/**',
          'config/*.js'
        ],
        tasks: ['develop']
      },
      client: {
        files: [
          'app/client/**/*.jsx',
          'app/client/**/*.js'
        ],
        tasks: ['webpack']
      },
      scss: {
        files: [
          'app/client/**/*.scss'
        ],
        tasks: ['webpack']
      },
      css: {
        files: [
          'public/css/*.css'
        ]
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('default', [
    'develop',
    'webpack',
    'watch'
  ]);
};
