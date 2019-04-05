//  20180518 - array refactoring with all/category toggle, display arrows for position change 
//  20180522 - add fades and competitor info on arrows display 
//  20180523 - add competitor number color/background according to category 
//  20180527 - add message uploading 
//  20180607 - special edition for 2 specials run individually and computation done in live. special 1 live points to: https://tnuatiming.com/live/livea/p1.html and special 2 live points to: https://tnuatiming.com/live/liveb/p1.html 
//  20180610 - refactor special edition for 2 specials run individually and computation done in live, added laps time in correct order.  
//  20180701 - added penalty indicator. 
// 20190328 - add time penalty, ONLY ON MAIN TIMING MACHINE


    var TimerLoad, Rafraichir;
    Rafraichir = 10000;
        
    var cleanResults = 0;     

    var positionArray = {}; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    if (sessionStorage.getItem('positionArray')) {
        positionArray = JSON.parse(sessionStorage.getItem('positionArray'));
    }
    
    var useCategory = "yes";
    if (sessionStorage.getItem('categoryOrAll')) {
        useCategory = sessionStorage.getItem('categoryOrAll');
    }
    document.addEventListener("DOMContentLoaded", function() {

        if (useCategory == "yes") {
            document.getElementById("displayCatButton").classList.remove("active");
            document.getElementById("displayCatButton").disabled = true;
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("displayAllButton").classList.remove("active");
            document.getElementById("displayAllButton").disabled = true;
        }

    });   

    var eventName = "";    
    if (sessionStorage.getItem('eventName')) {
        eventName = sessionStorage.getItem('eventName');
    }

    var tableClass = "fadeIn ";
    var url1 = "https://tnuatiming.com/live/livea/p1.html";    
    var url2 = "https://tnuatiming.com/live/liveb/p1.html";    
    var Text1;
    var Text2;
    
    var firstPass = 1;
    
    function category(choice){
        
        positionArray = {}; // empting the array as the info inside is incorrect due to canging between position/category position.
        useCategory = choice;
        
        firstPass = 1;
    
        if (useCategory == "yes") {
            document.getElementById("displayCatButton").classList.remove("active");
            document.getElementById("displayCatButton").disabled = true;
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("displayAllButton").classList.remove("active");
            document.getElementById("displayAllButton").disabled = true;
        }

        
        if (useCategory == "yes") {
            sessionStorage.setItem('categoryOrAll', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('categoryOrAll', 'no');
        }
        
        Rafraichir = 10000;

        tableClass = "fadeIn "; // make the table fadeIn on change
                    
        document.getElementById("result").innerHTML = createLiveTable();
        alignTable();
        
//        Load(url1, 'result');
    };

    async function Load(url, target) {
        
        var loop;
        if (TimerLoad) clearTimeout(TimerLoad);



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
                const response = await fetch(url2, {cache: "no-store"});
                if (response.ok) {
                 Text2 = await response.text();
                   
                }
            }
            catch (err) {
                console.log('results fetch failed', err);
            }

            try {
                const response2 = await fetch(url1, {cache: "no-store"});
                if (response2.ok) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    Text1 = await response2.text();
                    document.getElementById(target).innerHTML = createLiveTable();
                    alignTable();
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
        var xhr2;

        xhr2 = new XMLHttpRequest;
        xhr2.onreadystatechange = function () {
            if (xhr2.readyState == 4 && xhr2.status == 200) {
                Text2 = xhr2.responseText;
            }
        };
        xhr2.open("GET", url2 + "?r=" + Math.random(), true);
        xhr2.send(null);

        xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                Text1 = xhr.responseText;
                document.getElementById(target).innerHTML = createLiveTable();
                alignTable();
            }
        };
        xhr.open("GET", url1 + "?r=" + Math.random(), true);
        xhr.send(null);
        }
        
//        populatePre('uploadMsg.txt'); // upload message

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
/*
    // fn to upload messages
    function populatePre(url) {
        var xhr1 = new XMLHttpRequest();
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                document.getElementById('updates').innerHTML = xhr1.responseText;
            }
        };
    //    xhr1.open("GET", url + Math.random(), true);
        xhr1.open('GET', url, true);
        xhr1.send(null);
    }
*/   
    function createLiveTable() {

        var text1, text2, lines, i, a, b, id, prevCompCat, m, l, competitorLaps, leaderLaps, leaderTime, competitorTime, opt3, opt4, checkeredFlag, lapsXtemp, timeP, dnsfq, headerText1;
        competitorPosition = 0;
        competitorNumber = 0;
        competitorLaps = 0;
//        var qqq = [];
//        var hhh = [];
        var hhhPro = [];
//        var temp = [];
        var lineArray = {};
        var allArray = [];
        var allArray2 = [];
        var penalty = "no";
        var ttt = 0;
        var pp = 0;
        var positionChanged = "";
        var bestLapComp = 0;
        var bestLap = "99999999999";
        var bestLapComp2 = 0;
        var bestLap2 = "99999999999";
        var laps = 12; // number of laps
        var catFirst = 1;
        var dnfCategory = "";
        var dnsCategory = "";
        var dsqCategory = "";
        var category = "&nbsp;";
        var lapsX = {};
        lapsX["overAll"] = 0;
        var proLaps = 12;
        var notProLaps = 10;
        var beginnersLaps = 8;
/*        
        var bestTime2comp = 0;
        var bestTime2 = 0;
        var bestTimecomp = 0;
        var bestTime = 0;
*/        

        text2 = Text2;
        text1 = Text1;
        
        text2 = text2.split('<table'); // split the text to title/time and the table
        text2[1] = text2[1].substring(text2[1].indexOf("<tr"),text2[1].lastIndexOf("</tr>")+5); // clean the table text
  //      console.log(text2[1]);
        lines = text2[1].split("\n");
        text2 = [];


        text1 = text1.split('<table'); // split the text to title/time and the table
        text1[1] = text1[1].substring(text1[1].indexOf("<tr"),text1[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(text1[1]);

        var HeaderName = text1[0].split("\n");  
        var div = document.createElement("div");  
        div.innerHTML = HeaderName[0]; 
        var HeaderEventName = div.textContent || div.innerText || "";  
        var HeaderRaceName = HeaderEventName.split('-')[1].trim();  

        var flagText = HeaderName[0].match(/Images\/\s*(.*?)\s*\.png/);
//        console.log(flagText[0]); // Images/_Stop.png
//        console.log(flagText[1]); // _Stop


        if (HeaderName[0].includes("+++")) { // clean table for results page
            cleanResults = 1;
            HeaderEventName = HeaderEventName.replace("+++", "");
        } else {
            cleanResults = 0;
        }

        if (eventName != HeaderEventName) {  
            positionArray = {};
        }

        
        eventName = HeaderEventName;
        sessionStorage.setItem('eventName', eventName);





        var finalText = '<div id="Title"><img class="TitleFlag1" src="' + flagText[0] + '"><h2 id="TitleH1">'+HeaderEventName.replace(" - ", "<br>") + '</h2><img class="TitleFlag2" src="' + flagText[0] + '"></div>'; // clear the finalText variable and add the title and time lines
        
        finalText += HeaderName[1];

        
//        var finalText = text1[0]; // clear the finalText variable and add the title and time lines



        for (b = 0; b < lines.length; b++) { 
           
            if (lines[b].includes('<td id="Id_')) { // header cell
                id = (lines[b].substring(lines[b].indexOf(' id="')+4).split('"')[1]);
                hhhPro.push(id);
            } else if (lines[b].includes("OddRow") || lines[b].includes("EvenRow")) { // competitor line
                ttt = 1;
            } else if (lines[b].includes("</tr>") && ttt == 1) { // end competitor line
                ttt = 0;
                if (penalty == "yes") {
                    lineArray.Id_penalty = "P";
                } else {
                    lineArray.Id_penalty = "&nbsp;";
                }
                allArray2.push(lineArray); // push line to main array
               lineArray = {};
                pp = 0;
                penalty = "no";
            } else if (lines[b].includes("<td ") && ttt == 1) { // clean and add competitor cell
                if (lines[b].includes("(C)")) {
                    penalty = "yes";
                }

                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");
                // convert total time to miliseconds
                if (hhhPro[pp] == "Id_TpsCumule" && lineArray[hhhPro[pp]] != "-" ) {
                    lineArray[hhhPro[pp]] = timeString2ms(lineArray[hhhPro[pp]]);   
                }
                if (hhhPro[pp] == "Id_Categorie" && lineArray[hhhPro[pp]] == '&nbsp;' ) {
                    lineArray[hhhPro[pp]] = "&nbsp;";   
                }
                if (hhhPro[pp] != "Id_Categorie" && lineArray[hhhPro[pp]] == 'undefined' ) {
                    lineArray[hhhPro[pp]] = "-";   
                }
/*
                if (lines[b].includes("BestTimeOverall") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime2=lineArray["Id_TpsTour"];
                    bestTime2comp=lineArray["Id_Numero"];
                }
*/
                // find best lap overall        /Id_TpsTour\d+/.test(hhhPro[pp])
//                if (hhhPro[pp] == "Id_TpsTour1" || hhhPro[pp] == "Id_TpsTour2" || hhhPro[pp] == "Id_TpsTour3" || hhhPro[pp] == "Id_TpsTour4" || hhhPro[pp] == "Id_TpsTour5" || hhhPro[pp] == "Id_TpsTour6") {
                if (/Id_TpsTour\d+/.test(hhhPro[pp])) {
                    if (lineArray[hhhPro[pp]] != "-" && timeString2ms(lineArray[hhhPro[pp]]) <= timeString2ms(bestLap2)) {
                    bestLap2 = lineArray[hhhPro[pp]];
                    bestLapComp2 = lineArray["Id_Numero"];
                    }
                }

                pp += 1;
        //                console.log(lineArray);
         // console.log("x  "+bestLapComp2+"  "+bestLap2);
            }
            
        }
         // console.log(allArray2);

            
        ttt = 0;
        pp = 0;
        penalty = "no";
        hhhPro = [];
        lineArray = {};

        lines = text1[1].split("\n");
        //    console.log(lines.length);
     //   console.log(lines);

        for (b = 0; b < lines.length; b++) { 
           
            if (lines[b].includes('<td id="Id_')) { // header cell
                id = (lines[b].substring(lines[b].indexOf(' id="')+4).split('"')[1]);
                hhhPro.push(id);
 //               var idName = (lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")));
 //               hhh[id] = idName;
 //               temp.push(id,idName);
 //               qqq.push(temp);
 //               temp = [];
            } else if (lines[b].includes("OddRow") || lines[b].includes("EvenRow")) { // competitor line
                ttt = 1;
            } else if (lines[b].includes("</tr>") && ttt == 1) { // end competitor line
                ttt = 0;
                if (penalty == "yes") {
                    lineArray.Id_penalty = "P";
                } else {
                    lineArray.Id_penalty = "&nbsp;";
                }
                lineArray.Id_Image_2 = "&nbsp;";
                lineArray.Id_MeilleurTour_2 = "&nbsp;";
                lineArray.Id_penalty_2 = "&nbsp;";
                for (i = 1; i <= 12; i++) { 
                    lineArray["Id_lap" + i] = "-";
                }
                if (typeof lineArray.Id_PenaliteTpsCumule == "undefined") {
                    lineArray.Id_PenaliteTpsCumule = "-"
                }
                allArray.push(lineArray); // push line to main array 
               lineArray = {};
                pp = 0;
                penalty = "no";
            } else if (lines[b].includes("<td ") && ttt == 1) { // clean and add competitor cell
                if (lines[b].includes("(C)")) {
                    penalty = "yes";
                }

                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");
                // convert total time to miliseconds
                if (hhhPro[pp] == "Id_TpsCumule" && lineArray[hhhPro[pp]] != "-" ) {
                    lineArray[hhhPro[pp]] = timeString2ms(lineArray[hhhPro[pp]]);   
                }
                if (hhhPro[pp] == "Id_Categorie" && lineArray[hhhPro[pp]] == '&nbsp;' ) {
                    lineArray[hhhPro[pp]] = "&nbsp;";   
                }
                if (hhhPro[pp] != "Id_Categorie" && lineArray[hhhPro[pp]] == 'undefined' ) {
                    lineArray[hhhPro[pp]] = "-";   
                }
                if (hhhPro[pp] == "Id_PenaliteTpsCumule" ) {
                    if (lineArray[hhhPro[pp]] == '-') {
                        lineArray.timeP = "";   
                    } else {
                        lineArray.timeP = "P ";
                    }
                }
/*
                if (lines[b].includes("BestTimeOverall") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime=lineArray["Id_TpsTour"];
                    bestTimecomp=lineArray["Id_Numero"];
                }
*/
                // find best lap overall
//                if (hhhPro[pp] == "Id_TpsTour1" || hhhPro[pp] == "Id_TpsTour2" || hhhPro[pp] == "Id_TpsTour3" || hhhPro[pp] == "Id_TpsTour4" || hhhPro[pp] == "Id_TpsTour5" || hhhPro[pp] == "Id_TpsTour6") {
                if (/Id_TpsTour\d+/.test(hhhPro[pp])) {
                    if (lineArray[hhhPro[pp]] != "-" && timeString2ms(lineArray[hhhPro[pp]]) <= timeString2ms(bestLap)) {
                    bestLap = lineArray[hhhPro[pp]];
                    bestLapComp = lineArray["Id_Numero"];
                    }
                }

                pp += 1;
      //    console.log(lineArray);
       //   console.log(bestLapComp+"  "+bestLap);

            }
            
        }

     //    console.log(allArray);
     //    console.log(hhh);
     //    console.log(hhhPro);

     //             console.log(qqq);
      //   console.log(hhhPro);
         //                console.log(allArray);

        

        for (b = 0; b < allArray.length; b++) { 
            for (a = 0; a < allArray2.length; a++) { 

                lapsXtemp = 0;
                if (typeof lapsX[allArray[b]["Id_Categorie"]] == 'undefined') {
                    lapsX[allArray[b]["Id_Categorie"]] = 0;
                }
                
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                     
                                          
                    // calculating total time and total laps from both arrays
                    if (allArray[b]["Id_TpsCumule"] != "-" && allArray2[a]["Id_TpsCumule"] != "-") {
                        
                        allArray[b]["Id_TpsCumule"] = allArray[b]["Id_TpsCumule"] + allArray2[a]["Id_TpsCumule"];
                    }

                    if (allArray[b]["Id_NbTour"] != "-" && allArray2[a]["Id_NbTour"] != "-") {
                        
                        allArray[b]["Id_NbTour"] = Number(allArray[b]["Id_NbTour"]) + Number(allArray2[a]["Id_NbTour"]);
                    }
                                 

                    // reorder laps as elite3 does somthing wrong with the order - second array
                                        
                                        
                    for (i = 6; i > 0; i--) { 
                        
                        if (allArray2[a]["Id_TpsTour" + i] != "-") {
                            m = 2;
                            for (l = i; l > 0; l--) {

                                allArray[b]["Id_lap" + m] = allArray2[a]["Id_TpsTour" + l];
                                m = m + 2;

                            }
                            lapsXtemp = i;
                            i = 0;
                        }
                    }                               
                                 
 /*                                
                                 
                    if (allArray2[a]["Id_TpsTour6"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour6"];
                        allArray[b].Id_lap4 = allArray2[a]["Id_TpsTour5"];
                        allArray[b].Id_lap6 = allArray2[a]["Id_TpsTour4"];
                        allArray[b].Id_lap8 = allArray2[a]["Id_TpsTour3"];
                        allArray[b].Id_lap10 = allArray2[a]["Id_TpsTour2"];
                        allArray[b].Id_lap12 = allArray2[a]["Id_TpsTour1"];
                        lapsXtemp = 6;
                    } else if (allArray2[a]["Id_TpsTour5"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour5"];
                        allArray[b].Id_lap4 = allArray2[a]["Id_TpsTour4"];
                        allArray[b].Id_lap6 = allArray2[a]["Id_TpsTour3"];
                        allArray[b].Id_lap8 = allArray2[a]["Id_TpsTour2"];
                        allArray[b].Id_lap10 = allArray2[a]["Id_TpsTour1"];
                        allArray[b].Id_lap12 = "-";
                        lapsXtemp = 5;
                    } else if (allArray2[a]["Id_TpsTour4"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour4"];
                        allArray[b].Id_lap4 = allArray2[a]["Id_TpsTour3"];
                        allArray[b].Id_lap6 = allArray2[a]["Id_TpsTour2"];
                        allArray[b].Id_lap8 = allArray2[a]["Id_TpsTour1"];
                        allArray[b].Id_lap10 = "-";
                        allArray[b].Id_lap12 = "-";
                        lapsXtemp = 4;
                    } else if (allArray2[a]["Id_TpsTour3"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour3"];
                        allArray[b].Id_lap4 = allArray2[a]["Id_TpsTour2"];
                        allArray[b].Id_lap6 = allArray2[a]["Id_TpsTour1"];
                        allArray[b].Id_lap8 = "-";
                        allArray[b].Id_lap10 = "-";
                        allArray[b].Id_lap12 = "-";
                        lapsXtemp = 3;
                    } else if (allArray2[a]["Id_TpsTour2"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour2"];
                        allArray[b].Id_lap4 = allArray2[a]["Id_TpsTour1"];
                        allArray[b].Id_lap6 = "-";
                        allArray[b].Id_lap8 = "-";
                        allArray[b].Id_lap10 = "-";
                        allArray[b].Id_lap12 = "-";
                        lapsXtemp = 2;
                    } else if (allArray2[a]["Id_TpsTour1"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour1"];
                        allArray[b].Id_lap4 = "-";
                        allArray[b].Id_lap6 = "-";
                        allArray[b].Id_lap8 = "-";
                        allArray[b].Id_lap10 = "-";
                        allArray[b].Id_lap12 = "-";
                        lapsXtemp = 1;
                    } else {
                        allArray[b].Id_lap2 = "-";
                        allArray[b].Id_lap4 = "-";
                        allArray[b].Id_lap6 = "-";
                        allArray[b].Id_lap8 = "-";
                        allArray[b].Id_lap10 = "-";
                        allArray[b].Id_lap12 = "-";
                    }
*/                 
                    // transfer fileds from secound array to the first that nedded later, use _2 to mark
                    allArray[b].Id_penalty_2 = allArray2[a]["Id_penalty"];   
                    allArray[b].Id_Image_2 = allArray2[a]["Id_Image"];   
                    allArray[b].Id_MeilleurTour_2 = allArray2[a]["Id_MeilleurTour"];   // fastest lap

                    if (allArray2[a]["Id_penalty"] == "P") {
                    allArray[b].Id_penalty = "P";   
                    }
                    
                    if (allArray[b]["Id_Canal"] == "1" || allArray2[a]["Id_Canal"] == "1") {   // on track
                        allArray[b].Id_onTrack = 1;
                    } else {
                        allArray[b].Id_onTrack = 0;
                    }
             //       allArray[b].Id_TpsTour_2 = allArray2[a]["Id_TpsTour"];   // last lap
                    
                    if (allArray[b]["Id_Image"].includes("_Status") || allArray2[a]["Id_Image"].includes("_Status")) {
                        allArray[b].Id_Status = 1;
                    } else {
                        allArray[b].Id_Status = 0;
                    }
               
                // reorder laps as elite3 does somthing wrong with the order - first array
                
                
                    for (i = 6; i > 0; i--) { 
                        
                        if (allArray[b]["Id_TpsTour" + i] != "-") {
                            m = 1;
                            for (l = i; l > 0; l--) {

                                allArray[b]["Id_lap" + m] = allArray[b]["Id_TpsTour" + l];
                                m = m + 2;

                            }
                            lapsXtemp += i;
                            i = 0;
                        }
                    }                               
               } // END a == b

               /*                
                
                    if (allArray[b]["Id_TpsTour6"] != "-") {
                        allArray[b].Id_lap1 = allArray[b]["Id_TpsTour6"];
                        allArray[b].Id_lap3 = allArray[b]["Id_TpsTour5"];
                        allArray[b].Id_lap5 = allArray[b]["Id_TpsTour4"];
                        allArray[b].Id_lap7 = allArray[b]["Id_TpsTour3"];
                        allArray[b].Id_lap9 = allArray[b]["Id_TpsTour2"];
                        allArray[b].Id_lap11 = allArray[b]["Id_TpsTour1"];
                        lapsXtemp += 6;
                    } else if (allArray[b]["Id_TpsTour5"] != "-") {
                        allArray[b].Id_lap1 = allArray[b]["Id_TpsTour5"];
                        allArray[b].Id_lap3 = allArray[b]["Id_TpsTour4"];
                        allArray[b].Id_lap5 = allArray[b]["Id_TpsTour3"];
                        allArray[b].Id_lap7 = allArray[b]["Id_TpsTour2"];
                        allArray[b].Id_lap9 = allArray[b]["Id_TpsTour1"];
                        allArray[b].Id_lap11 = "-";
                        lapsXtemp += 5;
                    } else if (allArray[b]["Id_TpsTour4"] != "-") {
                        allArray[b].Id_lap1 = allArray[b]["Id_TpsTour4"];
                        allArray[b].Id_lap3 = allArray[b]["Id_TpsTour3"];
                        allArray[b].Id_lap5 = allArray[b]["Id_TpsTour2"];
                        allArray[b].Id_lap7 = allArray[b]["Id_TpsTour1"];
                        allArray[b].Id_lap9 = "-";
                        allArray[b].Id_lap11 = "-";
                        lapsXtemp += 4;
                    } else if (allArray[b]["Id_TpsTour3"] != "-") {
                        allArray[b].Id_lap1 = allArray[b]["Id_TpsTour3"];
                        allArray[b].Id_lap3 = allArray[b]["Id_TpsTour2"];
                        allArray[b].Id_lap5 = allArray[b]["Id_TpsTour1"];
                        allArray[b].Id_lap7 = "-";
                        allArray[b].Id_lap9 = "-";
                        allArray[b].Id_lap11 = "-";
                        lapsXtemp += 3;
                    } else if (allArray[b]["Id_TpsTour2"] != "-") {
                        allArray[b].Id_lap1 = allArray[b]["Id_TpsTour2"];
                        allArray[b].Id_lap3 = allArray[b]["Id_TpsTour1"];
                        allArray[b].Id_lap5 = "-";
                        allArray[b].Id_lap7 = "-";
                        allArray[b].Id_lap9 = "-";
                        allArray[b].Id_lap11 = "-";
                        lapsXtemp += 2;
                    } else if (allArray[b]["Id_TpsTour1"] != "-") {
                        allArray[b].Id_lap1 = allArray[b]["Id_TpsTour1"];
                        allArray[b].Id_lap3 = "-";
                        allArray[b].Id_lap5 = "-";
                        allArray[b].Id_lap7 = "-";
                        allArray[b].Id_lap9 = "-";
                        allArray[b].Id_lap11 = "-";
                        lapsXtemp += 1;
                    } else {
                        allArray[b].Id_lap1 = "-";
                        allArray[b].Id_lap3 = "-";
                        allArray[b].Id_lap5 = "-";
                        allArray[b].Id_lap7 = "-";
                        allArray[b].Id_lap9 = "-";
                        allArray[b].Id_lap11 = "-";
                    }
*/
/*
            // inflating the table as laps results come in
            for (q = laps; q >= lapsX; q--) { 

                if (allArray[b]["Id_lap" + q] != "-" && lapsX < q) {
                    lapsX = q;
                }
            }
*/            

            if (lapsXtemp > lapsX[allArray[b]["Id_Categorie"]]) { // get max laps to show per category
                lapsX[allArray[b]["Id_Categorie"]] = lapsXtemp;
            }
            if (lapsXtemp > lapsX["overAll"]) { // get max laps to show overall
                lapsX["overAll"] = lapsXtemp;
            }
     //   console.log(lapsX);     

                
               
            } // END for allArray2
        } // END for allArray

        // delete the secound array
         allArray2 = [];
         
         // THE MAGIC - sort the array after the merge to get new results
        if (useCategory == "no") {
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || b.Id_NbTour - a.Id_NbTour || a.Id_TpsCumule - b.Id_TpsCumule || b.Id_onTrack - a.Id_onTrack});
        } else if (useCategory == "yes") {
            allArray.sort(function(a, b){return (a.Id_Categorie == "&nbsp;")-(b.Id_Categorie == "&nbsp;") ||  (a.Id_Categorie.includes("ג'וניור"))-(b.Id_Categorie.includes("ג'וניור")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || b.Id_NbTour - a.Id_NbTour || a.Id_TpsCumule - b.Id_TpsCumule || b.Id_onTrack - a.Id_onTrack});
        }
         
         

         
    // fix the position fields of the competitors and start building the final table
            m = 0;
            prevCompCat = ""

        if (useCategory == "no") {
            finalText += '\n<div id="liveTable"><table class="' + tableClass + 'line_color">\n';
        } else {

            finalText += '\n<div id="liveTable">\n';
        }           
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
                 if (useCategory == "no") {
                    allArray[l]["Id_Position"] = l+1;
                 } else if (useCategory == "yes") {
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position"] = m;
                 }

                if (allArray[l]["Id_Position"] == 1) {
                    leaderTime = allArray[l]["Id_TpsCumule"];
                    leaderLaps = allArray[l]["Id_NbTour"];
                }

                        // fix the diff fields of the competitors
                    competitorLaps = allArray[l]["Id_NbTour"];

                if (competitorLaps < leaderLaps && competitorLaps > 0) {
                    if ((leaderLaps - competitorLaps) == "1") {
                        allArray[l]["Id_Ecart1er"] = "1 הקפה";
                    } else {
                        allArray[l]["Id_Ecart1er"] = (leaderLaps - competitorLaps) + " הקפות";
                    }
                    
                } else if (competitorLaps == leaderLaps) {
                    competitorTime = allArray[l]["Id_TpsCumule"];
                    if (competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                    allArray[l]["Id_Ecart1er"] = ms2TimeString(competitorTime - leaderTime);

                    if (allArray[l]["Id_Ecart1er"].toString().substring(0, 3) == "00:") {
                        allArray[l]["Id_Ecart1er"] = allArray[l]["Id_Ecart1er"].substr(3);
                    }
                    if (allArray[l]["Id_Ecart1er"].toString().substring(0, 1) == "0" && allArray[l]["Id_Ecart1er"].includes(":")) {
                        allArray[l]["Id_Ecart1er"] = allArray[l]["Id_Ecart1er"].substr(1);
                    }
                        
                    } else {
                    allArray[l]["Id_Ecart1er"] = "-";
                    }
                } else {
                    allArray[l]["Id_Ecart1er"] = "-";
                }

                // convert back to time
                if (allArray[l]["Id_TpsCumule"] != "-") {  
                    allArray[l]["Id_TpsCumule"] = ms2TimeString(allArray[l]["Id_TpsCumule"]);

                    
                    if (allArray[l]["Id_TpsCumule"].toString().substring(0, 3) == "00:") {
                        allArray[l]["Id_TpsCumule"] = allArray[l]["Id_TpsCumule"].substr(3);
                    }
                    if (allArray[l]["Id_TpsCumule"].toString().substring(0, 1) == "0" && allArray[l]["Id_TpsCumule"].includes(":")) {
                        allArray[l]["Id_TpsCumule"] = allArray[l]["Id_TpsCumule"].substr(1);
                    }
                    
                }


   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

            // set laps according to category
            if (useCategory == "yes" && cleanResults == 0) {
                laps = lapsX[allArray[l]["Id_Categorie"]];
            } else if (useCategory == "no" && cleanResults == 0) {
                laps = lapsX["overAll"];
            } else if (useCategory == "yes" && cleanResults == 1) {

                if (allArray[l]["Id_Categorie"].includes('עממית') || allArray[l]["Id_Categorie"].includes("ג'וניור") || allArray[l]["Id_Categorie"].includes('סניורים')) {
                    laps = notProLaps;
                } else if (allArray[l]["Id_Categorie"].includes('מתחילים')) {
                    laps = beginnersLaps;
                } else {
                    laps = laps;
                }
            }
            
            
            // hard coded header for now
            headerText1 = '<tr class="rnkh_bkcolor">';
        
            if (cleanResults == 0) {
                headerText1 += '<th colspan = "2" class="rnkh_font">&nbsp;מקום&nbsp;</th>\n'; //  Id_Arrow
            } else {
                headerText1 += '<th class="rnkh_font">מקום</th>\n'; //  Id_Position
            }
            headerText1 += '<th class="rnkh_font">מספר</th>';
            headerText1 += '<th class="rnkh_font">שם</th>';
            
            for (q = 1; q <= laps; q++) {

                headerText1 += '<th class="rnkh_font">הקפה ' + q + '</th>';
            }
            
            headerText1 += '<th class="rnkh_font">זמן</th>';
            headerText1 += '<th class="rnkh_font">פער</th>';

        
        headerText1 += '</tr>';
      //   console.log(headerText1);
      //          console.log(temp);

         
        
                             // position change arrow/status prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;
                    allArray[l]["Id_Arrow"] = "&#9670;";
                
                    dnsfq = "";
                    if (allArray[l]["Id_Image"].includes("_Status10") || allArray[l]["Id_Image_2"].includes("_Status10")) {
                        allArray[l]["Id_Arrow"] = "DSQ";
                        dnsfq = "נפסל";
                    } else if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image_2"].includes("_Status11")) {
                        allArray[l]["Id_Arrow"] = "DNF";
                        dnsfq = "לא סיים";
                    } else if (allArray[l]["Id_Image"].includes("_Status12") || allArray[l]["Id_Image_2"].includes("_Status12")) {
                        allArray[l]["Id_Arrow"] = "DNS";
                        dnsfq = "לא התחיל";
                    } else if (allArray[l]["Id_Image"].includes("_Status2") || allArray[l]["Id_Image_2"].includes("_Status2")) {
                        allArray[l]["Id_Arrow"] = "NQ";
                        dnsfq = "ללא דירוג";
                    } else if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image_2"].includes("_Status")) {
                        allArray[l]["Id_Arrow"] = "&#10033;"; // astrix
                        dnsfq = "&#10033;";
                    } else if (allArray[l]["Id_penalty"].includes("P")) {
                        allArray[l]["Id_Arrow"] = "P"; // penalty
                    }




                    // calculating arrows status
                    competitorPosition = Number(allArray[l]["Id_Position"]);  // get the position value and clean penalty indicator
                     
                    if (firstPass == 0 && competitorPosition > 0 && competitorNumber > 0 && allArray[l]["Id_NbTour"] && allArray[l]["Id_TpsCumule"] != "-") { // position change arrow calc
                        
                        positionChanged = "";

                        if (positionArray[competitorNumber][0] < competitorPosition) {
                            allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'; // down :(
                            positionChanged = "lostPosition ";
                        } else if (positionArray[competitorNumber][0] > competitorPosition) {
                            allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'; // up :)
                            positionChanged = "gainedPosition ";
//                            } else if (positionArray[competitorNumber] == competitorPosition && !(allArray[l]["Id_Image"].includes("_Status")) && !(allArray[l]["Id_Image_2"].includes("_Status"))) {
//                        allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'; // same :|
                            //   positionChanged = "same ";
//                    }                        
                                
                        } else if (allArray[l]["Id_NbTour"] != positionArray[competitorNumber][1]) {
                            
                            positionChanged = "unChanged ";
                        }
                    
                        // console.log("competitorNumber: " + competitorNumber + ",competitorPosition: " + competitorPosition + ", positionArray:" + positionArray[competitorNumber]);
                        // positionArray[competitorNumber][0] = competitorPosition;// update array with current position for next Load calc
                    }
                               
                               
                    positionArray[competitorNumber] = [Number(allArray[l]["Id_Position"]), allArray[l]["Id_NbTour"]];// update array with current position and laps for next Load calc

                    // mark on track
                    if (allArray[l]["Id_onTrack"] == 1 && positionChanged == "" && !(allArray[l]["Id_Image"].includes("_Status")) && !(allArray[l]["Id_Image_2"].includes("_Status"))) {
                        allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'+allArray[l]["Id_penalty"]; // same :|
                             //   positionChanged = "same ";
                    }                        
        
/*        
            // add category name header and table header
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
                finalText += '<tr><td colspan="99" class="title_font">כללי</td></tr>' + headerText1;
            }
*/


            // add category name header and table header
            
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
                
                if (catFirst == 0) {
                    finalText += '</table>\n';
                }

                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1 + '\n';                
                                
                category = allArray[l]["Id_Categorie"];

            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
                                
                finalText += '<tr><td colspan="99" class="title_font">כללי</td></tr>' + headerText1 + '\n';
            }
            
            catFirst = 0;
            
            // DNF/DSQ
            if (cleanResults == 1) {
            
                if ((allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image"] == '_Status1') && useCategory == "yes" && dnfCategory != category) {
                    
                    finalText += '<tr><td colspan="99" class="subtitle_font">לא סיים - DNF</td></tr>\n';
                    dnfCategory = category;
                    
                } else if (allArray[l]["Id_Image"].includes("_Status10") && useCategory == "yes" && dsqCategory != category) {
                    
                    finalText += '<tr><td colspan="99" class="subtitle_font">נפסל - DSQ</td></tr>\n';
                    dsqCategory = category;
                    
                } else if (allArray[l]["Id_Image"].includes("_Status12") && useCategory == "yes" && dnsCategory != category) {
                    
                    finalText += '<tr><td colspan="99" class="subtitle_font">לא התחיל - DNS</td></tr>\n';
                    dnsCategory = category;
                }

            positionChanged = "";
            }
             
            
            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
            }
       
        
        
        
    //        for(var key in allArray[l]) {
    //        var opt3 = allArray[l][key];
 
            
    //          if (key != "Id_Ecart1erCategorie" && key != "Id_MeilleurTour" && key != "Id_PositionCategorie" && key != "Id_Image" && key != "Id_Arrow" && key != "Id_TpsTour1" && key != "Id_TpsTour2" && key != "Id_TpsTour3" && key != "Id_Categorie" && key != 'undefined' && key != null && key != "&nbsp;") {
                
                if (allArray[l]["Id_Image"].includes("_CheckeredFlag") || allArray[l]["Id_Image_2"].includes("_CheckeredFlag") || allArray[l]["Id_NbTour"] == proLaps || (allArray[l]["Id_Categorie"].includes("מתחילים") && allArray[l]["Id_NbTour"] == beginnersLaps) || ((allArray[l]["Id_Categorie"].includes('עממית') || allArray[l]["Id_Categorie"].includes("ג'וניור") || allArray[l]["Id_Categorie"].includes('סניורים')) && allArray[l]["Id_NbTour"] == notProLaps)) {
                    checkeredFlag = "finished ";
                } else {
                    checkeredFlag = "";
                }
                
            if (cleanResults == 0) {
      
                // add and style the status/arrow
                if (dnsfq != "") { 
                    
                    finalText += '<td aria-label="' + dnsfq + '" class="rnk_font dnsfq">' + allArray[l]["Id_Arrow"] + '</td>\n';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_MinusPosition")) { // red
                    
                    finalText += '<td class="' + checkeredFlag + 'red rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_PlusPosition")) { // green
                    
                    finalText += '<td class="' + checkeredFlag + 'green rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                }  else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td aria-label="סיים" class="finished white rnk_font">&nbsp;</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_TrackPassing")) { // white
                    
                    finalText += '<td aria-label="על המסלול" class="white rnk_font fadeIn">' + allArray[l]["Id_Arrow"] + '</td>';

                } else if (allArray[l]["Id_Arrow"] == "P") { // black
                    
                    finalText += '<td class="black rnk_font fadeIn">P</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == "&#9670;") { // white
                    
                    finalText += '<td class="rnk_font white scale">&#9670;</td>';
                    
                } else {

                    finalText += '<td class="orange rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';

                }
            }     
                
                if (allArray[l]["Id_Status"] == 1 || (checkeredFlag != "finished " && flagText[1] == '_Stop') || allArray[l]["Id_NbTour"] == 0) {
                    finalText += '<td class="rnk_font"></td>'; // add postion
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position"] + '</td>'; // add postion
                }
                
        // add and color competitor number        
       //         if (key == "Id_Numero") {
                    opt3 = allArray[l]["Id_Numero"];                        
                    opt4 = allArray[l]["Id_Categorie"];
                    
                    if (useCategory == "no") {
                        
                        if (opt4.toUpperCase().includes("E1") || opt4.toUpperCase().includes("MX2") || opt4.toUpperCase().includes("רוקיז")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font blackCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("E2")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font redCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("E3") || opt4.toUpperCase().includes("פתוחה")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font yellowCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("C1") || opt4.toUpperCase().includes("C2") || opt4.toUpperCase().includes("C3") || opt4.toUpperCase().includes("עממית")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font greenCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("ג'וניור מקצועי") || opt4.toUpperCase().includes("ג'וניור מתחילים")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font grayCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("סופר ג'וניור")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font blueCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("ג'וניור") || opt4.toUpperCase().includes("expert")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font orangeCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("סופר סניור") ||opt4.toUpperCase().includes("מתחילים") || opt4.toUpperCase().includes("MX1")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font whiteCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("סניור") || opt4.toUpperCase().includes("נשים")) {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font pinkCat">' + opt3 + '</td>';
                        } else {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font highlight">' + opt3 + '</td>';
                        }

                    } else {
                            finalText += '<td class="rnk_font highlight">' + opt3 + '</td>';
                    }


      //          } else {
      //              finalText += '<td class="rnk_font ">' + opt3 + '</td>';
      //          }
                 
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>';// add the name
// adding and coloring the laps and best time
// short version
             for (q = 1; q <= laps; q++) {
                if (q % 2 == 0) {
                    if (allArray[l]["Id_lap"+q] == bestLap2 && allArray[l]["Id_Numero"] == bestLapComp2) {
                        finalText += '<td class="BestTimeOverall rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                    } else if (allArray[l]["Id_lap"+q] != "-" && allArray[l]["Id_lap"+q] == allArray[l]["Id_MeilleurTour_2"] && allArray[l]["Id_NbTour"] > 3) {
                        finalText += '<td class="BestTime1 rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                    }
                } else {
                    if (allArray[l]["Id_lap"+q] == bestLap && allArray[l]["Id_Numero"] == bestLapComp) {
                        finalText += '<td class="BestTimeOverall rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                    } else if (allArray[l]["Id_lap"+q] != "-" && allArray[l]["Id_lap"+q] == allArray[l]["Id_MeilleurTour"] && allArray[l]["Id_NbTour"] > 2) {
                        finalText += '<td class="BestTime rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                    }
                }
             }               



/*
// long version
                if (allArray[l]["Id_lap1"] == bestTime && allArray[l]["Id_Numero"] == bestTimecomp) {
                    finalText += '<td class="BestTimeOverall rnk_font ">' + allArray[l]["Id_lap1"] + '</td>';
                } else if (allArray[l]["Id_lap1"] != "-" && allArray[l]["Id_lap1"] == allArray[l]["Id_MeilleurTour"]) {
                    finalText += '<td class="BestTime rnk_font ">' + allArray[l]["Id_lap1"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font ">' + allArray[l]["Id_lap1"] + '</td>';
                }
                if (allArray[l]["Id_lap2"] == bestTime2 && allArray[l]["Id_Numero"] == bestTime2comp) {
                    finalText += '<td class="BestTimeOverall rnk_font ">' + allArray[l]["Id_lap2"] + '</td>';
                } else if (allArray[l]["Id_lap2"] != "-" && allArray[l]["Id_lap2"] == allArray[l]["Id_MeilleurTour_2"]) {
                    finalText += '<td class="BestTime1 rnk_font ">' + allArray[l]["Id_lap2"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font ">' + allArray[l]["Id_lap2"] + '</td>';
                }
                if (allArray[l]["Id_lap3"] == bestTime && allArray[l]["Id_Numero"] == bestTimecomp) {
                    finalText += '<td class="BestTimeOverall rnk_font ">' + allArray[l]["Id_lap3"] + '</td>';
                } else if (allArray[l]["Id_lap3"] != "-" && allArray[l]["Id_lap3"] == allArray[l]["Id_MeilleurTour"]) {
                    finalText += '<td class="BestTime rnk_font ">' + allArray[l]["Id_lap3"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font ">' + allArray[l]["Id_lap3"] + '</td>';
                }
                if (allArray[l]["Id_lap4"] == bestTime2 && allArray[l]["Id_Numero"] == bestTime2comp) {
                    finalText += '<td class="BestTimeOverall rnk_font ">' + allArray[l]["Id_lap4"] + '</td>';
                } else if (allArray[l]["Id_lap4"] != "-" && allArray[l]["Id_lap4"] == allArray[l]["Id_MeilleurTour_2"]) {
                    finalText += '<td class="BestTime1 rnk_font ">' + allArray[l]["Id_lap4"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font ">' + allArray[l]["Id_lap4"] + '</td>';
                }
                if (allArray[l]["Id_lap5"] == bestTime && allArray[l]["Id_Numero"] == bestTimecomp) {
                    finalText += '<td class="BestTimeOverall rnk_font ">' + allArray[l]["Id_lap5"] + '</td>';
                } else if (allArray[l]["Id_lap5"] != "-" && allArray[l]["Id_lap5"] == allArray[l]["Id_MeilleurTour"]) {
                    finalText += '<td class="BestTime rnk_font ">' + allArray[l]["Id_lap5"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font ">' + allArray[l]["Id_lap5"] + '</td>';
                }
                if (allArray[l]["Id_lap6"] == bestTime2 && allArray[l]["Id_Numero"] == bestTime2comp) {
                    finalText += '<td class="BestTimeOverall rnk_font ">' + allArray[l]["Id_lap6"] + '</td>';
                } else if (allArray[l]["Id_lap6"] != "-" && allArray[l]["Id_lap6"] == allArray[l]["Id_MeilleurTour_2"]) {
                    finalText += '<td class="BestTime1 rnk_font ">' + allArray[l]["Id_lap6"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font ">' + allArray[l]["Id_lap6"] + '</td>';
                }
*/

                if (allArray[l]["Id_PenaliteTpsCumule"] != "-" && cleanResults == 0) {
                    finalText += '<td class="rnk_font penalty" aria-label="עונשין: ' + allArray[l]["Id_PenaliteTpsCumule"].replace('.000', '') + '">P ' + allArray[l]["Id_TpsCumule"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["timeP"] + allArray[l]["Id_TpsCumule"] + '</td>'; // add total time
                }
 
 
 
 
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>'; // add diff
 
                
     //       }

                 
                
      //      }    

                    finalText += '</tr>';

               
            }   // END l      
         
         

            finalText += '</table>\n</div>\n';
     

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
             console.log(allArray);

       //      console.log(positionArray);

    sessionStorage.setItem('positionArray', JSON.stringify(positionArray));
    
    firstPass = 0;      
    tableClass = "";
    
    if (cleanResults == 0) {

        finalText += '<div><ul><li style="width: fit-content;padding: 0 5px;background-color: rgba(219,42,255,.6);color: #fff;    text-shadow: none;">הקפה מהירה כללית</li><li style="width: fit-content;padding: 0 5px;background-color: rgba(54,220,24,.6);color: #222;text-shadow: none;">הקפה מהירה אישית ספיישל 1</li><li style="width: fit-content;padding: 0 5px;background-color: rgba(88,201,241,.6);color: #222;text-shadow: none;">הקפה מהירה אישית ספיישל 2</li></ul></div>';
    }

    return finalText

    };
        
    function timeString2ms(a,b){// time(HH:MM:SS.mss) // optimized
        return a=a.split('.'), // optimized
        b=a[1]*1||0, // optimized
        a=a[0].split(':'),
        b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
    };

    function ms2TimeString(a,k,s,m,h){
        return k=a%1e3, // optimized by konijn
        s=a/1e3%60|0,
        m=a/6e4%60|0,
        h=a/36e5%24|0,
        (h?(h<10?'0'+h:h)+':':'')+ // optimized
        (m<10?0:'')+m+':'+  // optimized
        (s<10?0:'')+s+'.'+ // optimized
        (k<100?k<10?'00':0:'')+k // optimized
    };

    function alignTable() {
        
        if (cleanResults == 0) {
                        
            // aligning table colmuns according to number of colmuns
            var tt = document.querySelectorAll('.line_color');

            for (let kk = 0; kk < tt.length; kk++) {

        /*
                var numCols = 0;

                for (let ii = 0; ii < tt[kk].rows.length; ii++) {//loop through HTMLTableRowElement

                    row = tt[kk].rows[ii];
                    
                    if (numCols < row.cells.length) { // find max number of colmuns
                        numCols = row.cells.length;
                    }
                    row = null;
                }
                var ddd = 90 / (numCols - 2); // 90% divided by number of columns - first 2 column
        */
                var trs = tt[kk].querySelectorAll('tr.rnkh_bkcolor');
                var tds = trs[0].querySelectorAll('th.rnkh_font');
/*
                if (tds.length > 15) {
                    tt[kk].classList.add("huge_table");
                } else if (tds.length > 11) {
                    tt[kk].classList.add("big_table");
                }
*/
                tt[kk].classList.add("big_table");

                var ddd = 90 / (tds.length - 2); // 90% divided by number of columns - first 2 column

                tt[kk].querySelectorAll('td.rnk_font:nth-child(-n+3)').forEach(function(element) { // first 3 column
                    element.style.width = "3%";
                });

                tt[kk].querySelectorAll('th.rnkh_font:nth-child(-n+3)').forEach(function(element) { // first 3 column 
                    element.style.width = "3%";
                });

                tt[kk].querySelectorAll('td.rnk_font:nth-child(n+4)').forEach(function(element) { // all from column 4
                    element.style.width = ddd + "%";
                });

                tt[kk].querySelectorAll('th.rnkh_font:nth-child(n+4)').forEach(function(element) { // all from column 4
                    element.style.width = ddd + "%";
                });
        //       console.log(kk + " " + numCols)
            }
        }
    }  

/*
 // another option to convert
    function timeToMs(time) {// time(HH:MM:SS.mss)
        a=time.split('.');
        mss=a[1];
        b=a[0].split(':');
        if (b[2]) {
            c=b[0]*3600+b[1]*60+b[2]*1;
        } else if (b[1]) {
            c=b[0]*60+b[1]*1;
        } else if (b[0]) {
            c=b[0]*1;
        } else {
            c = 0;
        }
    return (c+mss);
    };

 
    function msToTime(duration) {
        var milliseconds = parseInt(duration % 1000),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours).toString().padStart(2, "0");
        minutes = (minutes).toString().padStart(2, "0");
        seconds = (seconds).toString().padStart(2, "0");
        milliseconds = (milliseconds).toString().padStart(3, "0");
        if (hours == "00") {
            return minutes + ":" + seconds + "." + milliseconds;
        } else {
            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        }
    };

    function sortObjKeysAlphabetically(obj) {
        var ordered = {};
        Object.keys(obj).sort().forEach(function(key) {
        ordered[key] = obj[key];
        });
        return ordered;
    };
     

    function AfficherImageZoom(a, b) {
        "" != b ? (document.getElementById("ImageZoom").src = b, document.getElementById("ImageZoom").style.left = a.clientX + "px", document.getElementById("ImageZoom").style.top = a.clientY + "px", document.getElementById("ImageZoom").style.visibility = "visible") : document.getElementById("ImageZoom").style.visibility = "hidden"
    };
*/
