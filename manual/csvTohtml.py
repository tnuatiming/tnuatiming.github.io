#! /usr/bin/python3
# create html table from csv
# Author(s): Chris Trombley <ctroms@gmail.com>
# Version 2 - added css class to all columns except header
# Version 3 20170717 - simplefied and adjusted for use on elite 3 output
# https://github.com/ctroms/snippets/blob/master/csvtotable.py
# https://github.com/iamliamc/CSVtoHTML/blob/master/script4.py
# http://www.ctroms.com/blog/code/python/2011/04/20/csv-to-html-table-with-python/
# http://stackoverflow.com/questions/4521426/delete-blank-rows-from-csv
# http://stackoverflow.com/questions/191359/how-to-convert-a-file-to-utf-8-in-python
import time
import re
import sys
import csv
import io
from chardet.universaldetector import UniversalDetector

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

targetFormat = 'utf-8'
detector = UniversalDetector()
fileName = sys.argv[1] 
OriginalName = sys.argv[1]

def get_encoding_type(fileName):
    detector.reset()
    for line in open(fileName, 'rb'):
        detector.feed(line)
        if detector.done: break
    detector.close()
    return detector.result['encoding']

def convertFileWithDetection(fileName):
    print("Converting '" + fileName + "'...")
    format=get_encoding_type(fileName)
    try:
        with io.open(fileName, 'rU', encoding=format) as sourceFile:
            writeConversion(sourceFile)
            print('Done.')
            return
    except UnicodeDecodeError:
        pass
    print("Error: failed to convert '" + fileName + "'.")

def writeConversion(file):
    global OriginalName
    OriginalName,Ext = OriginalName.split(".",1)
    OriginalName = OriginalName + "_utf8." + Ext
    with io.open(OriginalName, 'w', encoding=targetFormat) as targetFile:
        for line in file:
            targetFile.write(line)


            
def dnx(findStr, subStr):
    htmlfile.write('    <tr>\n')
    for column in row:
        column = re.sub(findStr, subStr+round, str(column))
        htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
    htmlfile.write('    </tr>\n')

#if len(sys.argv) < 3:

OriginalCodecs = get_encoding_type(fileName)
print("\nfile codecs is "+OriginalCodecs)
if OriginalCodecs != "utf-8" and OriginalCodecs != "UTF-8-SIG":
    convertFileWithDetection(fileName)
    print (bcolors.FAIL +  "file not utf-8, converted to new file: " + OriginalName + " ,trying to create the HTML file...\n" + bcolors.ENDC)
#    exit(0)

# Create the HTML file for output
filename = OriginalName.split(".",1)
filename = '{0}_ConvertedHTML_{1}.txt'.format(filename[0],time.strftime("%Y%m%d_%H%M"))
    #exit(1)
#else:
#    filename = sys.argv[1]
#    filename = filename.split(".",1)
#    filename = '{0}.txt'.format(filename[0])
    
htmlfile = open(filename,"w")

# build the dynamic header. going over the rows, finding the header row and creating the header in html format to use and append in the secound run.
readerheader = csv.reader(open(OriginalName), delimiter='\t') # for the header
#if str(sys.argv[2]) == "a":
if len(sys.argv) < 3:
    round = "הקפה"
else:
    round = "מקצה"
header_total = ''
   
for row in readerheader:
        if len(row)> 3: # find the first row with more then 3 column and assumes its the header row
    #    if rownum == 0:
 #           htmlfile.write('    <tr class=\"rnkh_bkcolor\">\n')
            header_total += '    <tr class=\"rnkh_bkcolor\">\n'
            for column in row:
                column = re.sub('(r|R)ank', 'מקום', str(column))
                column = re.sub('(r|R)nk', 'מקום', str(column))
                column = re.sub('(p|P)os.', 'מקום', str(column))
                column = re.sub('(n|N)um', 'מספר', str(column))
                column = re.sub('(b|B)ib.', 'מספר', str(column))
                column = re.sub("Driver's last name", 'שם', str(column))
                column = re.sub("Driver's first name", 'נווט', str(column))
                column = re.sub('(l|L)Last Name', 'שם', str(column))
                column = re.sub('(f|F)irst Name', 'נווט', str(column))
                column = re.sub('(n|N)ame', 'שם', str(column))
                column = re.sub('(d|D)river', 'שם', str(column))
                column = re.sub('(l|L)aps', 'הקפות', str(column))
                column = re.sub('B.Lap', 'הקפה מהירה', str(column))
                column = re.sub('(l|L)ap', 'הקפה', str(column))
                column = re.sub('(t|T)ime', 'זמן', str(column))
                column = re.sub('(h|H)Hour', 'זמן', str(column))
                column = re.sub('(g|G)ap', 'פער', str(column))
                column = re.sub('(p|P)enalty', 'עונשין', str(column))
                column = re.sub('(c|C)ategory', 'קטגוריה', str(column))
                column = re.sub('(s|S)Seq', 'סידורי', str(column))
                column = re.sub('(r|R)un', round, str(column))
 #               htmlfile.write('        <th class=\"rnkh_font\">' + column + '</th>\n')
                header_total += '        <th class=\"rnkh_font\">' + column + '</th>\n'
#            htmlfile.write('    </tr>\n')
            header_total += '    </tr>\n'
            break
        #write all other rows

# print header to shell to check if correct
print (bcolors.HEADER +  "\nThis is the header we'll use:" + bcolors.ENDC)
print(header_total)

# start building the html file
# Open the CSV file for reading
reader = csv.reader(open(OriginalName), delimiter='\t')

# initialize variables
rownum = 0
headerrow = 0
# write <table> tag
htmlfile.write('<table class=\"line_color\">\n')

# generate table contents
for row in reader: # Read a single row from the CSV file
    
    if len(row)> 3 and headerrow == 0: # find the first row with more then 3 column and assumes its the header row so we can pass it
        headerrow = 1
    #write all other rows
    else:
        if any(row):#check if row not empty so not to get empty td.
            if re.match("(.*)DNS(.*)", str(row)):
                dnx('DNS - Did not start - Run', 'DNS - לא התחיל - ')
            elif re.match("(.*)DNF(.*)", str(row)):
                dnx('DNF - Do not finish - Run', 'DNF - לא סיים - ')
            elif re.match("(.*)DISQ(.*)", str(row)):
                dnx('DISQ - Disqualified - Run', 'DSQ - נפסל - ')
            elif re.match("(.*)DSQ(.*)", str(row)):
                dnx('DSQ - Disqualified - Run', 'DSQ - נפסל - ')
            elif re.match("(.*)(b|B)est lap(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('(b|B)est lap', 'הקפה מהירה', str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"comment_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)הקפה מהירה(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    htmlfile.write('        <td  colspan=\"99\" class=\"comment_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif len(row) == 1: #after going all the other options we left with the category header
                htmlfile.write('    <tr>\n')
                for column in row:
                    htmlfile.write('        <td  colspan=\"99\" class=\"title_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
#                   htmlfile.write(header)
                htmlfile.write(header_total) #append the header html code
            else: # and finally craeating the particepent html table row with fixes for laps and time
                htmlfile.write('    <tr class=\"rnk_bkcolor\">\n')
                for column in row:
                    column = re.sub('(l|L)aps', 'הקפות', str(column))
                    column = re.sub('(l|L)ap', 'הקפה', str(column))
                    column = re.sub('1h', '01:', str(column))
                    column = re.sub('2h', '02:', str(column))
                    column = re.sub('3h', '03:', str(column))
                    column = re.sub('4h', '04:', str(column))
                    htmlfile.write('        <td class=\"rnk_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')

    #increment row count
    rownum += 1

# write </table> tag
htmlfile.write('</table>\n')
# close the new created file
htmlfile.close()
# print results to shell
print (bcolors.OKBLUE +  "Created " + str(rownum) + " row table.")
print (bcolors.OKGREEN +  "\ndone, see converted file:",filename,"\n" + bcolors.ENDC)
exit(0)
