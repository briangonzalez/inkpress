# ===================
# = Post Helpers =
# ===================
module Sinatra
  module PostHelper

    def post_titles_and_info
      posts_path  = File.join( settings.site_folder, 'posts' )
      post_dirs   = Dir.glob( File.join( posts_path, '**/') )

      titles_and_info_hash = {}

      post_dirs.each do |post_path|

        next if post_path == posts_path + '/'

        raw = File.read File.join(post_path, "index.haml")
        front_matter = parse_front_matter(raw)[:yaml]
        
        next if front_matter['flags'] and front_matter['flags'].include? 'no-publish'

        date  = front_matter['date'] || "January 1, 0000"
        year  = Date.parse(date).year
        title = front_matter['title'] || false

        titles_and_info_hash[year] ||= []
        titles_and_info_hash[year].push({ :title => title, :date => date, :path => File.basename(post_path) }) 
      
      end

      #   now let's sort out the posts by years
      #   and then dates.
      titles_and_info = []
      titles_and_info_hash.each_pair do |k,v|
        a = titles_and_info_hash[k]
        a.sort_by!{|post| Date.parse(post[:date]) }
        a.reverse!

        titles_and_info.push([k, a])
      end

      titles_and_info.sort_by!{|years| years[0] }
      titles_and_info.reverse!
      titles_and_info
    end

  end

  helpers PostHelper
end