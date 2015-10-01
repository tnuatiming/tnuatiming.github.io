

# install

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

# install npm/node
1. Unpack the official pre-built binaries into ~/.node (.e.g https://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz would be unpacked in ~/.node/node-v0.12.7-linux-x64)
2. Add a symlink called current to your wanted node version (e.g. ln -s ~/.node/node-v0.12.7-linux-x64 ~/.node/current)
3. Add ~/.node/current/bin to your path (e.g echo export PATH=$HOME/.node/current/bin:$PATH >> ~/.bashrc)

npm update -g npm
npm install -g grunt-cli
npm install grunt --save-dev
npm install --save-dev grunt-shell
npm install --save-dev load-grunt-tasks
npm install grunt-contrib-watch --save-dev
npm install grunt-contrib-connect --save-dev
grunt

# running

bundle exec jekyll serve
bundle exec guard
 
 
# install git
git clone https://github.com/amirsher/amirsher.github.io
git add --all
git config user.email aaa@gmail.com
git config user.name amirsher
git config --global color.ui auto

# updating git
git status
git add -A
git commit -m "fix calculation in results index page"
git push -u origin master 
