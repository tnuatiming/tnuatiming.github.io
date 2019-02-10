

### install 
// no need for guard if using grunt 

packer -S nodejs

packer -S npm

gem list


gem update

gem install html-proofer

 
 
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

minify js:
npm install google-closure-compiler
gem install closure-compiler --no-document ???

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

### on raspberry pi

sudo apt-get update
sudo apt-get install software-properties-common
sudo apt-get install ruby-full
sudo apt-get install nodejs npm
sudo npm install -g grunt-cli
npm install grunt
sudo gem install jekyll

sudo pip3 install beautifulsoup4 (for python csv convert)

and add: , encoding='utf-8' to file options in convert_html_to_csv.py
and: # -*- coding: utf-8 -*- at the top

change to python3 in Gruntfile.js:
command: 'python3 convert_html_to_csv.py'

install all packges as above

### hugo

yay -S hugo 



