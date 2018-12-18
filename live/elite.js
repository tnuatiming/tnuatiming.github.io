// 20180518 - array refactoring with all/category toggle, display arrows for position change 
// 20180522 - add fades and competitor info on arrows display 
// 20180523 - add competitor number color/background according to category 
// 20180527 - add message uploading 
// 20180607 - special edition for 2 specials run individually and computation done in live. special 1 live points to: https://tnuatiming.com/live1/livea/p1.html and special 2 live points to: https://tnuatiming.com/live1/liveb/p1.html 
// 20180610 - refactor special edition for 2 specials run individually and computation done in live, added laps time in correct order.  
// 20180703 - added category best lap. added local storage for category or all button.  
// 20180704 - added individual laps best lap (activated by "טסט" in folder name). added penalty indicator. 
// 20180709 - added option for cleaning the results for the results page (activated by "+++" in folder name). 
// 20180903 - added option for harescramble finish. 
// 20181010 - added previous results and race progress ticker. 
// 20181105 - added show penalty time on hover. 
// 20181126 - added show only laps needed for category and split categories to separate tables. 
// 20181203 - added coPilot. 

    
    var harescrambleFinishE = 7200000; // 2 hours
    var harescrambleFinishC = 5400000; // 1.5 hours
    var harescrambleFinishBeginers = 3600000; // 1 hour

    var TimerLoad, TimerChange;
    var MaxNum, Rafraichir, Changement, ClassementReduit, ClassementReduitXpremier;
    var UrlRefresh, UrlChange;
    Rafraichir = 10000;
    Changement = 60000;
    MaxNum = 1;
    ClassementReduit = 1;
    ClassementReduitXpremier = 10;
    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    var lapsArray = []; // array with the previous laps count. updated every Load, used to show the position change arrow between Loads 
    
    var useCategory = "yes";
    
//    var option = "1";  // tickerTest
    
//    var categoryBestTime = {};
//    if (sessionStorage.getItem('categoryBestTime')) {
//        categoryBestTime = JSON.parse(sessionStorage.getItem('categoryBestTime'));
//    }
    var categoryBestTimePrevious = {};
    if (sessionStorage.getItem('categoryBestTimePrevious')) {
        categoryBestTimePrevious = JSON.parse(sessionStorage.getItem('categoryBestTimePrevious'));
    }
    
    var ticker = [];  // tickerTest
    if (sessionStorage.getItem('ticker')) {
        ticker = JSON.parse(sessionStorage.getItem('ticker'));
    }      // tickerTest
    var firstPlace = "";  // tickerTest
    var firstPass = 1;  // tickerTest
    var tickerBestTime = "-";  // tickerTest
    if (sessionStorage.getItem('tickerBestTime')) {
        tickerBestTime = sessionStorage.getItem('tickerBestTime');
    }      // tickerTest
    var eventName = "";  // tickerTest    
    if (sessionStorage.getItem('eventName')) {
        eventName = sessionStorage.getItem('eventName');
    }      // tickerTest
    var flag = "";  // tickerTest    
    if (sessionStorage.getItem('flag')) {
        flag = sessionStorage.getItem('flag');
    }      // tickerTest
    var doNotShowInTicker = [];  // tickerTest 
    if (sessionStorage.getItem('doNotShowInTicker')) {
        doNotShowInTicker = JSON.parse(sessionStorage.getItem('doNotShowInTicker'));
    }      // tickerTest

    
    if (sessionStorage.getItem('useCategory')) {
        useCategory = sessionStorage.getItem('useCategory');
    }    
    
    var tableClass = "fadeIn ";
        
    function category(choice){
        
        positionArray = []; // empting the array as the info inside is incorrect due to canging between position/category position.
        
        useCategory = choice;
        if (useCategory == "yes") {
            sessionStorage.setItem('useCategory', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('useCategory', 'no');
        }

        tableClass = "fadeIn "; // make the table fadeIn on change
        
        Load('p1.html', 'result');
    }

/*
     function Load(url, target) {

        if (useCategory == "yes") {
            document.getElementById("displayCatButton").style.display = "none";        
            document.getElementById("displayAllButton").style.display = "block";        
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").style.display = "block";        
            document.getElementById("displayAllButton").style.display = "none";        
        }

        var xhr;
        var fct;

//        if (UrlChange) url = UrlRefresh;
//        else UrlRefresh = url;
//        UrlChange = 0;

        if (TimerLoad) clearTimeout(TimerLoad);
        
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                document.getElementById(target).innerHTML = createLiveTable(xhr.responseText);
 //           } else {
 //               document.getElementById("categoryOrAll").style.display = "none";
            }
        };
        
    //    xhr.open("GET", url + "?r=" + Math.random(), true);
        xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
        xhr.send(null);
        fct = function() {
            Load(url, target);
        };
        populatePre('uploadMsg.txt','updates'); // upload message
     //   populatePre('previousresults.txt','previousResults'); // upload previousResults
        TimerLoad = setTimeout(fct, Rafraichir);
        Rafraichir = 30000;
    };

    // fn to upload messages
    function populatePre(url, div) {
        var xhr1 = new XMLHttpRequest();
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                document.getElementById(div).innerHTML = xhr1.responseText;
            }
        };
    //    xhr1.open("GET", url + Math.random(), true);
        xhr1.open('GET', url, true);
        xhr1.send();
    };

 */    
    
    async function Load(url, target) {
        
        var loop;
        if (TimerLoad) clearTimeout(TimerLoad);


        if (useCategory == "yes") {
            document.getElementById("displayCatButton").style.display = "none";        
            document.getElementById("displayAllButton").style.display = "block";        
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").style.display = "block";        
            document.getElementById("displayAllButton").style.display = "none";        
        }

/*        await fetch(url, {cache: "no-store"})
        .then(res => res.text())
        .then(data => {
            document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
            document.getElementById(target).innerHTML = createLiveTable(data);
        })
        .catch(rejected => {
            console.log('page unavailable');
        });
*/
        if (self.fetch) {

            try {
                const response = await fetch(url, {cache: "no-store"});
                if (response.ok) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    document.getElementById("center1").style.display = "block"; // if p1.html exist, display race progress
                    document.getElementById(target).innerHTML = createLiveTable(await response.text());
                }
            }
            catch (err) {
                console.log('results fetch failed', err);
            }

            try {
                const response1 = await fetch('uploadMsg.txt', {cache: "no-store"});
                if (response1.ok) {
                    document.getElementById('updates').innerHTML = (await response1.text());
                }
            }
            catch (err) {
                console.log('msg fetch failed', err);
            }

/*            try {
                const response2 = await fetch('previousresults.txt', {cache: "no-store"});
                if (response2.ok) {
                    document.getElementById('previousResults').innerHTML = (await response2.text());
                }
            }
            catch (err) {
                console.log('previous results fetch failed', err);
            }
*/            
        } else {
            var xhr;
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    document.getElementById("center1").style.display = "block"; // if p1.html exist, display race progress
                    document.getElementById(target).innerHTML = createLiveTable(xhr.responseText);
    //           } else {
    //               document.getElementById("categoryOrAll").style.display = "none";
                }
            };
            
        //    xhr.open("GET", url + "?r=" + Math.random(), true);
            xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
            xhr.send(null);

            // upload message
            populatePre('uploadMsg.txt','updates');

            // upload previous results            
        //    populatePre('previousresults.txt','previousResults');
            
        }

/*
        await fetch('uploadMsg.txt', {cache: "no-store"})
        .then(res1 => res1.text())
        .then(data1 => {
            document.getElementById('updates').innerHTML = data1;
        })
        .catch(rejected => {
            console.log('page unavailable');
        });

        await fetch('previousresults.txt', {cache: "no-store"})
        .then(res2 => res2.text())
        .then(data2 => {
            document.getElementById('previousResults').innerHTML = data2;
        })
        .catch(rejected => {
            console.log('page unavailable');
        });
 
 // wait 30 seconds
        await new Promise(resolve => {
            setTimeout(() => {
            Load(url, target);
            }, Rafraichir);
            Rafraichir = 30000;
        });
*/
        loop = function() {
            Load(url, target);
        };

        TimerLoad = setTimeout(loop, Rafraichir);
        Rafraichir = 30000;

    }

    
    // fn to upload messages
    function populatePre(url, div) {
        var xhr1 = new XMLHttpRequest();
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                document.getElementById(div).innerHTML = xhr1.responseText;
            }
        };
    //    xhr1.open("GET", url + Math.random(), true);
   //     xhr1.open('GET', url  + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
        xhr1.open('GET', url, true);
        xhr1.send();
    }


    function createLiveTable(Text) {
         
        var showIndividualLaps = 0;
        var showLapsNumber = 1;
        var showBestLap = 1;
        var showCoPilot = 0;

        var cleanResults = 0; // clean the table for copying to results page

        var specialTest = 0;
        var hareScramble = 0;
        var rallySprint = 0;
        var qualifying = 0;
           
        var b, q, z, f, l, j, g, gg, i, ff, ii;
        var lines;
        var competitorPosition = 0;
        var competitorNumber = 0;
        var competitorLaps = 0;
  //      var qqq = [];
  //      var hhh = [];
  //      var temp = [];
        var hhhPro = [];
        var lineArray = [];
        var allArray = [];
        var bestLapComp = 0;
        var bestLap = "99999999999";
        var BestTimeTemp = "99999999999";
        var bestTime = [];
        var category = "&nbsp;";
        var ttt = 0;
        var pp = 0;
        var positionChanged = "";
        var laps = 6; // number of laps 
        var lapsX = 6;
        var useThis = 0;
        var penalty = 0;
        var linePenalty = 1;
        var showPenalty = 0;
        var categoryPenalty = [];
        var dnfCategory = "";
        var dnsCategory = "";
        var dsqCategory = "";

        Text = Text.split('<table'); // split the text to title/time and the table
        Text[1] = Text[1].substring(Text[1].indexOf("<tr"),Text[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(Text[1]);

        lines = Text[1].split("\n");
        //    console.log(lines.length);
     //   console.log(lines);

        // getting the event/race name from header
        // option 1
        //var HeaderEventName = Text[0].split('png">')[1]; // tickerTest
        //HeaderEventName = HeaderEventName.split("<img src=")[0];  // tickerTest
            // option 2
            // var HeaderName = Text[0].split('-'); // tickerTest
            // var HeaderEventName = HeaderName[0].split(">").pop().trim();  // tickerTest
            // var HeaderRaceName = HeaderName[1].split("<")[0].trim();  // tickerTest
            // HeaderEventName = HeaderEventName + ' - ' + HeaderRaceName;  // tickerTest
        // option 3
        var HeaderName = Text[0].split("\n");  
        var div = document.createElement("div");  
        div.innerHTML = HeaderName[0]; 
        var HeaderEventName = div.textContent || div.innerText || "";  
        var HeaderRaceName = HeaderEventName.split('-')[1].trim();  
        var time = HeaderName[1].split(':');  // tickerTest
        time = ('0' + (time[0].slice(-2)).trim()).slice(-2) + ':' + time[1];  // tickerTest
       // get time - option 2 (local browser time) 
      //  const now = new Date();  // tickerTest
      //  var time = ('0' + now.getHours()).slice(-2)+ ':' + ('0' + now.getMinutes()).slice(-2);  // tickerTest // adding leading 0 if needed
        
     //   categoryBestTimeTemp = {};
    var categoryBestTime = {};


        if (eventName != HeaderEventName) {  
            doNotShowInTicker = [];  // tickerTest
            ticker = [];  // tickerTest
            flag = "";  // tickerTest
            firstPlace = "";  // tickerTest
            tickerBestTime = "-";  // tickerTest
   //         categoryBestTime = {};
            categoryBestTimePrevious = {};
        }
        
        eventName = HeaderEventName;  // tickerTest
        sessionStorage.setItem('eventName', eventName);  // tickerTest
        
            if (Text[0].includes("_GreenFlag")) {   // tickerTest
                if (firstPass == 0 && flag != "green") {
                    ticker.push(time + ' - ' + 'זינוק/דגל ירוק ' + HeaderRaceName);  // tickerTest
                }
                flag = "green";
            } else if (Text[0].includes("_CheckeredFlag")) {
                if (firstPass == 0 && flag != "checkered") {
                    ticker.push(time + ' - ' + 'סיום ' + HeaderRaceName);  // tickerTest
                }
                flag = "checkered";
            } else if (Text[0].includes("_Stop")) {
                if (firstPass == 0 && flag != "checkered") {
                    ticker.push(time + ' - ' + 'סיום');  // tickerTest
                }
                flag = "checkered";
            } else if (Text[0].includes("_RedFlag")) {
                if (firstPass == 0 && flag != "red") {
                    ticker.push(time + ' - ' + 'דגל אדום');  // tickerTest
                }
                flag = "red";
            } else if (Text[0].includes("_YellowFlag")) {
                if (firstPass == 0 && flag != "yellow") {
                    ticker.push(time + ' - ' + 'דגל צהוב');  // tickerTest
                }
                flag = "yellow";
            } else {
                flag = "";
            }  // tickerTest
            

        if (HeaderName[0].includes("טסט") || HeaderName[0].includes("ספיישל")) { // will show individual laps for enduro special test
            specialTest = 1;
            showIndividualLaps = 1;
            showLapsNumber = 0;
        }

        if (HeaderName[0].includes("סקרמבל") || HeaderName[0].includes("הייר")) { // will show finished for enduro hareScramble
            hareScramble = 1;
        }

        if (HeaderName[0].includes("ראלי") && HeaderName[0].includes("ספרינט")) { // will show diffrent colmuns for qualifying
/*           var sheet = document.createElement('style');
            sheet.innerHTML = "#live td.BestTimeOverall {background-color: inherit;color: inherit;font-weight: inherit;} #live td.BestTime {background-color: inherit;color: inherit;font-weight: inherit;}";
            document.body.appendChild(sheet);
*/            rallySprint = 1;
            showBestLap = 0;
        }
                
        if (HeaderName[0].includes("laps")) { // will show individual laps for enduro special test
            var lapsNum = HeaderName[0].substring(HeaderName[0].indexOf("laps")-1,HeaderName[0].indexOf("laps")); // clean the table text
            showIndividualLaps = 1;
            showLapsNumber = 0;
            laps = lapsNum;
            lapsX = lapsNum;
//            showBestLap = 0;
            HeaderEventName = HeaderEventName.replace(lapsNum + "laps", "");
            useThis = 1;
//            Text[0] = Text[0].replace("3laps", "");
/*            var sheet = document.createElement('style');
            sheet.innerHTML = "#live td.BestTimeOverall {background-color: inherit;color: inherit;font-weight: inherit;} #live td.BestTime {background-color: inherit;color: inherit;font-weight: inherit;}";
            document.body.appendChild(sheet);
*/       }

        if (HeaderName[0].includes("דירוג") || HeaderName[0].includes("דרוג")) { // will show diffrent colmuns for qualifying
            qualifying = 1;
            showBestLap = 0;
        }

        if (HeaderName[0].includes("+++")) { // clean table for results page
            cleanResults = 1;
            HeaderEventName = HeaderEventName.replace("+++", "");
        }

        if (HeaderName[0].includes("copilot")) { // clean table for results page
            showCoPilot = 1;
            HeaderEventName = HeaderEventName.replace("copilot", "");
        }
        
        if (HeaderName[0].includes("nobestlap")) { // clean table for results page
            showBestLap = 0;
            HeaderEventName = HeaderEventName.replace("nobestlap", "");
        }
        /*
        if (Text[0].includes("laps")) { // get number of laps, NOT TESTED
            var tempLaps, tempIndex;
            tempIndex = Text[0].indexOf("laps");
            tempLaps = Text[0].substring(tempIndex, tempIndex+6);
            laps = Number(tempLaps.replace("laps", ""));
            Text[0] = Text[0].replace(/laps\d{1,2}/, "");
        }
*/
        var flagText = HeaderName[0].match(/Images\/\s*(.*?)\s*\.png/);
//        console.log(flagText[0]); // Images/_Stop.png
//        console.log(flagText[1]); // _Stop

        var finalText = '<div id="Title"><img class="TitleFlag1" src="' + flagText[0] + '"><h1 id="TitleH1">'+HeaderEventName.replace(" - ", "<br>") + '</h1><img class="TitleFlag2" src="' + flagText[0] + '"></div>'; // clear the finalText variable and add the title and time lines
        
        finalText += HeaderName[1];
        
//        var finalText = Text[0]; // clear the finalText variable and add the title and time lines
        
        for (b = 0; b < lines.length; b++) { 
           
            if (lines[b].includes('<td id="Id_')) {
                var id = (lines[b].substring(lines[b].indexOf(' id="')+4).split('"')[1]);
                var idName = (lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")));
                hhhPro.push(id);
        //        hhh[id] = idName;
       //         temp.push(id,idName);
        //        qqq.push(temp);
         //       temp = [];
            } else if (lines[b].includes("OddRow") || lines[b].includes("EvenRow")) {
                ttt = 1;
            } else if (lines[b].includes("</tr>") && ttt == 1) {
                ttt = 0;
                if (penalty == 1) {
                    categoryPenalty[lineArray["Id_Categorie"]] = 1;
                }
                
                // find category best time
    //            if (showBestLap == 1) {
                    if (typeof categoryBestTime[lineArray["Id_Categorie"]] == 'undefined') {
                        categoryBestTime[lineArray["Id_Categorie"]] = [Number(99999999),"-","-"];
                    }
                    if (categoryBestTime[lineArray["Id_Categorie"]][0] > timeString2ms(lineArray["Id_MeilleurTour"]) && lineArray["Id_MeilleurTour"] != "-" && lineArray["Id_Categorie"] != "&nbsp;") {
                        categoryBestTime[lineArray["Id_Categorie"]] = [Number(timeString2ms(lineArray["Id_MeilleurTour"])),lineArray["Id_Numero"],lineArray["Id_Nom"]];
/*                        
                        if (Object.keys(categoryBestTime).length > 1 && useCategory == "yes" && lineArray["Id_Categorie"] != "&nbsp;" && lineArray["Id_Nom"] != "???" && firstPass == 0) {  // tickerTest show best time in category in race progress
                            ticker.push(time + ' - ' + lineArray["Id_Nom"] + ' (' + lineArray["Id_Numero"] + ') הקפה מהירה בקטגוריה ' + lineArray["Id_Categorie"] + ' - <span dir="ltr">' + lineArray["Id_MeilleurTour"] + '</span>');  // tickerTest
                        }  // tickerTest
*/                        
                    }
 
                if (BestTimeTemp > timeString2ms(lineArray["Id_MeilleurTour"])) {
                    BestTimeTemp = timeString2ms(lineArray["Id_MeilleurTour"]);
                }
                    
                    
//               }
                allArray.push(lineArray); 
                lineArray = [];
                pp = 0;
                penalty = 0;
            } else if (lines[b].includes("<td ") && ttt == 1) {
    //            lineArray["Id_Ecart1erCategorie"] = '-';
    //            lineArray["Id_Image"] = '-';
                linePenalty = 0;

                if (lines[b].includes("(C)")) {
                    penalty = 1;
                    linePenalty = 1;
                    showPenalty = 1;
                }
                // for penalty in cell
                if (hhhPro[pp] == "Id_Position" || hhhPro[pp] == "Id_NbTour" || hhhPro[pp] == "Id_TpsCumule") {
                    var fff = hhhPro[pp] + '_Penalty';
                    if (linePenalty == 1) {
                        lineArray[fff] = 1;
                    } else {
                        lineArray[fff] = 0;
                    }
                }

                if (hhhPro[pp] == "Id_Ecart1erCategorie" || hhhPro[pp] == "Id_Ecart1er") {
                    lines[b] = lines[b].replace(">1 הקפות<", ">1 הקפה<"); 
                }
                
                if ((typeof lines[b] != 'undefined') && (cleanResults == 1)) {
                    lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", ""); // replace "" with "P " when penalty shown on Id_Arrow
                } else if (typeof lines[b] != 'undefined') {
                    lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");
                } else {
                    lineArray[hhhPro[pp]] = "-";
                }
                
                if (lines[b].includes("BestTimeOverall") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime[lineArray["Id_Numero"]] = " BestTimeOverall";
                    
/*                    if (tickerBestTime != lineArray["Id_TpsTour"]) {  // tickerTest
                        tickerBestTime = lineArray["Id_TpsTour"];  // tickerTest
                        ticker.push(time + ' - ' + lineArray["Id_Nom"] + ' (' + lineArray["Id_Numero"] + ') הקפה מהירה במקצה ' + tickerBestTime);  // tickerTest
                    }  // tickerTest
        console.log(tickerBestTime);
*/                } else if  (lines[b].includes("BestTime") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime[lineArray["Id_Numero"]] = " BestTime";
                } else if  (hhhPro[pp] == "Id_TpsTour") {
                    bestTime[lineArray["Id_Numero"]] = "";
                }
                
                // fix category not defined
                if (hhhPro[pp] == "Id_Categorie" && (lineArray[hhhPro[pp]] == "-" || lineArray[hhhPro[pp]] == "" || lineArray[hhhPro[pp]] == "&nbsp;" || typeof lineArray[hhhPro[pp]] == 'undefined')) {
                    lineArray[hhhPro[pp]] = "&nbsp;";   
                }

                // find best lap overall
                if (showIndividualLaps == 1) {
                
                    if (hhhPro[pp] == "Id_TpsTour1" || hhhPro[pp] == "Id_TpsTour2" || hhhPro[pp] == "Id_TpsTour3" || hhhPro[pp] == "Id_TpsTour4" || hhhPro[pp] == "Id_TpsTour5" || hhhPro[pp] == "Id_TpsTour6") {
                        if (lineArray[hhhPro[pp]] != "-" && timeString2ms(lineArray[hhhPro[pp]]) <= timeString2ms(bestLap)) {
                        bestLap = lineArray[hhhPro[pp]];
                        bestLapComp = lineArray["Id_Numero"];
                        }
                    }
                }
                
                pp += 1;
      //    console.log(lineArray);

            }
            
        }

 /*          
  // tickerTest
var randomComp = Math.floor((Math.random() * (allArray.length)) + 1);  // tickerTest
switch(option) {  // tickerTest
    case "1":
        ticker.push(time + ' - ' + 'מתחרה מספר ' + allArray[randomComp]["Id_Numero"] + ' נמצא במקום ' + allArray[randomComp]["Id_Position"]);  // tickerTest
        option = "2";
        break;
    case "2":
        ticker.push(time + ' - ' + 'מתחרה מספר ' + allArray[randomComp]["Id_Numero"] + ' הקפה מהירה במקצה ' + allArray[randomComp]["Id_MeilleurTour"]);  // tickerTest
        option = "3";
        break;
    case "3":
        ticker.push(time + ' - ' + 'דגל אדום');  // tickerTest
        option = "4";
        break;
    case "4":
        ticker.push(time + ' - ' + allArray[randomComp]["Id_Nom"] + ' (' + allArray[randomComp]["Id_Numero"] + ') עבר למקום הראשון!');  // tickerTest
        option = "5";
        break;
    case "5":
        ticker.push(time + ' - ' + 'מתחרה מספר ' + allArray[randomComp]["Id_Numero"] + ' פרש');  // tickerTest
        option = "1";
        break;
}  // tickerTest
*/
           
           // MAGIC sort the array after the merge to get new results
        if (useCategory == "yes" && HeaderName[0].includes("אנדורו")) { // this sort discreminate aginst empty category so it shown last
            allArray.sort(function(a, b){return (a.Id_Categorie == "&nbsp;")-(b.Id_Categorie == "&nbsp;") || (b.Id_Categorie.includes("מקצועית"))-(a.Id_Categorie.includes("מקצועית")) || (b.Id_Categorie.includes("עממית"))-(a.Id_Categorie.includes("עממית")) || (b.Id_Categorie.includes("סניורים"))-(a.Id_Categorie.includes("סניורים")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_PositionCategorie - b.Id_PositionCategorie});
        } else if (useCategory == "yes") { // this sort discreminate aginst empty category so it shown last
            allArray.sort(function(a, b){return (a.Id_Categorie == "&nbsp;")-(b.Id_Categorie == "&nbsp;") || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_PositionCategorie - b.Id_PositionCategorie});
        } 
    //    if (useCategory == "yes") {
    //        allArray.sort(function(a, b){return a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_PositionCategorie - b.Id_PositionCategorie});
    //    }
                   
        if (useCategory == "no") {
            finalText += '\n<div id="liveTable"><table class="' + tableClass + 'line_color">\n';
        } else {

            finalText += '\n<div id="liveTable">\n';
        }           
            for (l = 0; l < allArray.length; l++) {



                
/*                
 // best time
    var categoryTemp = allArray[l]["Id_Categorie"];
    if (typeof categoryBestTimeTemp[categoryTemp] == "undefined" && allArray[l]["Id_MeilleurTour"] != "-") {
        categoryBestTimeTemp[categoryTemp] = timeString2ms(allArray[l]["Id_MeilleurTour"]);
    } else if (timeString2ms(allArray[l]["Id_MeilleurTour"]) < categoryBestTimeTemp[categoryTemp] && allArray[l]["Id_MeilleurTour"] != "-") {
        categoryBestTimeTemp[categoryTemp] = timeString2ms(allArray[l]["Id_MeilleurTour"]);
    }
               
*/     
                
                
                
                
                            if (useCategory == "no" && allArray[l]["Id_Ecart1er"] != "-") { // clean diff   

                                     if (allArray[l]["Id_Ecart1er"].toString().substring(0, 3) == "00:") {
                                        allArray[l]["Id_Ecart1er"] = allArray[l]["Id_Ecart1er"].substr(3);
                                    }
                                    if (allArray[l]["Id_Ecart1er"].toString().substring(0, 1) == "0" && allArray[l]["Id_Ecart1er"].includes(":")) {
                                        allArray[l]["Id_Ecart1er"] = allArray[l]["Id_Ecart1er"].substr(1);
                                    }
                            }
                 
                            if (useCategory == "yes" && allArray[l]["Id_Ecart1erCategorie"] != "-") { // clean diff 

                                     if (allArray[l]["Id_Ecart1erCategorie"].toString().substring(0, 3) == "00:") {
                                        allArray[l]["Id_Ecart1erCategorie"] = allArray[l]["Id_Ecart1erCategorie"].substr(3);
                                    }
                                    if (allArray[l]["Id_Ecart1erCategorie"].toString().substring(0, 1) == "0" && allArray[l]["Id_Ecart1erCategorie"].includes(":")) {
                                        allArray[l]["Id_Ecart1erCategorie"] = allArray[l]["Id_Ecart1erCategorie"].substr(1);
                                    }
                            }
                 
                            if (typeof allArray[l]["Id_TpsCumule"]  != 'undefined' && allArray[l]["Id_TpsCumule"] != "-") { // clean total time  

                                
                                if (allArray[l]["Id_TpsCumule"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_TpsCumule"] = allArray[l]["Id_TpsCumule"].substr(3);
                                }
                                if (allArray[l]["Id_TpsCumule"].toString().substring(0, 1) == "0" && allArray[l]["Id_TpsCumule"].includes(":")) {
                                    allArray[l]["Id_TpsCumule"] = allArray[l]["Id_TpsCumule"].substr(1);
                                }
                                
                            }


                            
                            
                       // reorder laps as elite3 does somthing wrong with the order 
                 if (allArray[l]["Id_TpsTour1"] && showIndividualLaps == 1) { 

                    g = laps; // number of laps
                    for (gg = g; gg > -1; gg--) { 

                        if ((allArray[l]["Id_TpsTour"+gg] && allArray[l]["Id_TpsTour"+gg] != "-") || gg == 0) {
                                
                            ff = gg;
                            for (z = 1; z <= g; z++)  {
                                
                                if (ff > 0) {
                                    allArray[l]["Id_lap"+z] = allArray[l]["Id_TpsTour"+ff];
                                } else {
                                    allArray[l]["Id_lap"+z] = "-";
                                }
                 
                                ff--; 
                            }     
                
                            gg = -1;
                        } 
                    }
                     
                     
 /*                     
                     
                    if (allArray[l]["Id_TpsTour6"] && allArray[l]["Id_TpsTour6"] != "-") {
                        allArray[l].Id_lap1 = allArray[l]["Id_TpsTour6"];
                        allArray[l].Id_lap2 = allArray[l]["Id_TpsTour5"];
                        allArray[l].Id_lap3 = allArray[l]["Id_TpsTour4"];
                        allArray[l].Id_lap4 = allArray[l]["Id_TpsTour3"];
                        allArray[l].Id_lap5 = allArray[l]["Id_TpsTour2"];
                        allArray[l].Id_lap6 = allArray[l]["Id_TpsTour1"];
                    } else if (allArray[l]["Id_TpsTour5"] && allArray[l]["Id_TpsTour5"] != "-") {
                        allArray[l].Id_lap1 = allArray[l]["Id_TpsTour5"];
                        allArray[l].Id_lap2 = allArray[l]["Id_TpsTour4"];
                        allArray[l].Id_lap3 = allArray[l]["Id_TpsTour3"];
                        allArray[l].Id_lap4 = allArray[l]["Id_TpsTour2"];
                        allArray[l].Id_lap5 = allArray[l]["Id_TpsTour1"];
                        allArray[l].Id_lap6 = "-";
                    }  else if (allArray[l]["Id_TpsTour4"] && allArray[l]["Id_TpsTour4"] != "-") {
                        allArray[l].Id_lap1 = allArray[l]["Id_TpsTour4"];
                        allArray[l].Id_lap2 = allArray[l]["Id_TpsTour3"];
                        allArray[l].Id_lap3 = allArray[l]["Id_TpsTour2"];
                        allArray[l].Id_lap4 = allArray[l]["Id_TpsTour1"];
                        allArray[l].Id_lap5 = "-";
                        allArray[l].Id_lap6 = "-";
                    }  else if (allArray[l]["Id_TpsTour3"] && allArray[l]["Id_TpsTour3"] != "-") {
                        allArray[l].Id_lap1 = allArray[l]["Id_TpsTour3"];
                        allArray[l].Id_lap2 = allArray[l]["Id_TpsTour2"];
                        allArray[l].Id_lap3 = allArray[l]["Id_TpsTour1"];
                        allArray[l].Id_lap4 = "-";
                        allArray[l].Id_lap5 = "-";
                        allArray[l].Id_lap6 = "-";
                    }  else if (allArray[l]["Id_TpsTour2"] && allArray[l]["Id_TpsTour2"] != "-") {
                        allArray[l].Id_lap1 = allArray[l]["Id_TpsTour2"];
                        allArray[l].Id_lap2 = allArray[l]["Id_TpsTour1"];
                        allArray[l].Id_lap3 = "-";
                        allArray[l].Id_lap4 = "-";
                        allArray[l].Id_lap5 = "-";
                        allArray[l].Id_lap6 = "-";
                    } else if (allArray[l]["Id_TpsTour1"] != "-") {
                        allArray[l].Id_lap1 = allArray[l]["Id_TpsTour1"];
                        allArray[l].Id_lap2 = "-";
                        allArray[l].Id_lap3 = "-";
                        allArray[l].Id_lap4 = "-";
                        allArray[l].Id_lap5 = "-";
                        allArray[l].Id_lap6 = "-";
                    } else {
                        allArray[l].Id_lap1 = "-";
                        allArray[l].Id_lap2 = "-";
                        allArray[l].Id_lap3 = "-";
                        allArray[l].Id_lap4 = "-";
                        allArray[l].Id_lap5 = "-";
                        allArray[l].Id_lap6 = "-";
                    }
 */
                     
                }            
                            
            if (specialTest == 1 && useCategory == "yes" && useThis == 0) {
                if (allArray[l]["Id_Categorie"].includes("מקצועית")) {
                    lapsX = 6;
                } else if (allArray[l]["Id_Categorie"].includes("סניורים") || allArray[l]["Id_Categorie"].includes("עממית") || allArray[l]["Id_Categorie"].includes("ג'וניור מקצועי")) {
                    lapsX = 5;
                } else if (allArray[l]["Id_Categorie"].includes("מתחילים") || allArray[l]["Id_Categorie"].includes("סופר ג'וניור")) {
                    lapsX = 4;
                } else {
                    lapsX = 6;
                }                
            }

            if (cleanResults == 1) {
                var slim = "";
            } else {
                var slim = " slim";
            }
            
            if ((allArray[l]["Id_Position"] == 1 && useCategory == "no") || (allArray[l]["Id_PositionCategorie"] == 1 && useCategory == "yes")) {                   
                                                            
                var headerText1 = '<tr class="rnkh_bkcolor">\n';

    //     for (b = 0; b < qqq.length; b++) { 
    //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
    //             temp.push(b);
    //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>\n';
    //         }
    //     }          

        // semi hard coded header

                if (cleanResults == 0) {
                    headerText1 += '<th colspan = "2" class="rnkh_font">&nbsp;&nbsp;מקום&nbsp;&nbsp;</th>\n'; //  Id_Arrow
                } else {
                    headerText1 += '<th class="rnkh_font">מקום</th>\n'; //  Id_Position
                }
                headerText1 += '<th class="rnkh_font">מספר</th>\n'; // Id_Numero
                
        // NOT using aria popup for נווט 
                if (showCoPilot == 1 && typeof allArray[l]["Id_Licence"] != 'undefined') {
                    if (allArray[l]["Id_Categorie"].includes('אופנועים') && useCategory == "yes") {
                        headerText1 += '<th class="rnkh_font">שם</th>\n'; // Id_Nom
                    } else {
                        headerText1 += '<th class="rnkh_font">נהג</th>\n'; // Id_Nom
                        headerText1 += '<th class="rnkh_font">נווט</th>\n'; // Id_Licence
                    }
                } else {
                    headerText1 += '<th class="rnkh_font">שם</th>\n'; // Id_Nom
                }
/*
        // using aria popup for נווט 
                if (showCoPilot == 1 && typeof allArray[l]["Id_Licence"] != 'undefined' && cleanResults == 1) {
                    if (allArray[l]["Id_Categorie"].includes('אופנועים') && useCategory == "yes") {
                        headerText1 += '<th class="rnkh_font">שם</th>\n'; // Id_Nom
                    } else {
                        headerText1 += '<th class="rnkh_font">נהג</th>\n'; // Id_Nom
                        headerText1 += '<th class="rnkh_font">נווט</th>\n'; // Id_Licence
                    }
                } else {
                    headerText1 += '<th class="rnkh_font">שם</th>\n'; // Id_Nom
                }
*/
                
                if (showLapsNumber == 1 && rallySprint == 0) {
                    headerText1 += '<th class="rnkh_font">הקפות</th>\n'; // Id_NbTour
                }
                
                if (showIndividualLaps == 1 && allArray[l]["Id_lap1"]) {
                    
                    for (j = 1; j <= lapsX; j++) {
                //      headerText1 += '<th class="rnkh_font Id_lap' + j + '">הקפה ' + j + '</th>\n';
                        headerText1 += '<th class="rnkh_font">הקפה ' + j + '</th>\n';
                    }
    /*                
                    headerText1 += '<th class="rnkh_font Id_lap1">הקפה 1</th>\n';
                    headerText1 += '<th class="rnkh_font Id_lap2">הקפה 2</th>\n';
                    headerText1 += '<th class="rnkh_font Id_lap3">הקפה 3</th>\n';
                    headerText1 += '<th class="rnkh_font Id_lap4">הקפה 4</th>\n';
                    headerText1 += '<th class="rnkh_font Id_lap5">הקפה 5</th>\n';
                    headerText1 += '<th class="rnkh_font Id_lap6">הקפה 6</th>\n';
    */
                } else {
                    if (cleanResults == 0) {
                        headerText1 += '<th class="rnkh_font">הקפה אחרונה</th>\n'; //  Id_TpsTour
                    }
                    headerText1 += '<th class="rnkh_font">הקפה מהירה</th>\n'; // Id_MeilleurTour
                }
                
                if (qualifying == 0 && rallySprint == 0) {
                    headerText1 += '<th class="rnkh_font">זמן</th>\n'; // Id_TpsCumule
                }

                if (cleanResults == 1 && ((showPenalty == 1 && useCategory == "no") || (categoryPenalty[allArray[l]["Id_Categorie"]] == 1 && useCategory == "yes"))) {
                    headerText1 += '<th class="rnkh_font">עונשין</th>\n'; // Id_PenaliteTpsCumule
                }
                
                if (useCategory == "yes") {
                    headerText1 += '<th class="rnkh_font">פער</th>\n'; // Id_Ecart1erCategorie
                } else if (useCategory == "no") {
                    headerText1 += '<th class="rnkh_font">פער</th>\n'; // Id_Ecart1er
                }

            
                headerText1 += '</tr>';
        //   console.log(headerText1);
        //          console.log(temp);

            }        

            if (allArray[l]["Id_Position"] == 1) {   // tickerTest
                if (firstPass == 1 && (HeaderName[0].includes("_GreenFlag") || HeaderName[0].includes("_CheckeredFlag"))) {
                    firstPlace = allArray[l]["Id_Numero"];  // tickerTest
                }

                if (firstPlace != allArray[l]["Id_Numero"] && allArray[l]["Id_NbTour"] > 0 && (HeaderName[0].includes("_GreenFlag") || HeaderName[0].includes("_CheckeredFlag"))) {
                    firstPlace = allArray[l]["Id_Numero"];  // tickerTest
                    ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') עבר למקום הראשון!');  // tickerTest
                }  // tickerTest
                    
            }  // tickerTest


// position change arrow prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;
                    allArray[l]["Id_Arrow"] = "&#9670;";
                    
                    var dnsfq = "";
                    if (allArray[l]["Id_Image"].includes("_Status10")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">';
                        dnsfq = "נפסל";
                        if (!doNotShowInTicker.includes(allArray[l]["Id_Numero"])) {  // tickerTest
                            ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') נפסל');  // tickerTest
                            doNotShowInTicker.push(allArray[l]["Id_Numero"]);  // tickerTest
                        }  // tickerTest
 
                    } else if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image"] == '_Status1') {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">';
                        dnsfq = "לא סיים";
                        if (!doNotShowInTicker.includes(allArray[l]["Id_Numero"])) {  // tickerTest
                            ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') פרש');  // tickerTest
                            doNotShowInTicker.push(allArray[l]["Id_Numero"]);  // tickerTest
                        }  // tickerTest
 
                    } else if (allArray[l]["Id_Image"].includes("_Status12")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dns.svg" alt="dns">';
                        dnsfq = "לא התחיל";
                    } else if (allArray[l]["Id_Image"].includes("_Status2")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_nq.svg" alt="nq">';
                        dnsfq = "ללא דירוג";
                    } else if (allArray[l]["Id_Image"].includes("_Status")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_status.svg" alt="status">'; // astrix
           //         } else if (allArray[l]["Id_penalty"].includes("P")) {
           //             allArray[l]["Id_Arrow"] = "P"; // penalty
                    } else {
                            allArray[l]["Id_Arrow"] = "&#9670;"; // BLACK DIAMOND
                    }
                          
                          
                    if (allArray[l]["Id_Position"] && useCategory == "no") { 
                            competitorPosition = Number(allArray[l]["Id_Position"]);  // get the position value and clean penalty indicator
                    }
                    if (allArray[l]["Id_PositionCategorie"] && useCategory == "yes") { 
                            competitorPosition = Number(allArray[l]["Id_PositionCategorie"]);  // get the position value and clean penalty indicator
                    }

                    positionChanged = "";
                    
                    if (competitorPosition > 0 && competitorNumber >= 0 && (allArray[l]["Id_TpsTour"] != "-" || allArray[l]["Id_NbTour"] > 0 || allArray[l]["Id_Image"].includes("_TrackPassing"))) { // position change arrow calc
                    
                        if (positionArray[competitorNumber] && (allArray[l]["Id_NbTour"] > 0 || (qualifying == 1 && allArray[l]["Id_TpsTour"] != "-"))) {

                            if (positionArray[competitorNumber] < competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'; // down :(
                                positionChanged = "lostPosition ";
                 //               ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') ירד למקום ' + competitorPosition);  // tickerTest
                            } else if (positionArray[competitorNumber] > competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'; // up :)
                                positionChanged = "gainedPosition ";
                                
                                if (useCategory == "no" && competitorPosition > 1 && allArray[l]["Id_Nom"] != "???" && allArray[l]["Id_Position"] <= 3) {  // tickerTest
                                ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') עלה למקום ' + competitorPosition);  // tickerTest
                                } else if (Object.keys(categoryBestTime).length > 1 && useCategory == "yes" && allArray[l]["Id_Nom"] != "???" && allArray[l]["Id_PositionCategorie"] <= 3 && allArray[l]["Id_Categorie"] != "undefined") {
                                ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') עלה למקום ' + competitorPosition + ' בקטגוריה ' + allArray[l]["Id_Categorie"]);  // tickerTest
                                } else if (useCategory == "yes" && allArray[l]["Id_Nom"] != "???" && allArray[l]["Id_PositionCategorie"] <= 3 && allArray[l]["Id_Categorie"] != "undefined") {
                                ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') עלה למקום ' + competitorPosition);  // tickerTest
                                }// tickerTest
                            }
                        }
                        // console.log("competitorNumber: " + competitorNumber + ",competitorPosition: " + competitorPosition + ", positionArray:" + positionArray[competitorNumber]);
                        positionArray[competitorNumber] = competitorPosition;// update array with current position for next Load calc
                    }
       
        // blink the competitor line when change

                if (allArray[l]["Id_NbTour"]) {
                    competitorLaps = allArray[l]["Id_NbTour"]; 
                
                    if (competitorLaps != lapsArray[competitorNumber] && positionChanged == "" && firstPass == 0) { 
                        
                        positionChanged = "unChanged "; // blink the competitor line                       
                    }
                    
                    lapsArray[competitorNumber] = competitorLaps;// update array with current laps count for next Load calc
                }
       
       // mark on track
                if ((positionChanged == "" || positionChanged == "unChanged ") && (allArray[l]["Id_Image"].includes("_TrackPassing") || allArray[l]["Id_Canal"] == "1") && !(allArray[l]["Id_Image"].includes("_Status"))) {
                    allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'; // same :|
           //         allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'+allArray[l]["Id_penalty"]; // same :| + P penalty
                        //   positionChanged = "same ";
                }                        
         

            // add category name header and table header
            if (allArray[l]["Id_PositionCategorie"] == "1" && useCategory == "yes") {

                if (category != "&nbsp;") {
                    if (typeof categoryBestTime[category][1] != 'undefined' && showBestLap == 1 && category != "&nbsp;" && category != "קטגוריה כללית" && categoryBestTime[category][1] != "-") {
                        var bestTimeDisplay = ms2TimeString(Number(categoryBestTime[category][0]));
                        
                        if (bestTimeDisplay.toString().substring(0, 3) == "00:") {
                            bestTimeDisplay = bestTimeDisplay.substr(3);
                        }
                        if (bestTimeDisplay.toString().substring(0, 1) == "0" && bestTimeDisplay.includes(":")) {
                            bestTimeDisplay = bestTimeDisplay.substr(1);
                        }

                        finalText += '<tr><td colspan="99" class="comment_font">הקפה מהירה: (' + categoryBestTime[category][1] + ') ' + categoryBestTime[category][2] + ' - ' + bestTimeDisplay + '</td></tr>\n';
                    }
                }

                category = allArray[l]["Id_Categorie"];


                    finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1 + '\n';                
                
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
                

                
                    finalText += '<tr><td colspan="99" class="title_font">כללי</td></tr>' + headerText1 + '\n';
           }


            // DNF/DSQ
            
            if ((allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image"] == '_Status1') && useCategory == "yes" && dnfCategory != category && cleanResults == 1) {
                
                finalText += '<tr><td colspan="99" class="subtitle_font">לא סיים - DNF</td></tr>\n';
                dnfCategory = category;
            } else if (allArray[l]["Id_Image"].includes("_Status10") && useCategory == "yes" && dsqCategory != category && cleanResults == 1) {
                
                finalText += '<tr><td colspan="99" class="subtitle_font">נפסל - DSQ</td></tr>\n';
                dsqCategory = category;
            } else if (allArray[l]["Id_Image"].includes("_Status12") && useCategory == "yes" && dnsCategory != category && cleanResults == 1) {
                
                finalText += '<tr><td colspan="99" class="subtitle_font">לא התחיל - DNS</td></tr>\n';
                dnsCategory = category;
            }
            
            if (cleanResults == 1) {
                positionChanged = "";
            }
            
            if (l % 2 == 0) {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">\n';
                } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">\n';
                    
                }
        
    //        for(var key in allArray[l]) {
    //        var opt3 = allArray[l][key];
 

                // hare scramble
                var harescrambleFinished = 0;
                if (hareScramble == 1) {
                    
                    if (allArray[l]["Id_Categorie"].toUpperCase().includes("E") && timeString2ms(allArray[l]["Id_TpsCumule"]) >= harescrambleFinishE) {
                        harescrambleFinished = 1;
                    } else if (allArray[l]["Id_Categorie"].toUpperCase().includes("מתחילים") && timeString2ms(allArray[l]["Id_TpsCumule"]) >= harescrambleFinishBeginers) {
                        harescrambleFinished = 1;
                    } else if ((allArray[l]["Id_Categorie"].toUpperCase().includes("עממית") || (allArray[l]["Id_Categorie"].toUpperCase().includes("סניורים")) || ((allArray[l]["Id_Categorie"].toUpperCase().includes("ג'וניור")) && (allArray[l]["Id_Categorie"].toUpperCase().includes("מקצועי")))) && timeString2ms(allArray[l]["Id_TpsCumule"]) >= harescrambleFinishC) {
                        harescrambleFinished = 1;
                    } else {
                        harescrambleFinished = 0;
                    }
                    
                }
            
            //          if (key != "Id_Ecart1erCategorie" && key != "Id_MeilleurTour" && key != "Id_PositionCategorie" && key != "Id_Image" && key != "Id_Arrow" && key != "Id_TpsTour1" && key != "Id_TpsTour2" && key != "Id_TpsTour3" && key != "Id_Categorie" && key != 'undefined' && key != null && key != "&nbsp;") {
                
                if (allArray[l]["Id_Image"].includes("_CheckeredFlag") || (!(allArray[l]["Id_Image"].includes("_Status")) && showIndividualLaps == 1 && (allArray[l]["Id_Image"].includes("_CheckeredFlag") || (allArray[l]["Id_NbTour"] == laps) || (specialTest == 1 && allArray[l]["Id_NbTour"] == (laps-2) && allArray[l]["Id_Categorie"].includes("מתחילים")) || (specialTest == 1 && allArray[l]["Id_NbTour"] == (laps-1) && !(allArray[l]["Id_Categorie"].toUpperCase().includes("E")))))) {
                    var checkeredFlag = "finished ";
                } else if (!(allArray[l]["Id_Image"].includes("_Status")) && harescrambleFinished == 1) {
                    var checkeredFlag = "finished ";
                } else {
                    var checkeredFlag = "";
                }

                
/*                if (allArray[l]["Id_Image"].includes("_CheckeredFlag") || (!(allArray[l]["Id_Image"].includes("_Status")) && showIndividualLaps == 1 && (allArray[l]["Id_Image"].includes("_CheckeredFlag") || (allArray[l]["Id_NbTour"] == laps) || (specialTest == 1 && allArray[l]["Id_NbTour"] == lapsX)))) {
                    var checkeredFlag = "finished ";
                } else if (!(allArray[l]["Id_Image"].includes("_Status")) && harescrambleFinished == 1) {
                    var checkeredFlag = "finished ";
                } else {
                    var checkeredFlag = "";
                }
*/
                // add and style the status/arrow

            if (cleanResults == 0) {
                
                 if (allArray[l]["Id_Arrow"].includes("dnsfq")) { 
                    
                    finalText += '<td aria-label="' + dnsfq + '" class="rnk_font dnsfq' + slim + '">' + allArray[l]["Id_Arrow"] + '</td>\n';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_MinusPosition")) { // red
                    
                    finalText += '<td class="' + checkeredFlag + 'rnk_font red' + slim + '">' + allArray[l]["Id_Arrow"] + '</td>\n';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_PlusPosition")) { // green
                    
                    finalText += '<td class="' + checkeredFlag + 'rnk_font green' + slim + '">' + allArray[l]["Id_Arrow"] + '</td>\n';
                    
                } else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td aria-label="סיים" class="rnk_font finished black' + slim + '"></td>\n';
        //            finalText += '<td class="rnk_font finished black">'+allArray[l]["Id_penalty"]+'</td>\n'; // + P penalty
                    
                } else if (allArray[l]["Id_Arrow"].includes("_TrackPassing")) { // black
                    
                    finalText += '<td aria-label="על המסלול" class="rnk_font black fadeIn' + slim + '">' + allArray[l]["Id_Arrow"] + '</td>\n';
                    
                } else if (allArray[l]["Id_Arrow"] == "P") { // black
                    
                    finalText += '<td class="rnk_font black fadeIn' + slim + '">P</td>\n';
                    
                } else if (allArray[l]["Id_Arrow"] == "&#9670;") { // white
                    
                    finalText += '<td class="rnk_font white scale' + slim + '">&#9670;</td>\n';
                    
                } else {

                    finalText += '<td class="rnk_font orange' + slim + '">' + allArray[l]["Id_Arrow"] + '</td>\n';

                }
                
            }
                
                if (useCategory == "yes") {
                    if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_TpsTour"] == "-" || allArray[l]["Id_NbTour"] == 0 || allArray[l]["Id_NbTour"] == "-" || (qualifying == 1 && allArray[l]["Id_TpsTour"] == "-")) {
                        finalText += '<td class="rnk_font' + slim + '"></td>\n';
                    } else {
                        finalText += '<td class="rnk_font' + slim + '">' + allArray[l]["Id_PositionCategorie"] + '</td>\n';
                    }
                } else if (useCategory == "no") {
                    if (allArray[l]["Id_Image"].includes("_Status") && (cleanResults == 1)) { // FIXME is this needed? on clean results we dont show id_Arrow, this will never be invoked
                        
                        if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image"] == '_Status1') {
                            finalText += '<td class="rnk_font' + slim + '"><img class="dnsfq" src="Images/_dnf.svg" alt="dnf"></td>\n';
                        } else if (allArray[l]["Id_Image"].includes("_Status10")) {
                            finalText += '<td class="rnk_font' + slim + '"><img class="dnsfq" src="Images/_dsq.svg" alt="dsq"></td>\n';
                        } else if (allArray[l]["Id_Image"].includes("_Status12")) {
                            finalText += '<td class="rnk_font' + slim + '"><img class="dnsfq" src="Images/_dns.svg" alt="dns"></td>\n';
                        } else if (allArray[l]["Id_Image"].includes("_Status2")) {
                            finalText += '<td class="rnk_font' + slim + '"><img class="dnsfq" src="Images/_nq.svg" alt="nq"></td>\n';
                        } else if (allArray[l]["Id_Image"].includes("_Status")) {
                        finalText += '<td class="rnk_font' + slim + '"><img class="dnsfq" src="Images/_status.svg" alt="status"></td>\n'; // astrix
                        }    
                        
                    } else if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_TpsTour"] == "-" || allArray[l]["Id_NbTour"] == 0 || allArray[l]["Id_NbTour"] == "-" || (qualifying == 1 && allArray[l]["Id_TpsTour"] == "-")) {
                        finalText += '<td class="rnk_font' + slim + '"></td>\n';
                    } else {
                        
            //            if (allArray[l]["Id_Position"].includes("P")) {
                        if (allArray[l]["Id_Position_Penalty"] == 1) {
                            finalText += '<td class="rnk_font penalty' + slim + '">P ' + allArray[l]["Id_Position"] + '</td>\n';
                        } else {
                            finalText += '<td class="rnk_font' + slim + '">' + allArray[l]["Id_Position"] + '</td>\n';
                        }
                        
                    }
                    
                }
                
       //         if (key == "Id_Numero") {
                    var opt3 = allArray[l]["Id_Numero"];                        
                    var opt4 = allArray[l]["Id_Categorie"];
                    
                    if (useCategory == "no" && (HeaderName[0].includes("מוטוקרוס") || HeaderName[0].includes("אנדורו"))) {
                        
                        if (opt4.toUpperCase().includes("E1") || opt4.toUpperCase().includes("MX2") || opt4.toUpperCase().includes("רוקיז")) {
                            finalText += '<td class="rnk_font blackCat" aria-label="' + opt4 + '" >' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("E2")) {
                            finalText += '<td class="rnk_font redCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("E3") || opt4.toUpperCase().includes("פתוחה")) {
                            finalText += '<td class="rnk_font yellowCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("C1") || opt4.toUpperCase().includes("C2") || opt4.toUpperCase().includes("C3") || opt4.toUpperCase().includes("עממית")) {
                            finalText += '<td class="rnk_font greenCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("ג'וניור מקצועי") || opt4.toUpperCase().includes("ג'וניור מתחילים")) {
                            finalText += '<td class="rnk_font grayCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("סופר ג'וניור")) {
                            finalText += '<td class="rnk_font blueCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("ג'וניור") || opt4.toUpperCase().includes("expert")) {
                            finalText += '<td class="rnk_font orangeCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("סופר סניור") ||opt4.toUpperCase().includes("מתחילים") || opt4.toUpperCase().includes("MX1")) {
                            finalText += '<td class="rnk_font whiteCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else if (opt4.toUpperCase().includes("סניור") || opt4.toUpperCase().includes("נשים")) {
                            finalText += '<td class="rnk_font pinkCat" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        } else {
                            finalText += '<td class="rnk_font highlight" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                        }

                    } else if (useCategory == "no") {
                            finalText += '<td class="rnk_font highlight" aria-label="' + opt4 + '">' + opt3 + '</td>\n';
                    } else {
                            finalText += '<td class="rnk_font highlight">' + opt3 + '</td>\n';
                    }

      //          } else {
      //              finalText += '<td class="rnk_font ">' + opt3 + '</td>\n';
      //          }
                 

         // NOT using aria popup for נווט 
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                if ((showCoPilot == 1 && typeof allArray[l]["Id_Licence"] != 'undefined' && !(allArray[l]["Id_Categorie"].includes('אופנועים')) && useCategory == "yes") || (showCoPilot == 1 && typeof allArray[l]["Id_Licence"] != 'undefined' && useCategory == "no")) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Licence"] + '</td>\n'; //copilot
                }
/*
        // using aria popup for נווט need fixing
                //FIXME doesnt work with usecategory no with cleanResults 1(אופנועים doesnt get נווט cell), altough we never need it
                if (showCoPilot == 1 && typeof allArray[l]["Id_Licence"] != 'undefined' && !(allArray[l]["Id_Categorie"].includes('אופנועים'))) {
                    if (cleanResults == 0 && allArray[l]["Id_Licence"] != '&nbsp;') {
                        finalText += '<td aria-label="נווט: ' + allArray[l]["Id_Licence"] + '" class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n'; //copilot
                    } else if (cleanResults == 0 && allArray[l]["Id_Licence"] == '&nbsp;') {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Licence"] + '</td>\n'; //copilot
                    }
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                }
               
        // using aria popup for נווט 
            if (showCoPilot == 1 && typeof allArray[l]["Id_Licence"] != 'undefined') {
                if (cleanResults == 0) {
                    if (allArray[l]["Id_Categorie"].includes('אופנועים')) {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                    } else {
                        if (allArray[l]["Id_Licence"] == '&nbsp;') {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                        } else {
                            finalText += '<td aria-label="נווט: ' + allArray[l]["Id_Licence"] + '" class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n'; //copilot
                        }
                    }
                } else if (cleanResults == 1) {
                    if (allArray[l]["Id_Categorie"].includes('אופנועים')) {
                        if (useCategory == "yes") {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                            finalText += '<td class="rnk_font"></td>\n'; //copilot
                        }
                    } else {
                        if (allArray[l]["Id_Licence"] == '&nbsp;') {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                            finalText += '<td class="rnk_font"></td>\n'; //copilot
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Licence"] + '</td>\n'; //copilot
                        }
                    }
                } 
            } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';                
                }
 */
                
                
                if (showLapsNumber == 1 && rallySprint == 0) {

                    if (typeof allArray[l]["Id_NbTour"] != 'undefined') {
                        
               //         if (allArray[l]["Id_NbTour"].includes("P")) {
                        if (allArray[l]["Id_NbTour_Penalty"] == 1) {
                            finalText += '<td class="rnk_font penalty">P ' + allArray[l]["Id_NbTour"] + '</td>\n';
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_NbTour"] + '</td>\n';
                        }

                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }                
                }

                if (showIndividualLaps == 1 && allArray[l]["Id_lap1"]) {

        // adding and coloring the laps and best time
        // short version
                    for (q = 1; q <= lapsX; q++) {
                            if (showBestLap == 1 && allArray[l]["Id_lap"+q] == bestLap && allArray[l]["Id_Numero"] == bestLapComp) {
                                finalText += '<td class="rnk_font BestTimeOverall">' + allArray[l]["Id_lap"+q] + '</td>\n';
                            } else if (showBestLap == 1 && allArray[l]["Id_lap"+q] != "-" && allArray[l]["Id_lap"+q] == allArray[l]["Id_MeilleurTour"]) {
                                finalText += '<td class="rnk_font BestTime">' + allArray[l]["Id_lap"+q] + '</td>\n';
                            } else {
                                finalText += '<td class="rnk_font">' + allArray[l]["Id_lap"+q] + '</td>\n';
                            }
                    }               
/*
                    for (q = 1; q <= laps; q++) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_lap"+q] + '</td>\n';
                    }
 /*                   
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap1"] + '</td>\n';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap2"] + '</td>\n';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap3"] + '</td>\n';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap4"] + '</td>\n';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap5"] + '</td>\n';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap6"] + '</td>\n';
*/
                } else {

                    if (cleanResults == 0) {
                        finalText += '<td class="rnk_font' + bestTime[allArray[l]["Id_Numero"]] + '">' + allArray[l]["Id_TpsTour"] + '</td>\n';
                    }
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_MeilleurTour"] + '</td>\n';
                    
                }

                // tickerTest show best time overall in race progress
                if (timeString2ms(allArray[l]["Id_MeilleurTour"]) == BestTimeTemp && tickerBestTime != BestTimeTemp && allArray[l]["Id_Nom"] != "???" && allArray[l]["Id_Categorie"] != '&nbsp;') {  
                    tickerBestTime = BestTimeTemp;  // tickerTest
                    
                    var tickerBestTimeTemp = ms2TimeString(tickerBestTime);
                    
                    if (tickerBestTimeTemp.toString().substring(0, 3) == "00:") {
                        tickerBestTimeTemp = tickerBestTimeTemp.substr(3);
                    }
                    if (tickerBestTimeTemp.toString().substring(0, 1) == "0" && tickerBestTimeTemp.includes(":")) {
                        tickerBestTimeTemp = tickerBestTimeTemp.substr(1);
                    }
                    
                    if (firstPass == 0) {
                        ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') הקפה מהירה כללית - ' + tickerBestTimeTemp);  // tickerTest
                    }
                }  // tickerTest

 /*               
                for (var key in categoryBestTime) {  // tickerTest show best time in category in race progress
                    if (useCategory == "yes" && key == category && Number(categoryBestTime[category][0]) > timeString2ms(allArray[l]["Id_MeilleurTour"])) {  // tickerTest
                        ticker.push(time + ' - ' + allArray[l]["Id_Nom"] + ' (' + allArray[l]["Id_Numero"] + ') הקפה מהירה בקטגוריה ' + category + ' - ' + allArray[l]["Id_MeilleurTour"]);  // tickerTest
                    }  // tickerTest

                }  // tickerTest
   */             
                
            if (showPenalty == 1 && cleanResults == 1 && (useCategory == "no" || (useCategory == "yes" && categoryPenalty[allArray[l]["Id_Categorie"]] == 1))) {
    
                if (qualifying == 0 && rallySprint == 0) {
                    if (typeof allArray[l]["Id_TpsCumule"] != 'undefined') {
      //                  if (allArray[l]["Id_TpsCumule"].includes("P")) {
                        if (allArray[l]["Id_TpsCumule_Penalty"] == 1) {
                            finalText += '<td class="rnk_font penalty">P ' + allArray[l]["Id_TpsCumule"] + '</td>\n';
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule"] + '</td>\n';
                        }
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }                

                    if (typeof allArray[l]["Id_PenaliteTpsCumule"] != 'undefined'&& allArray[l]["Id_PenaliteTpsCumule"] != '-'){
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_PenaliteTpsCumule"] + '</td>\n';
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }
                }

             } else {
 
                if (qualifying == 0 && rallySprint == 0) {
                    if (typeof allArray[l]["Id_TpsCumule"] != 'undefined') {
      //                  if (allArray[l]["Id_TpsCumule"].includes("P")) {
                        if (allArray[l]["Id_TpsCumule_Penalty"] == 1 && typeof allArray[l]["Id_PenaliteTpsCumule"] != 'undefined'&& allArray[l]["Id_PenaliteTpsCumule"] != '-') {
                            finalText += '<td class="rnk_font penalty" aria-label="עונשין: ' + allArray[l]["Id_PenaliteTpsCumule"] + '">P ' + allArray[l]["Id_TpsCumule"] + '</td>\n';
                        } else if (allArray[l]["Id_TpsCumule_Penalty"] == 1) {
                            finalText += '<td class="rnk_font penalty">P ' + allArray[l]["Id_TpsCumule"] + '</td>\n';
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule"] + '</td>\n';
                        }
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }                
                }
            }        

                if (useCategory == "yes") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1erCategorie"] + '</td>\n';
                } else if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>\n';
                }
                
     //       }
                
      //      }    

                finalText += '</tr>\n';

            }
            
            if (category != "&nbsp;") {
                
                if (useCategory == "yes" && showBestLap == 1 && categoryBestTime[category][1] != "-" && category != "קטגוריה כללית" && category != "&nbsp;") {

                        var bestTimeDisplay = ms2TimeString(Number(categoryBestTime[category][0]));
                        
                        if (bestTimeDisplay.toString().substring(0, 3) == "00:") {
                            bestTimeDisplay = bestTimeDisplay.substr(3);
                        }
                        if (bestTimeDisplay.toString().substring(0, 1) == "0" && bestTimeDisplay.includes(":")) {
                            bestTimeDisplay = bestTimeDisplay.substr(1);
                        }

                    finalText += '<tr><td colspan="99" class="comment_font">הקפה מהירה: (' + categoryBestTime[category][1] + ') ' + categoryBestTime[category][2] + ' - ' + bestTimeDisplay + '</td></tr>\n</table>\n';
                } else {
                    finalText += '</table>\n';
                }
            }            

/*         
         for (var key in categoryBestTime) {
    
 //console.log(key+'  '+ms2TimeString(categoryBestTime[key]));
   
                    finalText += '<tr>\n';
                        finalText += '<td colspan="99" class="comment_font">'+key+' הקפה מהירה: ('+numberBestTime[key]+') '+nameBestTime[key]+' - '+ms2TimeString(categoryBestTime[key])+'</td>\n';
                    finalText += '</tr>\n';
    
        }
*/

        if (useCategory == "no") {
            finalText += '</table>\n</div>\n';
        } else {
            finalText += '</div>\n';
        }
                
/*     
// make sure category best lap is correct
               for (var key in categoryBestTimeTemp) { 
                   if (categoryBestTimeTemp[key] != categoryBestTime[key][0]) {
                       categoryBestTime[key][0] = categoryBestTimeTemp[key];
                   }
               }
*/
                delete categoryBestTime["&nbsp;"];

                if (Object.keys(categoryBestTimePrevious).length > 1 && Object.keys(categoryBestTime).length > 1) {
                    for (var key in categoryBestTime) { 
                        if (categoryBestTime[key][0] != categoryBestTimePrevious[key][0] && key != "&nbsp;" && categoryBestTime[key][2] != "???") {  // tickerTest show best time in category in race progress

                                var bestTimeDisplay = ms2TimeString(Number(categoryBestTime[key][0]));
                                
                                if (bestTimeDisplay.toString().substring(0, 3) == "00:") {
                                    bestTimeDisplay = bestTimeDisplay.substr(3);
                                }
                                if (bestTimeDisplay.toString().substring(0, 1) == "0" && bestTimeDisplay.includes(":")) {
                                    bestTimeDisplay = bestTimeDisplay.substr(1);
                                }

                                ticker.push(time + ' - ' + categoryBestTime[key][2] + ' (' + categoryBestTime[key][1] + ') הקפה מהירה בקטגוריה ' + key + ' - <span dir="ltr">' + bestTimeDisplay + '</span>');  // tickerTest
                        }  // tickerTest
                    }
                }   
                
                categoryBestTimePrevious = categoryBestTime;
                
/* 
    var headerText = '<tr class="rnkh_bkcolor">';
        for (var key in hhh) { 

            headerText += '<th class="rnkh_font" id="' +key+ '">' +hhh[key]+ '</th>';
            
        }           
        headerText += '</tr>';
     //    console.log(headerText);

        
        var mainText = "";

         for (b = 0; b < allArray.length; b++) { 
                mainText += '<tr class="fadeIn rnk_bkcolor">';

               for (var key in allArray[b]) { 
                   
                   if (key != "Id_MeilleurTour" && key != "Id_Arrow" && key != "Id_Ecart1er" && key != "Id_Position" && key != "Id_Categorie" && key != "Id_Image") {
                   
                       if (key == "Id_Numero") {
                        mainText += '<td class="rnk_font highlight">' +allArray[b][key]+ '</td>';
                       } else {
                        mainText += '<td class="rnk_font">' +allArray[b][key]+ '</td>';
                       }
                       
                    }
                   
               }
                mainText += '</tr>';

        }
   //         console.log(mainText);

*/             
            //   console.log(allArray);
           //  console.log(categoryPenalty);
          //      console.log(bestTime);
           //     console.log(tickerBestTime);

    tableClass = "";

    if (document.getElementById("tickerTest")) {  // tickerTest

        if (firstPass == 1) {
            ticker = [];
        }

        var tickerInnerHTML = "";

        if (ticker.length > 0) {
            tickerInnerHTML += "<ul>";
            for (ii = 0; ii < ticker.length; ii++) {
                tickerInnerHTML += '<li>' + ticker[ii] + '</li>';
            }
            tickerInnerHTML += "</ul>";

            document.getElementById("tickerTest").innerHTML = tickerInnerHTML;  // tickerTest
            var tickerElement = ticker.shift();  // tickerTest
            if (ticker.length > 5) {
                tickerElement = ticker.shift();  // tickerTest
            }
            if (ticker.length > 10) {
                tickerElement = ticker.shift();  // tickerTest
            }
        } else {
            document.getElementById("tickerTest").innerHTML = "&nbsp;";  // tickerTest
        }

        // console.log(tickerElement);  // tickerTest
        // console.log(ticker);  // tickerTest

    }  // tickerTest               
   
        sessionStorage.setItem('doNotShowInTicker', JSON.stringify(doNotShowInTicker));  // tickerTest
        sessionStorage.setItem('ticker', JSON.stringify(ticker));  // tickerTest
        sessionStorage.setItem('flag', flag);  // tickerTest
        sessionStorage.setItem('tickerBestTime', tickerBestTime);  // tickerTest

//        sessionStorage.setItem('categoryBestTime', JSON.stringify(categoryBestTime));
        sessionStorage.setItem('categoryBestTimePrevious', JSON.stringify(categoryBestTimePrevious));

        firstPass = 0;  // tickerTest

    //   if (typeof tickerElement != 'undefined') {
    //       document.getElementById("tickerTest").innerHTML = time + " - " + tickerElement;  // tickerTest
    //   } else {
    //       document.getElementById("tickerTest").innerHTML = "&nbsp;";  // tickerTest
    //   }

    return finalText
    }
/*
    function sortObjKeysAlphabetically(obj) {
        var ordered = {};
        Object.keys(obj).sort().forEach(function(key) {
        ordered[key] = obj[key];
        });
        return ordered;
    }
     
    function Change() {
        var Num, Index;
        if (document.forms["Changement"].chkChangement.checked) {
            Index = UrlRefresh.indexOf(".");
            Num = parseInt(UrlRefresh.substring(1, Index)) + 1;
            if (Num > MaxNum) Num = 1;
            UrlRefresh = "p" + Num + ".html";
            UrlChange = 1;
            fct = function() {
                Change()
            };
            TimerChange = setTimeout(fct, Changement)
        } else if (TimerChange) clearTimeout(TimerChange)
    }

    function AfficherImageZoom(a, b) {
        "" != b ? (document.getElementById("ImageZoom").src = b, document.getElementById("ImageZoom").style.left = a.clientX + "px", document.getElementById("ImageZoom").style.top = a.clientY + "px", document.getElementById("ImageZoom").style.visibility = "visible") : document.getElementById("ImageZoom").style.visibility = "hidden"
    }

    function timeString2ms(a,b){// time(HH:MM:SS.mss) // optimized
        return a=a.split('.'), // optimized
        b=a[1]*1||0, // optimized
        a=a[0].split(':'),
        b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
    }

    function ms2TimeString(a,k,s,m,h){
        return k=a%1e3, // optimized by konijn
        s=a/1e3%60|0,
        m=a/6e4%60|0,
        h=a/36e5%24|0,
        (h?(h<10?'0'+h:h)+':':'')+ // optimized
        (m<10?0:'')+m+':'+  // optimized
        (s<10?0:'')+s+'.'+ // optimized
        (k<100?k<10?'00':0:'')+k // optimized
    }
*/
    function timeString2ms(a){// time(HH:MM:SS.mss) 
         a = a.split('.');
        var b = a[1]*1||0;
        a = a[0].split(':');
        return b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3
    }

    function ms2TimeString(a){
        var k = a%1e3; 
        var s = a/1e3%60|0;
        var m = a/6e4%60|0;
        var h = a/36e5%24|0;
        return (h?(h<10?'0'+h:h)+':':'')+ (m<10?0:'')+m+':'+ (s<10?0:'')+s+'.'+ (k<100?k<10?'00':0:'')+k 
      //  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(k).padStart(3, '0') 
    }

