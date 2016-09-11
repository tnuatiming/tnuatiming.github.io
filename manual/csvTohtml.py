#!/usr/bin/python
# create html table from csv
# Author(s): Chris Trombley <ctroms@gmail.com>
# Version 2 - added css class to all columns except header
# http://www.ctroms.com/blog/code/python/2011/04/20/csv-to-html-table-with-python/
# http://stackoverflow.com/questions/4521426/delete-blank-rows-from-csv
import time

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
    filename = 'ConvertedHTML_'+timestr+'.txt'
    #exit(1)
else:
    filename = sys.argv[2]
    
htmlfile = open(filename,"w")

# Open the CSV file for reading
reader = csv.reader(open(sys.argv[1]), delimiter='\t')

# initialize rownum variable
rownum = 0

# write <table> tag
htmlfile.write('<table cellspacing=1 class=\"line_color\">\n')

# generate table contents
for row in reader: # Read a single row from the CSV file

    # write header row. assumes first row in csv contains header
    if rownum == 0:
        htmlfile.write('   <tr class=\"rnkh_bkcolor\">\n')
        for column in row:
            htmlfile.write('      <th class=\"rnkh_font\">' + column + '</th>\n')
        htmlfile.write('   </tr>\n')

    #write all other rows	
    else:
        if any(row):#check if row not empty so not to get empty td.
            htmlfile.write('   <tr class=\"rnk_bkcolor\">\n')	
            for column in row:
                htmlfile.write('      <td class=\"rnk_font\">' + column + '</td>\n')
            htmlfile.write('   </tr>\n')

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
