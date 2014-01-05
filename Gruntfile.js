module.exports = function(grunt) {

  // automatically find all top level .scss files to pass into the sass renderer
  function scssFileMapping(){
    var mappings = {};
    // file.expand will return something like: ['app/scss/application.css.scss']
    grunt.file.expand('app/scss/*.scss').forEach(function(path){
      var filename = path.split('/').pop().replace('.scss', '');
      mappings['public/assets/' + filename] = path;
      // grunt.log.writeln('filename: ', filename, ', mappings: ', mappings)
    })
    return mappings;
  }

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
        files: scssFileMapping(),
        // Note: you can also manually map each file for the sass engine (this is the default setup).
        // files: {
        //   'public/assets/application.css': 'app/scss/application.css.scss',
        // },
      }
    },

    // we're using the copy task to copy over all straight css files (if exists)
    copy: {
      css: {
        expand: true,
        src: 'app/scss/*.css',
        dest: 'public/assets/',
        flatten: true,
        filter: 'isFile',
      },
    },

    watch: {
      // This has been suggested but we don't need to use this. If you make changes here, just restart grunt instead.
      // grunt: { files: ['Gruntfile.js'] },
      sass: {
        files: 'app/scss/**/*.scss',  // watch all level scss files so that changes in imported files will trigger compiling
        tasks: ['sass'],
        // Note: This is one method, but we're not using grunt-watch livereload,
        // as it reloads the whole page, not just style injection
        // options: { livereload: true },
        options: {
          spawn: false,
        },
      },
      css: {
        files: 'app/scss/**/*.css',  // watch for all levels of css files
        tasks: ['copy'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['sass','copy', 'watch']);
  // grunt.registerTask('default', ['sass', 'watch']);
}