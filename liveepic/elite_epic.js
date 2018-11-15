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
    Rafraichir = 10000;
    Changement = 60000;
    MaxNum = 1;
    ClassementReduit = 1;
    ClassementReduitXpremier = 10;
    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    var lapsArray = []; // array with the previous laps count. updated every Load, used to show the position change arrow between Loads 
    
    var useCategory = "yes";
    if (sessionStorage.getItem('categoryOrAll')) {
        useCategory = sessionStorage.getItem('categoryOrAll');
    }

    var tableClass = "fadeIn ";
    var url1 = "https://tnuatiming.com/liveepic/p1.html";    
    var text1;

    function category(choice){
        
        positionArray = []; // empting the array as the info inside is incorrect due to canging between position/category position.
        
        useCategory = choice;
        if (useCategory == "yes") {
            sessionStorage.setItem('categoryOrAll', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('categoryOrAll', 'no');
        }
        
        Rafraichir = 10000;

        tableClass = "fadeIn "; // make the table fadeIn on change
        
        Load('p1.html', 'result');
    };

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

    function createLiveTable(text1) {
        var i;
        var lines;
        competitorPosition = 0;
        competitorNumber = 0;
        competitorLaps = 0;
//        var qqq = new Array();
//        var hhh = new Array();
        var hhhPro = new Array();
//        var temp = new Array();
        var lineArray = new Array();
        var allArray = new Array();
        var allArray2 = new Array();
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
        /*        
        var bestTime2comp = 0;
        var bestTime2 = 0;
        var bestTimecomp = 0;
        var bestTime = 0;
*/        
        text1 = text1.split('<table'); // split the text to title/time and the table
        text1[1] = text1[1].substring(text1[1].indexOf("<tr"),text1[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(text1[1]);

        lines = text1[1].split("\n");
        //    console.log(lines.length);
     //   console.log(lines);


        
        var finalText = text1[0]; // clear the finalText variable and add the title and time lines




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
                
                if (pair_num == 1) {
                    allArray.push(lineArray); // push line to main array 
                }
                if (pair_num == 2) {
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
                lineArray.Id_Nom_2 = "&nbsp;";
                lineArray.Id_Arrow = "&nbsp;";
                lineArray.Id_Status = 0;
                lineArray.Id_penalty = "&nbsp;";   

                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");
                // convert total time to miliseconds
                if (hhhPro[pp] == "Id_TpsCumule" && lineArray[hhhPro[pp]] != "-" ) {
                    lineArray[hhhPro[pp]] = timeString2ms(lineArray[hhhPro[pp]]);   
                }
                if (hhhPro[pp] == "Id_TpsCumule" && lineArray[hhhPro[pp]] == "-" ) {
                    lineArray[hhhPro[pp]] = 99999999999;   
                }
                if (hhhPro[pp] == "Id_Categorie" && lineArray[hhhPro[pp]] == '&nbsp;' ) {
                    lineArray[hhhPro[pp]] = "כללי";   
                }
                if (hhhPro[pp] != "Id_Categorie" && lineArray[hhhPro[pp]] == 'undefined' ) {
                    lineArray[hhhPro[pp]] = "-";   
                }
                if (hhhPro[pp] == "Id_Numero" && lineArray[hhhPro[pp]] != "-" ) {
                    var pair_num = String(lineArray[hhhPro[pp]]).slice(-1);
                    lineArray[hhhPro[pp]] = String(lineArray[hhhPro[pp]]).slice(0, -1);
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

        for (b = 0; b < allArray.length; b++) { 
            for (a = 0; a < allArray2.length; a++) { 

                // calculating total time and total laps from both arrays
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"] && allArray[b]["Id_TpsCumule"] != 99999999999 && allArray2[a]["Id_TpsCumule"] != 99999999999) {
                    
          //          allArray[b]["Id_TpsCumule"] = allArray[b]["Id_TpsCumule"] + allArray2[a]["Id_TpsCumule"];
                }
            
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"] && allArray[b]["Id_NbTour"] != "-" && allArray2[a]["Id_NbTour"] != "-") {
                    
                    allArray[b]["Id_NbTour"] = Number(allArray[b]["Id_NbTour"]) + Number(allArray2[a]["Id_NbTour"]);
                }
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                    
                    // transfer fileds from secound array to the first that nedded later, use _2 to mark
                    allArray[b]["Id_Image_2"] = allArray2[a]["Id_Image"];   
                    allArray[b]["Id_MeilleurTour_2"] = allArray2[a]["Id_MeilleurTour"];   // fastest lap
                    allArray[b]["Id_Nom_2"] = allArray2[a]["Id_Nom"];
                    allArray[b]["Id_TpsCumule_2"] = allArray2[a]["Id_TpsCumule"];


 
                    // find finish time and check for 2 minutes diffrance
                                if (allArray[b]["Id_TpsCumule"] != 99999999999 && allArray[b]["Id_TpsCumule_2"] != 99999999999) {
                                    if (allArray[b]["Id_TpsCumule"] > allArray[b]["Id_TpsCumule_2"]) {
                                        allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule"]);
                                    }
                                    else if (allArray[b]["Id_TpsCumule"] <= allArray[b]["Id_TpsCumule_2"]) {
                                        allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule_2"]);
                                    } else {
                                        allArray[b]["Id_FinishTime"] = 99999999999;
                                    }
                                   
                                    
                                    if (Math.abs(allArray[b]["Id_TpsCumule"] - allArray[b]["Id_TpsCumule_2"]) > 120000) {
                                        allArray[b]["Id_FinishTime"] = 99999999999;
                                        allArray[b]["Id_Image"] = "_Status10"; // make DSQ
                                        allArray[b]["Id_Image_2"] = "_Status10"; // make DSQ
                                    }
                                    
                                   
                                    
                                    
                                }
                    }
         
                
                 if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                     


                    if (allArray2[a]["Id_penalty"] == "P") {
                    allArray[b].Id_penalty = "P";   
                    }
                    
             //       allArray[b].Id_TpsTour_2 = allArray2[a]["Id_TpsTour"];   // last lap
                    
                    if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status")) {
                        allArray[b].Id_Status = 1;
                    } else {
                        allArray[b].Id_Status = 0;
                    }
               }
               
                
            } 
        }
         // delete the secound array
         allArray2 = [];
         
         // THE MAGIC - sort the array after the merge to get new results
        if (useCategory == "no") {
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.Id_Classe.localeCompare(b.Id_Classe) || a.Id_FinishTime - b.Id_FinishTime || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        } else if (useCategory == "yes") {
            allArray.sort(function(a, b){return a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.Id_Classe.localeCompare(b.Id_Classe) || a.Id_FinishTime - b.Id_FinishTime || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
         
         

         
    // fix the position fields of the competitors and start building the final table
            var m = 0;
            var prevCompCat = ""

            finalText += '<div id="liveTable"><table class="' + tableClass + 'line_color">';
            
            for (var l = 0; l < allArray.length; l++) {

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
                                var leaderTime = allArray[l]["Id_FinishTime"];
                                var leaderLaps = allArray[l]["Id_NbTour"];
                            }

                                    // fix the diff fields of the competitors
                                var competitorLaps = allArray[l]["Id_NbTour"];

                                if (competitorLaps == leaderLaps) {
                                    var competitorTime = allArray[l]["Id_FinishTime"];
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
                            
                            
                            
                            
        var headerText1 = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

    // hard coded header for now
            headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
            headerText1 += '<th class="rnkh_font Id_Position">מקום</th>';
            headerText1 += '<th class="rnkh_font Id_Numero">מספר</th>';
            headerText1 += '<th class="rnkh_font Id_Nom">מתחרה 1</th>';
            headerText1 += '<th class="rnkh_font Id_Nom_2">מתחרה 2</th>';
            if (useCategory == "no") {

            headerText1 += '<th class="rnkh_font Id_Categorie">קטגוריה</th>';
            }            
            headerText1 += '<th class="rnkh_font Id_TpsCumule">זמן 1</th>';
            headerText1 += '<th class="rnkh_font Id_TpsCumule_2">זמן 2</th>';
            headerText1 += '<th class="rnkh_font Id_FinishTime">זמן כולל</th>';
            headerText1 += '<th class="rnkh_font Id_Ecart1er">פער</th>';

        
        headerText1 += '</tr>';
      //   console.log(headerText1);
      //          console.log(temp);

         
        
                             // position change arrow/status prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;
                    
                    if (allArray[l]["Id_Image"].includes("_Status10") || allArray[l]["Id_Image_2"].includes("_Status10")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">';
                    } else if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image_2"].includes("_Status11")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">';
                    } else if (allArray[l]["Id_Image"].includes("_Status12") || allArray[l]["Id_Image_2"].includes("_Status12")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dns.svg" alt="dns">';
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
                     
                    if (competitorPosition > 0 && competitorNumber > 0 && allArray[l]["Id_NbTour"] && allArray[l]["Id_FinishTime"] != 99999999999) { // position change arrow calc
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
        
            // add category name header and table header
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
                finalText += '<tr><td colspan="99" class="title_font">כללי</td></tr>' + headerText1;
            }


            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
            }
       
        
        
        
    //        for(var key in allArray[l]) {
    //        var opt3 = allArray[l][key];
 
            
    //          if (key != "Id_Ecart1erCategorie" && key != "Id_MeilleurTour" && key != "Id_PositionCategorie" && key != "Id_Image" && key != "Id_Arrow" && key != "Id_TpsTour1" && key != "Id_TpsTour2" && key != "Id_TpsTour3" && key != "Id_Categorie" && key != 'undefined' && key != null && key != "&nbsp;") {
                
                if (allArray[l]["Id_Image"].includes("_CheckeredFlag") || allArray[l]["Id_Image_2"].includes("_CheckeredFlag")) {
                    var checkeredFlag = "finished ";
                } else {
                    var checkeredFlag = "";
                }
                
                
                
                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"].includes("_Status")) { // orange
                    
                    finalText += '<td class="orange rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_MinusPosition")) { // red
                    
                    finalText += '<td class="' + checkeredFlag + 'red rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_PlusPosition")) { // green
                    
                    finalText += '<td class="' + checkeredFlag + 'green rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td class="finished white rnk_font">&nbsp;</td>';
                    
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
                
                if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_FinishTime"] == 99999999999 || allArray[l]["Id_Classe"] == "blue") {
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show postion if status or no finish time
                } else {
                    
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position"] + '</td>'; // add postion
                }

                
                if (allArray[l]["Id_Classe"] == "blue") {
                finalText += '<td style="color:#111; background-color:lightblue;" class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                } else if (allArray[l]["Id_Categorie"] == "g c" && useCategory == "no") {
                finalText += '<td style="color:white; background-color:red;" class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                }

                
                
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>';// add the name
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom_2"] + '</td>'; // add the name
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; 
                }            

                if (allArray[l]["Id_TpsCumule"] == 99999999999) {
                    finalText += '<td class="rnk_font">-</td>'; // add time
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule"] + '</td>'; // add time
                }
                
                if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                    finalText += '<td class="rnk_font">-</td>'; // add time
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule_2"] + '</td>'; // add time
                }
                
      //          if (overTheTime == "yes") {
                // make color change FIXME

                
                if (allArray[l]["Id_FinishTime"] == 99999999999) {
                finalText += '<td class="rnk_font">-</td>'; // add total time
                } else {
                finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>'; // add total time
                }
      //          } else {
       //             finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>'; // add total time
       //         }
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>'; // add diff
     //       }

                 
                
      //      }    

                    finalText += '</tr>';

               
            }        
         
         
                finalText += '</table></div>';
     

         
          
          //   console.log(allArray);

         //    console.log(finalText);
      
    tableClass = "";
            
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
