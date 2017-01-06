#!/usr/bin/python
import time

import sys
import os
import csv
import string
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

if len( sys.argv ) < 2 :
    sys.stderr.write( sys.argv[ 0 ]  + 
                      ": usage - "   + 
                      sys.argv[ 0 ]  + " [.csv file name]\n" )
    sys.exit()

if not os.path.exists(sys.argv[ 1 ]):
    sys.stderr.write( sys.argv[ 1 ] + " not found \n" )
    sys.exit()
# delete empty lines
input = open(sys.argv[ 1 ], 'rb')
#input = [x.replace(" \r\n","\r\n") for x in input]
#print input
output = open('temp223344.csv', 'wb')
writer = csv.writer(output)
for row in csv.reader(input):
    if row:
        writer.writerow(row)
input.close()
output.close()

with open( 'temp223344.csv', 'rt') as csvfile:
    table_string = "<table cellspacing=1 class=\"line_color\">\n"
    for line in csv.reader(csvfile, delimiter='\t'):        
        table_string += "\t<tr class=\"rnk_bkcolor\">\n" + \
        "\t\t<td class=\"rnk_font\">" + \
        string.join( line, "</td>\n\t\t<td class=\"rnk_font\">" ) + \
        "</td>\n" + \
        "\t</tr>\n"
    table_string += "</table>\n\n"
os.remove('temp223344.csv')
#sys.stdout.write( table_string )
timestr = time.strftime("%Y%m%d_%H%M")
filename = 'ConvertedHTML_'+timestr+'.txt'
text_file = open(filename, "w")
text_file.write(table_string)
text_file.close()
print bcolors.OKGREEN +  "\ndone, see converted file:",filename,"\n" + bcolors.ENDC
sys.exit()
