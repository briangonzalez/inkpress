# Further requires (models, helpers, core extensions etc. 
# but not 'middleware' because that should be grabbed up by Rack when appropriate
# Note, our main app file (this file), is required in config.ru
Dir.glob('./application/**/*.rb') do |file|
  require file
end

#   InkApp Class
#   This is the bread & butter of our "modular"
#   style Sinatra app.
#   --------------------------------------------
class InkApp < Sinatra::Base

  enable :sessions

  #   Our main Ink Sinatra extensions and helpers.
  helpers   Sinatra::InkPageBuilderHelper
  helpers   Sinatra::InkShortURL::Helpers
  register  Sinatra::InkShortURL
  helpers   Sinatra::InkAdmin::Helpers
  register  Sinatra::InkAdmin
  helpers   Sinatra::InkSync::Helpers
  register  Sinatra::InkSync

  #   Other extensions and helpers.
  helpers Sinatra::AppHelper
  helpers Sinatra::MiscHelper
  helpers Sinatra::PostHelper
  helpers Sinatra::RequestHelper
  helpers Sprockets::Helpers

  #   Configuration.
  set :run,               false
  set :show_exceptions,   development?
  set :raise_errors,      development?
  set :root,              './'
  set :public_folder,     './public'
  set :uploads_folder,    './public/uploads'
  set :views,             './application/views'
  set :clean_folder,      './application/clean'
  set :short_url_folder,  './site/short'
  set :site_folder,       './site'
  set :logging,           true
  set :static,            true                  # best case scenario: nginx/apache's job
  set :haml,              :format => :html5

  #   Sprockets setup.
  set :sprockets_root,  File.join( settings.root, 'application' )
  set :assets_prefix,   '/assets'
  set :assets_path,     File.join(settings.sprockets_root, settings.assets_prefix)

  # Tilt Bug.
  Encoding.default_internal = nil

  # Routes.
  before do
    # opt into the future
    response['X-UA-Compatible'] = "IE=edge,chrome=1"
  end

  get '/' do
    ink(:path => '/home')
  end 

  get '/home' do
    redirect "/"
  end

  get '/*' do
    if params.has_key?('edit') and logged_in?
      haml :edit, :layout => false
    else
      ink
    end
  end

  not_found do
    short_url?
    ink(:path => '/not_found')
  end

  error do 
    ink(:path => '/error')
  end

end