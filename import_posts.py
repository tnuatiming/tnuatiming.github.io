#!/usr/bin/python

# change log:
# 2018-4-7 move to relative universal paths
from shutil import copyfile, rmtree

from bs4 import BeautifulSoup
import glob, os, csv, datetime, pathlib, re
CWD = os.getcwd() # '/home/amir/tnuatiming.github.io'
os.chdir(CWD+"/_posts/")# dir with all the md files
rmtree(CWD+"/content/results/", ignore_errors=True)
'''if not os.path.exists("temp"):# create temp dir
    os.makedirs("temp")

files = glob.glob('temp/*')# clean the temp dir
for fd in files:
    os.remove(fd)

os.chdir("results/")# dir with all the md files
'''
for file in sorted(glob.glob("*.md"), reverse=True):# go trough the files

    with open(file, "r")  as f0:# create the variables for header
        tag=''
        type=''
        round=''
        season=''
        noseason=''
        place=''
        date=''
        category=''
        for line in f0:
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
                if "categories" in line:
                    line=line.replace('categories:','').replace('[results, ','').replace(']','')
                    category=line.replace(' ','').replace('"','').rstrip()
    #                print (category)
    f0.close()
    
    fileTemp = file.split('-')
    fileNew = fileTemp[-1]
#    print (fileNew)

    pathlib.Path(CWD+'/content/results/' + category + '/' + season).mkdir(parents=True, exist_ok=True) 
    copyfile(file, CWD+'/content/results/' + category + '/' + season + '/' + fileNew)

    date = datetime.datetime.strptime(file[:10], '%Y-%m-%d').strftime('%Y-%m-%d').rstrip()# extract date from file name and make it beutyfull
#    date = datetime.datetime.strptime(file[:10], '%Y-%m-%d').isoformat(timespec='seconds')# extract date from file name and make it beutyfull

#    print (date)

    with open(CWD+'/content/results/' + category + '/' + season + '/' + fileNew) as f:
        s = f.read()
    with open(CWD+'/content/results/' + category + '/' + season + '/' + fileNew, 'w') as f:
        s = s.replace('permalink:', 'url:', 1)
        s = s.replace('type:', 'sub:', 1)
        s = s.replace('layout:', 'type:', 1) 
        s = s.replace('[results, ', '"', 1) 
        s = s.replace(']', '"', 1) 
        s = s.replace('categories:', 'category:', 1) 
        s = s.replace('type: post', 'type: results', 1)
        s = s.replace('---', '---\ntitle: "' + fileNew.replace('.md','') + '"\ndate: ' + date, 1)
        f.write(s)
    
#    date = datetime.datetime.strptime(file[:10], '%Y-%m-%d').strftime('%d-%m-%Y').rstrip()# extract date from file name and make it beutyfull
    

os.chdir(CWD)
