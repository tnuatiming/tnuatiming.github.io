

### install 
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

(https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)

### running

bundle exec jekyll serve

bundle exec guard
 
 
### install git

git clone https://github.com/amirsher/amirsher.github.io

git add --all

git config user.email aaa@gmail.com

git config user.name amirsher

git config --global color.ui auto

### updating git

git status

git add -A

git commit -m "fix calculation in results index page"

git push -u origin master 

### install grunt

npm update npm

npm install -g grunt-cli //the -g is to get grunt in the path

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

## install script (run in the root dir of the project)

instal/update nodejs:
1. Unpack the official pre-built binaries into ~/.node (.e.g https://nodejs.org/dist/v5.5.0/node-v0 … x64.tar.gz would be unpacked in ~/.node/node-v5.5.0-linux-x64
2. Add a symlink called current to your wanted node version (e.g. ln -s ~/.node/node-v5.5.0-linux-x64 ~/.node/current)
3. Add ~/.node/current/bin to your path (e.g echo export PATH=$HOME/.node/current/bin:$PATH >> ~/.bashrc)


npm update npm && npm install -g grunt-cli && npm install grunt --save-dev && npm install grunt-contrib-cssmin --save-dev &&  npm install grunt-contrib-htmlmin --save-dev && npm install grunt-shell --save-dev && npm install load-grunt-tasks --save-dev && npm install grunt-contrib-watch --save-dev && npm install grunt-contrib-connect --save-dev && npm install grunt-contrib-ftpush --save-dev && npm install grunt-text-replace --save-dev

Add this line to your application's Gemfile:

gem 'html-proofer'
And then execute:

$ bundle
Or install it yourself as:

$ gem install html-proofer

### running grunt tasks

grunt //normal jekyell server with live update

grunt ftp //building minifing and uploading to live site

grunt git  //updating git repo

