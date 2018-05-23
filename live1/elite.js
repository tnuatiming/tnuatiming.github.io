<!-- 20180518 - array refactoring with all/category toggle, display arrows for position change -->
<!-- 20180522 - add fades and competitor info on arrows display -->

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
    var tableClass = " fadeIn";

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

        tableClass = " fadeIn"; // make the table fadeIn on change
        
        Load('p1.html', 'result');
    };

    function Load(url, target) {
        var xhr;
        var fct;
        if (UrlChange) url = UrlRefresh;
        else UrlRefresh = url;
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
        
        xhr.open("GET", url + "?r=" + Math.random(), true);
        xhr.send(null);
        fct = function() {
            Load(url, target)
        };
        TimerLoad = setTimeout(fct, Rafraichir)
    };

    function ExtraireClassementReduitNew(Texte) {
        var i;
        var Lignes;
        var opt3 = "";
        var NouveauTexte = ""; // the finished text for display
        notHeaderTR = 0;
        HeaderTR = 0; // 1 if inside the header TR
        var catName = "&nbsp;"; //competitor category
        var resultsByCategory = [];
        var headerLineArray = []; // header used for building the final text
        var prototypeLineArray = []; // array with all line ID in order {0:start, 1:Id_Position, ......}
        var lineArray = []; // array from the curent competitor
        td = 1;
        competitorPosition = 0;
        competitorNumber = 0;
        competitorLaps = 0;
        var addHeaderLine = ""; // header text
        var addLine = ""; // curent competitor text

        Texte = Texte.split('<table'); // split the text to title/time and the table
        Texte[1] = Texte[1].substring(Texte[1].indexOf("<tr"),Texte[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(Texte[1]);
        Lignes = Texte[1].split("\r\n");
   //     console.log(Lignes.length);

        if  (Lignes.length > 5) { // check to see if we have more the 5 lines which mean we have a full page from elite and not one edited for display

        NouveauTexte = Texte[0]; // clear the NouveauTexte variable and add the title and time lines

        for (i = 0; i < Lignes.length; i++) { 

            Lignes[i] = Lignes[i].replace('>#N/A<', '>&nbsp;<').replace('(C)', 'P').replace(/ width="\w+"/i, "").replace(/ align="\w+"/i, ""); // clean the line

        // start building the prototype for header and competitor text

            if  (Lignes[i].includes("HeaderRow")) { 
                            HeaderTR = 1;

                    headerLineArray["start"]  =  Lignes[i].replace('HeaderRow', "rnkh_bkcolor"); 
                    prototypeLineArray.push("start");
                     
            }
             if  (Lignes[i].includes("HeaderRow") || HeaderTR == 1) { // if header TR or inside the header TR
                             
                 if  (Lignes[i].includes("<td ")) { // add header TD lines and set variables, the header cells are still TD here

                    if  (Lignes[i].includes("class=")) { // add rnkh_font class to header TD
                        Lignes[i] = Lignes[i].replace(/ class="([^"]+)/i, ' class="rnkh_font $1')
                    } else {
                        Lignes[i] = Lignes[i].replace('<td ', '<td class="rnkh_font" ')
                    }
                     
                    var lineId = Lignes[i].substring(Lignes[i].indexOf(' id="')+4).split('"')[1];  // get the ID value

                    headerLineArray[lineId]  = (Lignes[i].replace('<td', "<th").replace('</td', "</th"));  // clean, change to TH and add the line
                    prototypeLineArray.push(lineId);
                }
                
                if (Lignes[i].substring(0, 4) == "</tr") {
                    HeaderTR = 0;

                    headerLineArray["finish"]  =  Lignes[i];             
                    prototypeLineArray.push("finish");
                    
                    headerLineArray["Id_Arrow"]  = '<th class="rnkh_font" id="Id_Arrow">&nbsp;</th>';            

                    //   console.log(headerLineArray);
                     //  console.log(prototypeLineArray);

                    // building the header text
                    if (useCategory == "yes") {

                        addHeaderLine = headerLineArray["start"] 
                        addHeaderLine += headerLineArray["Id_Arrow"] 

                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_Arrow" && prototypeLineArray[y] != "Id_Categorie" && prototypeLineArray[y] != "Id_Ecart1er" && prototypeLineArray[y] != "Id_Position" && prototypeLineArray[y] != "Id_Image") {
                                
                                addHeaderLine += headerLineArray[prototypeLineArray[y]];

                            }
                        }

                    } else if (useCategory == "no") {

                        addHeaderLine = headerLineArray["start"] 
                        addHeaderLine += headerLineArray["Id_Arrow"] 
                        
                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_Arrow" && prototypeLineArray[y] != "Id_Categorie" && prototypeLineArray[y] != "Id_Ecart1erCategorie" && prototypeLineArray[y] != "Id_PositionCategorie" && prototypeLineArray[y] != "Id_Image") {
                                
                                addHeaderLine += headerLineArray[prototypeLineArray[y]];

                            }
                        }

                    }
                      //console.log('addHeaderLine\r\n' + addHeaderLine);
                }

            } else {  // end header and check other lines (competitor)
                if (Lignes[i].substring(0, 3) == "<tr") {
                                    
                    lineArray[prototypeLineArray[0]] = Lignes[i].replace(' class="', ' class="rnk_bkcolor ');
                    
                    notHeaderTR = 1; // mark that we inside a competitor TR (not header TR)
                    
                } else if (Lignes[i].substring(0, 4) == "</tr") {
                
                    lineArray[prototypeLineArray[prototypeLineArray.length - 1]] = Lignes[i];  // add end TR line

                    notHeaderTR = 0; // mark that we finished the competitor TR (other then header TR)

                } else if (Lignes[i].substring(0, 3) == "<td" && notHeaderTR == 1) { //check if inside a TR which is not the header TR

                    if (prototypeLineArray[td] == 'Id_Numero') { // change number cell css
                    
                        lineArray[prototypeLineArray[td]] = Lignes[i].replace(' class="', ' class="highlight rnk_font ').replace('>00:', '>'); // clean TD and remove the first 00: (hours) if present

                    } else {
                        lineArray[prototypeLineArray[td]] = Lignes[i].replace(' class="', ' class="rnk_font ').replace('>00:', '>'); // clean TD and remove the first 00: (hours) if present
                        
                    }
                    
                    td += 1;

                } 

                if (notHeaderTR == 0) { // start building the competitor text

                  //  lineArray["Id_Arrow"] = '<td class="green fadeOut rnk_font ">&#9679;</td>';
                    lineArray["Id_Arrow"] = '<td class="rnk_font ">&nbsp;</td>';
                    
                    if (lineArray["Id_Numero"]) { 
                        competitorNumber = lineArray["Id_Numero"].substring(lineArray["Id_Numero"].indexOf(">")+1,lineArray["Id_Numero"].lastIndexOf("<")).replace(/\D/i, '').trim();  // get the position value and clean penalty indicator
                    }

                    if (useCategory == "yes" && lineArray["Id_Categorie"]) {

                        catName = lineArray["Id_Categorie"].substring(lineArray["Id_Categorie"].indexOf(">")+1,lineArray["Id_Categorie"].lastIndexOf("<"));  // get the category value
                    }

                    if (lineArray["Id_NbTour"]) {
                        competitorLaps = lineArray["Id_NbTour"].substring(lineArray["Id_NbTour"].indexOf(">")+1,lineArray["Id_NbTour"].lastIndexOf("<")); // get the time value
                    }
                    
                    // position change arrow prep
                    if (lineArray["Id_Position"] && useCategory == "no") { 
                            competitorPosition = lineArray["Id_Position"].substring(lineArray["Id_Position"].indexOf(">")+1,lineArray["Id_Position"].lastIndexOf("<")).replace(/\D/i, '').trim();  // get the position value and clean penalty indicator
                    }
                 
                    if (lineArray["Id_PositionCategorie"] && useCategory == "yes") { 
                            competitorPosition = lineArray["Id_PositionCategorie"].substring(lineArray["Id_PositionCategorie"].indexOf(">")+1,lineArray["Id_PositionCategorie"].lastIndexOf("<")).replace(/\D/i, '').trim();  // get the position value and clean penalty indicator
                    }
                    
                    // blink changed
                    if (competitorLaps != "0") { 

                        if (competitorLaps != lapsArray[competitorNumber]) {
                                lineArray["Id_Arrow"] = '<td class="green fadeOut rnk_font ">&#9679;</td>'; // fadeOut green dot if info changed
                                lineArray["start"] = lineArray["start"].replace(' class="', ' class="fadeIn '); // blink the competitor line                       
                        }
                        
                        lapsArray[competitorNumber] = competitorLaps;// update array with current laps count for next Load calc
                    }
                    
                    if (competitorPosition > 0 && competitorNumber > 0 && lineArray["Id_NbTour"]) { // position change arrow calc
                    
                        if (positionArray[competitorNumber]) {

                            if (positionArray[competitorNumber] < competitorPosition) {
                                lineArray["Id_Arrow"] = '<td class="red rnk_font ">&#9660;</td>';
                                lineArray["start"] = lineArray["start"].replace(' class="', ' class="fadeIn '); // blink the competitor line                      
                            } else if (positionArray[competitorNumber] > competitorPosition) {
                                lineArray["Id_Arrow"] = '<td class="green rnk_font ">&#9650;</td>';
                                lineArray["start"] = lineArray["start"].replace(' class="', ' class="fadeIn '); // blink the competitor line                       
                            } else {
                    //            lineArray["Id_Arrow"] = '<td class="green rnk_font ">&nbsp;</td>';
                                lineArray["Id_Arrow"] = '<td class="green fadeOut rnk_font ">&#9679;</td>';
                           }
                        }
                        // console.log("competitorNumber: " + competitorNumber + ",competitorPosition: " + competitorPosition + ", positionArray:" + positionArray[competitorNumber]);
                        positionArray[competitorNumber] = competitorPosition;// update array with current position for next Load calc
                    }
                    
                    if (lineArray["Id_Image"]) { // clean the image (competitor info) TD

                        if (lineArray["Id_Image"].includes("_Status10")) {
                            
                            lineArray["Id_Arrow"] = lineArray["Id_Arrow"].replace(/>.+</i, '>DNF<').replace(' class="', ' class="orange ').replace(/fadeOut|green|red|black/ig, '');

                        } else if (lineArray["Id_Image"].includes("_Status11")) {
                        
                            lineArray["Id_Arrow"] = lineArray["Id_Arrow"].replace(/>.+</i, '>DSQ<').replace(' class="', ' class="orange ').replace(/fadeOut|green|red|black/ig, '');
                            
                        } else if (lineArray["Id_Image"].includes("_Status12")) {
                        
                            lineArray["Id_Arrow"] = lineArray["Id_Arrow"].replace(/>.+</i, '>DNS<').replace(' class="', ' class="orange ').replace(/fadeOut|green|red|black/ig, '');
                            
                        } else if (lineArray["Id_Image"].includes("_Status")) {
                        
                            lineArray["Id_Arrow"] = lineArray["Id_Arrow"].replace(/>.+</i, '>&#9679;<').replace(' class="', ' class="orange ').replace(/fadeOut|green|red|black/ig, '');
                            
                        } else if (lineArray["Id_Image"].includes("_CheckeredFlag")) {

                  //          lineArray["Id_Arrow"] = lineArray["Id_Arrow"].replace(/>.+</i, '>&#9873;<').replace(' class="', ' class="black ').replace(/fadeOut|green|red|orange/ig, '');
                            lineArray["Id_Arrow"] = lineArray["Id_Arrow"].replace(/>.+</i, '><img src="Images/_Stop.png"><').replace(/fadeOut|green|red|orange/ig, '');
                            
                        } else if (lineArray["Id_Image"].includes("_MaximumTime")) {

                            lineArray["Id_Arrow"] = lineArray["Id_Arrow"].replace(/>.+</i, '>&#9201;<').replace(' class="', ' class="black ').replace(/fadeOut|green|red|orange/ig, '');
                            
                        } else if (lineArray["Id_Image"].includes("_TrackPassing")) {

                            
                        } else if (lineArray["Id_Image"].includes("_MinusPosition")) {

                            
                        } else if (lineArray["Id_Image"].includes("_PlusPosition")) {

                            
                        }
                    }
                                        
                    // console.log(lineArray);
                     
                     // assamble the competitor text
                    if (useCategory == "yes") {

                        addLine = lineArray["start"] 
                        addLine += lineArray["Id_Arrow"] 
                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_Arrow" && prototypeLineArray[y] != "Id_Categorie" && prototypeLineArray[y] != "Id_Ecart1er" && prototypeLineArray[y] != "Id_Position" && prototypeLineArray[y] != "Id_Image" ) {
                                
                                addLine += lineArray[prototypeLineArray[y]];

                            }
                        }

                    } else if (useCategory == "no") {

                        addLine = lineArray["start"] 
                        addLine += lineArray["Id_Arrow"] 
                        
                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_Arrow" && prototypeLineArray[y] != "Id_Categorie" && prototypeLineArray[y] != "Id_Ecart1erCategorie" && prototypeLineArray[y] != "Id_PositionCategorie" && prototypeLineArray[y] != "Id_Image" ) {
                                
                                addLine += lineArray[prototypeLineArray[y]];

                            }
                        }
                        
                    }
                                          
                    lineArray = [];
                    td = 1; // zero the counter
                    competitorPosition = 0;
                    competitorNumber = 0;
                    competitorLaps = 0;
                    
                    // adding the finished competitor text to the array (by category)
                    if (typeof resultsByCategory[catName] == 'undefined' && resultsByCategory[catName] == null) {
                        opt3 = addLine;
                    } else {
                        opt3 = resultsByCategory[catName] + addLine;
                    }
                    
                    resultsByCategory[catName] = opt3;
                    
                    addLine = "";
                    opt3 = "";
 
                } // end notHeaderTR == 0
            }// end other lines
        }  // end for
        } // end if check for more the 5 lines
        //console.log(resultsByCategory);
        

        var sortedObj = sortObjKeysAlphabetically(resultsByCategory); // sort by category name
        NouveauTexte += '<table class="line_color' + tableClass + '">\r\n'
        for(var key in sortedObj) {
            opt3 = sortedObj[key];
            if (opt3 != "") {
            //    opt1 = refactor(opt1); // re issue pos number in category, comment out line if not needed (for ex: when you get the cat pos from elite live).
                if (key == 'undefined' || catName == null || catName == "&nbsp;") {
                    key = "כללי";
                }
                NouveauTexte += '<td colspan="99" class="title_font">' + key + '</td>\r\n' + addHeaderLine + '\r\n' + opt3.replace(/undefined/ig, "") + '\r\n';
            }
        }    
        NouveauTexte += "</table>";

        tableClass = ""; // remove the fadeIn after first load

    return NouveauTexte
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
