# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'livereload' do
  # watch for any changes in public/assets that the libsass compiler puts out
  watch(%r{public/assets/.+\.css})

  # DON'T DO THIS - it watches for changes in the scss files, but the compiling time for Libsass means
  # that Guard will trigger livereload.js to load the final css output in public/assets before the
  # sass has actually been compiled.
  # watch(%r{app/scss/.+\.(scss|)})

  # other base default watch targets, not needed when combining with libsass.
  # for any of these changes, just refresh the browser

  # watch(%r{app/views/.+\.(erb|haml|slim)$})
  # watch(%r{app/helpers/.+\.rb})
  # watch(%r{public/.+\.(css|js|html)})
  # watch(%r{config/locales/.+\.yml})
  # Rails Assets Pipeline
  # watch(%r{(app|vendor)(/assets/\w+/(.+\.(css|js|html|png|jpg))).*}) { |m| "/assets/#{m[3]}" }
end
