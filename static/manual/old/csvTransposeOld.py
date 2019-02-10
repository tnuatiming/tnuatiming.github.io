#!/usr/bin/python
# create html table from csv
# Author(s): Chris Trombley <ctroms@gmail.com>
# Version 2 - added css class to all columns except header
# https://github.com/ctroms/snippets/blob/master/csvtotable.py
# https://github.com/iamliamc/CSVtoHTML/blob/master/script4.py
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

# start building the html file
# Open the CSV file for reading
reader = csv.reader(open(sys.argv[1]), delimiter='\t')

with open(sys.argv[1]) as f:
  lis = [x.split('\t') for x in f]

for x in zip(*lis):
  for y in x:
    print(y+'\t', end='')
    htmlfile.write(y+'\t')
    
  print('\n')
  htmlfile.write('\n')

# close the new created file
htmlfile.close()
# print results to shell
print (bcolors.OKGREEN +  "\ndone, see converted file:",filename,"\n" + bcolors.ENDC)
exit(0)
