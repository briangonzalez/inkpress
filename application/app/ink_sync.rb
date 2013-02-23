require 'sinatra/base'

module Sinatra
  module InkSync

    module Helpers

      def git_status
        git_root { return `git status` } 
      end

      def git_pull
        git_root { return `git pull` }
      end

      def git_sync
        branch = production? ? 'deploy' : 'master'
        cmds = [
                "git add .",
                "git commit -am 'Saved Inkpress site @ #{Time.now.to_datetime.strftime "%a, %d %b %Y, %l:%M%P"}'",
                "git pull",
                "git push"
               ] 

        git_root { return `#{cmds.join('; ')}` } 
      end

      def git_root(&blk)
        Dir.chdir(settings.root) do
          blk.call
        end
      end

    end

    def self.registered(app)

      app.get '/ink/sync/status' do
        halt 403 unless logged_in? 
        content_type :json
        output = git_status.gsub(/\n/, '<br>')
        return { :output => output }.to_json
      end

      app.post '/ink/sync/save' do
        halt 403 unless logged_in? 
        content_type :json
        output = git_sync.gsub(/\n/, '<br>')
        return { :output => output }.to_json
      end

      app.post '/ink/sync/pull' do
        halt 403 unless logged_in? 
        content_type :json
        output = git_pull.gsub(/\n/, '<br>')
        return { :output => output }.to_json
      end

    end

  end

  register InkSync
end