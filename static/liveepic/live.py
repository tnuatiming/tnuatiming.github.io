#!/usr/bin/python
# -*- coding: UTF-8 -*-
# run "python -m http.server" to server the p1 file localy

# use minimize var to minimize the output for upload


import os, sys, time
import hashlib
from bs4 import BeautifulSoup
import json
from operator import itemgetter
import csv

#from datetime import datetime, timedelta

phash = ""

BLOCKSIZE = 65536
file = "p1.html" 
file2 = "live.csv" 
file3 = "live.txt" 

MaximumStageTime = "09:00:00"
startTime = "2019-09-21T04:00:00.000Z"
message = ""

raceEnded = 0

positionArray_All_Cat = {} # used to calculate the arrow for gain/lost position
minimize = 1

def timeToMilliseconds(time_str):
    t, f = time_str.split('.')
    t = t.split(':')
    if len(t) == 3:
        z = int(t[0]) * 3600000 + int(t[1]) * 60000 + int(t[2]) * 1000 + int(f) * 100
    elif  len(t) == 2:
        z = int(t[0]) * 60000 + int(t[1]) * 1000 + int(f) * 100
    elif  len(t) == 1:
        z = int(t[0]) * 1000 + int(f) * 100
        
    return int(z)
    
def millisecondsToTime(millis):
    millis = int(millis)
    milliseconds = (millis%1000)/100
    milliseconds = int(milliseconds)
    seconds=(millis/1000)%60
    seconds = int(seconds)
    minutes=(millis/(1000*60))%60
    minutes = int(minutes)
    hours=(millis/(1000*60*60))%24
    hours = int(hours)

    return cleanTime(str(hours).zfill(2) + ':' + str(minutes).zfill(2) + ':' + str(seconds).zfill(2) + '.' + str(milliseconds))

# clean zeros at begining of time string
def cleanTime(time):
    if time.startswith('00:'):
        time = time[3:]
    if time.startswith('00:'):
        time = time[3:]
    if time.startswith('0:'):
        time = time[2:]
    if time.startswith('0') and not time.startswith('0.'):
        time = time[1:]

    return time

MaximumStageTimeMili = timeToMilliseconds(MaximumStageTime + '.0')

def main():
    
    global positionArray_All_Cat
    global phash

    
    if os.path.exists(file):
        
        
        if os.stat(file).st_size != 0: # check if the file not empty
        
            hasher = hashlib.md5() # blake2b apper faster on 64bit, for 32bit use md5
            with open(file, 'rb') as afile:
                buf = afile.read(BLOCKSIZE)
                while len(buf) > 0:
                    hasher.update(buf)
                    buf = afile.read(BLOCKSIZE)
    #                    print(hasher.hexdigest())
        
        
    #        print(hasher.hexdigest())
    #    print(phash)
        
        if phash != hasher.hexdigest(): # checking if the file we want to upload chenged
            phash = hasher.hexdigest()


            with open(file, "r", encoding="utf-8") as myfile2: 
                                
                soup = BeautifulSoup(myfile2, 'lxml')


    # create the header for json
        
            headerFlag = soup.find(lambda tag: tag.name=='img')
    #        print(headerFlag.get('src'))

            HeaderEventName = soup.find('h1')
    #        print(HeaderEventName.text)

            DayTime = soup.find("span", id="DayTime")
    #        print(DayTime.text)
            ElapsedTime = soup.find("span", id="ElapsedTime")
    #        print(ElapsedTime.text)
            RemainingTime = soup.find("span", id="RemainingTime")
    #        print(RemainingTime.text)

            head = {}
            head["headerFlag"] = headerFlag.get('src')
            head["HeaderEventName"] = HeaderEventName.text
            head["DayTime"] = DayTime.text
            head["ElapsedTime"] = ElapsedTime.text
            head["RemainingTime"] = RemainingTime.text
            head["MaximumStageTime"] = MaximumStageTime
            head["startTime"] = startTime
            head["message"] = message
            
    #        print(head)

    # phrase the html file into a list of dictioneries
            table = soup.find('table')

            rows = table.find_all("tr")
                
            headers = {}
            thead = table.find_all(lambda tag: tag.name=='td' and tag.has_attr("id"))
            for i in range(len(thead)):
                headers[i] = thead[i].get('id')
            data = []
    # THIS APPEND THE RACE DATA HEADER AT THE TOP
    #        data.append(head)
            rowsa = iter(rows)
            next(rowsa) # skip first row
            for row in rowsa:
                cells = row.find_all("td")
                if thead:
                    items = {}
                    for index in headers:
                        items[headers[index]] = cells[index].text.replace(u'\xa0', u' ').strip()
                else:
                    items = []
                    for index in cells:
                        items.append(index.text.replace(u'\xa0', u' ').strip())
                data.append(items)
    #        print(data)

    # BEGIN clean, calculate and sort the results
            dataAll = []
            dataAll2 = []
            leaderFinish = {}
            leaderi1Finish = {}
            leaderi2Finish = {}
            leaderi3Finish = {}
            leaderOverall = 99999999999
            i1Overall = 99999999999
            i2Overall = 99999999999
            i3Overall = 99999999999
            leader = {}
            leaderi1 = {}
            leaderi2 = {}
            leaderi3 = {}
            
    # convert to milis        
            for item in data:
                if item['Id_NbTour'] != '-':
                    item['Id_NbTour'] = int(item['Id_NbTour'])
                if item['Id_TpsCumule'] != '-':
                    item['Id_TpsCumule'] = timeToMilliseconds(item['Id_TpsCumule'])
                else:
                    item['Id_TpsCumule'] = 99999999999
                if item['Id_Inter1'] != '-':
                    item['Id_Inter1'] = timeToMilliseconds(item['Id_Inter1'])
                else:
                    item['Id_Inter1'] = 99999999999
                if item['Id_Inter2'] != '-':
                    item['Id_Inter2'] = timeToMilliseconds(item['Id_Inter2'])
                else:
                    item['Id_Inter2'] = 99999999999
                if item['Id_Inter3'] != '-':
                    item['Id_Inter3'] = timeToMilliseconds(item['Id_Inter3'])
                else:
                    item['Id_Inter3'] = 99999999999

                item['Id_Numero_Full'] = item['Id_Numero'][:-1] + '-' + item['Id_Numero'][-1]
                item['Id_Numero'] = item['Id_Numero'][:-1]
                
                if (item['Id_Numero_Full'].endswith('1') and item['Id_Classe'] != 'ss'):
                    dataAll.append(item)
                if (item['Id_Numero_Full'].endswith('2') and item['Id_Classe'] != 'ss'):
                    dataAll2.append(item)


            
            for item in dataAll:
                for item2 in dataAll2:
            
                    if (item['Id_Numero'] == item2['Id_Numero']):
                        
                    
                        item['Id_Image_2'] = item2['Id_Image']
                        item['Id_Nom_2'] = item2['Id_Nom']
                        item['Id_Numero_Full_2'] = item2['Id_Numero_Full']
                        item['Id_Nationalite_2'] = item2['Id_Nationalite']
                        item['Id_Canal_2'] = item2['Id_Canal']
                        item['Id_Inter1_2'] = item2['Id_Inter1']
                        item['Id_Inter2_2'] = item2['Id_Inter2']
                        item['Id_Inter3_2'] = item2['Id_Inter3']
                        item['Id_TpsCumule_2'] = item2['Id_TpsCumule']
                        item["Id_FinishTime"] = 99999999999
                        item["Id_Inter1Time"] = 99999999999
                        item["Id_Inter2Time"] = 99999999999
                        item["Id_Inter3Time"] = 99999999999
                        

                        
                        if "_Status" in item['Id_Image'] or "_Status" in item2['Id_Image']: 
                            item['Id_Status'] = 1
                        else:
                            item['Id_Status'] = 0
                            
    #                    if "&nbsp;" in item['Id_Groupe']: 
    #                        item['Id_Groupe'] = ''


                        if "l" in item['Id_Groupe'] or "l" in item2['Id_Groupe']: 
                            item['leader'] = 1
                        else:
                            item['leader'] = 0

                            
                        item["single"] = 0;
                        if "s" in item['Id_Groupe']: 
                            item['Id_Groupe'] = item['Id_Groupe'].replace("s", "s1")
                            item['Id_NbTour'] = item['Id_NbTour'] * 2
                            item["Id_FinishTime"] = item["Id_TpsCumule"]
                            item["Id_Inter1Time"] = item["Id_Inter1"]
                            item["Id_Inter2Time"] = item["Id_Inter2"]
                            item["Id_Inter3Time"] = item["Id_Inter3"]
                            item["single"] = 1;
                            
                        elif "s" in item2['Id_Groupe']: 
                            item['Id_Groupe'] = item['Id_Groupe'].replace("s", "s2")
                            item['Id_NbTour'] = item2['Id_NbTour'] * 2
                            item["Id_FinishTime"] = item2["Id_TpsCumule"]
                            item["Id_Inter1Time"] = item2["Id_Inter1"]
                            item["Id_Inter2Time"] = item2["Id_Inter2"]
                            item["Id_Inter3Time"] = item2["Id_Inter3"]
                            item["single"] = 2;
                        else:
                            item['Id_NbTour'] = item['Id_NbTour'] + item2['Id_NbTour']
                            
                        if "u" in item['Id_Groupe'] and "u" in item2['Id_Groupe']: 
                            item['Id_Groupe'] = item['Id_Groupe'].replace("u", "u3")
                            item['uci'] = 3
                        elif "u" in item['Id_Groupe']: 
                            item['Id_Groupe'] = item['Id_Groupe'].replace("u", "u1")
                            item['uci'] = 1
                        elif "u" in item2['Id_Groupe']: 
                            item['Id_Groupe'] = item['Id_Groupe'].replace("u", "u2")
                            item['uci'] = 2
                        else:
                            item['uci'] = 0

                        if "d" in item['Id_Groupe'] and "d" in item2['Id_Groupe']: 
                            item['Id_Image'] = '_Status10'; # mark DSQ
                            
                        # combine blue, single, leader
                        item['Id_Groupe'] = (item['Id_Groupe'] + item2['Id_Groupe']).replace('dd', 'd').replace('ll', 'l').replace('bb', 'b'); 
                        
                        item['oldBlue'] = 0
                        if "b" in item['Id_Groupe']: 
                            item['oldBlue'] = 1
                        
                        item['blue'] = 0
                        
                        item['Id_Finishblue'] = 0
                        item['Id_Inter1blue'] = 0
                        item['Id_Inter2blue'] = 0
                        item['Id_Inter3blue'] = 0
                        if "s" not in item['Id_Groupe'] and "s" not in item2['Id_Groupe']: 
        # finish
    #                        item['Id_Finishblue'] = 0
                            if (item['Id_TpsCumule'] != '-' and item2['Id_TpsCumule'] != '-'):
                                if item2['Id_TpsCumule'] > item['Id_TpsCumule']:
                                    item['Id_FinishTime'] = item2['Id_TpsCumule']
                                elif item2['Id_TpsCumule'] <= item['Id_TpsCumule']:
                                    item['Id_FinishTime'] = item['Id_TpsCumule']
                            
                                # check 2 minutes diff
                                if abs(item['Id_TpsCumule'] - item2['Id_TpsCumule']) > 120000:
                                    item['Id_Finishblue'] = 1
                                    item['blue'] = 1
                            
                            else:
                                item['Id_FinishTime'] = 99999999999

        # intermediate 1
    #                        item['Id_Inter1blue'] = 0
                            if (item['Id_Inter1'] != '-' and item2['Id_Inter1'] != '-'):
                                if item2['Id_Inter1'] > item['Id_Inter1']:
                                    item['Id_Inter1Time'] = item2['Id_Inter1']
                                elif item2['Id_Inter1'] <= item['Id_Inter1']:
                                    item['Id_Inter1Time'] = item['Id_Inter1']
                            
                                # check 2 minutes diff
                                if abs(item['Id_Inter1'] - item2['Id_Inter1']) > 120000:
                                    item['Id_Inter1blue'] = 1
                            
                            else:
                                item['Id_Inter1Time'] = 99999999999

        # intermediate 2
    #                        item['Id_Inter2blue'] = 0
                            if (item['Id_Inter2'] != '-' and item2['Id_Inter2'] != '-'):
                                if item2['Id_Inter2'] > item['Id_Inter2']:
                                    item['Id_Inter2Time'] = item2['Id_Inter2']
                                elif item2['Id_Inter2'] <= item['Id_Inter2']:
                                    item['Id_Inter2Time'] = item['Id_Inter2']
                            
                                # check 2 minutes diff
                                if abs(item['Id_Inter2'] - item2['Id_Inter2']) > 120000:
                                    item['Id_Inter2blue'] = 1
                            
                            else:
                                item['Id_Inter2Time'] = 99999999999

        # intermediate 3
    #                        item['Id_Inter3blue'] = 0
                            if (item['Id_Inter3'] != '-' and item2['Id_Inter3'] != '-'):
                                if item2['Id_Inter3'] > item['Id_Inter3']:
                                    item['Id_Inter3Time'] = item2['Id_Inter3']
                                elif item2['Id_Inter3'] <= item['Id_Inter3']:
                                    item['Id_Inter3Time'] = item['Id_Inter3']
                            
                                # check 2 minutes diff
                                if abs(item['Id_Inter3'] - item2['Id_Inter3']) > 120000:
                                    item['Id_Inter3blue'] = 1
                            
                            else:
                                item['Id_Inter3Time'] = 99999999999

    # find leaders

                        if item['Id_Status'] == 0 and item["single"] == 0 and "d" not in item['Id_Groupe'] and "b" not in item['Id_Groupe']:
        # finish

                            if item['Id_FinishTime'] < leaderOverall:
                                leaderOverall = item['Id_FinishTime']  
                                leaderFinish['overall'] = [item['Id_Numero'], item['Id_FinishTime']]   
            
                            if item['Id_Categorie'] in leader: 
                                if item['Id_FinishTime'] < leader[item['Id_Categorie']]:
                                    leader[item['Id_Categorie']] = item['Id_FinishTime']  
                                    leaderFinish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_FinishTime']]   
                            else:
                                leader[item['Id_Categorie']] = item['Id_FinishTime']  
                                leaderFinish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_FinishTime']]   
                            
        # intermediate 1

                            if item['Id_Inter1Time'] < i1Overall:
                                i1Overall = item['Id_Inter1Time']  
                                leaderi1Finish['overall'] = [item['Id_Numero'], item['Id_Inter1Time']]   
            
                            if item['Id_Categorie'] in leaderi1: 
                                if item['Id_Inter1Time'] < leaderi1[item['Id_Categorie']]:
                                    leaderi1[item['Id_Categorie']] = item['Id_Inter1Time']  
                                    leaderi1Finish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_Inter1Time']]   
                            else:
                                leaderi1[item['Id_Categorie']] = item['Id_Inter1Time']  
                                leaderi1Finish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_Inter1Time']]   

        # intermediate 2

                            if item['Id_Inter2Time'] < i2Overall:
                                i2Overall = item['Id_Inter2Time']  
                                leaderi2Finish['overall'] = [item['Id_Numero'], item['Id_Inter2Time']]   
            
                            if item['Id_Categorie'] in leaderi2: 
                                if item['Id_Inter2Time'] < leaderi2[item['Id_Categorie']]:
                                    leaderi2[item['Id_Categorie']] = item['Id_Inter2Time']  
                                    leaderi2Finish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_Inter2Time']]   
                            else:
                                leaderi2[item['Id_Categorie']] = item['Id_Inter2Time']  
                                leaderi2Finish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_Inter2Time']]   

        # intermediate 3

                            if item['Id_Inter3Time'] < i3Overall:
                                i3Overall = item['Id_Inter3Time']  
                                leaderi3Finish['overall'] = [item['Id_Numero'], item['Id_Inter3Time']]   
            
                            if item['Id_Categorie'] in leaderi3: 
                                if item['Id_Inter3Time'] < leaderi3[item['Id_Categorie']]:
                                    leaderi3[item['Id_Categorie']] = item['Id_Inter3Time']  
                                    leaderi3Finish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_Inter3Time']]   
                            else:
                                leaderi3[item['Id_Categorie']] = item['Id_Inter3Time']  
                                leaderi3Finish[item['Id_Categorie']] = [item['Id_Numero'], item['Id_Inter3Time']]   
            
    #        print(leaderFinish)
                                


                        item['mst'] = 0
                        if (item['Id_FinishTime'] != 99999999999 and item['Id_FinishTime'] > MaximumStageTimeMili) or (raceEnded == 1 and item['Id_FinishTime'] == 99999999999):
                            item['Id_FinishTime'] = 99999999999
                            item['Id_Finishblue'] = 1
                            item['mst'] = 1




                        item['Id_Arrow'] = 0

    # gained/lost arrow FIXME, not tested and need display toggle for overall/category, also need to save to next load (need to save positionArray_All_Cat outside the fn)
    # overall
                        if item['Id_Numero'] in positionArray_All_Cat and positionArray_All_Cat['Id_Numero'][0] != 0:
                            if positionArray_All_Cat['Id_Numero'][0] > item['fPosition_Overall']:
                                item["Id_Arrow"] = 4; # up :)
            #                    positionChanged = "gainedPosition";
                            elif positionArray_All_Cat['Id_Numero'][0] < item['fPosition_Overall']:
                                item["Id_Arrow"] = 3; # down :(
            #                    positionChanged = "lostPosition";
    # category
                        if item['Id_Numero'] in positionArray_All_Cat and positionArray_All_Cat['Id_Numero'][1] != 0:
                            if positionArray_All_Cat['Id_Numero'][1] > item['fPosition_Overall']:
                                item["Id_Arrow"] = 44; # up :)
            #                    positionChanged = "gainedPosition";
                            elif positionArray_All_Cat['Id_Numero'][1] < item['fPosition_Overall']:
                                item["Id_Arrow"] = 33; # down :(
            #                    positionChanged = "lostPosition";



                        if "_Status10" in item['Id_Image'] or "_Status10" in item2['Id_Image'] or item['blue'] == 1 or item['oldBlue'] == 1:
                            item['Id_Arrow'] = 10  # DSQ
                        if "_Status5" in item['Id_Image'] or "_Status5" in item2['Id_Image']:
                            item['blue'] = 1  # FIXME
                        if "_Status11" in item['Id_Image'] or "_Status11" in item2['Id_Image']:
                            item['Id_Arrow'] = 11  # DNF
                        if "_Status12" in item['Id_Image'] or "_Status12" in item2['Id_Image']:
                            item['Id_Arrow'] = 12  # DNS
                            item['blue'] = 1  # FIXME
    #                    if "_Status2" in item['Id_Image'] or "_Status2" in item2['Id_Image']:
    #                        item['Id_Arrow'] = 9  # ???
    #                    if raceEnded == 1 and item['Id_FinishTime'] == 99999999999:
    #                        item['Id_Arrow'] = 11  # DNF
    #                    if "_Status" in item['Id_Image'] or "_Status" in item2['Id_Image']:
    #                        item['Id_Arrow'] = 8  # astrix
    #                    if item['Id_penalty'] == 'P':
    #                        item['Id_Arrow'] = 7  # penalty


            
    # calculate gap
            for item in dataAll:
    # finish            
                if item['Id_FinishTime'] != 99999999999 and item['Id_Numero'] != leaderFinish[item['Id_Categorie']][0]:
                    item['Id_Ecart1er'] = millisecondsToTime(item['Id_FinishTime'] - leaderFinish[item['Id_Categorie']][1])
                elif item['Id_FinishTime'] != 99999999999 and item['Id_Numero'] == leaderi1Finish[item['Id_Categorie']][0]:
                    item['Id_Ecart1er'] = 99999999999
                else:
                    item['Id_Ecart1er'] = 99999999999

                if item['Id_FinishTime'] != 99999999999 and item['Id_FinishTime'] != leaderFinish['overall'][1]:
                    item['Id_Ecart1er_Overall'] = millisecondsToTime(item['Id_FinishTime'] - leaderFinish['overall'][1])
                else:
                    item['Id_Ecart1er_Overall'] = 99999999999
    # intermediate 1            
                if item['Id_Inter1Time'] != 99999999999 and item['Id_Numero'] != leaderi1Finish[item['Id_Categorie']][0]:
                    item['Id_Inter1Ecart1er'] = millisecondsToTime(item['Id_Inter1Time'] - leaderi1Finish[item['Id_Categorie']][1])
                elif item['Id_Inter1Time'] != 99999999999 and item['Id_Numero'] == leaderi1Finish[item['Id_Categorie']][0]:
                    item['Id_Inter1Ecart1er'] = 99999999999
                else:
                    item['Id_Inter1Ecart1er'] = 99999999999

                if item['Id_Inter1Time'] != 99999999999 and item['Id_Numero'] != leaderi1Finish['overall'][0]:
                    item['Id_Inter1Ecart1er_Overall'] = millisecondsToTime(item['Id_Inter1Time'] - leaderi1Finish['overall'][1])
                else:
                    item['Id_Inter1Ecart1er_Overall'] = 99999999999
            
    # intermediate 2            
                if item['Id_Inter2Time'] != 99999999999 and item['Id_Numero'] != leaderi2Finish[item['Id_Categorie']][0]:
                    item['Id_Inter2Ecart1er'] = millisecondsToTime(item['Id_Inter2Time'] - leaderi2Finish[item['Id_Categorie']][1])
                elif item['Id_Inter2Time'] != 99999999999 and item['Id_Numero'] == leaderi2Finish[item['Id_Categorie']][0]:
                    item['Id_Inter2Ecart1er'] = 99999999999
                else:
                    item['Id_Inter2Ecart1er'] = 99999999999

                if item['Id_Inter2Time'] != 99999999999 and item['Id_Numero'] != leaderi2Finish['overall'][0]:
                    item['Id_Inter2Ecart1er_Overall'] = millisecondsToTime(item['Id_Inter2Time'] - leaderi2Finish['overall'][1])
                else:
                    item['Id_Inter2Ecart1er_Overall'] = 99999999999
            
    # intermediate 3            
                if item['Id_Inter3Time'] != 99999999999 and item['Id_Numero'] != leaderi3Finish[item['Id_Categorie']][0]:
                    item['Id_Inter3Ecart1er'] = millisecondsToTime(item['Id_Inter3Time'] - leaderi3Finish[item['Id_Categorie']][1])
                elif item['Id_Inter3Time'] != 99999999999 and item['Id_Numero'] == leaderi3Finish[item['Id_Categorie']][0]:
                    item['Id_Inter3Ecart1er'] = 99999999999
                else:
                    item['Id_Inter3Ecart1er'] = 99999999999

                if item['Id_Inter3Time'] != 99999999999 and item['Id_Numero'] != leaderi3Finish['overall'][0]:
                    item['Id_Inter3Ecart1er_Overall'] = millisecondsToTime(item['Id_Inter3Time'] - leaderi3Finish['overall'][1])
                else:
                    item['Id_Inter3Ecart1er_Overall'] = 99999999999
            
    #        print(dataAll)

    # BEGIN sorting
            order = {'Men': 0, 'Women': 1, 'Mixed': 2, 'Masters': 3, 'Grand': 4}

    # intermediate 1
            sortedData = sorted(dataAll, key=itemgetter('Id_Status', 'oldBlue', 'single', 'Id_Inter1blue', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))

            x = 1

            for item in sortedData:
                item['i1Position_Overall'] = x
                x += 1


#            sortedData = sorted(dataAll, key=itemgetter('Id_Categorie', 'Id_Status', 'oldBlue', 'single', 'Id_Inter1blue', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))
            sortedData = sorted(dataAll, key=lambda d:[order[d['Id_Categorie']], d['Id_Categorie'], d['Id_Status'], d['oldBlue'], d['single'], d['Id_Inter1blue'], d['Id_Inter1Time'], d['Id_TpsCumule'], d['Id_TpsCumule_2']])

            x = 1
            c = ''
            y = 1
            
            for item in sortedData:
                if item['Id_Categorie'] == c:
                    x += 1
                else:
                    x = 1
                    c = item['Id_Categorie']

                item['i1Position_Categorie'] = x

    # get the order for display when using category
                item['i1index'] = y
                y += 1

    # intermediate 2
            sortedData = sorted(dataAll, key=itemgetter('Id_Status', 'oldBlue', 'single', 'Id_Inter2blue', 'Id_Inter1blue', 'Id_Inter2Time', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))

            x = 1

            for item in sortedData:
                item['i2Position_Overall'] = x
                x += 1


#            sortedData = sorted(dataAll, key=itemgetter('Id_Categorie', 'Id_Status', 'oldBlue', 'single', 'Id_Inter2blue', 'Id_Inter1blue', 'Id_Inter2Time', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))
            sortedData = sorted(dataAll, key=lambda d:[order[d['Id_Categorie']], d['Id_Categorie'], d['Id_Status'], d['oldBlue'], d['single'], d['Id_Inter2blue'], d['Id_Inter1blue'], d['Id_Inter2Time'], d['Id_Inter1Time'], d['Id_TpsCumule'], d['Id_TpsCumule_2']])

            x = 1
            c = ''
            y = 1
            
            for item in sortedData:
                if item['Id_Categorie'] == c:
                    x += 1
                else:
                    x = 1
                    c = item['Id_Categorie']

                item['i2Position_Categorie'] = x

    # get the order for display when using category
                item['i2index'] = y
                y += 1

    # intermediate 3
            sortedData = sorted(dataAll, key=itemgetter('Id_Status', 'oldBlue', 'single', 'Id_Inter3blue', 'Id_Inter2blue', 'Id_Inter1blue', 'Id_Inter3Time', 'Id_Inter2Time', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))

            x = 1

            for item in sortedData:
                item['i3Position_Overall'] = x
                x += 1


#            sortedData = sorted(dataAll, key=itemgetter('Id_Categorie', 'Id_Status', 'oldBlue', 'single', 'Id_Inter3blue', 'Id_Inter2blue', 'Id_Inter1blue', 'Id_Inter3Time', 'Id_Inter2Time', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))
            sortedData = sorted(dataAll, key=lambda d:[order[d['Id_Categorie']], d['Id_Categorie'], d['Id_Status'], d['oldBlue'], d['single'], d['Id_Inter3blue'], d['Id_Inter2blue'], d['Id_Inter1blue'], d['Id_Inter3Time'], d['Id_Inter2Time'], d['Id_Inter1Time'], d['Id_TpsCumule'], d['Id_TpsCumule_2']])

            x = 1
            c = ''
            y = 1
            
            for item in sortedData:
                if item['Id_Categorie'] == c:
                    x += 1
                else:
                    x = 1
                    c = item['Id_Categorie']
                
                item['i3Position_Categorie'] = x

    # get the order for display when using category
                item['i3index'] = y
                y += 1

    # finish
    # FIXME 'Id_NbTour' making problems, removed for now, need reversing...

            # this sort the 'Id_Categorie' by the defult (probably alphbetic)
#            sortedData = sorted(dataAll, key=itemgetter('Id_Categorie', 'Id_Status', 'blue', 'oldBlue', 'single', 'Id_FinishTime', 'Id_Inter3Time', 'Id_Inter2Time', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))

            # this sort the 'Id_Categorie' by the order we specified in 'order' list
            sortedData = sorted(dataAll, key=lambda d:[order[d['Id_Categorie']], d['Id_Categorie'], d['Id_Status'], d['blue'], d['oldBlue'], d['single'], d['Id_FinishTime'], d['Id_Inter3Time'], d['Id_Inter2Time'], d['Id_Inter1Time'], d['Id_TpsCumule'], d['Id_TpsCumule_2']])

            x = 1
            c = ''
            y = 1
            
            for item in sortedData:
                if item['Id_Categorie'] == c:
                    x += 1
                else:
                    x = 1
                    c = item['Id_Categorie']

                item['fPosition_Categorie'] = x

    # get the order for display when using category
                item['findex'] = y
                y += 1
            
            

            sortedData = sorted(sortedData, key=itemgetter('Id_Status', 'blue', 'oldBlue', 'single', 'Id_FinishTime', 'Id_Inter3Time', 'Id_Inter2Time', 'Id_Inter1Time', 'Id_TpsCumule', 'Id_TpsCumule_2'))

            x = 1

            for item in sortedData:
                item['fPosition_Overall'] = x
                x += 1



    # END sorting

    #        for dic in sortedData:
    #            for val,cal in dic.items():
    #                print(f'{val} is {cal}')
                    


    # export to csv            
            keys = sortedData[0].keys()
            with open(file2, 'w') as output_file:
                dict_writer = csv.DictWriter(output_file, keys)
                dict_writer.writeheader()
                dict_writer.writerows(sortedData)
            
            
            for item in sortedData:
                                
    #            if (item['Id_FinishTime'] != '-' and item['Id_FinishTime'] != 99999999999):
    #                item['Id_FinishTime'] = millisecondsToTime(item['Id_FinishTime'])
    #            if (item['Id_TpsCumule'] != '-' and item['Id_TpsCumule'] != 99999999999):
    #                item['Id_TpsCumule'] = millisecondsToTime(item['Id_TpsCumule'])
    #            if (item['Id_TpsCumule_2'] != '-' and item['Id_TpsCumule_2'] != 99999999999):
    #                item['Id_TpsCumule_2'] = millisecondsToTime(item['Id_TpsCumule_2'])
                    

    # gained/lost arrow, save positions for next load
                positionArray_All_Cat[item['Id_Numero']] = [item['fPosition_Overall'], item['fPosition_Categorie']]

            #print(positionArray_All_Cat)

                if minimize == 1:
                    
                    # change 99999999999 to '-' and mili to time string
                    zeroIt = ['Id_Inter1Time', 'Id_Inter2Time', 'Id_Inter3Time', 'Id_Ecart1er', 'Id_Inter1Ecart1er', 'Id_Inter2Ecart1er', 'Id_Inter3Ecart1er', 'Id_FinishTime', 'Id_TpsCumule', 'Id_TpsCumule_2']
                        
                    for key in zeroIt:

                        if item[key] == 99999999999:
                            item[key] = 0 # '-'
#                        elif '.' not in str(item[key]) and item[key] != 0 and item[key] != '-':
#                            item[key] = millisecondsToTime(item[key])
                        elif '.' in str(item[key]) and item[key] != 0 and item[key] != '-':
                            item[key] = timeToMilliseconds(item[key])
                    
                    # minimize keys
                    mini = [['TT', 'Id_TpsCumule_2'], ['T', 'Id_TpsCumule'], ['PC', 'Id_Position_Categorie'], ['PO', 'Id_Position_Overall'], ['B','blue'], ['NA2', 'Id_Nationalite_2'], ['NA', 'Id_Nationalite'], ['C', 'Id_Categorie'], ['E', 'Id_Ecart1er'], ['Q', 'Id_Equipe'], ['F', 'Id_FinishTime'], ['FB', 'Id_Finishblue'], ['T1', 'Id_Inter1Time'], ['E1', 'Id_Inter1Ecart1er'], ['B1', 'Id_Inter1blue'], ['T2', 'Id_Inter2Time'], ['E2', 'Id_Inter2Ecart1er'], ['B2', 'Id_Inter2blue'], ['T3', 'Id_Inter3Time'], ['E3', 'Id_Inter3Ecart1er'], ['B3', 'Id_Inter3blue'], ['FC', 'fPosition_Categorie'], ['FO', 'fPosition_Overall'], ['FI', 'findex'], ['I1C', 'i1Position_Categorie'], ['I1O', 'i1Position_Overall'], ['I1', 'i1index'], ['I2C', 'i2Position_Categorie'], ['I2O', 'i2Position_Overall'], ['I2', 'i2index'], ['I3C', 'i3Position_Categorie'], ['I3O', 'i3Position_Overall'], ['I3', 'i3index'], ['A', 'Id_Arrow'], ['M', 'Id_Image'], ['M2', 'Id_Image_2'], ['L', 'Id_Classe'], ['G', 'Id_Groupe'], ['P', 'Id_penalty'], ['R', 'Id_NbTour'], ['O', 'Id_Numero'], ['N', 'Id_Nom'], ['N2', 'Id_Nom_2']]
                    
                    for key in mini:
                    
                        if key[1] in item:
                            item[key[0]] = item.pop(key[1])

                    # add missing keys
                    item['P'] = 0 # penalty, not used for now
                    item['PO'] = item['FO']
                    item['PC'] = item['FC']

                    # delete unnecessary keys
                    delKeys = ['Id_Inter1', 'Id_Inter1_2', 'Id_Inter2', 'Id_Inter2_2', 'Id_Inter3', 'Id_Inter3_2', 'Id_Canal', 'Id_Canal_2', 'Id_Numero_Full', 'Id_Numero_Full_2', 'Id_Ecart1er_Categorie', 'Id_Inter1Ecart1er_Categorie', 'Id_Ecart1er_Overall', 'Id_Inter1Ecart1er_Overall','Id_Inter2Ecart1er_Overall','Id_Inter3Ecart1er_Overall', 'Id_Inter3Ecart1er_Categorie', 'Id_Status', 'leader', 'single', 'uci', 'oldBlue']
                        
                    for key in delKeys:

                        if key in item:
                            del item[key]
                    
    #        print(sortedData)
    #        print(leaderi1Finish)
    
    
    # add the header for the json file
            sortedData.insert(0, head)

    # export to json            
            j = json.dumps(sortedData, ensure_ascii=False)
    #        print(j)
            with open(file3, "w", encoding="utf-8") as myfile2: 
                myfile2.write(str(j))    

try:
    while True:
        main()
        time.sleep(30)
except KeyboardInterrupt:
    sys.exit()


     
