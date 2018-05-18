<!-- 20180518 - array refactoring, with all, category select, arrows for advancment -->

<!-- tag heuer live timing -->

<script type="text/javascript">
    var TimerLoad, TimerChange;
    var MaxNum, Rafraichir, Changement, ClassementReduit, ClassementReduitXpremier;
    var UrlRefresh, UrlChange;
    Rafraichir = 30000;
    Changement = 90000;
    MaxNum = 1;
    ClassementReduit = 1;
    ClassementReduitXpremier = 10;

    var useCategory = "yes";

    function category(choice){
        useCategory = choice;
        if (useCategory == "yes") {
            document.getElementById("displayCatButton").style.display = "none";        
            document.getElementById("displayAllButton").style.display = "block";        
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").style.display = "block";        
            document.getElementById("displayAllButton").style.display = "none";        
        }
        
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
        var Lignes, sLignes;
        var opt3 = "";
        var NouveauTexte = "";
        var addLine = "";
        var addHeaderLine = "";
        notHeaderTR = 0;
        HeaderTR = 0; // 1 if inside the header TR
        var catName = "&nbsp;";
        var resultsByCategory = [];
        var headerLineArray = [];
        var prototypeLineArray = [];
        var lineArray = [];
        td = 1;

        Texte = Texte.split('<table');
        Texte[1] = Texte[1].substring(Texte[1].indexOf("<tr"),Texte[1].lastIndexOf("</tr>")+5);
      //  console.log(Texte[1]);
        sLignes = Texte[0].split("\r\n");
        Lignes = Texte[1].split("\r\n");
   //     console.log(Lignes.length);

        if  (Lignes.length > 5) { // check to see if we have more the 5 lines which mean we have a full page from elite and not one edited for display

        NouveauTexte = sLignes[0]; // clear the NouveauTexte variable and add the title line
        NouveauTexte += sLignes[1]; // add the time line

        for (i = 0; i < Lignes.length; i++) { // start building the prototype for header and competitor text
            if  (Lignes[i].includes("HeaderRow")) { 
                            HeaderTR = 1;

                    headerLineArray["start"]  =  Lignes[i].replace(/ width="\w+"/i, "").replace(/ align="\w+"/i, "").replace('HeaderRow', "rnkh_bkcolor"); 
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

                    headerLineArray[lineId]  = (Lignes[i].replace(/ width="\w+"/i, "").replace(/ align="\w+"/i, "").replace('<td', "<th").replace('</td', "</th"));  // clean, change to TH and add the line
                    prototypeLineArray.push(lineId);
                }
                
                if (Lignes[i].substring(0, 4) == "</tr") {
                    HeaderTR = 0;

                    headerLineArray["finish"]  =  Lignes[i];             
                    prototypeLineArray.push("finish");

                    //   console.log(headerLineArray);
                     //  console.log(prototypeLineArray);

                    // building the header text
                    if (useCategory == "yes") {

                        addHeaderLine = headerLineArray["start"] 
                        
                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_PositionTourPrec" && prototypeLineArray[y] != "Id_Categorie"&& prototypeLineArray[y] != "Id_Ecart1erCategorie" ) {
                                
                                addHeaderLine += headerLineArray[prototypeLineArray[y]];

                            }
                        }

                    } else if (useCategory == "no") {

                        addHeaderLine = headerLineArray["start"] 
                        
                        if (prototypeLineArray.includes("Id_PositionTourPrec")) {
                            addHeaderLine += headerLineArray["Id_PositionTourPrec"];
                        }
                        
                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_PositionTourPrec" && prototypeLineArray[y] != "Id_Categorie"&& prototypeLineArray[y] != "Id_Ecart1erCategorie" ) {
                                
                                addHeaderLine += headerLineArray[prototypeLineArray[y]];

                            }
                        }

                    }
                      //console.log('addHeaderLine\r\n' + addHeaderLine);
                }

            } else {  // end header and check other lines (competitor)
                if (Lignes[i].substring(0, 3) == "<tr") {
                                    
                    lineArray[prototypeLineArray[0]] = Lignes[i].replace(' class="', ' class="rnk_bkcolor ').replace(/ align="\w+"/i, "");
                    
                    notHeaderTR = 1; // mark that we inside a competitor TR (not header TR)
                    
                } else if (Lignes[i].substring(0, 4) == "</tr") {
                
                    lineArray[prototypeLineArray[prototypeLineArray.length - 1]] = Lignes[i];  // add end TR line

                    notHeaderTR = 0; // mark that we finished the competitor TR (other then header TR)

                } else if (Lignes[i].substring(0, 3) == "<td" && notHeaderTR == 1) { //check if inside a TR which is not the header TR

                    if (prototypeLineArray[td] == 'Id_Numero') { // change number cell css
                    
                        lineArray[prototypeLineArray[td]] = Lignes[i].replace(' class="', ' class="highlight rnk_font ').replace(/ align="\w+"/i, "").replace('>00:', '>'); // clean TD and remove the first 00: (hours) if present

                    } else {
                        lineArray[prototypeLineArray[td]] = Lignes[i].replace(' class="', ' class="rnk_font ').replace(/ align="\w+"/i, "").replace('>00:', '>'); // clean TD and remove the first 00: (hours) if present
                        
                    }
                    
                    td += 1;

                } 

                if (notHeaderTR == 0) { // start building the competitor text

                    if (useCategory == "yes" && lineArray["Id_Categorie"]) {

                        catName = lineArray["Id_Categorie"].substring(lineArray["Id_Categorie"].indexOf(">")+1,lineArray["Id_Categorie"].lastIndexOf("<"));  // get the category value
                    }

                    if (lineArray["Id_PositionTourPrec"] && lineArray["Id_TpsCumule"] && lineArray["Id_Position"]) {

                        var timeInfoB = lineArray["Id_TpsCumule"].substring(lineArray["Id_TpsCumule"].indexOf(">")+1,lineArray["Id_TpsCumule"].lastIndexOf("<")); // get the time value
                        
                        var positionB = lineArray["Id_Position"].substring(lineArray["Id_Position"].indexOf(">")+1,lineArray["Id_Position"].lastIndexOf("<"));  // get the position value

                        var positionPrevB = lineArray["Id_PositionTourPrec"].substring(lineArray["Id_PositionTourPrec"].indexOf(">")+1,lineArray["Id_PositionTourPrec"].lastIndexOf("<"));  // get the previous lap position value

                        if (positionPrevB > positionB &&  timeInfoB != "-") {
                                lineArray["Id_PositionTourPrec"] = lineArray["Id_PositionTourPrec"].replace(/>.+</i, '>&uarr;<').replace(' class="', ' class="up rnk_font ');
                        } else if (positionPrevB < positionB &&  timeInfoB != "-") {
                                lineArray["Id_PositionTourPrec"] = lineArray["Id_PositionTourPrec"].replace(/>.+</i, '>&darr;<').replace(' class="', ' class="down rnk_font ');
                        } else {
                                lineArray["Id_PositionTourPrec"] = lineArray["Id_PositionTourPrec"].replace(/>.+</i, '>&harr;<');
                        }
                    }    
                                          // console.log(lineArray);
                     
                     // assamble the competitor text
                    if (useCategory == "yes") {

                        addLine = lineArray["start"] 
                       
                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_PositionTourPrec" && prototypeLineArray[y] != "Id_Categorie"&& prototypeLineArray[y] != "Id_Ecart1erCategorie" ) {
                                
                                addLine += lineArray[prototypeLineArray[y]];

                            }
                        }

                    } else if (useCategory == "no") {

                        addLine = lineArray["start"] 
                        
                        if (prototypeLineArray.includes("Id_PositionTourPrec")) {
                            addLine += lineArray["Id_PositionTourPrec"];
                        }
                        
                        for (var y = 0; y < prototypeLineArray.length; y++) {
                            
                            if (prototypeLineArray[y] != "start" && prototypeLineArray[y] != "Id_PositionTourPrec" && prototypeLineArray[y] != "Id_Categorie"&& prototypeLineArray[y] != "Id_Ecart1erCategorie" ) {
                                
                                addLine += lineArray[prototypeLineArray[y]];

                            }
                        }
                        
                    }
                                          
                    lineArray = [];
                    td = 1; // zero the counter
                    
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
        NouveauTexte += '<table>\r\n'
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
