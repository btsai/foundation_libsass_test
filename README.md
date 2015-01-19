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
* In [config/application.rb](config/application.rb)

  ```
  config.assets.precompile += Dir.glob('app/scss/*.{css,css.erb,scss}').map{ |path|
    path.gsub('app/scss/', '').gsub('.erb', '')
  }
  ```
See the block under 'ASSET PIPELINE PRECOMPILING' in this project's [config/application.rb](config/application.rb).

* In [config/production.rb](config/production.rb) (and testing.rb, stable.rb if you are not compiling assets on the fly)
  ```
  config.assets.paths << 'app/scss/'
  ```

#### Configuring application.css.scss

Normally with the Rails pipeline, if you have the following manifest set up at the top of your application.css.scss file, Rails/Sprockets will deliver each file individually, and then compile it together in one file when precompiling.
```
/*
# This is a manifest file that'll be compiled into application.css by Sprockets/Rails pipeline, which will include all the files listed below.
#
# Any CSS and SCSS file within this directory, lib/assets/stylesheets, vendor/assets/stylesheets,
# or vendor/assets/stylesheets of plugins, if any, can be referenced here using a relative path.
#
# You're free to add application-wide styles to this file and they'll appear at the top of the
# compiled file, but it's generally better to create a new file per style scope.
#
# USAGE NOTES:
# if an individual sass file uses variables defined in another file, you have to @import it.
# having everything imported in this file doesn't automatically instantiate the variables in the individual file
# when precompiling assets.
#
# IMPORTANT NOTE: requires don't work with libsass - this is a Rails/Sprockets thing.
*= require_self
*= require foundation
*= require_directory ./precompiles/application
*= require_tree  // turning this off - don't need to include everything
*/

```
Serving each file individually has the benefit of allowing you to see which file the CSS code actually lives in.

However, Libsass does not do this as it is just a straight compiler, so all of the requires are ignored, and you must use @import to get the other files to compile into application.css.
```
@import 'foundation';
@import "precompiles/application/scss/custom_mixins";
@import 'precompiles/application/scss/base';
@import 'precompiles/application/scss/pc_base';
@import 'precompiles/application/scss/mobile_base';
@import 'precompiles/application/scss/fonts';
```

Lastly, if you @import a straight CSS file, this will only insert a standard CSS @import tag into the application.css file, which means that imported CSS file must also be present for download in the assets file, which defeats the purpose of consolidating files.

You will need to change the extension of the target CSS file to .scss so that it will actually get compiled into application.css, not just as an @import tag.


### Running Libsass and LiveReload

#### Package Requirements

You'll need to have the following items installed before continuing.

* [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
* [Grunt](http://gruntjs.com/): Run `sudo npm install -g grunt-cli`
* [Bower](http://bower.io): Run `sudo npm install -g bower`


#### Running Lib-Sass and Grunt to Compile Sass

Add these files (all relative to the project root):
* [package.json](package.json)

  This defines for Node/NPM what node_modules are required.
  Any new grunt functions you add to the project have to be also added here, not just referenced in Gruntfile.js.
  We have adjusted .gitignore not to include the /node_modules folder, since you will be able to generate this when you run `npm install`

* [Gruntfile.js](Gruntfile.js)

  This is the definition file for the Grunt tasks. When you run `grunt`, it will read this file.
  Note that if your Sass file names are like application.scss (not .css.scss), you will need to change the replace method in line 14.

Download and install the node_modules defined in package.json:
  ```
  npm install
  ```

Install grunt:
  ```
  npm install grunt
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

#### Automatically Reload CSS Assets with Guard Live Reload

Additional gems (note that this is needed only for development):
* Add this to your [Gemfile](Gemfile):

  ```ruby
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
* [Guardfile](Guardfile)

This file defines what files to watch. Depending on the type of file, either just that asset will be reloaded, or the entire page will be refreshed.

Add a reference to Rack::LiveReload, again only for development.
* In [config/development.rb](config/development.rb), add:
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

At the very top of your pages, livereload should be inserting the following (just after the <head> tag).
```
<script type="text/javascript">
    WEB_SOCKET_SWF_LOCATION = "/__rack/WebSocketMain.swf";

  </script>
  <script type="text/javascript" src="/__rack/swfobject.js"></script>
  <script type="text/javascript" src="/__rack/web_socket.js"></script>

<% # this should be automatically injected by the LiveReload middleware but it's not working so manually putting here %>
<script type="text/javascript">
  RACK_LIVERELOAD_PORT = 35729;
</script>
<script type="text/javascript" src="http://localhost:35729/livereload.js?"></script>

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

Projects:
* [Libsass](https://github.com/hcatlin/libsass)
* [Node.js](http://nodejs.org)
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)

