

### install 
// no need for guard if using grunt 

packer -S nodejs

packer -S npm

gem list


gem update

gem install jekyll

gem install rdiscount -s http://gemcutter.org // no need anymore, using kramdown

gem install html-proofer

jekyll new myblog

bundle install // no need all the bundle stuff

bundle update

bundle gem install jekyll --pre

bundle exec guard init

guard init livereload // no need, not using guard

(https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)

### running

bundle exec jekyll serve

bundle exec guard
 
 
### install git

git clone https://github.com/tnuatiming/tnuatiming.github.io

git add --all

git config user.email tnuatiming@gmail.com

git config user.name tnuatiming

git config --global color.ui auto

### updating git

git status

git add -A

git commit -m "fix calculation in results index page"

git push -u origin master 

### install grunt

npm update npm

npm install -g grunt-cli //the -g is to get grunt in the path

npm install grunt

npm install grunt-contrib-cssmin

npm install grunt-contrib-htmlmin

npm install grunt-shell

npm install load-grunt-tasks

npm install grunt-contrib-watch

npm install grunt-contrib-connect

npm install grunt-ftp-push

npm install grunt-text-replace

npm install grunt-contrib-clean

npm install grunt-zip

npm install grunt-zip-directories

// update Gruntfile.js and package.json

## install script (run in the root dir of the project)

instal/update nodejs:
1. Unpack the official pre-built binaries into ~/.node (.e.g https://nodejs.org/dist/v5.5.0/node-v0 … x64.tar.gz would be unpacked in ~/.node/node-v5.5.0-linux-x64
2. Add a symlink called current to your wanted node version (e.g. ln -s ~/.node/node-v5.5.0-linux-x64 ~/.node/current)
3. Add ~/.node/current/bin to your path (e.g echo export PATH=$HOME/.node/current/bin:$PATH >> ~/.bashrc)


sudo npm install -g grunt-cli && npm install grunt grunt-contrib-cssmin grunt-contrib-htmlmin grunt-shell load-grunt-tasks grunt-contrib-watch grunt-contrib-connect grunt-ftp-push grunt-text-replace grunt-contrib-clean grunt-zip grunt-zip-directories --save-dev

using lftp with .netrc to upload to site (no need for all grunt ftp push junk)

.netrc:
machine tnuatiming.com
login xxxxx 
password xxxxxx 


Add this line to your application's Gemfile:

gem 'html-proofer'

And then execute:

$ bundle

Or install it yourself as:

$ gem install html-proofer

### running grunt tasks

grunt //normal jekyell local server with live update

grunt ftp //building, minifing, backuping, proofing and uploading to live site

grunt git  //updating git repo

