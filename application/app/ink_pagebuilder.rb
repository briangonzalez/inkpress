require 'fileutils'

module Sinatra
  module InkPageBuilderHelper


    def ink(opts={})
      # Setup our variables.
      layout                  = opts[:layout] || :layout
      @short_page_path        = opts[:path] if opts[:path] 

      # Check if our compiled .html page exists, if so send it along.
      if send_static?
        puts "** Sending static file: #{compiled_page}"
        send_file( compiled_page )

      # If not, let's compile it, then perhaps save it for later.
      else  

        # Create a preview file when editing a page.
        if previewing? && File.exists?( index_path ) && !File.exists?( index_path(true) )
          FileUtils.cp index_path, index_path(true)
        end

        # Return "404 - Not Found" if directory or index.haml doesn't exist
        halt(404) unless ( File.exists?( page_path ) && File.exists?( index_path ) )
        
        parsed  = parse_front_matter( raw_page_content(previewing?) )
        raw     = parsed[:raw]
        data    = parsed[:yaml]

        raw     = sub_included_files(raw)

        hash_to_instance_variables(data)
        layout  = data['layout'] ? data['layout'].to_sym : true
        html    = haml(raw, :layout=> layout, :locals => data)

        if should_compile? 
          puts '  ** Compiling page & creating directories as needed.'
          FileUtils.mkdir_p( compiled_path ) unless File.exists?( compiled_path )
          File.open( compiled_page , 'w') {|f| f.write(html) }
        end
        
        headers['Cache-Control'] = 'nocache, no-store'
        html
      end
    end

    def short_page_path
      path = params['path'] ? params['path'] : request.path_info.chomp('/') 
      @short_page_path ||= path.chomp('/') 
    end

    def raw_page_content(preview=false)
      return @raw_page_content if @raw_page_content
      
      if preview and !File.exists?(index_path(true)) 
        FileUtils.copy_file index_path, index_path(true)
      end 
      @raw_page_content ||= File.read( index_path(preview) )
    end

    def page_path
      @page_path ||= File.join(settings.site_folder, short_page_path)
    end

    def home_page
      @home_page ||= File.join ink_folder, "home.html"
    end

    def compiled_page
      @compiled_page ||= File.join ink_folder, "#{short_page_path}.html"
    end

    def compiled_path
      @compiled_path ||= File.dirname( compiled_page )
    end

    def index_path(preview=false)
      preview ? File.join(page_path, "index_preview.haml") : File.join(page_path, "index.haml")
    end

    def parse_front_matter(raw)
      # Does our file have front matter?
      # If so, parse it.
      if raw =~ /^(---\s*\n.*?\n?)^(---\s*$\n?)/m
        data = YAML.load($1)
        raw.slice!($1)
        { :raw => raw, :yaml => data }

      # If not, send along some blank data.
      else
        { :raw => raw, :yaml => {} }
      end
    end

    #   Substitute file included in a page using the syntax:
    #     { file: some-file.js }
    #   which will look in the folder of the page currently being built for the 
    #   file. If the file is not found, it will be replaced with an empty 
    #   string.
    def sub_included_files(raw)
      raw_new = ""
      raw_new << raw

      raw.scan(/^.*\{file\:.*\}/) do |match|
        file = match.to_s
                .match(/:\s*[A-Za-z0-9_\-\.]*/)
                .to_s
                .gsub!(':', '')
                .strip()

        to_include  = File.join( page_path, file)
        contents    = File.exists?(to_include) ? File.read(to_include) : ''

        spaces = match.to_s
                      .match(/^\s*{/)
                      .to_s
                      .length - 1

        contents.gsub!(/^/, " " * spaces)
        raw_new.gsub!(match.to_s, contents)
      end

      return raw_new
    end

    #   Turns a hash of data into instance variables of the page, which allows
    #   us to use the @ syntax within our templates.
    def hash_to_instance_variables(data)
      # digest all of the hash into instance var's
      data.each do |k,v|
        instance_variable_set("@#{k}",v)
        eigenclass = class<<self; self; end
        eigenclass.class_eval do
          attr_accessor k
        end 
      end
    end

    def send_static?
      return false  if !File.exists?(compiled_page)
      return true   if params.has_key?('send-static')

      production? and !logged_in?
    end

    def compiled_page_exists?
      File.exists?(compiled_page)
    end

    def should_compile?
      (!compiled_page_exists? and !logged_in?) or params.has_key?('force-compile')
    end

    def previewing?
      logged_in? and params.has_key? 'preview'
    end

    def editing?
      params.has_key? 'edit'
    end

    def associated_files
      files = Dir.glob( "#{page_path}/*" )
      files = files.map do |file|
        next if File.basename(file) == 'index.haml'
        [File.basename(file), file]
      end
      files.reject! { |f| f.nil? }
      files
    end

    def file_content(path)
      File.read(path)
    end

    def new_page_path(name)
      File.join(settings.site_folder, name)
    end

    def new_post_path(name)
      File.join(settings.site_folder, 'posts', name)
    end

    def create_page(name)
      FileUtils.mkdir_p( new_page_path(name) )
      mock_path = File.join settings.clean_folder, 'page.txt' 
      mock_text = File.read(mock_path)
      FileUtils.cp( mock_path, File.join(new_page_path(name),'index.haml') )   
    end

    def create_post(name)
      FileUtils.mkdir_p( new_post_path(name) )
      mock_path = File.join settings.clean_folder, 'post.txt' 
      mock_text = File.read(mock_path)
      mock_text.gsub!( '<date>', Time.now.strftime('%B %d, %Y') )
      mock_text.gsub!( '<author>', user )
      File.open( File.join(new_post_path(name),'index.haml'), 'w') do |file| 
        file.write( mock_text )
      end
    end

    def friendly_filename(filename)
      filename.strip
              .gsub(/[^\w\s_-]+/, '')
              .gsub(/(^|\b\s)\s+($|\s?\b)/, '\\1\\2')
              .gsub(/\s+/, '-')
    end

  end

  helpers InkPageBuilderHelper
end