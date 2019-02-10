#!/bin/bash
## the script scan all sub folder and convert tables from html files to csv files
    mkdir csv
    find . -type f -name '*.html' | while read F; do
    file=$(basename "$F")
    echo ${file%.*}
#    dirname "$F" >>directories.txt
#    cat "$F" >>FullTextOfAllFiles.txt
    cat "$F" 2>/dev/null | grep -i -e '</\?TABLE\|</\?TD\|</\?TR\|</\?TH' | sed 's/^[\ \t]*//g' | tr -d '\n' | sed 's/<\/TR[^>]*>/\n/Ig'  | sed 's/<\/\?\(TABLE\|TR\)[^>]*>//Ig' | sed 's/^<T[DH][^>]*>\|<\/\?T[DH][^>]*>$//Ig' | sed 's/<\/T[DH][^>]*><T[DH][^>]*>/,/Ig' >"csv/${file%.*}.csv"
done
    
