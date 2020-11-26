module.exports =  function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.initConfig({
    watch: {
      sass: {
        files: ['assets/sass/*.scss'],
        tasks: ['sass'],
        options: {
          event: ['all'],
          dateFormat: function(time) {
            grunt.log.writeln(('SASS watch finished in ' + time + 'ms')['cyan']);
            grunt.log.writeln('Waiting for more changes...'['green']);
          },
        },
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compact'
        },
        files: {
          'assets/css/main.css': 'assets/sass/main.scss',
        }
      }
    },
  });

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('styles', ['sass']);
};
