#! /usr/bin/python3
# create html table from csv
# Author(s): Chris Trombley <ctroms@gmail.com>
# Version 2 - added css class to all columns except header
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
outputDir = 'converted'
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




def subToHebrew(cPlace, oldArg, subArg):
    global header_dynamic
    global c
    if re.match("(.*)"+oldArg+"(.*)", str(column)):
        if cPlace != "q":
            c[cPlace] += 1
            if c[cPlace] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">'+subArg+'</th>\n'
        else:
            header_dynamic += '        <th class=\"rnkh_font\">'+subArg+'</th>\n'
            
def dnx(findStr, subStr):
    htmlfile.write('    <tr>\n')
    for column in row:
        column = re.sub(findStr, subStr+round, str(column))
        htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
    htmlfile.write('    </tr>\n')

#if len(sys.argv) < 3:


detector = UniversalDetector()

codecs1 = get_encoding_type(fileName)
print("\nfile codecs is "+codecs1)
if codecs1 != "utf-8" and codecs1 != "UTF-8-SIG":
    convertFileWithDetection(fileName)
    print (bcolors.FAIL +  "file not utf-8, converted to new file: " + OriginalName + " ,trying to create the HTML file...\n" + bcolors.ENDC)
#    exit(0)


# Create the HTML file for output
timestr = time.strftime("%Y%m%d_%H%M")
filename = OriginalName
filename = filename.split(".",1)
filename = '{0}_ConvertedHTML_{1}.txt'.format(filename[0],timestr)
    #exit(1)
#else:
#    filename = sys.argv[1]
#    filename = filename.split(".",1)
#    filename = '{0}.txt'.format(filename[0])
    
htmlfile = open(filename,"w")

header_fixed = '\n\
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

# build the dynamic header
readerheader = csv.reader(open(OriginalName), delimiter='\t') # for the header
header_dynamic = '\n    <tr class=\"rnkh_bkcolor\">\n'
RunNum = 20
c= []
for y in range(1, 130): # a list for run numbers (from 1 to RunNum) and to check duplicated in the header (101-130 )
    c = c + [0]
#if str(sys.argv[2]) == "a":
if len(sys.argv) < 3:
    round = "הקפה"
else:
    round = "מקצה"
    
for row in readerheader:
#    print('unsorted:'+str(c))
    c.sort(reverse=True)
#    print('sorted:'+str(c))
    if c[1] > 0:# stop checking rows after we processed the real header row        
        break
    for column in row:
        subToHebrew(101,"(P|p)os.","מקום")
        subToHebrew(102, "(R|r)nk", "מקום")
        if re.match("(.*)(R|r)anking(.*)", str(row)):
            pass
        else:
            subToHebrew(103, "(R|r)ank", "מקום")
        subToHebrew(104, "(N|n)um", "מספר")
        subToHebrew(105, "(N|n)o.", "מספר")
        subToHebrew(106, "(B|b)ib", "מספר")
        if re.match("(.*)(N|n)ame(.*)", str(column)) or re.match("(.*)(D|d)river(.*)", str(column)):
            if re.match("(.*)(D|d)river's (L|l)ast (N|n)ame(.*)", str(column)):
                c[121] += 1
                if c[121] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">שם</th>\n'
            elif re.match("(.*)(L|l)ast (N|n)ame(.*)", str(column)):
                c[107] += 1
                if c[107] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">נהג</th>\n'
            elif re.match("(.*)(F|f)irst (N|n)ame(.*)", str(column)):
                c[108] += 1
                if c[108] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">נווט</th>\n'
            elif re.match("(.*)(D|d)river(.*)", str(column)):
                c[110] += 1
                if c[110] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">שם</th>\n'
            else:
                c[109] += 1
                if c[109] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">שם</th>\n'
#        subToHebrew(110, "(D|d)river", "שם")
        for i in range(1, RunNum):
            subToHebrew(i, "(R|r)un "+str(i), round+' '+str(i))
#        subToHebrew(111, "(L|l)aps", "הקפות")
        subToHebrew(112, "(T|t)ime", "זמן")
        subToHebrew(113, "(G|g)ap", "פער")
        subToHebrew(114, "(D|d)iff. with leader", "פער")
#        subToHebrew(115, "(B|b).(L|l)ap", "הקפה מהירה")
#        subToHebrew(116, "(B|b)est (L|l)ap", "הקפה מהירה")
        if re.match("(.*)(L|l)ap(.*)", str(column)):
            if re.match("(.*)(B|b).(L|l)ap(.*)", str(column)):
                c[116] += 1
                if c[116] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">הקפה מהירה</th>\n'
            elif re.match("(.*)(B|b)est (L|l)ap(.*)", str(column)):
                c[117] += 1
                if c[117] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">הקפה מהירה</th>\n'
            elif re.match("(.*)(L|l)aps(.*)", str(column)):
                c[111] += 1
                if c[111] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">הקפות</th>\n'
            else:
                c[119] += 1
                if c[119] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">הקפה</th>\n'
        subToHebrew("q", "(P|p)enalty", "עונשין")
        subToHebrew(117, "(S|s)eq", "סידורי")
        subToHebrew(118, "(H|h)our", "זמן כולל")
        subToHebrew(120, "(P|p)oints", "נקודות")
        subToHebrew(122, "(C|c)ategory", "קטגוריה")

#        print('column:'+str(c))
header_dynamic += '    </tr>\n'

# set which header to use
header = header_dynamic
#header = header_fixed

# start building the html file
# Open the CSV file for reading
reader = csv.reader(open(OriginalName), delimiter='\t')

# print header to shell to check if correct
print (bcolors.HEADER +  "\nThis is the header we'll use:" + bcolors.ENDC)
print(header)

# initialize rownum variable
rownum = 0

# write <table> tag
htmlfile.write('<table class=\"line_color\">\n')

# generate table contents
for row in reader: # Read a single row from the CSV file
    headerItems = ['Rank', 'Rnk', 'Bib.', 'Event Ranking', 'Gap', 'Num', 'Pos.', 'Name', 'All mountain']
    if not any(item in row for item in headerItems): # delete english header row

    # write header row. assumes first row in csv contains header (its wrong but we do not use it)
        if reader.line_num == 1:
    #    if rownum == 0:
            htmlfile.write('    <tr class=\"rnkh_bkcolor\">\n')
            for column in row:
                column = re.sub('(l|L)aps', 'הקפות', str(column))#for lap by lap
                column = re.sub('(l|L)ap', 'הקפה', str(column))#for lap by lap
                htmlfile.write('        <th class=\"rnkh_font\">' + column + '</th>\n')
            htmlfile.write('    </tr>\n')

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
