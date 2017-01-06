#! python3
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
readerheader = csv.reader(open(sys.argv[1]), delimiter='\t') # for the header
header_dynamic = '\n    <tr class=\"rnkh_bkcolor\">\n'
laps = 0
RunNum = 20
k= []
for i in range(1, RunNum):
    k = k + [0]
c = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]# make sure item is procssed once and no more
#if str(sys.argv[2]) == "a":
if len(sys.argv) < 3:
    round = "הקפה"
else:
    round = "מקצה"
    
for row in readerheader:
    c.sort(reverse=True)
    if c[1] > 0:# stop checking rows after we processed the real header row
        break
    for column in row:
        if re.match("(.*)(R|r)nk(.*)", str(column)):
            c[1] += 1
            if c[1] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">מקום</th>\n'
        if re.match("(.*)(R|r)anking(.*)", str(column)):
            pass
        else:
            if re.match("(.*)(R|r)ank(.*)", str(column)):
                c[2] += 1
                if c[2] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">מקום</th>\n'
        if re.match("(.*)(N|n)um(.*)", str(column)):
            c[3] += 1
            if c[3] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">מספר</th>\n'
        if re.match("(.*)(B|b)ib(.*)", str(column)):
            c[4] += 1
            if c[4] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">מספר</th>\n'
        if re.match("(.*)(N|n)ame(.*)", str(column)):
            if re.match("(.*)(L|l)ast (N|n)ame(.*)", str(column)):
                c[5] += 1
                if c[5] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">נהג</th>\n'
            elif re.match("(.*)(F|f)irst (N|n)ame(.*)", str(column)):
                c[8] += 1
                if c[8] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">נווט</th>\n'
            else:
                c[6] += 1
                if c[6] == 1:
                    header_dynamic += '        <th class=\"rnkh_font\">שם</th>\n'
        if re.match("(.*)(D|d)river(.*)", str(column)):
            c[7] += 1
            if c[7] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">שם</th>\n'
        for i in range(1, RunNum):
            if re.match("(.*)(R|r)un "+str(i)+"(.*)", str(column)):
                k[i] += 1
                if k[i] == 1:           
                    header_dynamic += '        <th class=\"rnkh_font\">'+round+' '+str(i)+'</th>\n'
        if re.match("(.*)(L|l)aps(.*)", str(column)):
            laps += 1
            if laps == 1:   # make sure just the first laps is prossed
                header_dynamic += '        <th class=\"rnkh_font\">הקפות</th>\n'
            else:
                pass
        if re.match("(.*)(T|t)ime(.*)", str(column)):
            c[9] += 1
            if c[9] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">זמן</th>\n'
        if re.match("(.*)(G|g)ap(.*)", str(column)):
            c[10] += 1
            if c[10] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">פער</th>\n'
        if re.match("(.*)(B|b).Lap(.*)", str(column)):
            c[11] += 1
            if c[11] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">הקפה מהירה</th>\n'
        if re.match("(.*)(P|p)enalty(.*)", str(column)):
            c[12] += 1
            if c[12] == 1:
                header_dynamic += '        <th class=\"rnkh_font\">עונשין</th>\n'
header_dynamic += '    </tr>\n'

# set which header to use
header = header_dynamic

# start building the html file
# Open the CSV file for reading
reader = csv.reader(open(sys.argv[1]), delimiter='\t')

# print header to shell to check if correct
print (bcolors.HEADER +  "\nThis is the header we'll use:" + bcolors.ENDC)
print(header)

# initialize rownum variable
rownum = 0

# write <table> tag
htmlfile.write('<table class=\"line_color\">\n')

# generate table contents
for row in reader: # Read a single row from the CSV file

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
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DNS - Did not start - Run', 'DNS - לא התחיל - '+round, str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)DNF(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DNF - Do not finish - Run', 'DNF - לא סיים - '+round, str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)DISQ(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DISQ - Disqualified - Run', 'DSQ - נפסל - '+round, str(column))
                    htmlfile.write('        <td  colspan=\"99\" class=\"subtitle_font\">' + column + '</td>\n')
                htmlfile.write('    </tr>\n')
            elif re.match("(.*)DSQ(.*)", str(row)):
                htmlfile.write('    <tr>\n')
                for column in row:
                    column = re.sub('DSQ - Disqualified - Run', 'DSQ - נפסל - '+round, str(column))
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
