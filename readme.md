

## install
// no need for guard if using grunt 

packer -S nodejs
packer -S npm
gem list

gem update
gem install jekyll
gem install rdiscount -s http://gemcutter.org
jekyll new myblog
bundle install
bundle update
bundle gem install jekyll --pre
bundle exec guard init
guard init livereload
https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en

## running

bundle exec jekyll serve
bundle exec guard
 
 
## install git

git clone https://github.com/amirsher/amirsher.github.io
git add --all
git config user.email aaa@gmail.com
git config user.name amirsher
git config --global color.ui auto

## updating git

git status
git add -A
git commit -m "fix calculation in results index page"
git push -u origin master 

## install grunt

npm update npm
npm install grunt-cli
npm install grunt --save-dev
npm install grunt-contrib-cssmin --save-dev
npm install grunt-contrib-htmlmin --save-dev
npm install grunt-shell --save-dev
npm install load-grunt-tasks --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-contrib-connect --save-dev
npm install grunt-contrib-ftpush --save-dev
npm install grunt-text-replace --save-dev
// update Gruntfile.js and package.json

## running grunt tasks

grunt //normal jekyell server with live update
grunt ftp //building minifing and uploading to live site
grunt git  //updating git repo