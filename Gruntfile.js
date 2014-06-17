module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    opts: {
      path: '.',
      name: 'reactjsx'
    },
    connect: {
      server: {
        options: {
          keepalive: true,
          port: 8000,
          base: '<%= opts.path %>'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['connect']);
};
