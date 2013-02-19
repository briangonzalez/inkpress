require "highline/import"
Rake::TaskManager.record_task_metadata = true

namespace :ink do
  
  desc "Starting Inkpress Server (Thin) in development mode (-e for production)"
  task :start do |task|
    puts "*** " + task.full_comment
    port = ask("Which port? ") { |p| p.default = "6789" }

    production = ENV.has_key?('emulate_production') ? '-e production' : ''
    system("bundle exec thin start -R config.ru -p #{port} #{production}")
  end

  desc "Re-Initialize Inkpress site (WARNING: this may delete files/content)"
  task :clean do |task|
    puts "\n*** " + task.full_comment
    continue = ask("\n** Continue? (Type 'yes' or 'no')") { |p| p.default = "no" }
    puts "\n"

    if continue == 'yes'

      clean_folder = File.join('application', 'clean')
      site_folder   = './site/'

      # First Remove
      # -----------------------
      FileUtils.rm_f('./app.yaml')
      FileUtils.rm_rf( File.join(site_folder, 'assets', 'images'), :verbose => true )

      to_keep       = ['home', 'assets', 'error', 'not_found'].map{|f| "#{site_folder}#{f}"}
      Dir.glob( site_folder + '*').each do |f|
        next if to_keep.include?(f)
        FileUtils.rm_rf(f, :verbose => true)
      end

      # Then Make.
      # -----------------------
      puts "\nCopying clean files..."
      FileUtils.cp_r( File.join(clean_folder, 'app.yaml'),    '.' )
      FileUtils.mkdir( File.join(site_folder, 'deploy') )
      FileUtils.cp_r( File.join(clean_folder, 'deploy.rb.template'),  File.join(site_folder, 'deploy', 'deploy.rb') )
      FileUtils.mkdir( File.join(site_folder, 'about') )
      FileUtils.cp_r( File.join(clean_folder, 'about.haml'),          File.join(site_folder, 'about', 'index.haml') )
      FileUtils.cp_r( File.join(clean_folder, 'images'),              File.join(site_folder, 'assets', 'images') )

      # Setup remote repo.
      # ------------------------------
      puts "\n*** Setting up remote repo"
      repo_url = ask("\n** URL for your remote git repository:")
      `git remote set-url #{repo_url}`
      puts "\n *** Remote repository set to #{repo_url}"

      data  = YAML.load(File.read('./app.yaml'))
      data['repo_url'] = repo_url 
      File.open( './app.yaml', "w") {|f| f.write(data.to_yaml) }

    else
      puts "Quitting..." 
    end

  end

  desc "Export entire Inkpress site."
  task :export do |task|
    puts "\n*** " + task.full_comment
    folder = ask("Folder to export to: ") { |p| p.default = "~/Desktop" }
    `zip -r inkpress_export.zip ./site`
    FileUtils.mv './inkpress_export.zip', File.expand_path(folder), :verbose => true
  end

end

