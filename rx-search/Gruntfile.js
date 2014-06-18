module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    opts: {
      path: '.',
      name: 'rx-search'
    },
    stylus: {
      compile: {
        options: {
          compress: false,
          use: [ require('nib') ],
          "include css": true
        },
        files: {
          '<%= opts.path %>/dist/<%= opts.name %>.css': '<%= opts.path %>/css/compo.styl'
        }
      }
    },
    browserify: {
      dev: {
        files: {
          '<%= opts.path %>/dist/<%= opts.name %>.js': ['<%= opts.path %>/scripts/compo.js'],
        }
      }
    },
    copy: { //for development
      dev: {
        src: '<%= opts.path %>/dist/<%= opts.name %>.js',
        dest:'<%= opts.path %>/dist/<%= opts.name %>.min.js'
      }
    },
    uglify: { //for production
      prod: {
        files: {
          '<%= opts.path %>/dist/<%= opts.name %>.min.js': ['<%= opts.path %>/dist/<%= opts.name %>.js']
        }
      }
    },
    watch: {
      options: {
        spawn: false
      },
      dev: {
        files: [
          '<%= opts.path %>/scripts/**/*.js',
          '<%= opts.path %>/css/**/*.styl'
        ],
        tasks: ['stylus', 'browserify', 'copy']
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '<%= opts.path %>'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['stylus', 'browserify', 'copy', 'watch']);
  grunt.registerTask('dev', ['stylus', 'browserify', 'copy', 'connect', 'watch']);
  grunt.registerTask('prod', ['stylus', 'browserify', 'uglify']);
};
