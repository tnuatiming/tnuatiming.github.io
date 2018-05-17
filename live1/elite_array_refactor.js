
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
        var opt3; // can delete all opt in code  when using resultsByCategory
        var NouveauTexte;
        var addLineXXX;
        var addHeaderLineXXX;
        notHeaderTR = 0;
        hr = 0; // 1 if inside the header TR
        q = 0; // used to find the pesent line in the TR for finding category, diff with leader etc lines 
        var catNameB = "&nbsp;";
        var resultsByCategoryB = [];
        var headerLineArrayXXX = [];
        var headerLineArrayYYY = [];
        var lineArrayXXX = [];
        kk = 1;

        Texte = Texte.split('<table');
        Texte[1] = Texte[1].substring(Texte[1].indexOf("<tr"),Texte[1].lastIndexOf("</tr>")+5);
      //  console.log(Texte[1]);
        sLignes = Texte[0].split("\r\n");
        Lignes = Texte[1].split("\r\n");
   //     console.log(Lignes.length);

        if  (Lignes.length > 5) { // check to see if we have more the 5 lines which mean we have a full page from elite and not one edited for disply

        NouveauTexte = sLignes[0]; // clear the NouveauTexte variable and add the title line
        NouveauTexte += sLignes[1]; // add the time line

        for (i = 0; i < Lignes.length; i++) { // start with third line as the 2 first line allready proccessed
            if  (Lignes[i].includes("HeaderRow")) { 
                            hr = 1;
                            q = i;

                    headerLineArrayXXX["start"]  =  Lignes[i].replace(/ width=".*"/i, "").replace(/ align=".*"/i, "").replace(/HeaderRow/i, "rnkh_bkcolor"); 
                    headerLineArrayYYY.push("start");
                     
            }
             if  (Lignes[i].includes("HeaderRow") || hr == 1) { // if header TR or inside the header TR
                             
               
                if  (Lignes[i].includes("<td ")) {
                    if  (Lignes[i].includes("class=")) { // add rnkh_font class to header TD
                        Lignes[i] = Lignes[i].replace(/ class="/i, ' class="rnkh_font ')
                    } else {
                        Lignes[i] = Lignes[i].replace(/<td /i, '<td class="rnkh_font" ')
                    }
                } 
                
                 if  (Lignes[i].includes("<td ")) { // add header TD lines and set variables

                    var tts = Lignes[i].substring(Lignes[i].indexOf(' id="')+4).split('"')[1];  // get the ID value

                    headerLineArrayXXX[tts]  = (Lignes[i].replace(/ width=".*"/i, "").replace(/ align=".*"/i, "").replace(/<td/i, "<th").replace(/<\/td/i, "</th"));  // clean and add the line
                    headerLineArrayYYY.push(tts);
                }
                
                if (Lignes[i].substring(0, 4) == "</tr") {
                    hr = 0;

                    headerLineArrayXXX["finish"]  =  Lignes[i];             
                    headerLineArrayYYY.push("finish");

                    //   console.log(headerLineArrayXXX);
                     //  console.log(headerLineArrayYYY);

                    if (useCategory == "yes") {
                    
                        addHeaderLineXXX = headerLineArrayXXX["start"] 
                        //   + headerLineArrayXXX["Id_PositionTourPrec"] 
                        + headerLineArrayXXX["Id_Position"] 
                        + headerLineArrayXXX["Id_Numero"] 
                        + headerLineArrayXXX["Id_Nom"] 
                        + headerLineArrayXXX["Id_NbTour"] 
                        + headerLineArrayXXX["Id_TpsTour"] 
                        + headerLineArrayXXX["Id_MeilleurTour"] 
                        + headerLineArrayXXX["Id_TpsCumule"] 
                        + headerLineArrayXXX["Id_Ecart1erCategorie"] 
                        + headerLineArrayXXX["finish"];

                    } else if (useCategory == "no") {

                        addHeaderLineXXX = headerLineArrayXXX["start"] 
                        + headerLineArrayXXX["Id_PositionTourPrec"] 
                        + headerLineArrayXXX["Id_Position"] 
                        + headerLineArrayXXX["Id_Numero"] 
                        + headerLineArrayXXX["Id_Nom"] 
                        + headerLineArrayXXX["Id_NbTour"] 
                        + headerLineArrayXXX["Id_TpsTour"] 
                        + headerLineArrayXXX["Id_MeilleurTour"] 
                        + headerLineArrayXXX["Id_TpsCumule"] 
                        + headerLineArrayXXX["Id_Ecart1er"] 
                        + headerLineArrayXXX["finish"];
                    }

                   //   console.log('addHeaderLine\r\n'+addHeaderLine);
        
                }

            } else {  // end header and check other lines
                if (Lignes[i].substring(0, 3) == "<tr") {
                                    
                    lineArrayXXX[headerLineArrayYYY[0]] = Lignes[i].replace(/ class="/i, ' class="rnk_bkcolor ').replace(/ align="right"/i, "").replace(/ align="left"/i, "").replace(/ align="center"/i, "");
                    
                    notHeaderTR = 1; // mark that we inside a TR (not header TR)
                    
                } else if (Lignes[i].substring(0, 4) == "</tr") {
                
                    lineArrayXXX[headerLineArrayYYY[headerLineArrayYYY.length - 1]] = Lignes[i];  // add end TR line

                    notHeaderTR = 0; // mark that we finished the TR (other then header TR)

                } else if (Lignes[i].substring(0, 3) == "<td" && notHeaderTR == 1) { //check if inside a TR which is not the header TR

                    lineArrayXXX[headerLineArrayYYY[kk]] = Lignes[i].replace(/ class="/i, ' class="rnk_font ').replace(/ align="right"/i, "").replace(/ align="left"/i, "").replace(/ align="center"/i, "").replace(/>00:/i, '>');
                    kk += 1;
                } 

                if (notHeaderTR == 0) {

                    if (useCategory == "yes" && lineArrayXXX["Id_Categorie"]) {

                        catNameB = lineArrayXXX["Id_Categorie"].substring(lineArrayXXX["Id_Categorie"].indexOf(">")+1,lineArrayXXX["Id_Categorie"].lastIndexOf("<"));  // get the category value
                    }

                    if (lineArrayXXX["Id_PositionTourPrec"] && lineArrayXXX["Id_TpsCumule"] && lineArrayXXX["Id_Position"]) {

                        var timeInfoB = lineArrayXXX["Id_TpsCumule"].substring(lineArrayXXX["Id_TpsCumule"].indexOf(">")+1,lineArrayXXX["Id_TpsCumule"].lastIndexOf("<")); // get the time value
                        
                        var positionB = lineArrayXXX["Id_Position"].substring(lineArrayXXX["Id_Position"].indexOf(">")+1,lineArrayXXX["Id_Position"].lastIndexOf("<"));  // get the position value

                        var positionPrevB = lineArrayXXX["Id_PositionTourPrec"].substring(lineArrayXXX["Id_PositionTourPrec"].indexOf(">")+1,lineArrayXXX["Id_PositionTourPrec"].lastIndexOf("<"));  // get the previous lap position value

                        if (positionPrevB > positionB &&  timeInfoB != "-") {
                                lineArrayXXX["Id_PositionTourPrec"] = lineArrayXXX["Id_PositionTourPrec"].replace(/>.+</i, '>&uarr;<').replace(/ class="/i, ' class="up rnk_font ');
                        } else if (positionPrevB < positionB &&  timeInfoB != "-") {
                                lineArrayXXX["Id_PositionTourPrec"] = lineArrayXXX["Id_PositionTourPrec"].replace(/>.+</i, '>&darr;<').replace(/ class="/i, ' class="down rnk_font ');
                        } else {
                                lineArrayXXX["Id_PositionTourPrec"] = lineArrayXXX["Id_PositionTourPrec"].replace(/>.+</i, '>&harr;<');
                        }
                    }    
                                          // console.log(lineArrayXXX);
                                                                                   
                    if (useCategory == "yes") {
                    
                        addLineXXX = lineArrayXXX["start"] 
                     //   + lineArrayXXX["Id_PositionTourPrec"] 
                        + lineArrayXXX["Id_Position"] 
                        + lineArrayXXX["Id_Numero"] 
                        + lineArrayXXX["Id_Nom"] 
                        + lineArrayXXX["Id_NbTour"] 
                        + lineArrayXXX["Id_TpsTour"] 
                        + lineArrayXXX["Id_MeilleurTour"] 
                        + lineArrayXXX["Id_TpsCumule"] 
                        + lineArrayXXX["Id_Ecart1erCategorie"] 
                        + lineArrayXXX["finish"];

                        
                    } else if (useCategory == "no") {

                        addLineXXX = lineArrayXXX["start"] 
                        + lineArrayXXX["Id_PositionTourPrec"] 
                        + lineArrayXXX["Id_Position"] 
                        + lineArrayXXX["Id_Numero"] 
                        + lineArrayXXX["Id_Nom"] 
                        + lineArrayXXX["Id_NbTour"] 
                        + lineArrayXXX["Id_TpsTour"] 
                        + lineArrayXXX["Id_MeilleurTour"] 
                        + lineArrayXXX["Id_TpsCumule"] 
                        + lineArrayXXX["Id_Ecart1er"] 
                        + lineArrayXXX["finish"];
                    }
                                          
                   lineArray = [];
                    lineArrayXXX = [];
                    kk = 1; // zero the counter
                    
                    if (typeof resultsByCategoryB[catNameB] == 'undefined' && resultsByCategoryB[catNameB] == null) {
                        opt3 = addLineXXX;
                    } else {
                        opt3 = resultsByCategoryB[catNameB] + addLineXXX;
                    }
                    
                    resultsByCategoryB[catNameB] = opt3;
                    
                    addLineXXX = "";
                    opt3 = "";
 
                } // end notHeaderTR == 0
            }// end other lines
        }  // end for
        } // end if check for more the 5 lines
        //console.log(resultsByCategoryB);
        

        var sortedObj = sortObjKeysAlphabetically(resultsByCategoryB);
        NouveauTexte += '<table>\r\n'
        for(var key in sortedObj) {
            opt3 = sortedObj[key];
            if (opt3 != "") {
            //    opt1 = refactor(opt1); // re issue pos number in category, comment out line if not needed (for ex: when you get the cat pos from elite live).
                if (key == 'undefined' || catNameB == null || catNameB == "&nbsp;") {
                    key = "כללי";
                }
                NouveauTexte += '<td colspan="99" class="title_font">' + key + '</td>\r\n' + addHeaderLineXXX + '\r\n' + opt3.replace(/undefined/ig, "") + '\r\n';
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

    <!-- read race header from raceheader.txt 
<script>
        function populatePre(url) {
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                document.getElementById('raceheader').textContent = this.responseText;
            };
            xhttp.open('GET', url);
            xhttp.send();
        }
        populatePre('raceheader.txt');
</script>
 -->
