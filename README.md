# Foundation libsass template

This is a template to start your own project that uses Grunt and libsass!

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Grunt](http://gruntjs.com/): Run `[sudo] npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `[sudo] npm install -g bower`

## Quickstart

```bash
git clone git@github.com:zurb/foundation-libsass-template.git
npm install && bower install
```

While you're working on your project, run:

`grunt`

And you're set!

## Directory Strucutre

  * `scss/_settings.scss`: Foundation configuration settings go in here
  * `scss/app.scss`: Application styles go here

## Running Lib-Sass

From
  * http://benfrain.com/add-sass-compass-debug-info-for-chrome-web-developer-tools/
  * http://benfrain.com/lightning-fast-sass-compiling-with-libsass-node-sass-and-grunt-sass/

  1. [Download and install node.js](http://nodejs.org/dist/v0.10.24/node-v0.10.24.pkg)
  2. Create package.json in your project root:
    ```
      {
        "name": "Your Project Name",
          "version": "0.0.1",
          "devDependencies": {
              "grunt": "0.4.1",
              "grunt-contrib-watch": "0.4.3",
              "grunt-sass": "0.6.1"
          }
      }
    ```
  3. Create Gruntfile.js in your project root:
    ```
      module.exports = function(grunt) {
          grunt.initConfig({
              pkg: grunt.file.readJSON('package.json'),
              watch: {
                  sass: {
                      files: ['sass/**/*.{scss,sass}','sass/_partials/**/*.{scss,sass}'],
                      tasks: ['sass:dist']
                  },
                  livereload: {
                      files: ['*.html', '*.php', 'js/**/*.{js,json}', 'css/*.css','img/**/*.{png,jpg,jpeg,gif,webp,svg}'],
                      options: {
                          livereload: true
                      }
                  }
              },
              sass: {
                  dist: {
                      files: {
                          'css/styles.css': 'sass/styles.scss'
                      }
                  }
              }
          });
          grunt.registerTask('default', ['sass:dist', 'watch']);
          grunt.loadNpmTasks('grunt-sass');
          grunt.loadNpmTasks('grunt-contrib-watch');
      };
    ```
  4. Install Grunt & Live Rreload:
    * ```sudo npm install -g grunt-cli```
    * ```sudo npm install grunt-livereload```
  5. Install node_modules folder in your root folder.
    * ```cd``` to your project root.
    * Run ```npm install```
  6. Run grunt, which should then watch the folders you specify above, and compile to the ```dist``` folder specified.
    * ```grunt```


## Running Live Reload

(From http://blog.55minutes.com/2013/01/lightning-fast-sass-reloading-in-rails-32/)

  * First, make sure your stylesheets are in app/assets/stylesheets (i.e. using the asset pipeline) and are named with the .css.scss extension.
  * Then, add the guard, guard-livereload, and rack-livereload gems to the :development section of your Gemfile.
  * Enable rack-livereload by adding to config/environments/development.rb:
    ```config.middleware.insert_after(ActionDispatch::Static, Rack::LiveReload)```
  * Run ```bundle install``` to install all of the guard and live reload gems
  * Set up the necessary guard-livereload configuration by running ```guard init livereload```
    * Edit this file to watch the ap
  * Run ```guard -P livereload``` to start Guard’s livereload monitor
  * You should see Guard start up and the livereload monitor should begin listening for connections
  * Start up your web app and load a page. You should see that the browser is now connected.



