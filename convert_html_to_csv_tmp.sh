#!/bin/bash
## the script scan all sub folder and convert tables from html files to csv files
## https://stackoverflow.com/questions/1403087/how-can-i-convert-an-html-table-to-csv
rm csv/*
#cd ~/tnuatiming.github.io/_posts/
find _posts/ -type f -name '*.md' | while read F; do
#find . -type f -name '*.md' | while read F; do
#find -name '*.html' -type f -printf '%h\0%d\0%p\n' | sort -t '\0' -n | awk -F '\0' '{print $3}' | while read F; do

    R=$F
    file1=$(basename "$F") ##cut the file name from the path
    file="${file1//-/_}" ##replace - with _
    tag=""
    type=""
    round=""
    season=""
    noseason=""
    place=""

    if [ "$file" != "index.html" ]; then ##pass on index.html
        url="<li><a href=http://tnuatiming.com/csv/${file%.*}.csv>${file1%.*}</a></li>"
        echo $url >> csv/tmp.html
    #    dirname "$F" >>directories.txt
    #    cat "$F" >>FullTextOfAllFiles.txt

    ## get header info into variables
        while read -r line ; do
            if [[ $line == *"tag"* ]]; then
                tag=$(printf "$line" | sed -e "s/^tag: \"//" -e "s/\"$//" | tr -d "\n\r")
            fi
            if [[ $line == *"type"* ]]; then
                type=$(echo "$line" | sed -e "s/^type: \"//" -e "s/\"$//" | tr -d "\n\r")
            fi
            #echo '' >> "csv/${file%.*}.csv" ## add new line
            if [[ $line == *"round"* ]]; then
                round=$(echo "$line" | sed -e "s/^round: \"//" -e "s/\"$//" | tr -d "\n\r")
            fi 
            if [[ $line == *"season"* ]] && ! [[ $line == *"noseason"* ]]; then
                season=$(echo "$line" | sed -e "s/^season: \"//" -e "s/\"$//" | tr -d "\n\r")
            fi
            if [[ $line == *"noseason"* ]]; then
                noseason=$(echo "$line" | sed -e "s/^noseason: \"//" -e "s/\"$//" | tr -d "\n\r")
            fi 
            if [[ $line == *"place"* ]]; then
                place=$(echo "$line" | sed -e "s/^place: \"//" -e "s/\"$//" | tr -d "\n\r")
            fi
        done <"$R"

        ## build the header
        echo $tag | tr -d "\n\r" > "csv/${file%.*}.csv"
        if [ ! -z "$type" ]; then
            echo $type | sed 's/^/ - /' | tr -d "\n\r"  >> "csv/${file%.*}.csv"
        fi
        echo "" >> "csv/${file%.*}.csv"
        if [ ! -z "$round" ]; then
            echo $round | sed 's/$/ /' | tr -d "\n\r"  >> "csv/${file%.*}.csv"
        fi
        if ! [[ $noseason == "true" ]]; then
            if [ ! -z "$season" ]; then
                echo "עונת " | tr -d '\n\r' >> "csv/${file%.*}.csv"
                echo $season | tr -d "\n\r"  >> "csv/${file%.*}.csv"
            fi
        fi
        if [ ! -z "$round" ] || [ ! -z "$season" ] ; then
            if ! [[ $noseason == "true" ]]; then
                echo " - " | tr -d '\n\r' >> "csv/${file%.*}.csv"
            fi
        fi
        echo $place | tr -d "\n\r"  >> "csv/${file%.*}.csv"
        echo " - " | tr -d '\n\r' >> "csv/${file%.*}.csv"
        echo $file1 | awk -v FS=- -v OFS=- '{print $3,$2,$1}' >> "csv/${file%.*}.csv"
       
        ## creating event name header, very bad performance...
           # grep -F tag "$line" | sed "s/^tag: \"//" | tr -d "\"\n\r" > "csv/${file%.*}.csv"
            #grep -F type "$line" | sed "s/^type: \"//" | tr -d "\"\n\r" | sed 's/^/ - /' >> "csv/${file%.*}.csv"
            #printf '\n' >> "csv/${file%.*}.csv" ## add new line
            #if ! grep -q "round: \"\"" "$line"; then
                ## get the line that contain "round" | delete 'round: "' | delete " and end of line return | add 1 space in the end >> APPEND to file
            #    grep -F round "$line" | sed "s/^round: \"//" | tr -d "\"\n\r" | sed 's/$/ /' >> "csv/${file%.*}.csv"
            #fi
            #if ! grep -q "noseason: \"true\"" "$line"; then
            #    echo "עונת " | tr -d '\n\r' >> "csv/${file%.*}.csv"
            #    grep -F season "$line" | grep -v "noseason" | sed "s/^season: \"//" | tr -d "\"\n\r" >> "csv/${file%.*}.csv"
            #    echo " - " | tr -d '\n\r' >> "csv/${file%.*}.csv"
            #fi
            #grep -F place "$line" | sed "s/^place: \"//" | tr -d "\"\n\r" >> "csv/${file%.*}.csv"
            #echo " - " | tr -d '\n\r' >> "csv/${file%.*}.csv"
            ## rearange the date to be hebrew human readable
            #echo $file1 | awk -v FS=- -v OFS=- '{print $3,$2,$1}' >> "csv/${file%.*}.csv"
        
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
