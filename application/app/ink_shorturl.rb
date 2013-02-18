require 'sinatra/base'

module Sinatra
  module InkShortURL

    module Helpers

      # If the request is for a short URL, then
      # we'll send along the short URL file.
      def short_url?
        path = request.path_info.chomp('/')
        short = File.join settings.short_url_folder, "#{path}.html"

        if File.exists? short
          puts "** Sending along short URL"
          send_file(short)
        end 
      end

      def base_url
        @base_url ||= "#{request.env['rack.url_scheme']}://#{request.env['HTTP_HOST']}"
      end

      def random_string(length=5)
        chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ23456789'
        str = ''
        length.times { |i| str << chars[rand(chars.length)] }
        str
      end

    end

    def self.registered(app)

      #   Create a short url
      #   usage: /short?url=espn.com
      app.post "/ink/short" do
        halt 403 unless logged_in? 
        halt 404 unless params[:url]

        short_url = params[:url][0..3] != 'http'  ? 'http://' + params[:url] : params[:url] 
        
        # Get path to your "short" URL page
        random = random_string
        FileUtils.mkdir_p(settings.short_url_folder) unless File.exists?(settings.short_url_folder)
        short = File.join settings.short_url_folder, "#{random}.html"

        # Build out the short url page,
        # a plain-jane html page with a JS redirect 
        # to our short url-ified page. 
        html  = haml(short_url, :layout => :short)
        File.open(short, 'w') {|f| f.write(html) }
        
        content_type :json
        { :short_url => "#{base_url}/#{random}" }.to_json
      end

    end

  end

  register InkShortURL
end