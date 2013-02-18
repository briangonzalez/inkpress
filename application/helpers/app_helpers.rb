# ================
# = App Helpers  =
# ================

APP_VALUES_PATH = "app.yaml"

module Sinatra
  module AppHelper

    #   This method slurps in the settings from app.yaml, and places them in 
    #   Sinatra's constant: `settings`. Then you can access them from anywhere via 
    #
    #     app(:some_constant)
    #
    def app(key)
      data  = YAML.load(File.read(APP_VALUES_PATH))
      data[key.to_s]
    end

    def flagged_as?(flag)
      return false if !@flags
      @flags.include?(flag)
    end

    def add_user(name, key)
      data  = YAML.load(File.read(APP_VALUES_PATH))
      data['authorized_users'][name] = key unless data['authorized_users'][name] 
      File.open( APP_VALUES_PATH, "w") {|f| f.write(data.to_yaml) }
      InkAdmin.reload_app_values
    end

    def self.get_app_values
      app = YAML.load(File.read(APP_VALUES_PATH))
      app
    end

  end

  helpers AppHelper
end