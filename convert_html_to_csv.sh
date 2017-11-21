#!/bin/bash
## the script scan all sub folder and convert tables from html files to csv files
## https://stackoverflow.com/questions/1403087/how-can-i-convert-an-html-table-to-csv
rm csv/*
#cd ~/tnuatiming.github.io/_posts/
find _posts/ -type f -name '*.md' | while read F; do
#find . -type f -name '*.md' | while read F; do
#find -name '*.html' -type f -printf '%h\0%d\0%p\n' | sort -t '\0' -n | awk -F '\0' '{print $3}' | while read F; do
    file1=$(basename "$F" | sed -e "s/.md$//") ##cut the file name from the path
    file="${file1//-/_}" ##replace - with _
    #file2=$(echo $file | awk -v FS=_ '{print $4,$3,$2,$1}' | sed 's/ /-/g')
    date=$(echo $file1 | awk -v FS=- -v OFS=- '{print $3,$2,$1}')
    tag=""
    type=""
    round=""
    season=""
    noseason=""
    place=""

## creating event name header variables
    ## using grep
    tag=$(grep -m 1 -F tag "$F" | sed -e "s/^tag: \"//" -e "s/\"$//" | tr -d "\n\r")
    type=$(grep -m 1 -F type "$F" | sed -e "s/^type: \"//" -e "s/\"$//" | tr -d "\n\r")
    round=$(grep -m 1 -F round "$F" | sed -e "s/^round: \"//" -e "s/\"$//" | tr -d "\n\r")
    season=$(grep -m 1 -F season "$F" | grep -v "noseason" | sed -e "s/^season: \"//" -e "s/\"$//" | tr -d "\n\r")
    noseason=$(grep -m 1 -F noseason "$F" | sed -e "s/^noseason: \"//" -e "s/\"$//" | tr -d "\n\r")
    place=$(grep -m 1 -F place "$F" | sed -e "s/^place: \"//" -e "s/\"$//" | tr -d "\n\r")
    
    file2=$tag' - '$round' עונת '$season' - '$place' - '$date

    ## using sed
    #tag=$(sed -n '/tag/ {p;q}' < "$F" | sed -e "s/^tag: \"//" -e "s/\"$//" | tr -d "\n\r")
    #type=$(sed -n '/type/ {p;q}' < "$F" | sed -e "s/^type: \"//" -e "s/\"$//" | tr -d "\n\r")
    #round=$(sed -n '/round/ {p;q}' < "$F" | sed -e "s/^round: \"//" -e "s/\"$//" | tr -d "\n\r")
    #season=$(sed -n '/season/ {p;q}' < "$F" | grep -v "noseason" | sed -e "s/^season: \"//" -e "s/\"$//" | tr -d "\n\r")
    #noseason=$(sed -n '/noseason/ {p;q}' < "$F" | sed -e "s/^noseason: \"//" -e "s/\"$//" | tr -d "\n\r")
    #place=$(sed -n '/place/ {p;q}' < "$F" | sed -e "s/^place: \"//" -e "s/\"$//" | tr -d "\n\r")
    
## build the header
    echo $tag | tr -d "\n\r" > "csv/${file}.csv"
    if [ ! -z "$type" ]; then
        echo $type | sed 's/^/ - /' | tr -d "\n\r"  >> "csv/${file}.csv"
    fi
    echo "" >> "csv/${file}.csv"
    if [ ! -z "$round" ]; then
        echo $round | sed 's/$/ /' | tr -d "\n\r"  >> "csv/${file}.csv"
    fi
    if ! [[ $noseason == "true" ]]; then
        if [ ! -z "$season" ]; then
            echo "עונת " | tr -d '\n\r' >> "csv/${file}.csv"
            echo $season | tr -d "\n\r"  >> "csv/${file}.csv"
        fi
    fi
    if [ ! -z "$round" ] || [ ! -z "$season" ] ; then
        if ! [[ $noseason == "true" ]]; then
            echo " - " | tr -d '\n\r' >> "csv/${file}.csv"
        fi
    fi
    echo $place | tr -d "\n\r"  >> "csv/${file}.csv"
    echo " - " | tr -d '\n\r' >> "csv/${file}.csv"
    ## add the date in the correct format
    echo $date >> "csv/${file}.csv"
    
    if [ "$file" != "index.html" ]; then ##pass on index.html
        url="<li><a href=http://tnuatiming.com/csv/$file.csv>$file2</a></li>"
        echo $url >> csv/tmp.html
    #    dirname "$F" >>directories.txt
    #    cat "$F" >>FullTextOfAllFiles.txt

            #    echo "${file1//.md/}" > "csv/${file}.csv"
        cat "$F" 2>/dev/null | grep -i -e '</\?TABLE\|</\?TD\|</\?TR\|</\?TH' | sed 's/^[\ \t]*//g' | tr -d '\n' | sed 's/<\/TR[^>]*>/\n/Ig'  | sed 's/<\/\?\(TABLE\|TR\)[^>]*>//Ig' | sed 's/^<T[DH][^>]*>\|<\/\?T[DH][^>]*>$//Ig' | sed 's/<\/T[DH][^>]*><T[DH][^>]*>/,/Ig' >> "csv/${file}.csv"
    fi
done
sort -b -f --version-sort csv/tmp.html > csv/index.html
## add to end
echo "</ol></body></html>" >> csv/index.html
## add to start
sed -i '1i<!doctype html><html lang="he" xml:lang="he" dir="rtl"><head><meta charset="utf-8"><style>a{margin-right:20px;text-decoration:none;}a:hover{color:lightgray;}ol{margin-right:40px;font-size:1.5em;}</style></head><body><ol>' csv/index.html
rm csv/tmp.html
