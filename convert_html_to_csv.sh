#!/bin/bash
## the script scan all sub folder and convert tables from html files to csv files
## https://stackoverflow.com/questions/1403087/how-can-i-convert-an-html-table-to-csv
rm csv/*
#cd ~/tnuatiming.github.io/_posts/
find _posts/ -type f -name '*.md' | while read F; do
#find . -type f -name '*.md' | while read F; do
#find -name '*.html' -type f -printf '%h\0%d\0%p\n' | sort -t '\0' -n | awk -F '\0' '{print $3}' | while read F; do
    file1=$(basename "$F") ##cut the file name from the path
    file="${file1//-/_}" ##replace - with _
    if [ "$file" != "index.html" ]; then ##pass on index.html
        url="<li><a href=http://tnuatiming.com/csv/${file%.*}.csv>${file1%.*}</a></li>"
        echo $url >> csv/tmp.html
    #    dirname "$F" >>directories.txt
    #    cat "$F" >>FullTextOfAllFiles.txt
        cat "$F" 2>/dev/null | grep -i -e '</\?TABLE\|</\?TD\|</\?TR\|</\?TH' | sed 's/^[\ \t]*//g' | tr -d '\n' | sed 's/<\/TR[^>]*>/\n/Ig'  | sed 's/<\/\?\(TABLE\|TR\)[^>]*>//Ig' | sed 's/^<T[DH][^>]*>\|<\/\?T[DH][^>]*>$//Ig' | sed 's/<\/T[DH][^>]*><T[DH][^>]*>/,/Ig' >"csv/${file%.*}.csv"
    fi
done
sort -b -f --version-sort csv/tmp.html > csv/index.html
## add to end
echo "</ol></body></html>" >> csv/index.html
## add to start
sed -i '1i<!doctype html><html><head><meta charset="utf-8"><style>a{margin-left:20px;text-decoration:none;}a:hover{color:lightgray;}ol{margin-left:40px;font-size:1.5em;}</style></head><body><ol>' csv/index.html
rm csv/tmp.html
