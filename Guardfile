# More info at https://github.com/guard/guard#readme

guard 'livereload' do
  # Watch for any changes in public/assets that the libsass compiler puts out.
  # Note that Rack::LiveReload will tell the sockets in the browser to reload ONLY the css asset that has been changed,
  # which means the page styling will change but the page content will not refresh - SUPER FAST!
  watch(%r{public/assets/.+\.css})

  # These are other base default watch targets, not needed when combining with libsass.
  # If these are enabled, changes in these files will trigger a FULL page reload.

  # watch(%r{app/views/.+\.(erb|haml|slim)$})
  # watch(%r{app/helpers/.+\.rb})
  # watch(%r{public/.+\.(js|html)})
  # watch(%r{config/locales/.+\.yml})
  # watch(%r{(app|vendor)(/assets/\w+/(.+\.(js|html|png|jpg))).*}) { |m| "/assets/#{m[3]}" }

  # DON'T DO THIS - it watches for changes in the scss files, but the compiling time for Libsass means
  # that Guard will trigger livereload.js to load the final css output in public/assets before the
  # sass has actually been compiled.
  # watch(%r{app/scss/.+\.(scss|)})

end
