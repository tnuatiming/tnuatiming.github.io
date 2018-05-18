<?php include("../password_protect.php"); ?><!--  http://www.zubrag.com/scripts/password-protect.php -->
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he" dir="rtl">

    <head>

        <!-- META -->
       <meta charset="utf-8">
        <title>תנועה מדידת זמנים &middot; הוראות הפעלה</title>
        <meta name="description" content="הוראות הפעלה למערכת מדידת הזמנים" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
 
 <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
  <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/favicon-194x194.png" sizes="194x194">
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
  <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192">
  <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="/manifest.json">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffcc33">
  <meta name="msapplication-TileColor" content="#ffcc33">
  <meta name="msapplication-TileImage" content="/mstile-144x144.png">
  <meta name="theme-color" content="#ffcc33">
  
<style>
a {
    color: blue;
    text-decoration: none;
}
img {
    border: 0;
    max-width: 100%;
    height: auto;
}
.content {
    max-width: 90%;
    margin: 0 auto;
    position: relative;
    min-height: 100%;
    overflow: hidden;
}
ol {
    display: block;
    list-style-type: decimal;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;
}
pre {
    background: #eee;
}
pre, .downloads {
    text-align: left;
    direction: ltr;
}
table {
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto; 
    display: block;
    direction: ltr;
}
tr {
  height: 20px;
}
td, th {
    border: 2px solid #ccc;
    text-align: left;
    padding: 5px 1px;
}
tbody tr:hover { 
    background: yellow;
}
.s0, .s00 {
    font-weight: bold;
    text-align: center;
}
.s01 {
    font-weight: bold;
    color:green;
    text-align: center;
}
.s2 {
    text-align: center;
}
.s11 {
    font-weight: bold;
    color:red;
}
.s33 {
    font-weight: bold;
    color: olive;
}
.strike > td {
    text-decoration-line: line-through;
    color: #ccc;
}
</style>


</head>

<body>
    <div class="content">
    
    <h1 class="c5">הוראות הפעלה</h1>
<ul>    
<li><a href="#C1">תוכנות</a></li>
<li><a href="#C11">הגדרות ראשוניות</a>
<li><a href="#C11_1">טבלת הגדרות לפי מרוץ</a>
    <ul>
    <li><a href="#C11_2">זמן ביינים</a></li>
    </ul>
</li>
<li><a href="#C2">יבוא מתחרים</a>
    <ul>
    <li><a href="#C2_1">הסבת xlsx</a></li>
    </ul>
</li>
<li><a href="#C3">הגדרת CP</a></li>
<li><a href="#C4">היירסקרמבל</a>
    <ul>
    <li><a href="#C4_1">אופציה א</a></li>
    <li><a href="#C4_2">אופציה ב</a></li>
    <li><a href="#C4_3">מדידת זמנים</a></li>
    </ul>
</li>
<li><a href="#C5">ספיישל טסט</a></li>
<li><a href="#C6">מוטוקרוס או הקפות במסלול סגור</a></li>
<li><a href="#C7">live timing</a></li>
<li><a href="#C9">שעון תצוגה</a>
<li><a href="#C80">הדפסת התוצאות</a>
<li><a href="#C13">הגדרות GPRS</a>
<li><a href="#C8">התאמת התוצאות לתצוגה באתר</a>
    <ul>
    <li><a href="#C8_2">אוטומטי</a></li>
    <li><a href="#C8_1">ידני</a></li>
    </ul>
</li>
<li><a href="#C10">לוגואים</a></li>
<li><a href="#C101">תוצאות כקובץ CSV</a></li>
</ul>
<br><br>

<h2 id="C1" class="c4">תוכנות</h2>
    
    <div class="downloads">
    
    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/Msports-Pro-3.0.13-TagHeuer-Pak.exe">Msports-Pro-3.0.13-TagHeuer-Pak.exe</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/Elite3.msi">Elite3.msi (local copy)</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://www.chronelec.com/soft/Elite3.msi">Elite3.msi (latest)</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/GPRS_Interface_v1.2.2.zip">GPRS_Interface_v1.2.2.zip</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/GPRS_Settings.zip">GPRS_Settings.zip</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/HL980Utility.exe">HL980Utility.exe</a></span></p>
    
    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/G_HL980_EN.pdf">G_HL980_EN.pdf</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://www.aten.com/au/en/products/usb-&-thunderbolt/usb-converters/uc232a/">aten-serial-to-usb-UC232A_Windows_Setup.exe(remote)</a></span></p>
    
    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/UC232A_Windows_Setup_V1.0.083.exe">aten-serial-to-usb-UC232A_Windows_Setup.exe(local)</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/aten-serial-to-usb-UC232A_Windows_Setup.exe">aten-serial-to-usb-UC232A_Windows_Setup.exe(old)</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/Circuit-Pro-4.0.02-TagHeuer-Pak.exe">Circuit-Pro-4.0.02-TagHeuer-Pak.exe</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/CP540_EN.pdf">CP540_EN.pdf</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/CP545_EN.pdf">CP545_EN.pdf</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/CP545_USBDriver.zip">CP545_USBDriver.zip</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/EliteV3_User_EN_11-2012.pdf">EliteV3_User_EN_11-2012.pdf</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/Vola_USB_driver.exe">Vola_USB_driver.exe</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://www.chronelec.com/supports/manuals/loop/en/How%20to%20install%20the%20loop%20on%20offroad%20circuit.pdf">How to install the loop on offroad circuit</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://www.chronelec.com/supports/manuals/loop/en/How%20to%20install%20the%20loop%20on%20circuit.pdf">How to install the loop on circuit</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/DecoderSettings.msi">DecoderSettings.msi</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/DecoderSettingsNew.msi">DecoderSettings(New)</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://www.chronelec.com/soft/DecoderSettings.msi">DecoderSettings.msi(latest)</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://tnuatiming.com/software/THCOM08.pdf">Tag Heuer comunication protocol (THCOM08)</a></span></p>

    <p class="c3"><span class="c6"><a class="c2" href="http://www.microsoft.com/en-us/download/details.aspx?id=42643">Microsoft .NET Framework 4.5.2</a></span></p>

    </div>
  
    <h2 id="C11" class="c4">הגדרות ראשוניות</h2>

    <div class="downloads">

    <ol>
    <li>internet connection</li>
    <li>time syncro cp > pc</li>
    <li>CP > impulse time in according to race type</li>

    <li>setting > option</li>
        <ol>
    <li>translate to hebrew<br>
    <pre><code>No.,מספר,center
Name,שם,right
Category,קטגוריה,right
Group,קבוצה,right
Custom1,משפחה,right
Trans. 1,טרנספונדר,right
Driver 1,שם,right
,,
Pos.,מקום,center
Cat. Pos.,מקום,center (זהה לקודם)
Prev. lap pos.,,center (יש להשאיר ריק, משמש לחצים)
Total time,זמן,right
Total laps,הקפות,center
Best lap,הקפה מהירה,right
In lap,בהקפה,center
Lap time,הקפה אחרונה,right
Lap time 1,הקפה 1,right
Lap time 2,הקפה 2,right
Lap time 3,הקפה 3,right
Lap time 4,הקפה 4,right
Lap time 5,הקפה 5,right
Lap time 6,הקפה 6,right
Lap time 7,הקפה 7,right
Lap time 8,הקפה 8,right
Lap time 9,הקפה 9,right
Lap time 10,הקפה 10,right
Lap time 11,הקפה 11,right
Lap time 12,הקפה 12,right
Diff. with leader,פער,right
Diff. with leader cat.,פער,right (זהה לקודם)
Start time,זמן זינוק,right
Total time penelty,עונשין-זמן,right
Total laps penelty,עונשין-הקפות,center
Position penelty,עונשין-מקום,center
Running time,זמן מירוץ,right
Points,נקודות,center
,,
Abbreviation penality / bonnus, P ,left
Abbreviation lap :,הקפות,center
Abbreviation last lap in race :,הקפה אחרונה,center
Abbreviation laps completed :,סיום,center
,,
Status 10,DSQ,center
Status 11,DNF,center
Status 12,DNS,center</code></pre></li>
            <li>live internet setting and test</li>
            <li>timing > photo cell</li>
        </ol>
    <li>setting > stopwatch > set and test</li>
    <li>setting > display panel</li>
    <li>open new event , enter name(type - round - year) and date</li>
    <li>database of event > import competitors from csv/txt file</li>
    <li>right click > folder > new</li>
        <ol>
            <li>place as folder name</li>
            <li>setting > add track name(leave the Distance at 0!)</li>
            <li>edit timing channels to fit race type</li>
            <li>edit printing body > display the best lap (קטגוריה)</li>
            <li>options > enable live internet</li>
            <li>create tamplate</li>
        </ol>
    <li>import competitors to event database</li>
    <li>right click > race> new</li>
        <ol>
            <li>general > race name (category - heat), begin date and callsification on</li>
            <li>options > minimum lap time, auto finish, staggered start, consider the 1st passing as a full lap</li>
            <li>requirements > must cross the finshing line > DNF(status 1)</li>
            <li>import competitors of category</li>
            <li>create tamplate</li>
        </ol>
    <li>remember to enable the live timing after entering an event</li>
    <li>timing</li>
        <ol>
            <li>start procedure</li>
            <li>preferably use only hits from cp</li>
            <li>remember that first lap order not important, last one is!</li>
            <li>finish procedure</li>
        </ol>
    <li>merge/separate races if needed</li>
    <li>print > print the classification > apply sort on competitors > קטגוריה >> choose from template list</li>
    <li>export event if needed</li>
   </ol>
     </div>

   
   <h2 id="C11_1" class="c4">טבלת הגדרות לפי מרוץ</h2>
       
    <h3 id="C11_2" class="c7">זמן ביינים</h3>

    <p class="c0">מגדירים את נקודת ההתחלה ונקודת הסיום. לדוגמא בין הזינוק לנקודה הראשונה. במידה והזינוק הוא starting schedule ורוצים את הזינוק כנקודת ההתחלה אז בוחרים starting schedule כנקודת ההתחלה. ב-timing יש לאפשר intermedate display על מנת שההיטים יופיעו.</p>
    <p class="c1"><span><img alt="hardenduro.png" src="/manual/images/hardenduro.png"></span></p>

<div>
    <table class="waffle" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th class="s00"  rowspan="3">race type</th>
                <th class="s00"  colspan="7">folder settings</th>
                <th class="s00"  colspan="3">race settings</th>
                <th class="s00"  rowspan="3">start procedure</th>
                <th class="s00"  rowspan="3">finish procedure</th>
           </tr>
            <tr>
                <th class="s0"  rowspan="2">type configuration</th>
                <th class="s0"  colspan="3">start loop</th>
                <th class="s0"  colspan="3">finish loop</th>
                <th class="s0"  rowspan="2">classification on</th>
                <th class="s0"  rowspan="2">staggerted start</th>
                <th class="s0"  rowspan="2">consider the 1st passing as full lap</th>
            </tr>
            <tr>
                <th class="s01" >stopwatch</th>
                <th class="s01" >channel</th>
                <th class="s01" >counting lap</th>
                <th class="s01" >stopwatch</th>
                <th class="s01" >channel</th>
                <th class="s01" >counting lap</th>
            </tr>
        </thead>
       <tbody>
            <tr>
                <td class="s11" >motocross</td>
                <td class="s2" >circuit</td>
                <td class="s2" ></td>
                <td class="s2" >starting schedule</td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >total laps</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s1" >green flag near start + cp hit on start(pass), select all competitors and set start time according to hit<br>**</td>
                <td class="s1" >on winner competitor right click > insert flag > finish flag</td>
            </tr>
            <tr>
                <td class="s11" >enduro hare scramble</td>
                <td class="s2" >circuit</td>
                <td class="s2" ></td>
                <td class="s2" >starting schedule</td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >total laps</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s1" >green flag near start + cp hit on start(pass), select all competitors and set start time according to hit<br>**</td>
                <td class="s1" >on first finished competitor after time end right click > insert flag > finish flag</td>
            </tr>
            <tr>
                <td class="s11" >enduro special test</td>
                <td class="s2" >line</td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >4</td>
                <td class="s2" >v</td>
                <td class="s2" >total laps</td>
                <td class="s2" >v</td>
                <td class="s2" ></td>
                <td class="s1" >green flag near first start</td>
                <td class="s1" ></td>
            </tr>
            <tr>
                <td class="s11" >hard enduro</td>
                <td class="s2" >circuit</td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >1</td>
                <td class="s2" >4</td>
                <td class="s2" >v</td>
                <td class="s2" >total laps</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s1" >green flag near start, for each row: cp hit on row start(pass), F11 (duplicate) on hit as number of starters on row, manully enter competitors numbers</td>
                <td class="s1" >on first finished competitor: right click > insert flag > finish flag</td>
            </tr>
            <tr>
                <td class="s11" >superbike/ supermoto</td>
                <td class="s2" >circuit</td>
                <td class="s2" ></td>
                <td class="s2" >starting schedule</td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >total laps</td>
                <td class="s2" ></td>
                <td class="s2" >v</td>
                <td class="s1" >close gate, green flag near start + cp hit on start(pass), open gate after all competitors pass, select all competitors and set start time according to hit<br>**</td>
                <td class="s1" >on winner competitor right click > insert flag > finish flag</td>
            </tr>
            <tr>
                <td class="s11" >rally sprint/ rally/ gymkhana</td>
                <td class="s2" >line</td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >4</td>
                <td class="s2" >v</td>
                <td class="s2" >best lap</td>
                <td class="s2" >v</td>
                <td class="s2" ></td>
                <td class="s1" >green flag near first start</td>
                <td class="s1" ></td>
            </tr>
            <tr>
                <td class="s11" >rally raid/ baja</td>
                <td class="s2" >circuit</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >total laps</td>
                <td class="s2" >v</td>
                <td class="s2" ></td>
                <td class="s1" >green flag near first start</td>
                <td class="s1" ></td>
            </tr>
            <tr>
                <td class="s11" >time attack</td>
                <td class="s2" >circuit</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >best lap</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s1" >green flag near first start</td>
                <td class="s1" ></td>
            </tr>
            <tr>
                <td class="s33" >qualifying</td>
                <td class="s2" >circuit</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >best lap</td>
                <td class="s2" >v</td>
                <td class="s2" ></td>
                <td class="s1" >green flag on session start</td>
                <td class="s1" >on first finished competitor after time end right click > insert flag > finish flag</td>
            </tr>
            <tr class="strike">
                <td class="s1" >superbike/ supermoto</td>
                <td class="s2" >circuit</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s2" >1</td>
                <td class="s2" >1</td>
                <td class="s2" >v</td>
                <td class="s2" >total laps</td>
                <td class="s2" ></td>
                <td class="s2" ></td>
                <td class="s1" >close gate, green flag, open gate after all competitors pass, manual passing &gt; assign passing to all competitors(F10) &gt; fix stopwatch/channel to 1</td>
                <td class="s1" ></td>
            </tr>
        </tbody>
    </table>
</div>

<p class="c0"><span>** יתכן ו-start time לא יופיע בכפתור הימני בעכבר. יש לבחור בתפריט Competitors > Assign starting schedules. יש לבחור start time לפי ההיט, לבחור את כל המתחרים Apply , ctrl-a ולאשר.</span></p>

    <p class="c1"><span><img alt="image991.png" src="/manual/images/image991.png"></span></p>

   <h2 id="C2" class="c4">יבוא מתחרים</h2>
 
    <p class="c0"> מקובץ csv או xls. צריך לכלול לפחות: שם מלא בעמודה יחידה (לא כמו בצילום מתחת) אפשר להשתמש בנוסחה לאיחוד תאים:</p>
    <pre><code> &#61; B1 &#38; &#34; &#34; &#38; C1</code></pre>
    <p> מספר מתחרה(לוודא שאין כפילויות!) וקטגוריה.  יש לשמור את הקובץ כ- encoding utf-8.</p>
  
    <h3 id="C2_1" class="c7">הסבת xlsx</h3>

    <p class="c0"><span><a class="c2" href="https://www.beautifyconverter.com/excel-to-csv-converter.php">https://www.beautifyconverter.com/excel-to-csv-converter.php </a></span></p> 
    </br>
    <p class="c1"><span><img alt="image02.png" src="/manual/images/image02.png"></span></p>
    
    <h2 id="C3" class="c4">הגדרת CP</h2>
   
    <p class="c1"><span><img alt="image17.png" src="/manual/images/image17.png"></span></p>
    
    <p class="c0"><span>יש לבצע test ולבדוק שמתקבלת תשובה כמו בתמונה</span></p>
    
    <h2 id="C4" class="c4">היירסקרמבל</h2>
    
    <p class="c1"><span><img alt="image05.png" src="/manual/images/image05.png"></span></p>
    
    <p class="c1"><span><img alt="image01.png" src="/manual/images/image01.png"></span></p>

    <p class="c1"><span><img alt="image14.png" src="/manual/images/image14.png"></span></p>
        
    <p class="c1"><span><img alt="image18.png" src="/manual/images/image18.png"></span></p>
    
    <p class="c1"><span><img alt="image03.png" src="/manual/images/image03.png"></span></p>

    <p class="c0"><span>ניתן להגדיר auto finish לפי זמן, כדי שיופיע על השעון וב-live timing</span></p>
    
    <p class="c1"><span><img alt="image00.png" src="/manual/images/image00.png"></span></p>
    
    <h3 id="C4_3" class="c7">מדידת זמנים</h3>
    
    <h3 class="c7">זינוק (לא עובד ללא Encoder או CP?)</h3>

    <p class="c0"><span>בזינוק יש ללחוץ על הדגל הירוק, לתת היט ולרשום את זמן הזינוק. יש לבחור את כל המתמודדים (ctrl-a) ,לבחור start time ולהכניס את זמן הזינוק שרשמנו. </span></p>
    
    <p class="c1"><span><img alt="image09.png" src="/manual/images/image09.png"></span></p>
    
    <p class="c1"><span><img alt="image25.png" src="/manual/images/image25.png"></span></p>
        
    <h3 class="c7">סיום</h3>
    
    <p class="c0"><span>כשמסתיים הזמן, יש ללחוץ על דגל השחמט וכל מתחרה שמסיים לאחר מכן מקבל את הזמן הכללי/מספר הקפות הסופי שלו. אם הסיום הוא כשמתחרה מסיים, יש לבחור אותו ו"להכניס" דגל סיום</span></p>

    <h2 id="C5" class="c4">ספיישל טסט</h2>
    
    <p class="c1"><span><img alt="image05.png" src="/manual/images/image05.png"></span></p>
    
    <p class="c1"><span><img alt="image01.png" src="/manual/images/image01.png"></span></p>

    <p class="c0"><span>יש לוודא שבחרנו  line  ו- counting lap מסומן רק בסיום ההקפה</span></p>
    
    <p class="c1"><span><img alt="image04.png" src="/manual/images/image04.png"></span></p>
    
    <p class="c1"><span><img alt="image08.png" src="/manual/images/image08.png"></span></p>
    
    <p class="c1"><span><img alt="image11.png" src="/manual/images/image11.png"></span></p>
    
    <h2 id="C6" class="c4">מוטוקרוס או הקפות במסלול סגור</h2>
    
    <p class="c1"><span><img alt="image22.png" src="/manual/images/image22.png"></span></p>
    
    <p class="c1"><span><img alt="image23.png" src="/manual/images/image23.png"></span></p>

    <p class="c1"><span><img alt="image25.png" src="/manual/images/image25.png"></span></p>

    <h2 id="C7" class="c4">live timing</h2>
        
    <p class="c0">remember to enable the live timing after entering an event</p>
    
    <p class="c1"><span><img alt="image71.png" src="/manual/images/image71.png"></span></p>
 
    <p class="c0">יש לודא ש- remote file שונה מ- index.html</p>

    <p class="c1"><span><img alt="image72.png" src="/manual/images/image72.png"></span></p>
 
    <p class="c0">יש לוודא ששתי שורות ה"מקום" (כללי וקטגוריה), שתיהן צריכות להיות ראשונות. שורת "קטגוריה" צריכה להופיע על מנת שתצוגת הקטוגוריות תופעל. בנוסף, יש לוודא ששורת "פער" (Diff. with leader) ושורת "פער" (Diff. with leader cat) מופיעות. כדי לאפשר את תצוגת ההתקדמות (חצים) יש להוסיף את השדה הריק (Prev. lap pos.).</p>

    <p class="c1"><span><img alt="image73.png" src="/manual/images/image73.png"></span></p>
 
    <p class="c1"><span><img alt="image74.png" src="/manual/images/image74.png"></span></p>
    
    <h2 id="C77" class="c4">live timing(old)</h2>
    
    <p class="c0">remember to enable the live timing after entering an event</p>
    
    <p class="c1"><span><img alt="image07.png" src="/manual/images/image07.png"></span></p>
 
    <p class="c1"><span><img alt="image13.png" src="/manual/images/image13.png"></span></p>
 
    <p class="c1"><span><img alt="image10.png" src="/manual/images/image10.png"></span></p>
 
    <p class="c1"><span><img alt="image12.png" src="/manual/images/image12.png"></span></p>
 
    <p class="c0"><span>הקוד נמצא באתר: <a class="c2" href="http://tnuatiming.com/manual/elite_live.txt">http://tnuatiming.com/manual/elite_live.txt</a> מחולק לשניים.</span></p>
 
    <p class="c1"><span><img alt="image15.png" src="/manual/images/image15.png"></span></p>
  
 <h2 id="C9" class="c7">שעון תצוגה</h2>

    <p class="c0">ניתן להגדיר timinihg out, על מנת לאפשר תצוגה בין מדידות, למשל את time of day.</p>

    <p class="c1"><span><img alt="image26.png" src="/manual/images/image26.png"></span></p>
    
    <h2 id="C80" class="c4">הדפסת התוצאות</h2>

    <p class="c0">folder > settings > edit printing settings > body</p>

    <p class="c1"><span><img alt="image27.png" src="/manual/images/image27.png"></span></p>

    <p class="c1"><span><img alt="image28.png" src="/manual/images/image28.png"></span></p>

    <p class="c1"><span><img alt="image16.png" src="/manual/images/image16.png"></span></p>
    
    <p class="c0">if displaying lap times colmuns, please start with the last lap as it is actually the first...</p>

    <h2 id="C13" class="c4">הגדרות GPRS</h2>

    <p class="c1"><span><img alt="image30.png" src="/manual/images/image30.png"></span></p>

    <h2 id="C8" class="c4">התאמת התוצאות לתצוגה באתר</h2>

    <p class="c1"><span><img alt="image29.png" src="/manual/images/image29.png"></span></p>

    <h3 id="C8_2" class="c7">אוטומטי(דרך האתר)</h3>
    
    <p class="c0"><span><a class="c2" href="http://tnuatiming.com/manual/auto_convert/">http://tnuatiming.com/manual/auto_convert </a> את סעיפים 4,5 יש לוודא תקינות(לאחר ההמרה יש לנקות את השורות הראשונות שאינן נחוצות).</span></p>
    
    <h3 class="c7">אוטומטי(סקריפט)</h3>

    <p class="c0"><span><a class="c2" href="http://tnuatiming.com/manual/csvTohtml.py">http://tnuatiming.com/manual/csvTohtml.py </a>קובץ python המבצע את כל הפעולות(לאחר ההמרה יש לנקות את השורות הראשונות שאינן נחוצות)</span></p>    

    <h3 class="c7">מהלך המרוץ - אוטומטי</h3>

    <p class="c0"><span><a class="c2" href="http://tnuatiming.com/manual/csvTranspose.py">http://tnuatiming.com/manual/csvTranspose.py </a>קובץ python המבצע את כל הפעולות כולל סיבוב הטבלה</span></p>    

    <h3 id="C8_1" class="c7">ידני</h3>

    <p class="c0">יש לבצע את הפעולות לפי הסדר המופיע להלן:</p>
    <ol>
        <li>שימוש באתר <a class="c2" href="http://area23.brightbyte.de/csv2wp.php">http://area23.brightbyte.de/csv2wp.php</a> או <a class="c2" href="http://tnuatiming.com/manual/csv2wp.php">http://tnuatiming.com/manual/csv2wp.php</a> להפוך את ה-csv לטבלת html. יש להוסיף for each cell:  class="rnk_font"
        </li>
        <li>להפוך את כל ה- &lt;tr&gt; ל- &lt;tr class="rnk_bkcolor"&gt;</li>
        <li>להפוך את rnk ל- rnkh בשורה הראשונה(header) של הטבלה</li>
        <li>לשנות את תצוגת הקטגוריה ל-
        <pre><code>
            &lt;tr&gt;&lt;td colspan=99 class="title_font"&gt;  אופנועים  &lt;/td&gt;&lt;/tr&gt;
        &lt;tr class="rnkh_bkcolor"&gt;
            &lt;th class="rnkh_font"&gt;מקום&lt;/th&gt;
            &lt;th class="rnkh_font"&gt;מספר&lt;/th&gt;
            &lt;th class="rnkh_font"&gt;שם&lt;/th&gt;           
            &lt;th class="rnkh_font"&gt;מקצה 1&lt;/th&gt;           
            &lt;th class="rnkh_font"&gt;מקצה 2&lt;/th&gt;           
            &lt;th class="rnkh_font"&gt;מקצה 3&lt;/th&gt;           
            &lt;th class="rnkh_font"&gt;זמן&lt;/th&gt;           
            &lt;th class="rnkh_font"&gt;פער&lt;/th&gt;          
            &lt;th class="rnkh_font"&gt;עונשין&lt;/th&gt;       
        &lt;/tr&gt;
        </code></pre>
        </li>
              <li> יש לתקן תצוגת הקפה מהירה ו-DNF(הוספת class ותיקון טקסט):
        <pre><code>
  
        &lt;tr class="rnk_bkcolor"&gt;
            &lt;td colspan="99" class="subtitle_font">DNS - לא סיים - הקפה 2&lt;/td&gt;
        &lt;/tr&gt;
        
        &lt;tr class="rnk_bkcolor"&gt;
            &lt;td colspan="99" class="comment_font"> הקפה מהירה: (54)  דורון וינטר  - 00:59:16.725&lt;/td&gt;
        &lt;/tr&gt;
        </code></pre>
        </li>

        <li>במידה וחסרים <pre style="width:50px;"><code>&lt;/td&gt;</code></pre> יש להריץ:
        <pre><code>
           sed -i '/&lt;[tT][dD] class="rnk_font"/s/$/&lt;\/td&gt;/g' file.html
        </code></pre>
      או
      
        <pre><code>
           awk '/&lt;td class="rnk_font"/ { gsub(/$/, "&lt;/td&gt;") }; { print }' file.html &gt; file.html
        </code></pre>
        </li>
        <li>בנוסף במידה וחסר בכותרות<pre style="width:50px;"><code>&lt;/td&gt;</code></pre> יש להריץ:
        <pre><code>
           sed -i '/&lt;tr&gt;&lt;td/s/&lt;\/tr&gt;/&lt;\/td&gt;&lt;\/tr&gt;/g' file.html
        </code></pre>
      </li>
      
    </ol>
    במקום סעיפים 6,7 ניתן להשתמש ב-tidy-html5 ולהריץ את הפקודה:  tidy -f error.html -o output.html  -i input.html
    
       <h2 id="C10" class="c7">לוגואים</h2>
 
    <a class="c1" href="http://tnuatiming.com/images/logo.svg"><span><img alt="logo.svg" src="/images/logo.svg"></span></a><br><br>
    <a class="c1" href="http://tnuatiming.com/images/logo2_full.svg"><span><img alt="logo2_full.svg" src="/images/logo2_full.svg"></span></a><br><br>
    <a class="c1" href="http://tnuatiming.com/images/logo2_full_eng.svg"><span><img alt="logo2_full_eng.svg" src="/images/logo2_full_eng.svg"></span></a><br><br>
    <a class="c1" href="http://tnuatiming.com/live/Images/CheckeredFlag.svg"><span><img alt="CheckeredFlag.svg" src="/live/Images/CheckeredFlag.svg"></span></a><br><br>
    <a id="C101" class="c2" href="http://tnuatiming.com/csv/index.html">תוצאות כקובץ CSV</a>
    <p class="c0" style="color: lightgray;"><span>p5f123d7a7e</span></p>
    
    </div>
</body>
</html>
