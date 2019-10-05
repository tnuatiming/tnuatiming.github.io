#!/usr/bin/python

# change log:
# 2018-4-7 move to relative universal paths

from bs4 import BeautifulSoup
import glob, os, csv, datetime 
CWD = os.getcwd() # '/home/amir/tnuatiming.github.io'

if not os.path.exists("static/csv"):# create csv dir
    os.makedirs("static/csv")

files = glob.glob('static/csv/*')# clean the csv dir
for fd in files:
    os.remove(fd)

os.chdir(CWD+"/_posts/")# dir with all the html files

for file in sorted(glob.glob("*.md"), reverse=True):# go trough the files

    with open(file, "r")  as f0:# create the variables for header
        tag=''
        type=''
        round=''
        season=''
        noseason=''
        place=''
        date=''
        
        next(f0) # skip the first line (---)

        for line in f0:
            if "---" in line: # the secound line with --- , no need to go forward, as we finished phraseing the header
                break
            else:
                if "tag" in line:
                    line=line.replace('"','')
                    tag=line.replace('tag: ','').rstrip()
    #                print (tag.strip())
                if "type" in line:
                    line=line.replace('"','')
                    type=line.replace('type: ','').rstrip()
                if "round" in line:
                    line=line.replace('"','')
                    round=line.replace('round: ','').rstrip()+' '
                if "season" in line and "noseason" not in line:
                    line=line.replace('"','')
                    season=line.replace('season: ','').rstrip()
                if "noseason" in line:
                    line=line.replace('"','')
                    noseason=line.replace('noseason: ','').rstrip()
    #                print (noseason)
                if "place" in line:
                    line=line.replace('"','')
                    place=line.replace('place: ','').rstrip()
    f0.close()
    date = datetime.datetime.strptime(file[:10], '%Y-%m-%d').strftime('%d-%m-%Y').rstrip()# extract date from file name and make it beutyfull
    
    with open(file, "r")  as f1:# phrasing and creating the csv file
#        print(file)

        soup = BeautifulSoup(f1.read(), 'html.parser')

        tables = soup.find_all('table')

        file=file.replace(".md","")# remove .md
        file=file.replace("-","_")

        with open(CWD+"/static/csv/"+file+'.csv', 'w') as f:# create the result header
            f.write(tag.rstrip()) 
            if type != '':
                f.write(' - '+type.rstrip()) 
            f.write('\n') 
            if round.rstrip() != '':
                f.write(round.rstrip()+' ') 
            if noseason == '':
                f.write('עונת '+season.rstrip()) 
            if round.rstrip() != '' or noseason == '':
                f.write(' - ') 
            f.write(place.rstrip()) 
            f.write(' - '+date+'\n') 
        f.close()

        for table in tables:
    #        headers = [header.text for header in table.find_all('th')]
            with open(CWD+"/static/csv/"+file+'.csv', 'a') as f:# add empty line before each table
                f.write('\n') 
            f.close()

            rows = []

            for row in table.find_all('tr'):
                rows.append([val.text for val in row.find_all(['th','td'])])

            with open(CWD+"/static/csv/"+file+'.csv', 'a') as f:
                writer = csv.writer(f)
    #            writer.writerow(headers)
                writer.writerows(row for row in rows if row)
            f.close()

        # add copyright at the end
        with open(CWD+"/static/csv/"+file+'.csv', 'a') as f:
            f.write('\n\xa9 כל הזכויות שמורות לתנועה מדידת זמנים')
        f.close()


    with open(CWD+"/static/csv/index.html", 'a') as f2:
        url="<li><a href=http://tnuatiming.com/csv/"+file+".csv>"+tag+" - "+round+"עונת "+season+" - "+place+" - "+date+"</a></li>"
        f2.write(url+'\n') 
    f2.close()

os.chdir(CWD)

with open(CWD+"/static/csv/index.html", 'r+') as f3:
    content = f3.read()
    f3.seek(0, 0)
    head='<!doctype html><html lang="he" xml:lang="he" dir="rtl"><head><meta charset="utf-8"><style>a{margin-right:20px;text-decoration:none;}a:hover{color:lightgray;}ol{margin-right:40px;font-size:1.5em;}</style></head><body><ol reversed>'
    f3.write(head.rstrip('\r\n') + '\n' + content + '</ol></body></html>\n')
f3.close()
