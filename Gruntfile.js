module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'server/static/app.js': 'app/initialize.js'
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/*.js', '!lib/dontwatch.js'],
        tasks: ['browserify'],
      },
      src: {
        files: ['app/assets/*.html'],
        tasks: ['copy'],
      },
      vendor: {
        files: ['app/vendor/*'],
        tasks: ['copy'],
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            src: 'app/assets/*.html',
            dest: 'server/templates/',
            flatten: true,
            filter: 'isFile'
          }, {
            expand: true,
            src: 'app/vendor/*',
            dest: 'server/static/vendor/',
            flatten: true
          }
        ],
      },
    },
    browserify: {
      main: {
        options: {
          transform: [
            ["babelify", {
              presets: ["es2015"]
            }]
          ]
        },
        src: 'app/initialize.js',
        dest: 'server/static/vendor.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'babel', 'browserify']);

};
