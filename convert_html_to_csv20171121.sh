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

    ## creating event name header, very bad performance...
        grep -m 1 -F tag "$F" | sed "s/^tag: \"//" | tr -d "\"\n\r" > "csv/${file%.*}.csv"
        grep -m 1 -F type "$F" | sed "s/^type: \"//" | tr -d "\"\n\r" | sed 's/^/ - /' >> "csv/${file%.*}.csv"
        printf '\n' >> "csv/${file%.*}.csv" ## add new line
        if ! grep -m 1 -q "round: \"\"" "$F"; then
            ## get the line that contain "round" | delete 'round: "' | delete " and end of line return | add 1 space in the end >> APPEND to file
            grep -m 1 -F round "$F" | sed "s/^round: \"//" | tr -d "\"\n\r" | sed 's/$/ /' >> "csv/${file%.*}.csv"
        fi
        if ! grep -m 1 -q "noseason: \"true\"" "$F"; then
            echo "עונת " | tr -d '\n\r' >> "csv/${file%.*}.csv"
            grep -m 1 -F season "$F" | grep -v "noseason" | sed "s/^season: \"//" | tr -d "\"\n\r" >> "csv/${file%.*}.csv"
            echo " - " | tr -d '\n\r' >> "csv/${file%.*}.csv"
        fi
        grep -m 1 -F place "$F" | sed "s/^place: \"//" | tr -d "\"\n\r" >> "csv/${file%.*}.csv"
        echo " - " | tr -d '\n\r' >> "csv/${file%.*}.csv"
        ## add the date in the correct format
        echo $file1 | awk -v FS=- -v OFS=- '{print $3,$2,$1}' >> "csv/${file%.*}.csv"
            
    #    echo "${file1//.md/}" > "csv/${file%.*}.csv"
        cat "$F" 2>/dev/null | grep -i -e '</\?TABLE\|</\?TD\|</\?TR\|</\?TH' | sed 's/^[\ \t]*//g' | tr -d '\n' | sed 's/<\/TR[^>]*>/\n/Ig'  | sed 's/<\/\?\(TABLE\|TR\)[^>]*>//Ig' | sed 's/^<T[DH][^>]*>\|<\/\?T[DH][^>]*>$//Ig' | sed 's/<\/T[DH][^>]*><T[DH][^>]*>/,/Ig' >> "csv/${file%.*}.csv"
    fi
done
sort -b -f --version-sort csv/tmp.html > csv/index.html
## add to end
echo "</ol></body></html>" >> csv/index.html
## add to start
sed -i '1i<!doctype html><html><head><meta charset="utf-8"><style>a{margin-left:20px;text-decoration:none;}a:hover{color:lightgray;}ol{margin-left:40px;font-size:1.5em;}</style></head><body><ol>' csv/index.html
rm csv/tmp.html
