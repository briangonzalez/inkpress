# ================
# = App Helpers  =
# ================
module Sinatra
  module MiscHelper

    def titleize?
      via_path = (path_array.length >= 2) \
                      and (path_array.include?('posts') or path_array.include?('lab'))
      flagged  = flagged_as?('titleize') 

      flagged or via_path
    end

    def editing_settings?
      request.path_info == "/ink/admin/settings"
    end

    def ink_folder
      File.join( settings.public_folder, 'ink_static')
    end

    def google_fonts_url
      f = app(:google_fonts_families).join('|')
      "//fonts.googleapis.com/css?family=#{f}"
    end

  end

  helpers MiscHelper
end