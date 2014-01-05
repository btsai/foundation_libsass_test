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

    # Enable the asset pipeline
    config.assets.enabled = true

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
    # all non js,css files + application.js|css.
    # note that anything that compiles to js, css is counted as such (eg .coffee, .scss)
    # [
    #   Proc.new { |path, fn| fn =~ /app\/assets/ && !%w(.js .css).include?(File.extname(path)) },
    #   /application.(css|js)$/
    # ]

    # to get individually called js and css files copied over from the app/assets dir to public/assets on precompile,
    # you need to add their paths here.
    # this config requiires the file path, not the erb or scss file names
    # 1. main app/assets folder.
    #    note we don't push out everything in the assets folder, but actually one down.
    #    put all desired js/css files for individual precompiling in the app/assets/for_release folders.
    #    note that the tag helper paths are rooted at app/assets/for_release,
    #    so you'll need to add the javascripts/ and stylesheets/ folder prefixes to the paths.

    # JAVASCRIPT FILES
    # app/assets/javascripts root level - include all files.
    # note that all files that should be included in application.js and don't need individual precompiling
    # should go in app/assets/javascripts/precompiles.
    config.assets.precompile += Dir.glob('app/assets/javascripts/*.{js,js.erb}').map{ |path|
      path.gsub('app/assets/javascripts/', '').gsub('.erb', '')
    }

    # STYLESHEET FILES
    # app/assets/stylesheets root level - include all files.
    # note that all files that should be included in application.js and don't need individual precompiling
    # should go in app/assets/stylesheets/precompiles.
    config.assets.precompile += Dir.glob('app/assets/stylesheets/*.{css,css.erb}').map{ |path|
      path.gsub('app/assets/stylesheets/', '').gsub('.erb', '')
    }

    # VENDOR ASSETS
    # will precompile all assets in the vendor folder
    config.assets.precompile += Dir.glob('vendor/assets/**/*.{js,js.erb,css,css.erb}').map{ |path|
      path.gsub(/vendor\/assets\/.+?\//, '').gsub('.erb', '')
    }

  end
end
