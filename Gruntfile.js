module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {                                                                       // Task
      options: {
        includePaths: ['bower_components/foundation/scss']                        // Initial setup done by foundation task
      },
      dist: {                                                                     // Target
        options: {
          outputStyle: 'expanded'
        },
        // Dictionary of files. Each scss file to be compiled must go here.
        // 'destination': 'source'
        files: {
          'public/assets/application.css': 'app/scss/application.css.scss'
        }
      }
    },

    watch: {
      // This has been suggested but we don't need to use this. If you make changes here, just restart grunt instead.
      // grunt: { files: ['Gruntfile.js'] },
      sass: {
        files: 'app/scss/**/*.scss',
        tasks: ['sass'],
        // Note: This is one method, but we're not using grunt-watch livereload,
        // as it reloads the whole page, not just style injection
        // options: { livereload: true },
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass','watch']);
}