require 'sinatra/base'
require 'digest/md5'

module Sinatra
  module InkAdmin

    module Helpers

      def authorized?(username, password)
        app(:authorized_users)[username] == key( username + password )
      end

      def key(string)
        key = Digest::MD5.hexdigest(string)
      end

      def login!(user)
        session['user'] = user 
      end

      def logout!
        session['user'] = nil
      end

      def logged_in?
        !session['user'].nil?
      end

      def user
        session['user']
      end

    end

    def self.registered(app)

      app.post "/ink/admin/login" do
        halt 403 unless authorized?(params['u'], params['p']) 
        login!(params['u'])
        content_type :json
        return { :msg => "Nice, you're in!" }.to_json
      end

      app.post "/ink/admin/logout" do
        session['user'] = nil
        return true
      end

      app.post '/ink/admin/generate-key' do
        content_type :json
        return { :key => key(params['u'] + params['p']) }.to_json
      end

      app.post '/ink/admin/add-user' do
        halt 403 unless logged_in?
        content_type :json
        add_user(params['u'], params['k'])
        return { msg: "User '#{params['u']}' added" }.to_json
      end

      app.get "/ink/admin/settings" do
        halt 403 unless logged_in?
        @raw_page_content = File.read("./app.yaml")
        haml :settings, :layout => false
      end

      app.post "/ink/admin/recompile" do
        halt 403 unless logged_in?
        FileUtils.rm_rf("#{ink_folder}/.", secure: true)
        content_type :json
        return { msg: "Success" }.to_json
      end

      app.post "/ink/admin/save-page" do
        halt 403 unless logged_in?

        @short_page_path = params['path']
        preview   = (params['preview'] == 'true') ? true : false
        main_page = (params['page'] == 'false')   ? true : false

        if preview and main_page
          File.open( index_path(preview) , 'w') {|f| f.write( params['content'] ) }
        elsif main_page
          puts "  ** Saving page: #{main_page}"
          File.open( index_path, 'w') {|f| f.write( params['content'] ) }
          FileUtils.rm_f compiled_page
          FileUtils.rm_f index_path(true)
          FileUtils.rm_f home_page
        else
          puts " ** Editing non index page."
          File.open( params['page'], 'w') {|f| f.write( params['content'] ) }
        end

        return true
      end

      app.post "/ink/admin/delete-page" do 
        halt 403 unless logged_in?

        @short_page_path = params['path'].chomp('/')
        FileUtils.rm_rf(page_path, secure: true)
        FileUtils.rm_rf(compiled_page, secure: true)
        FileUtils.rm_rf("#{ink_folder}/.", secure: true)
      end

      app.post "/ink/admin/unpublished" do 
        halt 403 unless logged_in?

        content_type :json
        return { msg: 'Success', posts: unpublished_posts }.to_json
      end

      app.post "/ink/admin/create-page-or-post" do
        halt 403 unless logged_in?

        type = params['type']; 
        name = friendly_filename(params['name'])
        content_type :json

        if type == 'page'
          halt 409 if File.exists?( new_page_path(name) )
          create_page(name)
          return { url: "/#{name}" }.to_json
        else
          halt 409 if File.exists?( new_post_path(name) )
          create_post(name)
          return { url: "/posts/#{name}" }.to_json
        end 

      end

      app.post "/ink/admin/create-associated-file" do
        halt 403 unless logged_in?

        path      = File.join( settings.site_folder, params['path'] ) 
        name      = params['name'];
        full_path = File.join( path, name ) 

        halt 409 if !File.exists?(path) or File.exists?(full_path)
        FileUtils.touch( full_path )

        content_type :json
        return { msg: 'Success', path: full_path }.to_json
      end

      app.post "/ink/admin/files" do
        halt 403 unless logged_in?

        content_type :json
        return { files: associated_files }.to_json
      end

      app.post "/ink/admin/file-content" do
        halt 403 unless logged_in?

        content_type :json
        return { content: file_content( params['file'] ) }.to_json
      end

      app.post "/ink/admin/upload" do
        halt 403 unless logged_in?

        file_URLs = []

        if params[:files] 
          params[:files].each do |file|
            new_file_name = file[:filename]
            new_file = File.join(settings.uploads_folder, file[:filename])  

            if File.exists?(new_file) 
              new_file_name   = (new_file_name + "-" + random_string + File.extname(new_file))
              new_file        = File.join(settings.uploads_folder, new_file_name)  
            end

            file_URLs << URI.encode("uploads/#{new_file_name}")
            FileUtils.mv(file[:tempfile], new_file)
          end
        end

        content_type :json
        return { file_URLs: file_URLs }.to_json
      end

    end

  end

  register InkAdmin
end