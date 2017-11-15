#!/bin/bash
## the script scan all sub folder and convert tables from html files to csv files
    cd _site/results/
    mkdir csv
    echo "<!doctype html><html><head><meta charset="utf-8"></head><body>" >> csv/index.html
    find . -type f -name '*.html' | while read F; do
    file=$(basename "$F")
    if [ "$file" != "index.html" ]; then
        url="<a href=http://tnuatiming.com/results/csv/${file%.*}.csv>${file%.*}.csv</a></br>"
        echo $url >> csv/index.html
    #    dirname "$F" >>directories.txt
    #    cat "$F" >>FullTextOfAllFiles.txt
        cat "$F" 2>/dev/null | grep -i -e '</\?TABLE\|</\?TD\|</\?TR\|</\?TH' | sed 's/^[\ \t]*//g' | tr -d '\n' | sed 's/<\/TR[^>]*>/\n/Ig'  | sed 's/<\/\?\(TABLE\|TR\)[^>]*>//Ig' | sed 's/^<T[DH][^>]*>\|<\/\?T[DH][^>]*>$//Ig' | sed 's/<\/T[DH][^>]*><T[DH][^>]*>/,/Ig' >"csv/${file%.*}.csv"
    fi
done
echo "</body></html>" >> csv/index.html
