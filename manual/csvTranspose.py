#! /usr/bin/python3
# create html table from csv
# Author(s): Chris Trombley <ctroms@gmail.com>
# Version 2 - added css class to all columns except header
# https://github.com/ctroms/snippets/blob/master/csvtotable.py
# https://github.com/iamliamc/CSVtoHTML/blob/master/script4.py
# http://www.ctroms.com/blog/code/python/2011/04/20/csv-to-html-table-with-python/
# http://stackoverflow.com/questions/4521426/delete-blank-rows-from-csv
import time
import re
import sys
import csv
import os
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
 
#if len(sys.argv) < 3:

# Create the HTML file for output
timestr = time.strftime("%Y%m%d_%H%M")
filename = sys.argv[1]
filename = filename.split(".",1)
filename = '{0}_ConvertedHTML_{1}.txt'.format(filename[0],timestr)
    #exit(1)
#else:
#    filename = sys.argv[1]
#    filename = filename.split(".",1)
#    filename = '{0}.txt'.format(filename[0])
    
htmlfile = open(filename,"w")
htmltmp = open("tmp1212.txt","w")

# transposing the table
with open(sys.argv[1]) as f:
  lis = [x.split('\t') for x in f]

for x in zip(*lis):
  for y in x:
    htmltmp.write(y+';')
  htmltmp.write('\n')

htmltmp.close()
'''
# removing the last column
with open("tmp1212.txt","r") as fin:
    with open("tmp3434.txt","w") as fout:
        writer=csv.writer(fout)
        for row in csv.reader(fin):
            writer.writerow(row[0:-1])
'''
# start building the html file
# Open the CSV file for reading
reader = csv.reader(open("tmp1212.txt"), delimiter=';')
# initialize rownum variable
rownum = 0

# write <table> tag
htmlfile.write('<table class=\"line_color no_num_color\">\n')
htmlfile.write('    <tr>\n        <td colspan=\"99\" class=\"title_font\">מהלך המירוץ</td>\n    </tr>\n')
# generate table contents
for row in reader: # Read a single row from the CSV file

    # write header row. assumes first row in csv contains header (its wrong but we do not use it)
    if reader.line_num == 1:
        htmlfile.write('    <tr class=\"rnkh_bkcolor\">\n')
        for column in row[:-1]:#ignoring last column
            column = re.sub('(l|L)aps', 'הקפות', str(column))
            column = re.sub('(l|L)ap', 'הקפה', str(column))
            column = re.sub('(r|R)ank', 'מקום', str(column))
            htmlfile.write('        <th class=\"rnkh_font\">' + column + '</th>\n')
        htmlfile.write('    </tr>\n')

    #write all other rows
    else:
        if any(row):#check if row not empty so not to get empty td.
            htmlfile.write('    <tr class=\"rnk_bkcolor\">\n')
            for column in row[:-1]:#ignoring last column
                column = re.sub('(l|L)aps', 'הקפות', str(column))
                column = re.sub('(l|L)ap', 'הקפה', str(column))
                column = re.sub('(r|R)ank', 'מקום', str(column))
                column = column.replace(".","")
                htmlfile.write('        <td class=\"rnk_font\">' + column + '</td>\n')
            htmlfile.write('    </tr>\n')

    #increment row count
    rownum += 1

# write </table> tag
htmlfile.write('</table>\n')
# close the new created file
htmlfile.close()
#clean tmp files
os.remove("tmp1212.txt")
#os.remove("tmp3434.txt")
# print results to shell
print (bcolors.OKBLUE +  "Created " + str(rownum) + " row table.")
print (bcolors.OKGREEN +  "\ndone, see converted file:",filename,"\n" + bcolors.ENDC)
exit(0)
