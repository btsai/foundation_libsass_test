// This is your Gruntfile, which defines what Grunt is supposed to do;
// it will be loaded by running by 'grunt' at your project root command line.
module.exports = function(grunt) {

  // This function will automatically find all top level .scss files to pass into the sass renderer,
  // so we don't have to manually map a file each time something is created.
  function scssFileMapping(){
    var mappings = {};
    // file.expand will return something like: ['app/scss/application.css.scss'] in this project.
    grunt.file.expand('app/scss/*.scss').forEach(function(path){
      var filename = path.split('/').pop()
      // IMPORTANT!! change this replace method as needed.
      // If your files are like application.scss, then this should be filename.replace('.scss', '.css')
      filename = filename.replace('.scss', '');
      mappings['public/assets/' + filename] = path;
      // grunt.log.writeln('filename: ', filename, ', mappings: ', mappings) // test debug statement, you don't need it.
    })
    return mappings;
  }

  // This is where your grunt tasks are defined.
  // Pass in a JSON object task_name:{ target_name:{}, options:{}}
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // This is the grunt-sass Libsass defined task. You must use this pair of task/target names.
    sass: { // Task name
      dist: { // Task target
        options: {
          outputStyle: 'expanded'
        },
        // Dictionary of files. Each scss file to be compiled must go here.
        // format is {'destination': 'source'}
        // Note that we are using the automatic mapping function above,
        // but you can also manually map each file for the sass engine (this is the default setup), like this:
        // files: {
        //   'public/assets/application.css': 'app/scss/application.css.scss',
        // },
        files: scssFileMapping(),
      },
      options: {
        // Initial setup done by foundation task
        includePaths: ['bower_components/foundation/scss']
      },
    },

    // We're using the copy task to copy over all straight css files (if exists).
    // Copy is also a predefined task.
    // We could just tack these on to the watch:sass task by changing the files definition to:
    // files: ['app/scss/**/*.scss', 'app/scss/**/*.css']
    // But this was a good exercise in discovering more of what Grunt can do.
    copy: {
      css: {
        expand: true,
        src: 'app/scss/*.css',
        dest: 'public/assets/',
        flatten: true,
        filter: 'isFile',
      },
    },

    // This is the main watch (predefined) task, which watches for file changes (passing in the 'files' setting).
    // Define targets which in turn reference other tasks to kick off when the watch event happens.
    watch: {
      // This has been suggested in other articles but we don't need to use this.
      // If you make changes here, just restart grunt instead, unless you're lazy and want to monitor changes in this file too.
      // grunt: { files: ['Gruntfile.js'] },

      // This target watches all level scss files recursively in the app/scss folder,
      // so that any changes in all (including imported) files will trigger compiling in the above sass task.
      sass: {
        files: 'app/scss/**/*.scss',
        tasks: ['sass'],
        options: {
          spawn: false,
          // Note: This is one option that has many articles, but we're not using this,
          // as it reloads the whole page, not just style injection.
          // We need Guard and Rack::LiveReload to reload just the CSS assets as they change.
          // livereload: true,
        },
      },

      // This target watches for any changes in css files (recursively on all levels) and triggers the above copy task.
      css: {
        files: 'app/scss/**/*.css',  // watch for all levels of css files
        tasks: ['copy'],
      }
    }
  });

  // You need to define the Grunt base tasks to load up.
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Finally, register the tasks into the default task.
  // You could register each one, but this is slightly shorter.
  grunt.registerTask('default', ['sass','copy', 'watch']);
}
