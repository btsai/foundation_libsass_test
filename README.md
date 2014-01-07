# Libsass & LiveReload with Rails & Foundation 5

### Overview

This project is a bare-bones Rails project that will allow one to test the setup required to get Libsass compiling your Sass for your project, together with Rack::LiveReload.

Even with all of the information on the web, there was nothing that seemed to cover the exact configuration that I was looking for, so I had to work out a test rig and am recording this for future reference and in case it helps anyone else.
I've put in copius comments in each of the relevant files:
* Gruntfile.js
* Guardfile
* config/application.rb
* config/environments/development.rb, production.rb

Using the default Rails asset pipeline and Sprockets to compile Sass with the sass-rails gem is far too slow to use with a larger Sass library like Fuondation 5; changes in CSS that require compiling Foundation 5 libraries will take several seconds with the Rails pipeline, whereas with this setup, CSS/Sass changes are reflected in the page within several hundred msec.

The basic concepts of this setup are:

* Use the pipeline to serve JS and other non-CSS assets from app/assets.
* Rename the app/assets/stylesheets folder to app/scss to remove it from the asset pipeline compilation.
* Do NOT include the app/scss folder in the `config.assets.paths` in development mode.
* In production, stable and any other mode where `config.assets.compile = true`, add app/scss to config.assets.path and config.assets.precompile, so that the Rails pipeline will properly precompile them.
* Use Libsass and Grunt to watch the app/scss folder recursively, and:
  1. Sass compile any .scss assets into the /public/assets folder.
  2. Copy any changed .css assets directly into the /public/assets folder.
* Use Guard and Rack::LiveReload to set up a socket between your local Rails server and your browsers (desktop, mobile),
  so that any changes to files in /public/assets will trigger a reload of just that file, so that the whole browser page doesn't have to load.
  * Not only is this super-fast, this is very useful for testing styling changes when the page is in a certain state, e.g. after certain events have been triggered on the page.

The only page in this project is the home/show page which uses Foundation js and scss elements.

### Setting up Your Rails Project to Use Libsass as the Sass Compiler

#### File Structure

* We need to move the scss out of the asset pipeline so that Sprockets doesn't do the Sass compiling. See the notes above on this.
* Rename the app/assets/stylesheets folder to app/scss (scss files go in that folder).
* Keep all of the scss files you want complied to css in top level of that folder.
* Move all import-only, require-only scss files into a subfolder; I use 'precompiles'.
  This is because the application.rb setting for config.assets.precompile automatically takes anything in the top level of the app/scss folder and will precompile it (scss or css), but will ignore all subfolders.
  Supposedly, the pipeline compiler is supposed to also ignore all files that are prefixed with '_', but I recommend using the subfolder method because it makes it easy to see which files you should be expected to see compiled into public/assets.
* The final structure looks like this:

  ```
  app
  |- scss
     |- application.css.scss
        |- precompiles
           |- _base.css.scss
  ```
* A note on file naming. If you use only *.scss, not *.css.scss, you will need to change line 14 in the Gruntfile.


#### Asset Pipeline Settings

You will at a minimum need to set these for your scss/css assets:
* In config/application.rb

  ```
  config.assets.precompile += Dir.glob('app/scss/*.{css,css.erb,scss}').map{ |path|
    path.gsub('app/scss/', '').gsub('.erb', '')
  }
  ```
See the block under 'ASSET PIPELINE PRECOMPILING' in this project's config/application.rb

* In production.rb (and testing.rb, stable.rb if you are not compiling assets on the fly)
  ```
  config.assets.paths << 'app/scss/'
  ```


### Running Libsass and LiveReload

#### Package Requirements

You'll need to have the following items installed before continuing.

* [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
* [Grunt](http://gruntjs.com/): Run `[sudo] npm install -g grunt-cli`
* [Bower](http://bower.io): Run `[sudo] npm install -g bower`


#### Running Lib-Sass and Grunt to Compile Sass

Add these files (all relative to the project root):
* /package.json
  This defines for Node/NPM what node_modules are required.
  Any new grunt functions you add to the project have to be also added here, not just referenced in Gruntfile.js.
  We have adjusted .gitignore not to include the /node_modules folder, since you will be able to generate this when you run `npm install`

* /Gruntfile.js
  See file details [here](blob/master/Gruntfile.js)
  This is the definition file for the Grunt tasks. When you run `grunt`, it will read this file.
  Note that if your Sass file names are like application.scss (not .css.scss), you will need to change the replace method in line 14.

Download and install the node_modules defined in package.json:
  ```
  npm install
  ```

Run one of the two in a separate terminal:
* `grunt`
* `grunt --verbose` - I like to use this as i can see/confirm what is being watched.

If everything is working, you should see the following output (only showing the relevant bits);
```
Running "sass:dist" (sass) task
Verifying property sass.dist exists in config...OK
Files: app/scss/another.css.scss -> public/assets/another.css
Files: app/scss/application.css.scss -> public/assets/application.css

Running "copy:css" (copy) task
Verifying property copy.css exists in config...OK
Files: app/scss/straight.css -> public/assets/straight.css
Copying app/scss/straight.css -> public/assets/straight.css
```

And you should see these files appear:
```
public
|- assets
   |- application.css
   |- straight.css
```

#### Running Guard Live Reload to Automatically Reload Changed CSS Assets

Additional gems (note that this is needed only for development):
* Add this to your Gemfile:

  ```
  group :development do
    # FOR LIVERELOAD
    gem 'guard', '>= 2.2.2',       :require => false
    gem 'guard-livereload',        :require => false
    gem 'rack-livereload'
    gem 'rb-fsevent',              :require => false
  end

  ```
* Run `bundle install`

Add this file (open it up to see more detailed comments):
* /Guardfile. This file defines what files to watch. Depending on the type of file, either just that asset will be reloaded, or the entire page will be refreshed.

Add a reference to Rack::LiveReload, again only for development.
* In development.rb, add:
  ```
  config.middleware.insert_after(ActionDispatch::Static, Rack::LiveReload)
  ```

Launch Guard livereload in a separate terminal.
```
guard -P livereload
```

You should see Guard start up and the livereload monitor should begin listening for connections
```
10:43:55 - INFO - Guard is now watching at '/foundation_libsass_test'
10:46:42 - INFO - Reloading browser: public/assets/another.css
10:46:42 - INFO - Reloading browser: public/assets/application.css
[1] LiveReload guard(main)>
```

#### Running It All Together

In 3 different terminals:
* Start `grunt --verbose`
* Start `guard -P livereload`
* Start up `rails server` and load `http://localhost:3000/home`.
* Tickle some CSS in app/scss/_base.css.scss

Note: I've tried some shell scripts to kick off all three of these as separate jobs in one terminal, e.g.:
```
grunt --verbose > /dev/null 2>&1 & guard -P livereload > /dev/null 2>&1 & rails server > /dev/null 2>&1
```
But guard doesn't like being in job mode - it stops listening. So for the time being, you have to live with using three terminal instances.


### Reference Links

Good reference link to help describe the LiveReload and Guard process:
  * http://blog.55minutes.com/2013/01/lightning-fast-sass-reloading-in-rails-32/

Libsass project:
  * https://github.com/hcatlin/libsass

