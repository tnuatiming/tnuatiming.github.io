#!/usr/bin/python
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
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
 
if len(sys.argv) < 3:
    # Create the HTML file for output
    timestr = time.strftime("%Y%m%d_%H%M")
    filename = sys.argv[1]
    filename = filename.split(".",1)
    filename = '{0}_ConvertedHTML_{1}.txt'.format(filename[0],timestr)
    #exit(1)
else:
    filename = sys.argv[1]
    filename = filename.split(".",1)
    filename = '{0}.txt'.format(filename[0])
    
htmlfile = open(filename,"w")

header = '\n\
    <tr class="rnkh_bkcolor">\n\
        <th class="rnkh_font">מקום</th>\n\
        <th class="rnkh_font">מספר</th>\n\
        <th class="rnkh_font">נהג</th>\n\
        <th class="rnkh_font">נווט</th>\n\
        <th class="rnkh_font">מקצה 3</th>\n\
        <th class="rnkh_font">מקצה 4</th>\n\
        <th class="rnkh_font">מקצה 5</th>\n\
        <th class="rnkh_font">זמן</th>\n\
        <th class="rnkh_font">עונשין</th>\n\
        <th class="rnkh_font">פער</th>\n\
    </tr>\n\
'

# Open the CSV file for reading
reader = csv.reader(open(sys.argv[1]), delimiter='\t')

# initialize rownum variable
rownum = 0

# write <table> tag
htmlfile.write('<table cellspacing=\"1\" class=\"line_color\">\n')

# generate table contents
for row in reader: # Read a single row from the CSV file

    # write header row. assumes first row in csv contains header
    if rownum == 0:
        htmlfile.write('    <tr class=\"rnkh_bkcolor\">\n')
        for column in row:
            htmlfile.write('        <th class=\"rnkh_font\">' + column + '</th>\n')
        htmlfile.write('    </tr>\n')

    #write all other rows
    else:
        if any(row):#check if row not empty so not to get empty td.
            if re.match("(.*)DNS(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DNS - Did not start - Run', 'DNS - לא התחיל - מקצה', str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)DNF(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DNF - Do not finish - Run', 'DNF - לא סיים - מקצה', str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)DISQ(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DISQ - Disqualified - Run', 'DSQ - נפסל - מקצה', str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)DSQ(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DSQ - Disqualified - Run', 'DSQ - נפסל - מקצה', str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)(b|B)est lap(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('(b|B)est lap', 'הקפה מהירה', str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"comment_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif len(row) == 1:
                htmlfile.write('    <tr>\n')
                for column in row:
                    htmlfile.write('        <td  colspan=\"99\" class=\"title_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
                htmlfile.write(header)
            else:
                htmlfile.write('    <tr class=\"rnk_bkcolor\">\n')
                for column in row:
                    column = re.sub('(l|L)aps', 'הקפות', str(column))
                    column = re.sub('(l|L)ap', 'הקפה', str(column))
                    htmlfile.write('        <td class=\"rnk_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')

    #increment row count
    rownum += 1

# write </table> tag
htmlfile.write('</table>\n')
# close the new created file
htmlfile.close()
# print results to shell
print ("Created " + str(rownum) + " row table.")
print (bcolors.OKGREEN +  "\ndone, see converted file:",filename,"\n" + bcolors.ENDC)
exit(0)
