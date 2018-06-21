<!-- 20180518 - array refactoring with all/category toggle, display arrows for position change -->
<!-- 20180522 - add fades and competitor info on arrows display -->
<!-- 20180523 - add competitor number color/background according to category -->
<!-- 20180527 - add message uploading -->
<!-- 20180607 - special edition for 2 specials run individually and computation done in live. special 1 live points to: https://tnuatiming.com/live1/livea/p1.html and special 2 live points to: https://tnuatiming.com/live1/liveb/p1.html -->
<!-- 20180610 - refactor special edition for 2 specials run individually and computation done in live, added laps time in correct order. 

<!-- tag heuer live timing -->

<script type="text/javascript">
    var TimerLoad, TimerChange;
    var MaxNum, Rafraichir, Changement, ClassementReduit, ClassementReduitXpremier;
    var UrlRefresh, UrlChange;
    Rafraichir = 30000;
    Changement = 60000;
    MaxNum = 1;
    ClassementReduit = 1;
    ClassementReduitXpremier = 10;
    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    var lapsArray = []; // array with the previous laps count. updated every Load, used to show the position change arrow between Loads 
    
    var useCategory = "yes";
    var tableClass = "fadeIn ";
        
    var text2;

    function category(choice){
        
        positionArray = []; // empting the array as the info inside is incorrect due to canging between position/category position.
        
        useCategory = choice;
        if (useCategory == "yes") {
            document.getElementById("displayCatButton").style.display = "none";        
            document.getElementById("displayAllButton").style.display = "block";        
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").style.display = "block";        
            document.getElementById("displayAllButton").style.display = "none";        
        }

        tableClass = "fadeIn "; // make the table fadeIn on change
        
        Load('https://tnuatiming.com/live1/livea/p1.html', 'result');
    };

    function Load(url, target) {
        live2('https://tnuatiming.com/live1/liveb/p1.html')
        var xhr;
        var fct;
        if (UrlChange) url = 'https://tnuatiming.com/live1/livea/p1.html';
        else UrlRefresh = 'https://tnuatiming.com/live1/livea/p1.html';
        UrlChange = 0;
        if (TimerLoad) clearTimeout(TimerLoad);
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e2) {
                try {
                    xhr = new XMLHttpRequest
                } catch (e3) {
                    xhr = false
                }
            }
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                if (ClassementReduit == 0) document.getElementById(target).innerHTML = xhr.responseText;
                else document.getElementById(target).innerHTML = ExtraireClassementReduitNew(xhr.responseText)
 //           } else {
 //               document.getElementById("categoryOrAll").style.display = "none";
            }
        };
        
        xhr.open("GET", 'https://tnuatiming.com/live1/livea/p1.html' + "?r=" + Math.random(), true);
        xhr.send(null);
        fct = function() {
            Load('https://tnuatiming.com/live1/livea/p1.html', target)
        };
        populatePre('uploadMsg.txt'); // upload message
        live2('https://tnuatiming.com/live1/liveb/p1.html');
        TimerLoad = setTimeout(fct, Rafraichir)
    };

    function live2(url) {

        var xhr2 = new XMLHttpRequest();
        xhr2.onreadystatechange = function () {
            if (xhr2.readyState == 4 && xhr2.status == 200) {
                text2 = xhr2.responseText;
            }
        };
        xhr2.open("GET", url + "?r=" + Math.random(), true);
    //    xhr2.open('GET', url, true);
        xhr2.send(null);
    };



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
        xhr1.send();
    };


    function ExtraireClassementReduitNew(Texte) {
        var i;
        var Lignes;
        var lines;
        competitorPosition = 0;
        competitorNumber = 0;
        competitorLaps = 0;
        var qqq = new Array();
        var hhh = new Array();
        var hhhPro = new Array();
        var hhhPro2 = new Array();
        var temp = new Array();
        var lineArray = new Array();
        var allArray = new Array();
        var lineArray2 = new Array();
        var allArray2 = new Array();
        var ttt = 0;
        var b;
        var pp = 0;
        var positionChanged = "";

        Texte = Texte.split('<table'); // split the text to title/time and the table
        Texte[1] = Texte[1].substring(Texte[1].indexOf("<tr"),Texte[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(Texte[1]);
        Lignes = Texte[1].split("\r\n");
   //     console.log(Lignes.length);

        lines = Texte[1].split("\r\n");
        //    console.log(lines.length);
     //   console.log(lines);





        var lines2;
        var textx = text2;

        textx = textx.split('<table'); // split the text to title/time and the table
        textx[1] = textx[1].substring(textx[1].indexOf("<tr"),textx[1].lastIndexOf("</tr>")+5); // clean the table text
  //      console.log(textx[1]);
        lines2 = textx[1].split("\r\n");
        textx = [];

        
        var finalTexte = Texte[0]; // clear the finalTexte variable and add the title and time lines



        for (b = 0; b < lines2.length; b++) { 
           
            if (lines2[b].includes('<td id="Id_')) {
                var id = (lines2[b].substring(lines2[b].indexOf(' id="')+4).split('"')[1]);
                hhhPro2.push(id);
            } else if (lines2[b].includes("OddRow") || lines2[b].includes("EvenRow")) {
                ttt = 1;
            } else if (lines2[b].includes("</tr>") && ttt == 1) {
                ttt = 0;
                allArray2.push(lineArray2); 
               lineArray2 = [];
                pp = 0;
            } else if (lines2[b].includes("<td ") && ttt == 1) {
                lineArray2[hhhPro2[pp]] = lines2[b].substring(lines2[b].indexOf(">")+1,lines2[b].lastIndexOf("<"));
                if (hhhPro2[pp] == "Id_TpsCumule" && lineArray2[hhhPro2[pp]] != "-" ) {
                    
                    lineArray2[hhhPro2[pp]] = timeString2ms(lineArray2[hhhPro2[pp]]);   

                }
                pp += 1;
        //                console.log(lineArray2);

            }
            
        }
         // console.log(allArray2);

            
            
            
            
        for (b = 0; b < lines.length; b++) { 
           
            if (lines[b].includes('<td id="Id_')) {
                var id = (lines[b].substring(lines[b].indexOf(' id="')+4).split('"')[1]);
                var idName = (lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")));
                hhh[id] = idName;
                temp.push(id,idName);
                hhhPro.push(id);
                qqq.push(temp);
                temp = [];
            } else if (lines[b].includes("OddRow") || lines[b].includes("EvenRow")) {
                ttt = 1;
            } else if (lines[b].includes("</tr>") && ttt == 1) {
                ttt = 0;
                allArray.push(lineArray); 
               lineArray = [];
                pp = 0;
            } else if (lines[b].includes("<td ") && ttt == 1) {
                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<"));
                if (hhhPro[pp] == "Id_TpsCumule" && lineArray[hhhPro[pp]] != "-" ) {
                    
                    lineArray[hhhPro[pp]] = timeString2ms(lineArray[hhhPro[pp]]);   

                }
                
                pp += 1;
      //    console.log(lineArray);

            }
            
        }

     //    console.log(allArray);
     //    console.log(hhh);
     //    console.log(hhhPro);

     //             console.log(qqq);
      //   console.log(hhhPro2);
         //                console.log(allArray);

          
         
         

        for (b = 0; b < allArray.length; b++) { 
            for (a = 0; a < allArray2.length; a++) { 


                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"] && allArray[b]["Id_TpsCumule"] != "-" && allArray2[a]["Id_TpsCumule"] != "-") {
                    
                    allArray[b]["Id_TpsCumule"] = allArray[b]["Id_TpsCumule"] + allArray2[a]["Id_TpsCumule"];
                }
            
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"] && allArray[b]["Id_NbTour"] != "-" && allArray2[a]["Id_NbTour"] != "-") {
                    
                    allArray[b]["Id_NbTour"] = Number(allArray[b]["Id_NbTour"]) + Number(allArray2[a]["Id_NbTour"]);
                }
            

                
                
                
                 if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                     
                      // reorder laps as elite3 does somthing wrong with the order
                    if (allArray2[a]["Id_TpsTour3"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour3"];
                        allArray[b].Id_lap4 = allArray2[a]["Id_TpsTour2"];
                        allArray[b].Id_lap6 = allArray2[a]["Id_TpsTour1"];
                    } else if (allArray2[a]["Id_TpsTour2"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour2"];
                        allArray[b].Id_lap4 = allArray2[a]["Id_TpsTour1"];
                        allArray[b].Id_lap6 = "-";
                    } else if (allArray2[a]["Id_TpsTour1"] != "-") {
                        allArray[b].Id_lap2 = allArray2[a]["Id_TpsTour1"];
                        allArray[b].Id_lap4 = "-";
                        allArray[b].Id_lap6 = "-";
                    } else {
                        allArray[b].Id_lap2 = "-";
                        allArray[b].Id_lap4 = "-";
                        allArray[b].Id_lap6 = "-";
                    }
                 
                    allArray[b].Id_Image2 = allArray2[a]["Id_Image"];   
                    
                    if (allArray[b]["Id_Image"].includes("_Status") || allArray2[a]["Id_Image"].includes("_Status")) {
                        allArray[b].Id_Status = 1;
                    } else {
                        allArray[b].Id_Status = 0;
                    }
                    
                    
                    
                }
               
                      // reorder laps as elite3 does somthing wrong with the order
                if (allArray[b]["Id_TpsTour3"] != "-") {
                    allArray[b].Id_lap1 = allArray[b]["Id_TpsTour3"];
                    allArray[b].Id_lap3 = allArray[b]["Id_TpsTour2"];
                    allArray[b].Id_lap5 = allArray[b]["Id_TpsTour1"];
                } else if (allArray[b]["Id_TpsTour2"] != "-") {
                    allArray[b].Id_lap1 = allArray[b]["Id_TpsTour2"];
                    allArray[b].Id_lap3 = allArray[b]["Id_TpsTour1"];
                    allArray[b].Id_lap5 = "-";
                } else if (allArray[b]["Id_TpsTour1"] != "-") {
                    allArray[b].Id_lap1 = allArray[b]["Id_TpsTour1"];
                    allArray[b].Id_lap3 = "-";
                    allArray[b].Id_lap5 = "-";
                } else {
                    allArray[b].Id_lap1 = "-";
                    allArray[b].Id_lap3 = "-";
                    allArray[b].Id_lap5 = "-";
                }

                
                
                
                
                
                 
            } 
        }
         // delete the secound array
         allArray2 = [];
         
         // MAGIC sort the array after the merge to get new results
        if (useCategory == "no") {
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || b.Id_NbTour - a.Id_NbTour || a.Id_TpsCumule - b.Id_TpsCumule});
        } else if (useCategory == "yes") {
            allArray.sort(function(a, b){return a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || b.Id_NbTour - a.Id_NbTour || a.Id_TpsCumule - b.Id_TpsCumule});
        }
         
         

         
    // fix the position fields of the competitors and start building the final table
            var m = 0;
            var prevCompCat = ""

            finalTexte += '<table class="' + tableClass + 'line_color">';
            
            for (var l = 0; l < allArray.length; l++) {

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
                                var leaderTime = allArray[l]["Id_TpsCumule"];
                                var leaderLaps = allArray[l]["Id_NbTour"];
                            }

                                    // fix the diff fields of the competitors
                                var competitorLaps = allArray[l]["Id_NbTour"];

                                if (competitorLaps < leaderLaps && competitorLaps > 0) {
                                    allArray[l]["Id_Ecart1er"] = (leaderLaps - competitorLaps) + " הקפות";
                                } else if (competitorLaps == leaderLaps) {
                                    var competitorTime = allArray[l]["Id_TpsCumule"];
                                    if (competitorTime != leaderTime) {
                                    allArray[l]["Id_Ecart1er"] = ms2TimeString(competitorTime - leaderTime);

                                    if (allArray[l]["Id_Ecart1er"].toString().substring(0, 3) == "00:") {
                                        allArray[l]["Id_Ecart1er"] = allArray[l]["Id_Ecart1er"].substr(3);
                                    }
                                    if (allArray[l]["Id_Ecart1er"].toString().substring(0, 1) == "0") {
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
                                if (allArray[l]["Id_TpsCumule"].toString().substring(0, 1) == "0") {
                                    allArray[l]["Id_TpsCumule"] = allArray[l]["Id_TpsCumule"].substr(1);
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
            headerText1 += '<th class="rnkh_font" id="Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
            headerText1 += '<th class="rnkh_font" id="Id_Position">מקום</th>';
            headerText1 += '<th class="rnkh_font" id="Id_Numero">מספר</th>';
            headerText1 += '<th class="rnkh_font" id="Id_Nom">שם</th>';
            headerText1 += '<th class="rnkh_font" id="Id_lap1">הקפה 1</th>';
            headerText1 += '<th class="rnkh_font" id="Id_lap2">הקפה 2</th>';
            headerText1 += '<th class="rnkh_font" id="Id_lap3">הקפה 3</th>';
            headerText1 += '<th class="rnkh_font" id="Id_lap4">הקפה 4</th>';
            headerText1 += '<th class="rnkh_font" id="Id_lap5">הקפה 5</th>';
            headerText1 += '<th class="rnkh_font" id="Id_lap6">הקפה 6</th>';
            headerText1 += '<th class="rnkh_font" id="Id_TpsCumule">זמן</th>';
            headerText1 += '<th class="rnkh_font" id="Id_Ecart1er">פער</th>';

        
        headerText1 += '</tr>';
      //   console.log(headerText1);
      //          console.log(temp);

         
        
                             // position change arrow prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;
                    allArray[l]["Id_Arrow"] = "&#9830;";
                    
                            if (allArray[l]["Id_Image"].includes("_Status10") || allArray[l]["Id_Image2"].includes("_Status10")) {
                                allArray[l]["Id_Arrow"] = "DNF";
                            } else if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image2"].includes("_Status11")) {
                                allArray[l]["Id_Arrow"] = "DSQ";
                            } else if (allArray[l]["Id_Image"].includes("_Status12") || allArray[l]["Id_Image2"].includes("_Status12")) {
                                allArray[l]["Id_Arrow"] = "DNS";
                            } else if (allArray[l]["Id_Image"].includes("_Status2") || allArray[l]["Id_Image2"].includes("_Status2")) {
                                allArray[l]["Id_Arrow"] = "NQ";
                            } else if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image2"].includes("_Status")) {
                                allArray[l]["Id_Arrow"] = "&#10033;";
                            } else {
                                 allArray[l]["Id_Arrow"] = "&#9830;"; // same :|
                            }





                    if (allArray[l]["Id_Position"]) { 
                            competitorPosition = allArray[l]["Id_Position"];  // get the position value and clean penalty indicator
                    }
                     
                    if (competitorPosition > 0 && competitorNumber > 0 && allArray[l]["Id_NbTour"]) { // position change arrow calc
                    positionChanged = "";
                    
                        if (positionArray[competitorNumber]) {

                            if (positionArray[competitorNumber] < competitorPosition) {
                                allArray[l]["Id_Arrow"] = "&#9660;"; // down :(
                                positionChanged = "fadeIn";
                            } else if (positionArray[competitorNumber] > competitorPosition) {
                                allArray[l]["Id_Arrow"] = "&#9650;"; // up :)
                                positionChanged = "fadeIn";
                            }                        
                            
                        }
                        // console.log("competitorNumber: " + competitorNumber + ",competitorPosition: " + competitorPosition + ", positionArray:" + positionArray[competitorNumber]);
                        positionArray[competitorNumber] = competitorPosition;// update array with current position for next Load calc
                    }
       
         
        
        
            // add category name header and table header
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
                finalTexte += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
                finalTexte += '<tr><td colspan="99" class="title_font">כללי</td></tr>' + headerText1;
            }

                if (l % 2 == 0) {
                finalTexte += '<tr class="' + positionChanged + ' rnk_bkcolor OddRow">';
                } else {
                finalTexte += '<tr class="' + positionChanged + ' rnk_bkcolor EvenRow">';
                    
                }
       
        
        
        
    //        for(var key in allArray[l]) {
    //        var opt3 = allArray[l][key];
 
            
    //          if (key != "Id_Ecart1erCategorie" && key != "Id_MeilleurTour" && key != "Id_PositionCategorie" && key != "Id_Image" && key != "Id_Arrow" && key != "Id_TpsTour1" && key != "Id_TpsTour2" && key != "Id_TpsTour3" && key != "Id_Categorie" && key != 'undefined' && key != null && key != "&nbsp;") {
                
                if (allArray[l]["Id_Image"].includes("_CheckeredFlag") || allArray[l]["Id_Image2"].includes("_CheckeredFlag")) {
                    var checkeredFlag = "finished ";
                } else {
                    var checkeredFlag = "";
                }
                
                
                
                
                if (allArray[l]["Id_Arrow"] == "&#9660;") { // red
                    
                    finalTexte += '<td class="' + checkeredFlag + 'red rnk_font">&#9660;</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == "&#9650;") { // green
                    
                    finalTexte += '<td class="' + checkeredFlag + 'green rnk_font">&#9650;</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == "&#9830;") { // white
                    
                    finalTexte += '<td class="' + checkeredFlag + 'white rnk_font fadeOut">&#9830;</td>';
                    
                } else {

                    finalTexte += '<td class="orange rnk_font">' + allArray[l]["Id_Arrow"] + '</td>';

                }
                
                
                
                finalTexte += '<td class="rnk_font">' + allArray[l]["Id_Position"] + '</td>';

                
                
       //         if (key == "Id_Numero") {
                    var opt3 = allArray[l]["Id_Numero"];                        
                    var opt4 = allArray[l]["Id_Categorie"];
                    
                    if (useCategory == "no") {
                        
                        if (opt4.toUpperCase().includes("E1") || opt4.toUpperCase().includes("MX2") || opt4.toUpperCase().includes("רוקיז")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font blackCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("E2")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font redCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("E3") || opt4.toUpperCase().includes("פתוחה")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font yellowCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("C1") || opt4.toUpperCase().includes("C2") || opt4.toUpperCase().includes("C3") || opt4.toUpperCase().includes("עממית")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font greenCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("ג'וניור מקצועי") || opt4.toUpperCase().includes("ג'וניור מתחילים")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font grayCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("סופר ג'וניור")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font blueCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("ג'וניור") || opt4.toUpperCase().includes("expert")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font orangeCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("סופר סניור") ||opt4.toUpperCase().includes("מתחילים") || opt4.toUpperCase().includes("MX1")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font whiteCat">' + opt3 + '</td>';
                        } else if (opt4.toUpperCase().includes("סניור") || opt4.toUpperCase().includes("נשים")) {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font pinkCat">' + opt3 + '</td>';
                        } else {
                            finalTexte += '<td aria-label="' + opt4 + '" class="rnk_font highlight">' + opt3 + '</td>';
                        }

                    } else {
                            finalTexte += '<td class="rnk_font highlight">' + opt3 + '</td>';
                    }


      //          } else {
      //              finalTexte += '<td class="rnk_font ">' + opt3 + '</td>';
      //          }
                 
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_Nom"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_lap1"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_lap2"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_lap3"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_lap4"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_lap5"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_lap6"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_TpsCumule"] + '</td>';
                finalTexte += '<td class="rnk_font ">' + allArray[l]["Id_Ecart1er"] + '</td>';
 
                
     //       }

                 
                
      //      }    

                    finalTexte += '</tr>';

               
            }        
         
         
                finalTexte += '</table>';
     

         
<!-- 
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

            
-->             
             console.log(allArray);

         //    console.log(finalTexte);
      
    tableClass = "";
            
    return finalTexte

    };
        
    function timeString2ms(a,b){// time(HH:MM:SS.mss) // optimized
        return a=a.split('.'), // optimized
        b=a[1]*1||0, // optimized
        a=a[0].split(':'),
        b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
    };
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
// another option to convert
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

    function AfficherImageZoom(a, b) {
        "" != b ? (document.getElementById("ImageZoom").src = b, document.getElementById("ImageZoom").style.left = a.clientX + "px", document.getElementById("ImageZoom").style.top = a.clientY + "px", document.getElementById("ImageZoom").style.visibility = "visible") : document.getElementById("ImageZoom").style.visibility = "hidden"
    };

</script>
