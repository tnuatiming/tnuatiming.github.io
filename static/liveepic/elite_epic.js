// 20180518 - array refactoring with all/category toggle, display arrows for position change 
// 20180522 - add fades and competitor info on arrows display 
// 20180523 - add competitor number color/background according to category 
// 20180527 - add message uploading 
// 20180607 - special edition for 2 specials run individually and computation done in live. special 1 live points to: https://tnuatiming.com/live1/livea/p1.html and special 2 live points to: https://tnuatiming.com/live1/liveb/p1.html 
// 20180610 - refactor special edition for 2 specials run individually and computation done in live, added laps time in correct order.  
// 20180701 - added penalty indicator.  
// 20181030 - epic israel version.  

    var TimerLoad, TimerChange;
    var MaxNum, Rafraichir, Changement, ClassementReduit, ClassementReduitXpremier;
    var UrlRefresh, UrlChange;
    Rafraichir = 60000; // every 60 seconds
    Changement = 60000;
    MaxNum = 1;
    ClassementReduit = 1;
    ClassementReduitXpremier = 10;
    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    var lapsArray = []; // array with the previous laps count. updated every Load, used to show the position change arrow between Loads 
    
    var eventName = "";    
    
    var cleanResults = 0; // alignTable for TotalIndex
    
    var precision = "nottenth"; // "tenth" for 1 digit after the .
    
    var catcat = "None";
    if (sessionStorage.getItem('catcat')) {
        useCategory = sessionStorage.getItem('catcat');
    }
    var useCategory = "yes";
    if (sessionStorage.getItem('categoryOrAll')) {
        useCategory = sessionStorage.getItem('categoryOrAll');
    }
    
    var epictv = 0;

    var tableClass = "fadeIn ";
    var url1 = "https://tnuatiming.com/liveepic/p1.html";    
    var Text;

    function category(choice, cat){
        
        positionArray = []; // empting the array as the info inside is incorrect due to canging between position/category position.
        
        useCategory = choice;
        catcat = cat;
        if (catcat == "None") {
            sessionStorage.setItem('catcat', 'None');
        } else if (catcat == "Men") {
            sessionStorage.setItem('catcat', 'Men');
        } else if (catcat == "Women") {
            sessionStorage.setItem('catcat', 'Women');
        }



        if (useCategory == "yes") {
            sessionStorage.setItem('categoryOrAll', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('categoryOrAll', 'no');
        }

        if (useCategory == "yes" && catcat == "Men") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.remove("active");
            document.getElementById("Men").disabled = true;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Women") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.remove("active");
            document.getElementById("Women").disabled = true;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Mixed") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.remove("active");
            document.getElementById("Mixed").disabled = true;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Masters") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.remove("active");
            document.getElementById("Masters").disabled = true;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Grand") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.remove("active");
            document.getElementById("Grand").disabled = true;
        } else if (useCategory == "yes") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.remove("active");
            document.getElementById("displayCatButton").disabled = true;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "no") {
            document.getElementById("displayAllButton").classList.remove("active");
            document.getElementById("displayAllButton").disabled = true;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        }
        
        Rafraichir = 60000; // every 60 seconds

        tableClass = "fadeIn "; // make the table fadeIn on change
        
        Load('p1.html', 'result');
    };

    async function Load(url, target) {
        
        
        if (document.getElementById('epictv')){
            epictv = 1;
        }
                
        var loop;
        if (TimerLoad) clearTimeout(TimerLoad);

        if (useCategory == "yes" && catcat == "Men") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.remove("active");
            document.getElementById("Men").disabled = true;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Women") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.remove("active");
            document.getElementById("Women").disabled = true;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Mixed") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.remove("active");
            document.getElementById("Mixed").disabled = true;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Masters") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.remove("active");
            document.getElementById("Masters").disabled = true;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "yes" && catcat == "Grand") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.remove("active");
            document.getElementById("Grand").disabled = true;
        } else if (useCategory == "yes") {
            document.getElementById("displayAllButton").classList.add("active");
            document.getElementById("displayAllButton").disabled = false;
            document.getElementById("displayCatButton").classList.remove("active");
            document.getElementById("displayCatButton").disabled = true;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        } else if (useCategory == "no") {
            document.getElementById("displayAllButton").classList.remove("active");
            document.getElementById("displayAllButton").disabled = true;
            document.getElementById("displayCatButton").classList.add("active");
            document.getElementById("displayCatButton").disabled = false;
            document.getElementById("Men").classList.add("active");
            document.getElementById("Men").disabled = false;
            document.getElementById("Women").classList.add("active");
            document.getElementById("Women").disabled = false;
            document.getElementById("Mixed").classList.add("active");
            document.getElementById("Mixed").disabled = false;
            document.getElementById("Masters").classList.add("active");
            document.getElementById("Masters").disabled = false;
            document.getElementById("Grand").classList.add("active");
            document.getElementById("Grand").disabled = false;
        }

/*
        if (useCategory == "yes") {
            document.getElementById("displayCatButton").style.display = "none";        
            document.getElementById("displayAllButton").style.display = "block";        
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").style.display = "block";        
            document.getElementById("displayAllButton").style.display = "none";        
        }
*/

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
                    document.getElementById(target).innerHTML = createLiveTable(await response.text());
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
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    document.getElementById(target).innerHTML = createLiveTable(xhr.responseText);
                    alignTable();
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
        Rafraichir = 60000; // every 60 seconds

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
        var MaximumStageTime = 18000000; // Maximum stage time in miliseconds, 18000000=5hours
        var i;
        var timeGapDisplay = 1; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell
        var timeGapDisplayInter1 = 3; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell
        var raceEnded = 0;
        var doNotShowTime = 0; // dont display individuall time
        var lines;
        competitorPosition = 0;
        competitorNumber = 0;
        competitorLaps = 0;
//        var qqq = [];
//        var hhh = [];
        var hhhPro = [];
//        var temp = [];
        var lineArray = [];
        var allArray = [];
        var allArray2 = [];
        var allArray3 = [];
        var penalty = "no";
        var ttt = 0;
        var pp = 0;
        var b;
        var a;
        var id;
        var positionChanged = "";
        var bestLapComp = 0;
        var bestLap = "99999999999";
        var bestLapComp2 = 0;
        var bestLap2 = "99999999999";
        var laps = 12; // number of laps
        var NewCategoryHeader = "";
/*        
        var bestTime2comp = 0;
        var bestTime2 = 0;
        var bestTimecomp = 0;
        var bestTime = 0;
*/        
        var Inter1Leader = [];
        var l, m, leaderInter1Time, competitorLaps, leaderLaps, leaderTime, prevCompCat, competitorId_Inter1Time, imTheLeaderInter1, headerText1, competitorTime, eeee, ffff, gggg, single1, single2, checkeredFlag;

        Text = Text.split('<table'); // split the text to title/time and the table
        Text[1] = Text[1].substring(Text[1].indexOf("<tr"),Text[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(Text[1]);

        lines = Text[1].split("\n");
        //    console.log(lines.length);
     //   console.log(lines);

        var HeaderName = Text[0].split("\n");  
        var div = document.createElement("div");  
        div.innerHTML = HeaderName[0]; 
        var HeaderEventName = div.textContent || div.innerText || "";  
        var HeaderRaceName = HeaderEventName.split('-')[1].trim();  
     
    //    console.log(HeaderEventName);

        if (eventName != HeaderEventName) {  
            positionArray = []; 
            lapsArray = [];
        }
        
        eventName = HeaderEventName;  // tickerTest
        
        
        if (Text[0].includes("+++")) { // clean table for results page
            cleanResults = 1;
            timeGapDisplay = 1;
            timeGapDisplayInter1 = 1;
            Text[0] = Text[0].replace("+++", "");
        } else {
            cleanResults = 0;
        }

        if (Text[0].includes("---")) { // do not show individuall times
            doNotShowTime = 1;
            Text[0] = Text[0].replace("---", "");
        }

        if (Text[0].includes("_Stop.png") || Text[0].includes("_CheckeredFlag.png")) { // check if race ended
            raceEnded = 1;
        }
        
        if (cleanResults == 1) {
            var bigFont = '';
        } else {
            var bigFont = ' bigFont';
        }

        var finalText = Text[0]; // clear the finalText variable and add the title and time lines




         // console.log(allArray2);

            
        ttt = 0;
        pp = 0;
        penalty = "no";
  
            
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
                
                if (lineArray["Id_Categorie"] == 'חד יומי') {
                    allArray3.push(lineArray); // push line to main array 
                } else if (pair_num == 1) {
                    allArray.push(lineArray); // push line to main array 
                } else if (pair_num == 2) {
                    allArray2.push(lineArray); // push line to main array 
                }
               lineArray = [];
                pp = 0;
                penalty = "no";
            } else if (lines[b].includes("<td ") && ttt == 1) { // clean and add competitor cell
                if (lines[b].includes("(C)")) {
                    penalty = "yes";
                }
                lineArray.Id_Image_2 = "&nbsp;";
                lineArray.Id_MeilleurTour_2 = "&nbsp;";
                lineArray.Id_TpsCumule_2 = 99999999999;
                lineArray.Id_FinishTime = 99999999999;
                lineArray.Id_Inter1_2 = 99999999999;
                lineArray.Id_Inter1Time = 99999999999;
                lineArray.Id_Inter1Ecart1er = 99999999999; // maybe needs to be '-'
                lineArray.Id_Nom_2 = "&nbsp;";
                lineArray.Id_Nationalite_2 = "&nbsp;";
                lineArray.Id_Discipline_2 = "&nbsp;";
                lineArray.Id_Arrow = "&nbsp;";
                lineArray.Id_Status = 0;
                lineArray.blue = 0;
                lineArray.single = 0;
                lineArray.laps = 0; // replacing Id_NbTour as it not showing corectly the number of laps. using Id_TpsTour1
                lineArray.yellow = "";
                lineArray.Id_penalty = "&nbsp;";   

                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");
                // convert intermediate time to miliseconds
                if (hhhPro[pp] == "Id_Inter1" && lineArray[hhhPro[pp]] != "-" ) {
                    lineArray[hhhPro[pp]] = timeString2ms(lineArray[hhhPro[pp]]);   
                }
                if (hhhPro[pp] == "Id_Inter1" && lineArray[hhhPro[pp]] == "-" ) {
                    lineArray[hhhPro[pp]] = 99999999999;   
                }
                // convert total time to miliseconds
                if (hhhPro[pp] == "Id_TpsCumule" && lineArray[hhhPro[pp]] != "-" ) {
                    lineArray[hhhPro[pp]] = timeString2ms(lineArray[hhhPro[pp]]);   
                }
                if (hhhPro[pp] == "Id_TpsTour1" && lineArray[hhhPro[pp]] != "-" ) {
                    lineArray["laps"] = 1;   
                }
                if (hhhPro[pp] == "Id_TpsCumule" && lineArray[hhhPro[pp]] == "-" ) {
                    lineArray[hhhPro[pp]] = 99999999999;   
                }
                if (hhhPro[pp] == "Id_Categorie" && lineArray[hhhPro[pp]] == '&nbsp;' ) {
                    lineArray[hhhPro[pp]] = "&nbsp;";   
                }
                if (hhhPro[pp] != "Id_Categorie" && lineArray[hhhPro[pp]] == 'undefined' ) {
                    lineArray[hhhPro[pp]] = "-";   
                }
                if (hhhPro[pp] == "Id_Numero" && lineArray[hhhPro[pp]] != "-" ) {
                    var pair_num = String(lineArray[hhhPro[pp]]).slice(-1);
                    var main_num = String(lineArray[hhhPro[pp]]).slice(0, -1);
                    lineArray[hhhPro[pp]] = main_num;

                        lineArray["Id_Numero_Full"] = main_num + '-' + pair_num;
               }
/*
                if (lines[b].includes("BestTimeOverall") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime=lineArray["Id_TpsTour"];
                    bestTimecomp=lineArray["Id_Numero"];
                }
*/
                // find best lap overall
                    if (hhhPro[pp] == "Id_TpsTour" && lineArray[hhhPro[pp]] != "-" && timeString2ms(lineArray[hhhPro[pp]]) <= timeString2ms(bestLap)) {
                    bestLap = lineArray[hhhPro[pp]];
                    bestLapComp = lineArray["Id_Numero"];
                    }

                pp += 1;
      //    console.log(lineArray);
       //   console.log(bestLapComp+"  "+bestLap);

            }
            
        }

     //    console.log(hhh);
     //    console.log(hhhPro);

     //             console.log(qqq);
      //   console.log(hhhPro2);
         //                console.log(allArray);

     //    console.log(allArray);
         // console.log(allArray2);

        for (b = 0; b < allArray.length; b++) {  // main array
            for (a = 0; a < allArray2.length; a++) { 

/*                // calculating total time and total laps from both arrays
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"] && allArray[b]["Id_TpsCumule"] != 99999999999 && allArray2[a]["Id_TpsCumule"] != 99999999999) {
                    
          //          allArray[b]["Id_TpsCumule"] = allArray[b]["Id_TpsCumule"] + allArray2[a]["Id_TpsCumule"];
                }
*/            
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                    
                    
                    
                                if (allArray[b]["Id_Discipline"] == 'single') {
                                    
                                    allArray[b]["laps"] = 2 * allArray2[b]["laps"]; // need to 2* the laps as it 1 rider and not 2 
                                    
                                } else if (allArray[a]["Id_Discipline"] == 'single') {
                                    
                                    allArray[b]["laps"] = 2 * allArray[a]["laps"];
                                    
                                } else {
                    
                                    allArray[b]["laps"] = allArray[b]["laps"] + allArray2[a]["laps"];
                                }
                }

                
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                    
                    // transfer fields from secound array to the first that nedded later, use _2 to mark
                    allArray[b]["Id_Image_2"] = allArray2[a]["Id_Image"];   
                    allArray[b]["Id_MeilleurTour_2"] = allArray2[a]["Id_MeilleurTour"];   // fastest lap
                    allArray[b]["Id_Nom_2"] = allArray2[a]["Id_Nom"];
                    allArray[b]["Id_Numero_Full_2"] = allArray2[a]["Id_Numero_Full"];
                    allArray[b]["Id_Nationalite_2"] = allArray2[a]["Id_Nationalite"];
                    allArray[b]["Id_TpsCumule_2"] = allArray2[a]["Id_TpsCumule"];
                    
                    if (typeof allArray2[a]["Id_Inter1"] != 'undefined') {
                        allArray[b]["Id_Inter1_2"] = allArray2[a]["Id_Inter1"];
                    }
                    if (typeof allArray[b]["Id_Inter1"] == '-') {
                        allArray[b]["Id_Inter1"] = 99999999999;
                    }
                    if (typeof allArray2[a]["Id_Discipline"] != 'undefined') {
                        allArray[b]["Id_Discipline_2"] = allArray2[a]["Id_Discipline"];
                    }
                    if (allArray[b]["Id_Discipline_2"] == 'yellow' || allArray[b]["Id_Discipline"] == 'yellow') {
                        allArray[b]["yellow"] = '<span title="Finished" class="Flag YellowShirt"></span>';
                    }

 
                    // find finish time and check for 2 minutes diffrance
                                
                                if (allArray[b]["Id_Discipline"] == 'single') {
                                    allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule"]);
                                    allArray[b]["single"] = 1;
                                } else if ( allArray[b]["Id_Discipline_2"] == 'single') {
                                    allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule_2"]);
                                    allArray[b]["single"] = 1;
                                } else if (allArray[b]["Id_TpsCumule"] != 99999999999 && allArray[b]["Id_TpsCumule_2"] != 99999999999) {
                                    if (allArray[b]["Id_TpsCumule"] > allArray[b]["Id_TpsCumule_2"]) {
                                        allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule"]);
                                    }
                                    else if (allArray[b]["Id_TpsCumule"] <= allArray[b]["Id_TpsCumule_2"]) {
                                        allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule_2"]);
                                    } else {
                                        allArray[b]["Id_FinishTime"] = 99999999999;
                                    }
                                   
                                    
                                    if (Math.abs(allArray[b]["Id_TpsCumule"] - allArray[b]["Id_TpsCumule_2"]) > 120000) { // check more then 2 minutes apart
                                        allArray[b]["Id_FinishTime"] = 99999999999;
                                        allArray[b].blue = 1; // make blue DSQ
                                    }
                                   
                                    
                                    
                                } else if (raceEnded == 1 && (allArray[b]["Id_TpsCumule"] == 99999999999 || allArray[b]["Id_TpsCumule_2"] == 99999999999)) {
                                    
                                    allArray[b]["Id_FinishTime"] = 99999999999;
                                    allArray[b].blue = 1; // make blue DSQ
                                    
                                }

 // make blue if exeed MaximumStageTime, ENABLE after testing
                                if (allArray[b]["Id_FinishTime"] != 99999999999 && allArray[b]["Id_FinishTime"] > MaximumStageTime) {
                                    allArray[b]["Id_FinishTime"] = 99999999999;
                                    allArray[b].blue = 1; // make blue DSQ
                                }
                
                
                
                    // find intermediate time 1 and check for 2 minutes diffrance
                                if ( allArray[b]["Id_Discipline"] == 'single') {
                                    allArray[b]["Id_Inter1Time"] = Number(allArray[b]["Id_Inter1"]);
                                    allArray[b]["single"] = 1;
                                } else if ( allArray[b]["Id_Discipline_2"] == 'single') {
                                    allArray[b]["Id_Inter1Time"] = Number(allArray[b]["Id_Inter1_2"]);
                                    allArray[b]["single"] = 1;
                                } else if (allArray[b]["Id_Inter1"] != 99999999999 && allArray[b]["Id_Inter1_2"] != 99999999999) {
                                    if (allArray[b]["Id_Inter1"] > allArray[b]["Id_Inter1_2"]) {
                                        allArray[b]["Id_Inter1Time"] = Number(allArray[b]["Id_Inter1"]);
                                    }
                                    else if (allArray[b]["Id_Inter1"] <= allArray[b]["Id_Inter1_2"]) {
                                        allArray[b]["Id_Inter1Time"] = Number(allArray[b]["Id_Inter1_2"]);
                                    } else {
                                        allArray[b]["Id_Inter1Time"] = 99999999999;
                                    }
                                   
                                    
                                    if (Math.abs(allArray[b]["Id_Inter1"] - allArray[b]["Id_Inter1_2"]) > 120000) { // check more then 2 minutes apart
                                        allArray[b]["Id_Inter1Time"] = 99999999999;
                                        allArray[b].blue = 1; // make blue DSQ
                                        allArray[b].Id_Inter1blue = 1; // make blue DSQ
                                    } else {
                                        allArray[b].Id_Inter1blue = 0; 
                                    }
                                   
                                }                

                                
                        // update intermediate 1 leader array 
                        if (typeof Inter1Leader["overall"] == 'undefined') { // overall
                            Inter1Leader["overall"] = 99999999999;
                            
                        }
                        if (allArray[b]["Id_Inter1Time"] != 99999999999 && Inter1Leader["overall"] > allArray[b]["Id_Inter1Time"]) {
                            
                            Inter1Leader["overall"] = allArray[b]["Id_Inter1Time"];
                        }

                        if (typeof Inter1Leader[allArray[b]["Id_Categorie"]] == 'undefined') { // category
                            Inter1Leader[allArray[b]["Id_Categorie"]] = 99999999999;
                            
                        }
                        if (allArray[b]["Id_Inter1Time"] != 99999999999 && Inter1Leader[allArray[b]["Id_Categorie"]] > allArray[b]["Id_Inter1Time"]) {
                            
                            Inter1Leader[allArray[b]["Id_Categorie"]] = allArray[b]["Id_Inter1Time"];
                        }
                    
                
             //   console.log(Inter1Leader);
                
                
                
                    //combine class
                    if (allArray[b]["Id_Classe"] == "blue" || allArray2[a]["Id_Classe"] == "blue") {                    
                        allArray[b]["Id_Classe"] = "blue";
                    }
                
                
                }
         
                
                 if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                     


                    if (allArray2[a]["Id_penalty"] == "P") {
                    allArray[b].Id_penalty = "P";   
                    }
                    
             //       allArray[b].Id_TpsTour_2 = allArray2[a]["Id_TpsTour"];   // last lap
                    
                    if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status") || allArray[b]["blue"] == 1) {// FIXME Id_Status drops blue competitor to buttom , check if this is what needed
                        allArray[b].Id_Status = 1;
                    } else {
                        allArray[b].Id_Status = 0;
                    }
               }
               
                
            } 
        }
         // delete the secound array
         allArray2 = [];
         

// FIXME   SORTING WORKS ONLY IF THERE IS ONE LAP. IF THE RACE IS LONGER NEEDED TO ADD "|| b.laps - a.laps" BEFORE "|| a.Id_FinishTime - b.Id_FinishTime". THIS IS THEORETICAL, NOT CHECKED!!!

         // THE MAGIC - sort the array after the merge to get new results
         // FIXME Id_Status drops blue competitor to buttom , check if this is what needed
        if (useCategory == "no") {
            
            
 // calculate categorie position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.Id_Classe.localeCompare(b.Id_Classe) || b.laps - a.laps || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);

            }
 // END calculate categorie position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.Id_Classe.localeCompare(b.Id_Classe) || b.laps - a.laps || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.Id_Classe.localeCompare(b.Id_Classe) || b.laps - a.laps || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);

            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.Id_Classe.localeCompare(b.Id_Classe) || b.laps - a.laps || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
         
         
// HEADER              
                            
        headerText1 = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

    // hard coded header for now
        if (cleanResults == 0) {

                //  headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
                    headerText1 += '<th colspan="2" class="rnkh_font Id_Position"><div>CAT</div><div>GC</div></th>';
        } else {
                    headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
                    headerText1 += '<th class="rnkh_font Id_Position">CAT</th>';
                    headerText1 += '<th class="rnkh_font Id_Position">GC</th>';
        }

                    headerText1 += '<th class="rnkh_font Id_Numero">Nr</th>';


        if (cleanResults == 0) {

                    if (useCategory == "no") {
                        headerText1 += '<th class="rnkh_font Id_Categorie">CAT</th>';
                    }            
                    headerText1 += '<th class="rnkh_font Id_Nom">Name</th>';
            //        headerText1 += '<th class="rnkh_font Id_Nom_2">מתחרה 2</th>';

                    if (doNotShowTime == 0) {
                        headerText1 += '<th class="rnkh_font Id_TpsCumule">Individual Time</th>';
                    }
                    //      headerText1 += '<th class="rnkh_font Id_TpsCumule_2">זמן 2</th>';
                        headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
                    if (timeGapDisplayInter1 == 1) {
                        headerText1 += '<th class="rnkh_font Id_Inter1Ecart1er">Inter. 1 GAP</th>'; // intermediate 1 time diff
                    }

        } else {
                    headerText1 += '<th class="rnkh_font Id_Numero_Full">Rider 1 Nr</th>';
                    
                    headerText1 += '<th class="rnkh_font Id_Nom">Rider 1</th>';
                    if (doNotShowTime == 0) {
                        headerText1 += '<th class="rnkh_font Id_TpsCumule">Time Rider 1</th>';
                    }
                    headerText1 += '<th class="rnkh_font Id_Numero_Full_2">Rider 2 Nr</th>';
                    headerText1 += '<th class="rnkh_font Id_Nom_2">Rider 2</th>';
                    if (doNotShowTime == 0) {
                        headerText1 += '<th class="rnkh_font Id_TpsCumule_2">Time Rider 2</th>';
                    }
                    if (useCategory == "no") {
                        headerText1 += '<th class="rnkh_font Id_Categorie">CAT</th>';
                    }            
                    headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
                    if (timeGapDisplayInter1 == 1) {
                        headerText1 += '<th class="rnkh_font Id_Inter1Ecart1er">Inter. 1 Gap</th>'; // intermediate 1 time diff
                    }
            
        }


                    headerText1 += '<th class="rnkh_font Id_FinishTime">Time</th>'; // combined time
                    
                    if (timeGapDisplay == 1) {
                        headerText1 += '<th class="rnkh_font Id_Ecart1er">Gap</th>';
                    }
                
        headerText1 += '</tr>';
        
       //    console.log(headerText1);

// END HEADER
 
         
    // fix the position fields of the competitors and start building the final table
            m = 0;
            prevCompCat = ""

//            finalText += '<div id="liveTable"><table class="' + tableClass + 'line_color">';

            if (useCategory == "no") {
                finalText += '\n<div id="liveTable"><table class="' + tableClass + 'line_color">\n';
            } else {

                finalText += '\n<div id="liveTable">\n';
            }           

            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
                 if (useCategory == "no") {
                    allArray[l]["Id_Position"] = l+1;
                    allArray[l]["Id_Position_Overall"] = l+1;
                 } else if (useCategory == "yes") {
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position"] = m;
                    allArray[l]["Id_Position_Categorie"] = m;
                 }


                 
                 
                 
                 
                           if (allArray[l]["Id_Position"] == 1) {
                                leaderTime = allArray[l]["Id_FinishTime"];
                                leaderLaps = allArray[l]["laps"];
                            }

                                    // fix the diff fields of the competitors
                                competitorLaps = allArray[l]["laps"];
                                
                                
                                if (useCategory == "yes") {
                                    leaderInter1Time = Inter1Leader[allArray[l]["Id_Categorie"]];
                                } else {
                                    leaderInter1Time = Inter1Leader["overall"];
                                }
                                
                                imTheLeaderInter1 = 0;
                                if (allArray[l]["Id_Inter1Time"] == leaderInter1Time) {
                                    imTheLeaderInter1 = 1;
                                }

                                // diff on intermediate 1 time
                                if (allArray[l]["Id_Inter1Time"] != 99999999999) {
                                    competitorId_Inter1Time = allArray[l]["Id_Inter1Time"];
                                    if (competitorId_Inter1Time != leaderInter1Time && (competitorId_Inter1Time - leaderInter1Time) > 0 && (competitorId_Inter1Time - leaderInter1Time) < 86400000) { // check time is between 0 and 24h
                                    allArray[l]["Id_Inter1Ecart1er"] = ms2TimeString(competitorId_Inter1Time - leaderInter1Time);

                                    if (allArray[l]["Id_Inter1Ecart1er"].toString().substring(0, 3) == "00:") {
                                        allArray[l]["Id_Inter1Ecart1er"] = allArray[l]["Id_Inter1Ecart1er"].substr(3);
                                    }
                                    if (allArray[l]["Id_Inter1Ecart1er"].toString().substring(0, 1) == "0" && allArray[l]["Id_Inter1Ecart1er"].includes(":")) {
                                        allArray[l]["Id_Inter1Ecart1er"] = allArray[l]["Id_Inter1Ecart1er"].substr(1);
                                    }
                                     
                                    } else {
                                    allArray[l]["Id_Inter1Ecart1er"] = "-";
                                    }
                                } else {
                                    allArray[l]["Id_Inter1Ecart1er"] = "-";
                                }






                                // diff on total time
                                if (competitorLaps == leaderLaps) {
                                    competitorTime = allArray[l]["Id_FinishTime"];
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
                                
                            if (allArray[l]["Id_Inter1Time"] != 99999999999) {  
                                allArray[l]["Id_Inter1Time"] = ms2TimeString(allArray[l]["Id_Inter1Time"]);

                                
                                if (allArray[l]["Id_Inter1Time"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_Inter1Time"] = allArray[l]["Id_Inter1Time"].substr(3);
                                }
                                if (allArray[l]["Id_Inter1Time"].toString().substring(0, 1) == "0" && allArray[l]["Id_Inter1Time"].includes(":")) {
                                    allArray[l]["Id_Inter1Time"] = allArray[l]["Id_Inter1Time"].substr(1);
                                }
                                
                            }
                                
                                
                                
                                
                                
                            if (allArray[l]["Id_FinishTime"] != 99999999999) {  
                                allArray[l]["Id_FinishTime"] = ms2TimeString(allArray[l]["Id_FinishTime"]);

                                
                                if (allArray[l]["Id_FinishTime"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_FinishTime"] = allArray[l]["Id_FinishTime"].substr(3);
                                }
                                if (allArray[l]["Id_FinishTime"].toString().substring(0, 1) == "0" && allArray[l]["Id_FinishTime"].includes(":")) {
                                    allArray[l]["Id_FinishTime"] = allArray[l]["Id_FinishTime"].substr(1);
                                }
                                
                            }
                                
                                
                            if (allArray[l]["Id_TpsCumule"] != 99999999999) {  
                                allArray[l]["Id_TpsCumule"] = ms2TimeString(allArray[l]["Id_TpsCumule"]);

                                
                                if (allArray[l]["Id_TpsCumule"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_TpsCumule"] = allArray[l]["Id_TpsCumule"].substr(3);
                                }
                                if (allArray[l]["Id_TpsCumule"].toString().substring(0, 1) == "0" && allArray[l]["Id_TpsCumule"].includes(":")) {
                                    allArray[l]["Id_TpsCumule"] = allArray[l]["Id_TpsCumule"].substr(1);
                                }
                                
                            }

                            if (allArray[l]["Id_TpsCumule_2"] != 99999999999) {  
                                allArray[l]["Id_TpsCumule_2"] = ms2TimeString(allArray[l]["Id_TpsCumule_2"]);

                                
                                if (allArray[l]["Id_TpsCumule_2"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_TpsCumule_2"] = allArray[l]["Id_TpsCumule_2"].substr(3);
                                }
                                if (allArray[l]["Id_TpsCumule_2"].toString().substring(0, 1) == "0" && allArray[l]["Id_TpsCumule_2"].includes(":")) {
                                    allArray[l]["Id_TpsCumule_2"] = allArray[l]["Id_TpsCumule_2"].substr(1);
                                }
                                
                            }
                            
                            
        
        
                             // position change arrow/status prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;
                    
                    if (allArray[l]["Id_Image"].includes("_Status10") || allArray[l]["Id_Image_2"].includes("_Status10") || (allArray[l]["blue"] == 1 && allArray[l]["Id_Classe"] == "blue")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">';
                    } else if (allArray[l]["Id_Image"].includes("_Status5") || allArray[l]["Id_Image_2"].includes("_Status5")) {
                        allArray[l]["blue"] = 1; //FIXME
                    } else if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image_2"].includes("_Status11")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">';
                    } else if (allArray[l]["Id_Image"].includes("_Status12") || allArray[l]["Id_Image_2"].includes("_Status12")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dns.svg" alt="dns">';
                        allArray[l]["blue"] = 1;
                    } else if (allArray[l]["Id_Image"].includes("_Status2") || allArray[l]["Id_Image_2"].includes("_Status2")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_nq.svg" alt="nq">';
                    } else if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image_2"].includes("_Status")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_status.svg" alt="status">'; // astrix
                    } else if (allArray[l]["Id_penalty"].includes("P")) {
                        allArray[l]["Id_Arrow"] = "P"; // penalty
                    } else {
                            allArray[l]["Id_Arrow"] = "&nbsp;"; 
                    }




                    // calculating arrows status
                    if (allArray[l]["Id_Position"]) { 
                            competitorPosition = Number(allArray[l]["Id_Position"]);  // get the position value and clean penalty indicator
                    }
                     
                    if (competitorPosition > 0 && competitorNumber > 0 && allArray[l]["laps"] && allArray[l]["Id_FinishTime"] != 99999999999) { // position change arrow calc
                    positionChanged = "";
                    
                        if (positionArray[competitorNumber]) {

                            if (positionArray[competitorNumber] < competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'; // down :(
                                positionChanged = "down ";
                            } else if (positionArray[competitorNumber] > competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'; // up :)
                                positionChanged = "up ";
//                            } else if (positionArray[competitorNumber] == competitorPosition && !(allArray[l]["Id_Image"].includes("_Status")) && !(allArray[l]["Id_Image_2"].includes("_Status"))) {
//                        allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'; // same :|
                             //   positionChanged = "same ";
//                    }                        
                                 
                            }                            
                        }
                        // console.log("competitorNumber: " + competitorNumber + ",competitorPosition: " + competitorPosition + ", positionArray:" + positionArray[competitorNumber]);
                        positionArray[competitorNumber] = competitorPosition;// update array with current position for next Load calc
                    }
       
/*                    // mark on track
                    if (positionChanged == "" && !(allArray[l]["Id_Image"].includes("_Status")) && !(allArray[l]["Id_Image_2"].includes("_Status"))) {
                        allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'+allArray[l]["Id_penalty"]; // same :|
                             //   positionChanged = "same ";
                    }                        
*/        
        




                 
                 
    if (((catcat != "None" && allArray[l]["Id_Categorie"] == catcat && useCategory == "yes") || (catcat == "None" && useCategory == "yes") || useCategory == "no")  && epictv == 0) {
                 
// if ((allArray[l]["Id_Position"] < 6 && epictv == 1) || (epictv == 0)) { // TV show only 2 competitors








// add category name header and table header
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0) { // add table end tag
                    finalText += '</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
                            
                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1 + '\n';                
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerText1;
                    finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerText1 + '\n';
            }
            
            
            
            
            
/*
if (cleanResults == 0) {

            if (l % 2 == 0) { // start building competitor line
                finalText += '<tbody class="line">\n<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
            } else {
                finalText += '<tbody class="line">\n<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
            }
} else {
            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
            }
}
 */       
            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
            }
        
        
    //        for(var key in allArray[l]) {
    //        var opt3 = allArray[l][key];
 
            
    //          if (key != "Id_Ecart1erCategorie" && key != "Id_MeilleurTour" && key != "Id_PositionCategorie" && key != "Id_Image" && key != "Id_Arrow" && key != "Id_TpsTour1" && key != "Id_TpsTour2" && key != "Id_TpsTour3" && key != "Id_Categorie" && key != 'undefined' && key != null && key != "&nbsp;") {
                
                if (allArray[l]["Id_FinishTime"] != 99999999999 && allArray[l]["blue"] == 0) {
                    checkeredFlag = "finished ";
                } else {
                    checkeredFlag = "";
                }
                
                
                
                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"].includes("dnsfq") && allArray[l]["blue"] == 1) {
                    finalText += '<td aria-label="DNF/DSQ" class="orange blued rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';

                } else if (allArray[l]["Id_Arrow"].includes("dnsfq")) { // orange
                    
                    finalText += '<td aria-label="DNF/DSQ" class="orange rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["blue"] == 1) {
                
                    finalText += '<td aria-label="Blue Board Rider" class="blued rnk_font">&nbsp;</td>'; //&#9608;

                } else if (allArray[l]["Id_Arrow"].includes("_MinusPosition")) { // red
                    
                    finalText += '<td class="' + checkeredFlag + 'red rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_PlusPosition")) { // green
                    
                    finalText += '<td class="' + checkeredFlag + 'green rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td aria-label="Finished" class="finished white rnk_font">&nbsp;</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_TrackPassing")) { // white
                    
                    finalText += '<td class="white rnk_font fadeIn">' + allArray[l]["Id_Arrow"] + '</td>';

                    
                } else if (allArray[l]["Id_Arrow"] == "&#9671;") { // white
                    
                    finalText += '<td class="white rnk_font fadeIn">'+allArray[l]["Id_penalty"]+'&#9671;</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == "P") { // black
                    
                    finalText += '<td class="black rnk_font fadeIn">P</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == "&nbsp;") { // white
                    
                    finalText += '<td class="white rnk_font scale">&#9670;</td>';
                    
                } else {

                    finalText += '<td class="black rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';

                }
                
                if (allArray[l]["Id_Image"].includes("_Status") || (allArray[l]["Id_Inter1Time"] == 99999999999 && allArray[l]["Id_FinishTime"] == 99999999999) || allArray[l]["Id_Classe"] == "blue" || allArray[l]["single"] == 1) {
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show postion if status or no finish time
                } else {
                    if (cleanResults == 0) {

                        finalText += '<td class="rnk_font"><div>' + allArray[l]["Id_Position_Categorie"] + '</div><div>' + allArray[l]["Id_Position_Overall"] + '</div></td>'; 
                        
                    } else if (cleanResults == 1) {
                        
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; 
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; 
                    }
                    
                }

                
                if (allArray[l]["Id_Classe"] == "blue") {
                finalText += '<td title="Blue Board Rider" class="rnk_font blueCard ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else if (allArray[l]["yellow"] != "") {
                finalText += '<td class="rnk_font yellowCard ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td class="rnk_font highlight ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                }

                if (useCategory == "no" && cleanResults == 0) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; 
                }            

                single1 = "";
                single2 = "";
                
                if (allArray[l]["Id_Discipline_2"] == 'single') {
                    single2 = "lineThrough";
                }
                if (allArray[l]["Id_Discipline"] == 'single') {
                    single1 = "lineThrough";
                }
                

                if (cleanResults == 0) {
     //               finalText += '<div class="FirstLine">';
                    eeee = '<div class="FirstLine ' + single2 + '">';
                    ffff = '<div class="SecoundLine ' + single1 + '">';
                    gggg = '</div>';
               } else {
                    
                    eeee = '';
                    ffff = '';
                    gggg = '</td>';
                }
                
                if (cleanResults == 1) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full"] + '</td>'; // add rider 1 number
                }
                
                if (allArray[l]["Id_TpsCumule"] != 99999999999 && allArray[l]["Id_TpsCumule_2"] == 99999999999 && cleanResults == 0 && allArray[l]["single"] == 0) { // only rider 1 finished at this point
                    finalText += '<td class="rnk_font">' + eeee + '<span title="Finished" class="Flag CheckeredFlag"></span>' + allArray[l]["Id_Nom"];// add the name
                    if (typeof allArray[l]["Id_Nationalite"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                        
//                        if (cleanResults == 0) {
                                
                            finalText += '<span title="' + allArray[l]["Id_Nationalite"] + '" class="Flag ' + single2 + ' ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>' + allArray[l]["yellow"]; // add flag
 //                       }
                    }
                    finalText += gggg;// add the name
                    
                } else {
                    finalText += '<td class="rnk_font">' + eeee + allArray[l]["Id_Nom"];// add the name
                    if (typeof allArray[l]["Id_Nationalite"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
    //                    if (cleanResults == 0) {
                            finalText += '<span title="' + allArray[l]["Id_Nationalite"] + '" class="Flag ' + single2 + ' ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>' + allArray[l]["yellow"]; // add flag
    //                    }
                    }
                    finalText += gggg;// add the name
                }

    //            if (cleanResults == 0) {
    //                finalText += '</div>';
    //            }
                
                
                
                
                
         //       finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>';// add the name
                if (cleanResults == 0) {
       //             finalText += '<div class="SecoundLine">';
                    
                    
                    
                    if (allArray[l]["Id_TpsCumule"] == 99999999999 && allArray[l]["Id_TpsCumule_2"] != 99999999999 && allArray[l]["single"] == 0) { // only rider 2 finished at this point
                        finalText += ffff + '<span title="Finished" class="Flag CheckeredFlag"></span>' + allArray[l]["Id_Nom_2"];// add the name
                        if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
    //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                            finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>' + allArray[l]["yellow"]; // add flag
                        }
                        finalText += '</div></td>';// add the name
                        
                    } else {
                        finalText += ffff + allArray[l]["Id_Nom_2"];// add the name
                        if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
    //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                            finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>' + allArray[l]["yellow"]; // add flag
                        }
                        finalText += '</div></td>';// add the name
                    }
                   
                     
      //              finalText += '</div>';
                    
                }
                
                
            if (doNotShowTime == 0) {
                
      //          if (cleanResults == 0) {
     //               finalText += '<div class="FirstLine">';
      //          }
                
                if (allArray[l]["Id_TpsCumule"] == 99999999999) {
                    finalText += '<td class="rnk_font">' + eeee + '-' + gggg; // add time
                } else {
                    finalText += '<td class="rnk_font">' + eeee + allArray[l]["Id_TpsCumule"] + gggg; // add time
                }

      //          if (cleanResults == 0) {
     //               finalText += '</div>';
     //           }
                
                
                
                 if (cleanResults == 0) {
     //               finalText += '<div class="SecoundLine">';
               
                
                
                
                  if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                    finalText += '<div class="SecoundLine">-</div></td>'; // add time
                } else {
                    finalText += '<div class="SecoundLine">' + allArray[l]["Id_TpsCumule_2"] + '</div></td>'; // add time
                }
              
                
                
                
                
                    
           //         finalText += '</div>';
                    
                }
                
            }          
                
                if (cleanResults == 1) {
                                            
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full_2"] + '</td>'; // add rider 2 number

                    finalText += '<td class="rnk_font ' + single1 + '">' + allArray[l]["Id_Nom_2"]; // add the name
                    if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                        finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>'; // add flag
                    }
                    finalText += '</td>';// add the name
                    
            if (doNotShowTime == 0) {
                    if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // add time
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule_2"] + '</td>'; // add time
                    }
            }
                    if (useCategory == "no") {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; 
                    }            
                        
                }
                
      //          if (overTheTime == "yes") {
                // make color change FIXME
                
                
// intermediate time 1
                if (timeGapDisplayInter1 == 1) {
                    if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // add intermediate time
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Inter1Time"] + '</td>'; // add intermediate time
                    }
        //          } else {
        //             finalText += '<td class="rnk_font">' + allArray[l]["Id_Inter1Time"] + '</td>'; // add intermediate time
        //         }
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Inter1Ecart1er"] + '</td>'; // add diff
                } else if (timeGapDisplayInter1 == 2) {
                    
                    if (allArray[l]["Id_Inter1blue"] == 1) {
                                                
                        finalText += '<td title="Blue Board Rider" class="rnk_font"><span class="Flag blueFlag"></span></td>'; // add intermediate blue

                    
                    } else if (imTheLeaderInter1 == 1) {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font"><span class="Flag numberOne"></span>' + allArray[l]["Id_Inter1Time"] + '</td>'; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter1Ecart1er"] == '-') {
                            finalText += '<td class="rnk_font">-</td>'; // add diff
                        } else {
                            finalText += '<td class="rnk_font">+' + allArray[l]["Id_Inter1Ecart1er"] + '</td>'; // add diff
                        }
                    }
                } else if (timeGapDisplayInter1 == 3) {
                    
                    if (allArray[l]["Id_Inter1blue"] == 1) {
                                                
                        finalText += '<td title="Blue Board Rider" class="rnk_font"><span class="Flag blueFlag"></span></td>'; // add intermediate blue

                    
                    } else if (imTheLeaderInter1 == 1) {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font"><div class="bold">' + allArray[l]["Id_Inter1Time"] + '</div><span class="Flag numberOne"></span></td>'; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += '<td class="rnk_font"><div>-</div>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font"><div class="bold">' + allArray[l]["Id_Inter1Time"] + '</div>'; // add intermediate time
                        }

                        if (allArray[l]["Id_Inter1Ecart1er"] == '-') {
                            finalText += '<div>-</div></td>'; // add diff
                        } else {
                            finalText += '<div>+' + allArray[l]["Id_Inter1Ecart1er"] + '</div></td>'; // add diff
                        }
                    }
                }
// END intermediate 1              

                
// TOTAL TIME & GAP                
                
                if (timeGapDisplay == 1) {
                    if (allArray[l]["Id_FinishTime"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // add total time
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>'; // add total time
                    }
        //          } else {
        //             finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>'; // add total time
        //         }
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>'; // add diff
                } else if (timeGapDisplay == 2) {
                    if (allArray[l]["Id_Position"] == 1) {
                        if (allArray[l]["Id_FinishTime"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>'; // add total time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Ecart1er"] == '-') {
                            finalText += '<td class="rnk_font">-</td>'; // add diff
                        } else {
                            finalText += '<td class="rnk_font">+' + allArray[l]["Id_Ecart1er"] + '</td>'; // add diff
                        }
                    }
                } else if (timeGapDisplay == 3) {
                    if (allArray[l]["Id_Position"] == 1) {
                        if (allArray[l]["Id_FinishTime"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font"><div class="bold">' + allArray[l]["Id_FinishTime"] + '</div></td>'; // add total time
                        }
                        
                    } else {
                        if (allArray[l]["Id_FinishTime"] == 99999999999) {
                            finalText += '<td class="rnk_font"><div>-</div>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font"><div class="bold">' + allArray[l]["Id_FinishTime"] + '</div>'; // add total time
                        }

                        if (allArray[l]["Id_Ecart1er"] == '-') {
                            finalText += '<div>-</td>'; // add diff
                        } else {
                            finalText += '<div>+' + allArray[l]["Id_Ecart1er"] + '</td>'; // add diff
                        }
                    }
                }
                
                
        //       }

                
      //      }    

                    finalText += '</tr>\n';
                   
/*
            if (cleanResults == 0) {        
                    
                if (l % 2 == 0) { // start building competitor line
                    finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
                } else {
                    finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
                }
                        
                if (allArray[l]["Id_TpsCumule"] == 99999999999 && allArray[l]["Id_TpsCumule_2"] != 99999999999 && allArray[l]["single"] == 0) {
                    finalText += '<td class="rnk_font"><span title="Finished" class="Flag CheckeredFlag"></span>' + allArray[l]["Id_Nom_2"];// add the name
                    if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                        finalText += '<span class="Flag ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>'; // add flag
                    }
                    finalText += '</td>';// add the name
                    
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom_2"];// add the name
                    if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                        finalText += '<span class="Flag ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>'; // add flag
                    }
                    finalText += '</td>';// add the name
                }
                        
     //               finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom_2"] + '</td>'; // add the name
                        
            if (doNotShowTime == 0) {
                        
                if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                    finalText += '<td class="rnk_font">-</td>'; // add time
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule_2"] + '</td>'; // add time
                }
            }                   
                finalText += '</tr>\n</tbody>\n';
            }
*/
 



 } // end show only category X



if ((epictv == 1 && allArray[l]["Id_Position"] < 6 && allArray[l]["single"] == 0 && allArray[l]["Id_Status"] == 0) && ((catcat != "None" && allArray[l]["Id_Categorie"] == catcat && useCategory == "yes") || (catcat == "None" && useCategory == "yes") || useCategory == "no")) { // TV show only 5 competitors
    
    
    
 // HEADER for tv            
                            
        headerTexttv = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

        
                    headerTexttv += '<th class="rnkh_font Id_Position">Rank</th>';
                    headerTexttv += '<th class="rnkh_font Id_Nom">Name</th>';
                    headerTexttv += '<th class="rnkh_font Id_Nom">Nation</th>';
                    headerTexttv += '<th class="rnkh_font Id_Numero">Nr</th>';
                    headerTexttv += '<th class="rnkh_font Id_FinishTime">Time</th>'; // combined time

                  
        headerTexttv += '</tr>';
        
       //    console.log(headerTexttv);

// END HEADER for tv
   
   
    

            // add category name header and table header
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerTexttv;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0) { // add table end tag
                    finalText += '</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
//                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerTexttv + '\n';                
                            
                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font"><img class="CategoryHeader" src="Images/' + allArray[l]["Id_Categorie"].replace(" ", "").toLowerCase() + '.svg"></td></tr>' + headerTexttv + '\n';

                
                
                
                
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerTexttv;
                    finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerTexttv + '\n';
            }

    
    
            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="rnk_bkcolor EvenRow">';
            }
    
    
    
 
                if (useCategory == "no") {

                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; // add overall position
                
                } else {
                    
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; // add category position
                }
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + ' / ' + allArray[l]["Id_Nom_2"] + ' ' + allArray[l]["yellow"] + '</td>'; // add riders name
                
                finalText += '<td class="rnk_font"><span class="Flag ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>' + ' ' + '<span class="Flag ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span></td>'; // add flags

                finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero"] + '</td>'; // add number
                

                    if (allArray[l]["Id_Position"] == 1) {
                        if (allArray[l]["Id_FinishTime"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>'; // add total time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Ecart1er"] == '-') {
                            finalText += '<td class="rnk_font">-</td>'; // add diff
                        } else {
                            finalText += '<td class="rnk_font">+' + allArray[l]["Id_Ecart1er"] + '</td>'; // add diff
                        }
                    }

                
        finalText += '</tr>\n';
    
} // end TV

         
        }        // end for l
         
         
                finalText += '</table></div>';

 
 
 if (Array.isArray(allArray3) || allArray3.length != 0) {
 
     // build secound table
}        

         
          
             console.log(allArray);

         //    console.log(finalText);
      
    tableClass = "";
            
    return finalText

    };
        
    function timeString2ms(a,b){// time(HH:MM:SS.mss) // optimized
        return a=a.split('.'), // optimized
        b=a[1]*1||0, // optimized, if a[1] defined, use it, else use 0
        a=a[0].split(':'),
        b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
    };

    function ms2TimeString(a,k,s,m,h){
        if (precision == "tenth") {
            return k=a%1e3, // optimized by konijn
            s=a/1e3%60|0,
            m=a/6e4%60|0,
            h=a/36e5%24|0,
            (h?(h<10?'0'+h:h)+':':'')+ // optimized
            (m<10?0:'')+m+':'+  // optimized
            (s<10?0:'')+s+'.'+ // optimized
            (k<100?k<10?'':'':'')+k // optimized
        } else {
            return k=a%1e3, // optimized by konijn
            s=a/1e3%60|0,
            m=a/6e4%60|0,
            h=a/36e5%24|0,
            (h?(h<10?'0'+h:h)+':':'')+ // optimized
            (m<10?0:'')+m+':'+  // optimized
            (s<10?0:'')+s+'.'+ // optimized
            (k<100?k<10?'00':0:'')+k // optimized
/*    
if (k<100){
  if(k<10){
    message = '00'
  }else{
    message = 0
  }
} else {
  message = ''
}
*/    
        }
    };

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
    };

    function alignTable() {
        
        if (cleanResults == 0 && epictv == 0) {
            
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

                if (tds.length > 15) {
                    tt[kk].classList.add("huge_table");
                } else if (tds.length > 11) {
                    tt[kk].classList.add("big_table");
                }

                var ddd = 90 / (tds.length - 2); // 90% divided by number of columns - first 2 column

                tt[kk].querySelectorAll('td.rnk_font:nth-child(n+4)').forEach(function(element) { // all from column 4
                    element.style.width = ddd + "%";
                });

                tt[kk].querySelectorAll('th.rnkh_font:nth-child(n+3)').forEach(function(element) { // all from column 3
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
