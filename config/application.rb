require File.expand_path('../boot', __FILE__)

require 'rails/all'

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require(*Rails.groups(:assets => %w(development test)))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

module FoundationLibsassTest
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    #**************************************************************
    # RAILS BASIC STUFF
    #**************************************************************

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    #**************************************************************
    # SECURITY
    #**************************************************************

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable escaping HTML in JSON.
    config.active_support.escape_html_entities_in_json = true

    # Use SQL instead of Active Record's schema dumper when creating the database.
    # This is necessary if your schema can't be completely dumped by the schema dumper,
    # like if you have constraints or database-specific column types
    # config.active_record.schema_format = :sql

    # Enforce whitelist mode for mass assignment.
    # This will create an empty whitelist of attributes available for mass-assignment for all models
    # in your app. As such, your models will need to explicitly whitelist or blacklist accessible
    # parameters by using an attr_accessible or attr_protected declaration.
    config.active_record.whitelist_attributes = true

    #**************************************************************
    # ASSET PIPELINE
    #**************************************************************

    # Enable the asset pipeline
    config.assets.enabled = true

    # Add any new asset paths here (for sprockets and relative path lookup in manifest files)
    # DON'T put this in 'development' mode, as it will force Sprockets and the Rails asset pipeline to also try to
    # compile on page load, which is slow and defeats the purpose of doing it with Libsass and Grunt.
    # We'll put this instead in the stable/testing/production configs so that precompiling will work properly.
    # config.assets.paths << 'app/scss/'

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    #**************************************************************
    # ASSET PIPELINE PRECOMPILING
    #**************************************************************

    # if assets are enabled, they will be precompiled in production.
    # everything that is in 'config.assets.precompile' will be precompiled by the rake assets:precompile task.

    # Make sure that we don't try to launch the app during precompile. This is sometimes needed if you have
    # model references in the js or css erb files (bad practice!!).
    # In any case, HEROKU REQUIRES THIS TO BE FALSE.
    config.assets.initialize_on_precompile = false

    # default precompiler matcher is this:
    # [
    #   Proc.new { |path, fn| fn =~ /app\/assets/ && !%w(.js .css).include?(File.extname(path)) },
    #   /application.(css|js)$/
    # ]
    # this gets all non js,css files + application.js|css.
    # note that anything that compiles to js, css is counted as a js or css (eg .coffee, .scss)

    # JAVASCRIPT ASSETS
    # app/assets/javascripts root level - include all files at the top level.
    # Setting this means we don't have to manually add to the precompile path.
    # Note that all files that should be included in application.js and don't need individual precompiling
    # should go in app/assets/javascripts/precompiles.
    config.assets.precompile += Dir.glob('app/assets/javascripts/*.{js,js.erb}').map{ |path|
      path.gsub('app/assets/javascripts/', '').gsub('.erb', '')
    }

    # STYLESHEET ASSETS
    # app/scss root level - include all files at the top level.
    # Note that all files that should be included in application.css and don't need individual precompiling
    # should go in app/scss/precompiles.
    # Setting this means we don't have to manually add to the precompile path.
    # any straight css or scss files that need individual packaging should go at the base folder level of app/scss.
    # NOTE: we are moving all of the stylesheet assets OUT of app/assets, as Sprocket and the Rails asset pipeline
    # try to compile these when we refresh the page - which results in very slow response (Sass compile speed is poor with Rails).
    # We are depending on Libsass & Grunt to do the on-the-fly compiling for us, putting the compiled assets into
    # public/assets directly.
    config.assets.precompile += Dir.glob('app/scss/*.{css,css.erb,scss}').map{ |path|
      path.gsub('app/scss/', '').gsub('.erb', '')
    }

    # VENDOR ASSETS
    # Will precompile all assets in the vendor folder
    # Setting this means we don't have to manually add to the precompile path.
    config.assets.precompile += Dir.glob('vendor/assets/**/*.{js,js.erb,css,css.erb}').map{ |path|
      path.gsub(/vendor\/assets\/.+?\//, '').gsub('.erb', '')
    }

  end
end
