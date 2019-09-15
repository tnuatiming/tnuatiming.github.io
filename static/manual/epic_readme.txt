
## raspberry pi ##

using the rpi as local web server, to get results locally and then uploading them to site.

files needed to be modified to the production dir/file names.

make sure the local web server folder (tt) has the latest updates.

master.html and elite_epic.js is on the timing computer, when the page is open in chromium('gc' and 'finish' must be selected) it generate j1.txt json(dont forget to enable). it also generate p3.html for the single day competitors(FIXME - add to python). the python script below sense changes and upload it to the web server. on the web server we have index.html and elite_epic_remote.js that phrase the json and show the results.
for tv, we have tv.html which uses the same elite_epic.js, at least for now.

1. run 'python3 -m http.server' in the local website folder (tt).

2. USE THIS! 'python3 ftp_with_inotify_and_log.py' - this upload j1.txt from /home/pi/Downloads (where chromium saves files) to the web server (check address!)
2a. to upload the p1.html as is use: 'python3 ftp_with_inotify.py' (modify to upload j1.txt) - more updated with log: 'python3 ftp_with_inotify_and_log.py'
2b. to upload the PHRASE p1.html file use: 'python3 ftp_and_phrase_for_rpi.py'
2c. to upload j1.txt after local converting the p1.html use: 'python3 ftp_j1_with_inotify.py'

## rpi settings ##

apple magicpad:
sudo apt-get install xserver-xorg-input-libinput

/etc/X11/xorg.conf.d/40-libinput.conf:

Section "InputClass"
    Identifier "touchpad"
    Driver "libinput"
	MatchIsTouchpad "on"
	Option "Tapping" "on"    
EndSection

## serial connection rs-232

rpi/UART              db-9/USB
-----------------------------------
gpio 15 (RX)        RXD (usually white wire)
gpio 14 (TX)        TXD (usually green wire)
3v3(can be 5v)      VCC (usually red wire)
Ground              GRD (usually black wire)

## static IP ##

sudo service dhcpcd status

In /etc/dhcpcd.conf:

interface eth0
static ip_address=192.168.0.4/24
static routers=192.168.0.1
static domain_name_servers=192.168.0.1

sudo service dhcpcd restart
or
reboot

## wireless ##

sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

network={
    ssid="testing"
    psk="testingPassword"
}


multiple wireless networks:

network={
    ssid="HomeOneSSID"
    psk="passwordOne"
    priority=1
    id_str="homeOne"
}

network={
    ssid="HomeTwoSSID"
    psk="passwordTwo"
    priority=2
    id_str="homeTwo"
}


## option for getting j1.txt using python

python3 live.py


## option for getting j1.txt using python(very slow for now): ## DO NOT USE, TAKES A LOT OF TIME AND NOT COMPLETE SOLUTION!!!

sudo apt-get install python3-pandas

python3 convert_p1_to_json.py


## Elite ##

make sure live settings are pointing to the rpi web server (192.168.0.4, 22, passive, pi, raspberry, /home/pi/tt/liveepic/, use sftp, temp.html, upgrade every 30 sec).

folder name: Migdal Epic Israel
race name day 1: prologue
race name day 2: Stage 1

build classification for epic: 

    (מספר) - Id_Numero
    (שם) - Id_Nom
    (זמן) - Id_TpsCumule
    (הקפות) - Id_NbTour
    (קטגוריה) - Id_Categorie
    (&nbsp;) - Id_Image
    (Nationality) - Id_Nationalite
    (Inter. 1) - Id_Inter1 - intermediate time 1
    (Inter. 2) - Id_Inter2 - intermediate time 2
    (Inter. 3) - Id_Inter3 - intermediate time 3
    (Class) - Id_Classe - mark 1 day competitors ('sf' for Friday and 'ss' for Saturday)
    (Group) - Id_Groupe - add letters as follows: "u" - UCI Rider(convert xls "yes" on UCI colnum to "u" and import into Group), "b" - blue rider, "s" - single Rider, "i" - israeli leader(white shirt), "l" - leader(all other shirts), "d" - DSQ.
    (Team) - Id_Equipe - team name
    (Channel) - Id_Canal - mark "started" for prologue
    (Federation) - Id_Federation - UCI number
    (Id_Perso1) - Custom1 - gender
    
set race settings > others > cycling:

set time precision to "tenth" for prologue ans "second" for rest of stages. MOST IMPORTANT, OTHER WISE TIMING WILL BE WRONG!!!.

after green flag, update flag time, assign to all competitors . alternately, set "assign competitors start time at green flag date time" - need testing.
for prologue, use schedule start.

when importing competitors, make sure to import uci rider as "u" into "Group".

on prologue stage, make sure to have "prologue" in race name as it active the position arrow display (not needed in other stages)

before start of stage, make sure to update "Group" - ("ubsild").
make sure 'MaximumStageTime' set correctly, as it auto finish the day stage.

elite_epic_remote.js - the js to put on the remote server, reads JSON j1.txt. needs to enable in elite_epic.js which run as in between.

riders wont get automatic blue if exceeds 2 minutes separation on intermediate , use status 5 to make the rider blue.
use status 4 to make the rider blue for other resones.
use status 6 to make the rider individual finisher.

### single day ###

Class- mark 1 day competitors: 'sf' for Friday and 'ss' for Saturday.
individual riders must have 'solo' in category.


### status ###

Status3 - blue (exceeds Maximum Stage Time)
Status4 - blue
Status5 - blue (exceeds 2 minutes separation)
Status6 - individual finisher
Status10 - DSQ
Status11 - DNF
Status12 - DNS



## intermediate without Tag server ##

each intermediate time run its own race with mass start (same time as main timing) and finished at the intermediate (ch 4). the results live uploaded to the server (liveepic/{i1-i3}/p1.html) and get combined on the pi. the live only has to have competitor number((מספר) - Id_Numero) , time((זמן) - Id_TpsCumule) and class((Class) - Id_Classe)-not needed (the p1 file is very lean)


## kellner ##

need to use extention on chrome to get data from 3 party due to cors:
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi

make sure "https://www.4sport-services.com/epic2019/out.txt" is enabled

## on epic site ##

our code goes under:  <div class="main_content">
add epic.css to head: <link rel="stylesheet" media="all" type="text/css" href="epic.css">
add id="live" to body tag (maybe not needed)
check if needed #live in the css


## web pages  ##

master management - https://tnuatiming.com/liveepic/master.html (will have csv download on stage end)

master management with kellner - https://tnuatiming.com/liveepic/mastertest.html (will have csv download on stage end)

TV - https://tnuatiming.com/liveepic/tv.html (manual refresh?)

TV total - https://tnuatiming.com/liveepic/tvtotal.html (manual refresh?) to get live total, not implemented yet

live - https://tnuatiming.com/liveepic/index.html and on epic site

prologue - stage3 - https://tnuatiming.com/liveepic/stage.html and on epic site, day stage results (same concept as total), MAKE SURE NO INDIVIDUAL TIME!!!

master total - https://tnuatiming.com/liveepic/mastertotal.html and on epic site (use t1.txt-t4.txt and to update elite_epic_total.js?v=1 after every stage finish, will have csv download on stage end)

totalsingle - https://tnuatiming.com/liveepic/totalsingle.html on epic site, copy of tables generated by mastertotal.html (use publish button or use quick source viewer extension to get the tables, remove "fadeIn" except table tag), per day.

total/overall - https://tnuatiming.com/liveepic/total.html(overall.html) on epic site, can view all days. uses publish box(q1.txt) generated by mastertotal.html

single day - https://tnuatiming.com/liveepic/single.html and on epic site (support added to elite_epic.js as p3.html, remember to enable on master)

prologue start clock - https://tnuatiming.com/liveepic/start.html (computer time must be sync, start every 30 sec)

kiosk - https://tnuatiming.com/liveepic/kiosk.html iterate over categories and gc every 10 sec, show 14 competitors and auto jump to next intermediate/finsh when 3 competitors got there.

results - https://tnuatiming.com/liveepic/results.html - main page with links to all results pages


## daily update, before stage start ##

Id_Groupe

update start time Maximum Stage Time in master (elite_epic_remote.js and elite_epic.js), if possible, update in evning before so count down will be shown on live

elite_epic_total.js?v=1 change version

stages in elite_epic_total.js (auto?)

update t1.txt-t4.txt in ftp_with_inotify_and_log.py (for live total TV)

add t1.txt-t4.txt

"prologue" in race name for day 1

enableJ3 enabled for single day




## after stage finish ##

check on master all intermediate times for missing or blue and update status (status 5 for blue)
check DNF
publish on master to get stage results and cleanResults to get csv
after uploading t1.txt-t4.txt(from j1.txt), publish on mastertotal to get total results and cleanResults to get csv


## testing ##
test.html + testEpic.py will genrate test


## JSON shortcuts ##

all times are in milis

    B = blue; // needed for total
    T = Id_TpsCumule; // finish time rider 1
    TT = Id_TpsCumule_2; // finish time rider 2

    PC = Id_Position_Categorie; // needed only for third party, used to get position according to display needed (intermediate, finish)
    PO = Id_Position_Overall; // needed only for third party, used to get position according to display needed (intermediate, finish)
    
    NA = Id_Nationalite; // nationality 1
    NA2 = Id_Nationalite_2; // nationality 2
    
    C = Id_Categorie; // category
    E = Id_Ecart1er; // gap
    EC = FinishEcart1erCategory; // finish gap in category
    Q = Id_Equipe; // team


    F = Id_FinishTime; // combined time
    FB = Id_Finishblue; // blue board rider
    
    T1 = Id_Inter1Time; // intermediate 1 time
    E1 = Id_Inter1Ecart1er; // intermediate 1 overall gap
    E1C = Inter1Ecart1erCategory; // intermediate 1 gap in category
    B1 = Id_Inter1blue; // intermediate 1 blue
    T2 = Id_Inter2Time;
    E2 = Id_Inter2Ecart1er;
    E2C = Inter2Ecart1erCategory; // intermediate 2 gap in category
    B2 = Id_Inter2blue;
    T3 = Id_Inter3Time;
    E3 = Id_Inter3Ecart1er;
    E3C = Inter3Ecart1erCategory; // intermediate 3 gap in category
    B3 = Id_Inter3blue;

    FC = fPosition_Categorie; // category position at finish
    FO = fPosition_Overall; // overall position at finish
    FI = findex; // order to display by category at finish
    I1C = i1Position_Categorie; // category position at intermediate 1
    I1O = i1Position_Overall; // overall position at intermediate 1
    I1 = i1index; // order to display by category at intermediate 1
    I2C = i2Position_Categorie;
    I2O = i2Position_Overall;
    I2 = i2index;
    I3C = i3Position_Categorie;
    I3O = i3Position_Overall;
    I3 = i3index;

    A = Id_Arrow; // status calculated for display
    M = Id_Image; // status
    M2 = Id_Image_2;

    L = Id_Classe; // mark single day
    G = Id_Groupe; // start status
    P = Id_penalty;

    R = Id_NbTour; // laps

    O = Id_Numero; // combined number
    N = Id_Nom; // name 1
    N2 = Id_Nom_2; // name 2

    
    ## files flow ##
    
p1.html - from elite live > master.html
j1.txt - from master.html (via enable j1) > py > ftp > index.html on epic site / tt live for tv.html
p3.html - from master.html (via enable j3) > py > ftp > single.html on epic site / tt live
t1-4.txt - from master.html (via enable j1) > py(converted j1.txt) > ftp > tt live for tvtotal.html (virtual total standing)
q1-4.txt -from mastertotal.html (via publish box) > total.html on epic site
stageBox.html  - from master.html (via publish box, make sure to diable individual times) > prologue.html, stage1.html...


