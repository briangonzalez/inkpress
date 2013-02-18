
# Handle various stages
case ENV['DEPLOY']
when 'production'
  puts ' ** Deploy to production  **************************************'
  set :domain, "inkpress.briangonzalez.org"
  set :application, "inkpress.briangonzalez.org"
else
  # Deploy to staging by default.
  puts ' ** Deploying to stage **************************************'
  set :domain, "stage-inkpress.briangonzalez.org"
  set :application, "stage-inkpress.briangonzalez.org"
end

# Be sure to set your remote repo URL in ./app.yaml
data = YAML.load(File.read('./app.yaml'))

set :deploy_to, "/srv/www/#{application}"

role :app, domain, :primary => true
default_run_options[:pty] = true  # Must be set for the password prompt from git to work

# So you didn't see a repo URL?
raise "**** Set a remote repo in ./app.yaml *****" unless data['repo_url']

set :repository,  data['repo_url']
set :deploy_via, :remote_cache
set :branch, fetch(:branch, "master")
set :scm, "git"
set :user, "root"  # the server's user for deploys
ssh_options[:forward_agent] = true

# clean up old releases on each deploy
after "deploy:restart", "deploy:cleanup"

# create our logs
before 'deploy:restart', "deploy:create_logs"

# If you are using Passenger mod_rails uncomment this:
namespace :deploy do
  task :start do ; end
  task :stop do ; end
  
  task :create_logs do
    logs    = File.join(deploy_to, 'logs')
    access  = File.join(deploy_to, 'logs', 'access.log')
    error   = File.join(deploy_to, 'logs', 'error.log')
    run "if [ ! -f #{logs} ]; then #{try_sudo} mkdir #{logs}; fi"
    run "if [ ! -f #{access} ]; then #{try_sudo} touch #{access}; fi"
    run "if [ ! -f #{error} ];  then #{try_sudo} touch #{error}; fi"
  end

  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end