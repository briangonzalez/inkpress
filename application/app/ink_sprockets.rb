
#   Does one thing, and one thing only:
#   slurps in our InkApp's settings
#   and sets its `@environment` variable
#   to be used in our rackup file.

class InkSprocketsLoader
  attr_reader :environment

  def initialize(settings)

    @environment = Sprockets::Environment.new

    @environment.append_path File.join(settings.assets_path, 'stylesheets')
    @environment.append_path File.join(settings.assets_path, 'javascripts')
    @environment.append_path File.join(settings.assets_path, 'images')
    @environment.append_path File.join(settings.assets_path, 'fonts')

    # CONFIGURE COMPASS
    #   Compass so it can find images
    Compass.configuration do |compass|
      compass.project_path = settings.assets_path
      compass.images_dir   = 'images'
      compass.output_style = production? ? :compressed : :expanded
    end

    # CONFIGURE SPROCKETS
    #   Sprockets::Helpers
    Sprockets::Helpers.configure do |config|
      config.environment  = @environment
      config.prefix       = settings.assets_prefix
      config.digest       = true                                                # digests are great for cache busting
      config.public_path  = settings.public_folder
      config.manifest     = Sprockets::Manifest.new(
        @environment,
        File.join( settings.root, 'public', 'assets', 'manifest.json' )
      )

      # Clean it up.
      config.manifest.clean

      # Minify our assets in prod, but not in dev.
      if production?
        @environment.js_compressor  = Uglifier.new(mangle: true)
      end

      # Scoop up the images so they can come along for the party.
      images = Dir.glob(File.join(settings.assets_path, 'images', '**', '*')).map do |filepath|
        filepath.split('/').last
      end

      # Scoop up the fonts so they can come along for the party.
      fonts = Dir.glob(File.join(settings.assets_path, 'fonts', '**', '*')).map do |filepath|
        filepath.split('/').last
      end

      # Scoop up the JS so they can come along for the party
      javascripts = Dir.glob(File.join(settings.assets_path, 'javascripts', '*')).map do |filepath|
        filepath.split('/').last
      end

      # Scoop up the fonts so they can come along for the party.
      stylesheets = Dir.glob(File.join(settings.assets_path, 'stylesheets', '*')).map do |filepath|
        filepath.split('/').last
      end

      # Write the digested files out to public/assets (makes it so Nginx 
      # can serve them directly). This is only run on startup.
      config.manifest.compile( stylesheets | javascripts | images | fonts)
    end

  end
end
