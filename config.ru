#   Bundle & require foo.
require 'bundler' # gem requires
Bundler.require(:default)

#   Core Ruby requires, modules
%w(securerandom timeout cgi date).each do |requirement|
  require requirement
end

#   Rack::Deflater will send along gzipp'd assets so we don't have to configure
#   Nginx or Apache to do so for us
use Rack::Deflater

#   InkApp - this is our modular extension of Sinatra
require './application/app/ink_app'

#   Map our main app. 
map '/' do
  run InkApp
end

#   Map sprockets.
map InkApp.settings.assets_prefix do
  sprockets = InkSprocketsLoader.new(InkApp.settings).environment
  run sprockets
end
