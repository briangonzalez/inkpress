# ===================
# = Request Helpers =
# ===================
module Sinatra
  module RequestHelper

    def underscored_path
      request.path[1..-1].gsub('/', '_').strip
    end

    def classified_path
      p = request.path[1..-1].gsub('/', ' ').strip
      p.empty? ? 'home' : p
    end

    def path_array
      request.path[1..-1].split('/')
    end

    def current?(path)
      path  = path.strip.gsub('/', '')
      u     = underscored_path
      u     = u.empty? ? 'home' : u
      path_array = u.split('_')
      (u == path) || (path_array[0] == path)
    end

  end

  helpers RequestHelper
end