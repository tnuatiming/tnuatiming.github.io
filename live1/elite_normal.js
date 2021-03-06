<!-- 20180518 - array refactoring with all/category toggle, display arrows for position change -->
<!-- 20180522 - add fades and competitor info on arrows display -->
<!-- 20180523 - add competitor number color/background according to category -->
<!-- 20180527 - add message uploading -->
<!-- 20180607 - special edition for 2 specials run individually and computation done in live. special 1 live points to: https://tnuatiming.com/live1/livea/p1.html and special 2 live points to: https://tnuatiming.com/live1/liveb/p1.html -->
<!-- 20180610 - refactor special edition for 2 specials run individually and computation done in live, added laps time in correct order.  -->
<!-- 20180703 - added category best lap. added local storage for category or all button.  -->
<!-- 20180704 - added individual laps best lap (activated by "טסט" in folder name). added penalty indicator. -->
<!-- 20180709 - added option for cleaning the results for the results page (activated by "+++" in folder name). -->
<!-- 20180903 - added option for harescramble finish. -->

<!-- tag heuer live timing -->

<script type="text/javascript">

    var showBestLap = "1";
    var showIndividualLaps = "0";
    var showLapsNumber = "1";
    var hareScramble = "0";
    var cleanResults = "0"; // clean the table for coping to results page
    
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
    };

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
/*
        if (UrlChange) url = UrlRefresh;
        else UrlRefresh = url;
        UrlChange = 0;
*/
        if (TimerLoad) clearTimeout(TimerLoad);
        
        xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                document.getElementById(target).innerHTML = createLiveTable(xhr.responseText)
 //           } else {
 //               document.getElementById("categoryOrAll").style.display = "none";
            }
        };
        
        xhr.open("GET", url + "?r=" + Math.random(), true);
        xhr.send(null);
        fct = function() {
            Load(url, target)
        };
        populatePre('uploadMsg.txt','updates'); // upload message
  //      populatePre('uploadPr.txt','previousResults'); // upload previousResults
        TimerLoad = setTimeout(fct, Rafraichir)
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


    function createLiveTable(Text) {
        var i;
        var lines;
        competitorPosition = 0;
        competitorNumber = 0;
        competitorLaps = 0;
  //      var qqq = new Array();
  //      var hhh = new Array();
  //      var temp = new Array();
        var hhhPro = new Array();
        var lineArray = new Array();
        var allArray = new Array();
        var bestLapComp = 0;
        var bestLap = "99999999999";
        var bestTime = new Array();
        var categoryBestTime = new Array();
        var numberBestTime = new Array();
        var nameBestTime = new Array();
        var category = "&nbsp;";
        var ttt = 0;
        var b, q, z, f;
        var pp = 0;
        var positionChanged = "";
        var laps = 6; // number of laps 
        var penalty = "no";
        var dnfCategory = "";
        var dnsCategory = "";
        var dsqCategory = "";
        
        Text = Text.split('<table'); // split the text to title/time and the table
        Text[1] = Text[1].substring(Text[1].indexOf("<tr"),Text[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(Text[1]);

        lines = Text[1].split("\n");
        //    console.log(lines.length);
     //   console.log(lines);

        if (Text[0].includes("טסט")) { // will show individual laps for enduro special test
            showIndividualLaps = "1";
            showLapsNumber = "0";
        } else {
            showIndividualLaps = "0";
            showLapsNumber = "1";
        }

        if (Text[0].includes("סקרמבל") || Text[0].includes("הייר")) { // will show finished for enduro hareScramble
            hareScramble = "1";
        } else {
            hareScramble = "0";
        }

        if (Text[0].includes("דירוג") || Text[0].includes("דרוג")) { // will show diffrent colmuns for qualifying
            qualifying = "1";
        } else {
            qualifying = "0";
        }

        if (Text[0].includes("+++")) { // clean table for results page
            cleanResults = "1";
            Text[0] = Text[0].replace("+++", "");
        } else {
            cleanResults = "0";
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
        var finalText = Text[0]; // clear the finalText variable and add the title and time lines
           
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
                if (penalty == "yes") {
                    lineArray.Id_penalty = "P";
                } else {
                    lineArray.Id_penalty = "";
                }

                // find category best time
                if (showBestLap == "1") {
                    if (!(lineArray["Id_Categorie"] in categoryBestTime)) {
                        categoryBestTime[lineArray["Id_Categorie"]] = 99999999;
                        numberBestTime[lineArray["Id_Categorie"]] = "-";
                        nameBestTime[lineArray["Id_Categorie"]] = "-";
                    }
                    if (categoryBestTime[lineArray["Id_Categorie"]] > timeString2ms(lineArray["Id_MeilleurTour"]) && lineArray["Id_MeilleurTour"] != "-") {
                        categoryBestTime[lineArray["Id_Categorie"]] = timeString2ms(lineArray["Id_MeilleurTour"]);
                        numberBestTime[lineArray["Id_Categorie"]] = lineArray["Id_Numero"];
                        nameBestTime[lineArray["Id_Categorie"]] = lineArray["Id_Nom"];
                    }
                }
                allArray.push(lineArray); 
                lineArray = [];
                pp = 0;
                penalty = "no";
            } else if (lines[b].includes("<td ") && ttt == 1) {

                if (lines[b].includes("(C)")) {
                    penalty = "yes";
                }

                if ((typeof lines[b] != 'undefined') && (cleanResults == "1")) {
                    lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "P ");
                } else if (typeof lines[b] != 'undefined') {
                    lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");
                } else {
                    lineArray[hhhPro[pp]] = "-";
                }
                

                if (lines[b].includes("BestTimeOverall") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime[lineArray["Id_Numero"]] = " BestTimeOverall";
                } else if  (lines[b].includes("BestTime") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime[lineArray["Id_Numero"]] = " BestTime";
                } else if  (hhhPro[pp] == "Id_TpsTour") {
                    bestTime[lineArray["Id_Numero"]] = "";
                }
                // fix category not defined
                if (hhhPro[pp] == "Id_Categorie" && (lineArray[hhhPro[pp]] == "-" || lineArray[hhhPro[pp]] == "" || lineArray[hhhPro[pp]] == "&nbsp;" || typeof lineArray[hhhPro[pp]] == 'undefined')) {
                    lineArray[hhhPro[pp]] = "&nbsp;";   
                }

                // find best lap overall
                if (showIndividualLaps == "1") {
                
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

           
         // MAGIC sort the array after the merge to get new results
        if (useCategory == "yes") { // this sort discreminate aginst empty category so it shown last
            allArray.sort(function(a, b){return (a.Id_Categorie == "&nbsp;")-(b.Id_Categorie == "&nbsp;") || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_PositionCategorie - b.Id_PositionCategorie});
        }
    //    if (useCategory == "yes") {
    //        allArray.sort(function(a, b){return a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_PositionCategorie - b.Id_PositionCategorie});
    //    }
                   

            finalText += '<div id="liveTable"><table class="' + tableClass + 'line_color">';
            
            for (var l = 0; l < allArray.length; l++) {


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
                 if (allArray[l]["Id_TpsTour1"] && showIndividualLaps == "1") { 

                    var g = laps; // number of laps
                    for (q = g; q > -1; q--) { 

                        if ((allArray[l]["Id_TpsTour"+q] && allArray[l]["Id_TpsTour"+q] != "-") || q == 0) {
                                
                            var f = q;
                            for (z = 1; z <= g; z++)  {
                                
                                if (f > 0) {
                                    allArray[l]["Id_lap"+z] = allArray[l]["Id_TpsTour"+f];
                                } else {
                                    allArray[l]["Id_lap"+z] = "-";
                                }
                 
                                f--; 
                            }     
                
                            q = -1;
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
                            
                            
                            
                            
                            
            var headerText1 = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

    // semi hard coded header

            if (cleanResults != "1") {
                headerText1 += '<th class="rnkh_font" id="Id_Arrow"></th>';
            }

            headerText1 += '<th class="rnkh_font" id="Id_Position">מקום</th>';
            headerText1 += '<th class="rnkh_font" id="Id_Numero">מספר</th>';
            headerText1 += '<th class="rnkh_font" id="Id_Nom">שם</th>';
            
            if (showLapsNumber == "1") {
                headerText1 += '<th class="rnkh_font" id="Id_NbTour">הקפות</th>';
            }
            
            if (showIndividualLaps == "1" && allArray[l]["Id_lap1"]) {
                
                for (q = 1; q <= laps; q++) {
                    headerText1 += '<th class="rnkh_font" id="Id_lap'+q+'">הקפה '+q+'</th>';
                }
/*                
                headerText1 += '<th class="rnkh_font" id="Id_lap1">הקפה 1</th>';
                headerText1 += '<th class="rnkh_font" id="Id_lap2">הקפה 2</th>';
                headerText1 += '<th class="rnkh_font" id="Id_lap3">הקפה 3</th>';
                headerText1 += '<th class="rnkh_font" id="Id_lap4">הקפה 4</th>';
                headerText1 += '<th class="rnkh_font" id="Id_lap5">הקפה 5</th>';
                headerText1 += '<th class="rnkh_font" id="Id_lap6">הקפה 6</th>';
*/
            } else {
                if (cleanResults != "1") {
                    headerText1 += '<th class="rnkh_font" id="Id_TpsTour">הקפה אחרונה</th>';
                }
                headerText1 += '<th class="rnkh_font" id="Id_MeilleurTour">הקפה מהירה</th>';
            }
            
            if (qualifying == "0") {
                headerText1 += '<th class="rnkh_font" id="Id_TpsCumule">זמן</th>';
            }
            if (useCategory == "yes") {
                headerText1 += '<th class="rnkh_font" id="Id_Ecart1erCategorie">פער</th>';
            } else if (useCategory == "no") {
                headerText1 += '<th class="rnkh_font" id="Id_Ecart1er">פער</th>';
            }

        
        headerText1 += '</tr>';
      //   console.log(headerText1);
      //          console.log(temp);

        
        // position change arrow prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;
                    allArray[l]["Id_Arrow"] = "&#9670;";

                    if (allArray[l]["Id_Image"].includes("_Status10")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">';
                    } else if (allArray[l]["Id_Image"].includes("_Status11")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">';
                    } else if (allArray[l]["Id_Image"].includes("_Status12")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_dns.svg" alt="dns">';
                    } else if (allArray[l]["Id_Image"].includes("_Status2")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_nq.svg" alt="nq">';
                    } else if (allArray[l]["Id_Image"].includes("_Status")) {
                        allArray[l]["Id_Arrow"] = '<img class="dnsfq" src="Images/_status.svg" alt="status">'; // astrix
                    } else if (allArray[l]["Id_penalty"].includes("P")) {
                        allArray[l]["Id_Arrow"] = "P"; // penalty
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
                    
                        if (positionArray[competitorNumber] && (allArray[l]["Id_NbTour"] > 0 || (qualifying == "1" && allArray[l]["Id_TpsTour"] != "-"))) {

                            if (positionArray[competitorNumber] < competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'; // down :(
                                positionChanged = "lostPosition ";
                            } else if (positionArray[competitorNumber] > competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'; // up :)
                                positionChanged = "gainedPosition ";
                            }
                        }
                        // console.log("competitorNumber: " + competitorNumber + ",competitorPosition: " + competitorPosition + ", positionArray:" + positionArray[competitorNumber]);
                        positionArray[competitorNumber] = competitorPosition;// update array with current position for next Load calc
                    }
       
        // blink the competitor line when change

                if (allArray[l]["Id_NbTour"]) {
                    competitorLaps = allArray[l]["Id_NbTour"]; 
                
                    if (competitorLaps != lapsArray[competitorNumber] && positionChanged == "") { 
                        
                        positionChanged = "unChanged "; // blink the competitor line                       
                    }
                    
                    lapsArray[competitorNumber] = competitorLaps;// update array with current laps count for next Load calc
                }
       
       // mark on track
                if ((positionChanged == "" || positionChanged == "unChanged ") && (allArray[l]["Id_Image"].includes("_TrackPassing") || allArray[l]["Id_Canal"] == "1") && !(allArray[l]["Id_Image"].includes("_Status"))) {
                    allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'+allArray[l]["Id_penalty"]; // same :|
                        //   positionChanged = "same ";
                }                        
         
        
            // add category name header and table header
            if (allArray[l]["Id_PositionCategorie"] == 1 && useCategory == "yes") {

                if (showBestLap == "1" && category != "&nbsp;" && category != "קטגוריה כללית" && numberBestTime[category] != "-") {

                    categoryBestTime[category] = ms2TimeString(categoryBestTime[category]);
                    
                    if (categoryBestTime[category].toString().substring(0, 3) == "00:") {
                        categoryBestTime[category] = categoryBestTime[category].substr(3);
                    }
                    if (categoryBestTime[category].toString().substring(0, 1) == "0" && categoryBestTime[category].includes(":")) {
                        categoryBestTime[category] = categoryBestTime[category].substr(1);
                    }

                    finalText += '<tr><td colspan="99" class="comment_font">הקפה מהירה: ('+numberBestTime[category]+') '+nameBestTime[category]+' - '+categoryBestTime[category]+'</td></tr>';
                }
            
            finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;                
                
                category = allArray[l]["Id_Categorie"];
                
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
                finalText += '<tr><td colspan="99" class="title_font">כללי</td></tr>' + headerText1;
            }


            // DNF/DSQ
            
            if (allArray[l]["Id_Image"].includes("_Status11") && useCategory == "yes" && dnfCategory != category && cleanResults == "1") {
                
                finalText += '<tr><td colspan="99" class="subtitle_font">לא סיים - DNF</td></tr>';
                dnfCategory = category;
            } else if (allArray[l]["Id_Image"].includes("_Status10") && useCategory == "yes" && dsqCategory != category && cleanResults == "1") {
                
                finalText += '<tr><td colspan="99" class="subtitle_font">נפסל - DSQ</td></tr>';
                dsqCategory = category;
            } else if (allArray[l]["Id_Image"].includes("_Status12") && useCategory == "yes" && dnsCategory != category && cleanResults == "1") {
                
                finalText += '<tr><td colspan="99" class="subtitle_font">לא התחיל - DNS</td></tr>';
                dnsCategory = category;
            }
            
            
            if (l % 2 == 0) {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
                } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
                    
                }
       
         
        
    //        for(var key in allArray[l]) {
    //        var opt3 = allArray[l][key];
 
            

                // hare scramble
                var harescrambleFinished = 0;
                if (hareScramble == "1") {
                    
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
                
                if (allArray[l]["Id_Image"].includes("_CheckeredFlag") || (!(allArray[l]["Id_Image"].includes("_Status")) && showIndividualLaps == "1" && (allArray[l]["Id_Image"].includes("_CheckeredFlag") || (allArray[l]["Id_NbTour"] == laps) || (allArray[l]["Id_NbTour"] == (laps-2) && allArray[l]["Id_Categorie"].includes("מתחילים")) || (allArray[l]["Id_NbTour"] == (laps-1) && !(allArray[l]["Id_Categorie"].toUpperCase().includes("E")))))) {
                    var checkeredFlag = "finished ";
                } else if (!(allArray[l]["Id_Image"].includes("_Status")) && harescrambleFinished == 1 ) {
                    var checkeredFlag = "finished ";
                } else {
                    var checkeredFlag = "";
                }
                 
                // add and style the status/arrow

            if (cleanResults != "1") {
                
                 if (allArray[l]["Id_Arrow"].includes("dnsfq")) { 
                    
                    finalText += '<td class="dnsfq rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_MinusPosition")) { // red
                    
                    finalText += '<td class="' + checkeredFlag + 'red rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_PlusPosition")) { // green
                    
                    finalText += '<td class="' + checkeredFlag + 'green rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td class="finished black rnk_font">'+allArray[l]["Id_penalty"]+'</td>';
                    
                } else if (allArray[l]["Id_Arrow"].includes("_TrackPassing")) { // black
                    
                    finalText += '<td class="black rnk_font fadeIn">' + allArray[l]["Id_Arrow"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == "P") { // black
                    
                    finalText += '<td class="black rnk_font fadeIn">P</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == "&#9670;") { // white
                    
                    finalText += '<td class="white rnk_font scale">&#9670;</td>';
                    
                } else {

                    finalText += '<td class="orange rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';

                }
                
            }
                
                if (useCategory == "yes") {
                    if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_NbTour"] == 0 || allArray[l]["Id_NbTour"] == "-" || (qualifying == "1" && allArray[l]["Id_TpsTour"] == "-")) {
                        finalText += '<td class="rnk_font"></td>';
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_PositionCategorie"] + '</td>';
                    }
                } else if (useCategory == "no") {
                    if (allArray[l]["Id_Image"].includes("_Status") && (cleanResults == "1")) {
                        
                        
                        if (allArray[l]["Id_Image"].includes("_Status11")) {
                            finalText += '<td class="rnk_font"><img class="dnsfq" src="Images/_dnf.svg" alt="dnf"></td>';
                        } else if (allArray[l]["Id_Image"].includes("_Status10")) {
                            finalText += '<td class="rnk_font"><img class="dnsfq" src="Images/_dsq.svg" alt="dsq"></td>';
                        } else if (allArray[l]["Id_Image"].includes("_Status12")) {
                            finalText += '<td class="rnk_font"><img class="dnsfq" src="Images/_dns.svg" alt="dns"></td>';
                        } else if (allArray[l]["Id_Image"].includes("_Status2")) {
                            finalText += '<td class="rnk_font"><img class="dnsfq" src="Images/_nq.svg" alt="nq"></td>';
                        } else if (allArray[l]["Id_Image"].includes("_Status")) {
                        finalText += '<td class="rnk_font"><img class="dnsfq" src="Images/_status.svg" alt="status"></td>'; // astrix
                        }    
                        
                        
                        
                    } else if (allArray[l]["Id_Image"].includes("_Status")) {
                        finalText += '<td class="rnk_font"></td>';
                    } else {
                        
                        if (allArray[l]["Id_Position"].includes("P")) {
                            finalText += '<td class="rnk_font penalty">' + allArray[l]["Id_Position"] + '</td>';
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Position"] + '</td>';
                        }
                        
                    }
                    
                }
            
                
       //         if (key == "Id_Numero") {
                    var opt3 = allArray[l]["Id_Numero"];                        
                    var opt4 = allArray[l]["Id_Categorie"];
                    
                    if (useCategory == "no" && (Text[0].includes("מוטוקרוס") || Text[0].includes("אנדורו"))) {
                        
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

                    } else if (useCategory == "no") {
                            finalText += '<td aria-label="' + opt4 + '" class="rnk_font highlight">' + opt3 + '</td>';
                    } else {
                            finalText += '<td class="rnk_font highlight">' + opt3 + '</td>';
                    }


      //          } else {
      //              finalText += '<td class="rnk_font ">' + opt3 + '</td>';
      //          }
                 
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>';
                if (showLapsNumber == "1") {

                    if (typeof allArray[l]["Id_NbTour"] != 'undefined') {
                        
                        if (allArray[l]["Id_NbTour"].includes("P")) {
                            finalText += '<td class="rnk_font penalty">' + allArray[l]["Id_NbTour"] + '</td>';
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_NbTour"] + '</td>';
                        }

                    } else {
                        finalText += '<td class="rnk_font">-</td>';
                    }                
                }

                if (showIndividualLaps == "1" && allArray[l]["Id_lap1"]) {

        // adding and coloring the laps and best time
        // short version
                    for (q = 1; q <= laps; q++) {
                            if (allArray[l]["Id_lap"+q] == bestLap && allArray[l]["Id_Numero"] == bestLapComp) {
                                finalText += '<td class="BestTimeOverall rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                            } else if (allArray[l]["Id_lap"+q] != "-" && allArray[l]["Id_lap"+q] == allArray[l]["Id_MeilleurTour"]) {
                                finalText += '<td class="BestTime rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                            } else {
                                finalText += '<td class="rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                            }
                    }               


/*
                    for (q = 1; q <= laps; q++) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_lap"+q] + '</td>';
                    }
 /*                   
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap1"] + '</td>';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap2"] + '</td>';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap3"] + '</td>';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap4"] + '</td>';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap5"] + '</td>';
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_lap6"] + '</td>';
*/
                } else {

                    if (cleanResults != "1") {
                        finalText += '<td class="rnk_font' + bestTime[competitorNumber] + '">' + allArray[l]["Id_TpsTour"] + '</td>';
                    }
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_MeilleurTour"] + '</td>';
                }

                if (qualifying == "0") {
                    if (typeof allArray[l]["Id_TpsCumule"] != 'undefined') {
                        if (allArray[l]["Id_TpsCumule"].includes("P")) {
                            finalText += '<td class="rnk_font penalty">' + allArray[l]["Id_TpsCumule"] + '</td>';
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule"] + '</td>';
                        }
                    } else {
                        finalText += '<td class="rnk_font">-</td>';
                    }                
                }
                    
                if (useCategory == "yes") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1erCategorie"] + '</td>';
                } else if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>';
                }
                
     //       }
                
      //      }    

                finalText += '</tr>';

            }        
                
            if (useCategory == "yes" && showBestLap == "1" && numberBestTime[category] != "-" && category != "קטגוריה כללית" && category != "&nbsp;") {

                    categoryBestTime[category] = ms2TimeString(categoryBestTime[category]);
                    
                    if (categoryBestTime[category].toString().substring(0, 3) == "00:") {
                        categoryBestTime[category] = categoryBestTime[category].substr(3);
                    }
                    if (categoryBestTime[category].toString().substring(0, 1) == "0" && categoryBestTime[category].includes(":")) {
                        categoryBestTime[category] = categoryBestTime[category].substr(1);
                    }

                finalText += '<tr><td colspan="99" class="comment_font">הקפה מהירה: ('+numberBestTime[category]+') '+nameBestTime[category]+' - '+categoryBestTime[category]+'</td></tr>';
            }
/*         
         for (var key in categoryBestTime) {
    
 //console.log(key+'  '+ms2TimeString(categoryBestTime[key]));
   
                    finalText += '<tr>';
                        finalText += '<td colspan="99" class="comment_font">'+key+' הקפה מהירה: ('+numberBestTime[key]+') '+nameBestTime[key]+' - '+ms2TimeString(categoryBestTime[key])+'</td>';
                    finalText += '</tr>';
      
    
        }
*/



                finalText += '</table></div>';
     

         
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
         //    console.log(finalText);
      




tableClass = "";
            
    return finalText

    };
/*
    function sortObjKeysAlphabetically(obj) {
        var ordered = {};
        Object.keys(obj).sort().forEach(function(key) {
        ordered[key] = obj[key];
        });
        return ordered;
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
*/
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

    function AfficherImageZoom(a, b) {
        "" != b ? (document.getElementById("ImageZoom").src = b, document.getElementById("ImageZoom").style.left = a.clientX + "px", document.getElementById("ImageZoom").style.top = a.clientY + "px", document.getElementById("ImageZoom").style.visibility = "visible") : document.getElementById("ImageZoom").style.visibility = "hidden"
    };

</script>
