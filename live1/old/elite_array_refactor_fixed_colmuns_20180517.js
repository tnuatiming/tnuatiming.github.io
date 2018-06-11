

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
        var opt2; // can delete all opt in code  when using resultsByCategory
        var NouveauTexte;
        notHeaderTR = 0;
        hr = 0; // 1 if inside the header TR
        q = 0; // used to find the pesent line in the TR for finding category, diff with leader etc lines 
        timeLineA = -1; // the number of lines between the TR and the time TD
        catLineA = -1; // the number of lines between the TR and the category TD
        diffCatLeaderLineA = -1; // the number of lines between the TR and the diff with category leader TD
        diffLeaderLineA = -1; // the number of lines between the TR and the diff with overall leader TD
        posLineA = -1; // the number of lines between the TR and the position TD
        posPrevLineA = -1; // the number of lines between the TR and the previous lap position TD
        posPrevLineAmoved = -1; // the updated number of lines between the TR and the previous lap position TD
        nameLineA = -1; // the number of lines between the TR and name TD
        var timeInfoA = "-";
        var catNameA = "&nbsp;";
        positionPrevA = 0;
        positionA = 0 ;
        var resultsByCategoryA = [];
        var lineArray = [];
        var headerLineArray = [];
        var headerLineArrayXXX = [];
        
        Texte = Texte.split('<table');
      //  console.log(Texte[0]);
      //  console.log(Texte);
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
                     headerLineArray.push(Lignes[i].replace(/ width=".*"/i, "").replace(/ align=".*"/i, "").replace(/HeaderRow/i, "rnkh_bkcolor"));

  headerLineArrayXXX["start"]  =  Lignes[i].replace(/ width=".*"/i, "").replace(/ align=".*"/i, "").replace(/HeaderRow/i, "rnkh_bkcolor");             
                     
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
                    headerLineArray.push(Lignes[i].replace(/ width=".*"/i, "").replace(/ align=".*"/i, "").replace(/<td/i, "<th").replace(/<\/td/i, "</th"));  // clean and add the line
                    var tts = Lignes[i].substring(Lignes[i].indexOf(' id="')+4).split('"')[1];  // get the ID value
                    switch (tts) {
                        case "Id_PositionTourPrec":  // find the previous lap position TD in the header
                            posPrevLineA = i - q;
                            break;
                        case "Id_Ecart1er":  // find the diff with overall leader TD in the header
                            diffLeaderLineA = i - q;
                            break;
                        case "Id_Ecart1erCategorie":  // find the diff with category leader TD in the header
                            diffCatLeaderLineA = i - q;
                            break;
                        case "Id_Nom":  // find the diff with name TD in the header
                            nameLineA = i - q;
                            break;
                        case "Id_TpsCumule":  // find the time TD in the header
                            timeLineA = i - q;
                            break;
                        case "Id_Categorie":  // find the category TD in the header
                            catLineA = i - q;
                            break;
                        case "Id_Position":  // find the position TD in the header
                            posLineA = i - q;
                    }
headerLineArrayXXX[tts]  = (Lignes[i].replace(/ width=".*"/i, "").replace(/ align=".*"/i, "").replace(/<td/i, "<th").replace(/<\/td/i, "</th"));

                     
                     
                }
                

                console.log(headerLineArrayXXX);
                
                
                
                
                
                if (Lignes[i].substring(0, 4) == "</tr") {
                    hr = 0;
    
                    headerLineArray.push(Lignes[i]);
  headerLineArrayXXX["finish"]  =  Lignes[i];             

              //      console.log(headerLineArray);
             //      console.log(headerLineArray[posPrevLineA]);
        
                if (useCategory == "yes") {
     
                    headerLineArray.splice(posPrevLineA,1);
                   
                } else if (useCategory == "no") {

                }

                    // move the arrows to the first coulnm
                    if (useCategory == "no") {

                        for (var r = 0; r < headerLineArray.length; r++) { // find previous lap position new place in the array
                            if   (headerLineArray[r].includes('id="Id_PositionTourPrec"')) {
                                posPrevLineAmoved = r;
                            }                                
                        }                   

                        //headerLineArray.splice(new_index, 0, headerLineArray.splice(old_index, 1)[0]);
                       // headerLineArray.splice(1, 0, headerLineArray.splice(posPrevLineAmoved, 1)[0]);
                        
                    }
                    
                   
                    var addHeaderLine = "";
                    for (var r = 0; r < headerLineArray.length; r++) {
                        if (useCategory == "yes" && r != diffLeaderLineA && r != catLineA) {
                                addHeaderLine += (headerLineArray[r] + '\r\n');
                        } else if (useCategory == "no" && r != diffCatLeaderLineA && r != catLineA) {
                                addHeaderLine += (headerLineArray[r] + '\r\n');
                        }
                    }                   

                   
                   
                   
                   
                   //   console.log('addHeaderLine\r\n'+addHeaderLine);
        
                //    lineArray = [];

                }

            } else {  // end header and check other lines
                if (Lignes[i].substring(0, 3) == "<tr") {
                
                    lineArray.push(Lignes[i].replace(/ class="/i, ' class="rnk_bkcolor ').replace(/ align="right"/i, "").replace(/ align="left"/i, "").replace(/ align="center"/i, "")); // clean and add start TR line
   
                    notHeaderTR = 1; // mark that we inside a TR (not header TR)
                    
                } else if (Lignes[i].substring(0, 4) == "</tr") {
                
                    lineArray.push(Lignes[i]);  // add end TR line
                
                    notHeaderTR = 0; // mark that we finished the TR (other then header TR)

                } else if (Lignes[i].substring(0, 3) == "<td" && notHeaderTR == 1) { //check if inside a TR which is not the header TR

                    lineArray.push(Lignes[i].replace(/ class="/i, ' class="rnk_font ').replace(/ align="right"/i, "").replace(/ align="left"/i, "").replace(/ align="center"/i, "").replace(/>00:/i, '>')); // clean add end TD line
                
                } 
                
  //          console.log(tempLine);
                if (notHeaderTR == 0) {

                    if (useCategory == "yes") {
                        catNameA = lineArray[catLineA].substring(lineArray[catLineA].indexOf(">")+1,lineArray[catLineA].lastIndexOf("<"));  // get the category value
                      //  console.log(catNameA);
                    }

                    timeInfoA = lineArray[timeLineA].substring(lineArray[timeLineA].indexOf(">")+1,lineArray[timeLineA].lastIndexOf("<")); // get the time value
                    
                    positionA = lineArray[posLineA].substring(lineArray[posLineA].indexOf(">")+1,lineArray[posLineA].lastIndexOf("<"));  // get the position value

                    positionPrevA = lineArray[posPrevLineA].substring(lineArray[posPrevLineA].indexOf(">")+1,lineArray[posPrevLineA].lastIndexOf("<"));  // get the previous lap position value

                    if (positionPrevA > positionA &&  timeInfoA != "-") {
                            lineArray[posPrevLineA] = lineArray[posPrevLineA].replace(/>.+</i, '>&uarr;<').replace(/ class="/i, ' class="up rnk_font ');
                    } else if (positionPrevA < positionA &&  timeInfoA != "-") {
                            lineArray[posPrevLineA] = lineArray[posPrevLineA].replace(/>.+</i, '>&darr;<').replace(/ class="/i, ' class="down rnk_font ');
                    } else {
                            lineArray[posPrevLineA] = lineArray[posPrevLineA].replace(/>.+</i, '>&harr;<');
                    }
      
                if (useCategory == "yes") {
                    lineArray.splice(posPrevLineA,1);

      
                }
                // move the arrows to the first coulnm
                  //  if (useCategory == "no") {
                        //lineArray.splice(new_index, 0, lineArray.splice(old_index, 1)[0]); // template for option 1
                        //lineArray.splice(1, 0, lineArray.splice(posPrevLineAmoved, 1)[0]); // option 1
                 //   }
 
      
                    var addLine = "";
                    for (var r = 0; r < lineArray.length; r++) {
                        if (useCategory == "yes" && r != diffLeaderLineA && r != catLineA) {
                                addLine += (lineArray[r] + '\r\n');
                        } else if (useCategory == "no" && r != diffCatLeaderLineA && r != catLineA) {
                                addLine += (lineArray[r] + '\r\n');
                        }
                    }                   
                   
                 //  console.log(addLine);
                   lineArray = [];
 
 
                    if (typeof resultsByCategoryA[catNameA] == 'undefined' && resultsByCategoryA[catNameA] == null) {
                        opt2 = addLine;
                    } else {
                        opt2 = resultsByCategoryA[catNameA] + addLine;
                    }
                    
                    resultsByCategoryA[catNameA] = opt2;
                    
                    addLine = "";
                    opt2 = "";
 
 
                } // end notHeaderTR == 0
            }// end other lines
        }  // end for
        } // end if check for more the 5 lines
        //console.log(resultsByCategoryA);
 
        
        var sortedObj = sortObjKeysAlphabetically(resultsByCategoryA);
        NouveauTexte += '<table>\r\n'
        for(var key in sortedObj) {
            opt2 = sortedObj[key];
            if (opt2 != "") {
            //    opt1 = refactor(opt1); // re issue pos number in category, comment out line if not needed (for ex: when you get the cat pos from elite live).
                if (key == 'undefined' || catNameA == null || catNameA == "&nbsp;") {
                    key = "כללי";
                }
                NouveauTexte += '<td colspan="99" class="title_font">' + key + '</td>\r\n' + addHeaderLine + '\r\n' + opt2.replace(/undefined/ig, "") + '\r\n';
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
 

    function refactor(classic) {
        var rePos = "";
        var retf = "";
        d = -1;
        f = 1;
        var j;

        rePos = classic.split("\r\n");
        for (j = 0; j < rePos.length; j++) {
            if (rePos[j].substring(0, 3) == "<tr") {
                d = j + 1;
            }
            if (d == j) {
                retf += rePos[j].replace(/>.*</i, ">"+f+"<");
                f++;
            } else {
                retf += rePos[j];
            }
        }
        return retf
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

