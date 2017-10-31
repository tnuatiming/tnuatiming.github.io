#!/bin/bash
read -e -p "Commit description: " desc
desc=${desc:-# upload from local #}
cd $HOME/tnuatiming.github.io
git add -A && git commit -m "$desc" && git push -u origin master

# upload from local #
