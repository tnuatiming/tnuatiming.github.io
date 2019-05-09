/*
1. make "stage1", "stage2", "stage3", "stage4" folders
2. create the daily stage results with "cleanResults = 2" (you can use +++) and on the כללי view. copy the table and put it in "p1.html" file in corespanding stage folder, make sure to leave the header (tough we only use the one in stage 1).
3. set "stages = 4" acording to number of stages compleated.

TODO
remove all blue board as not needed in total??? (not needed in stage 4, other stages is needed) 
csv download not tested
cleanResults == 1 not tested, simplify table
display both gc and category position
add dns

*/
//    var TimerLoad;
//    var Rafraichir = 60000; // every 60 seconds

    var stages = 1; // day of competition

    var cleanResults = 0;


    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    
    var useCategory = "yes";
    if (sessionStorage.getItem('categoryOrAll')) {
        useCategory = sessionStorage.getItem('categoryOrAll');
    }

    var precision = "tenth"; // "tenth" for 1 digit after the .
    
    var tableClass = "fadeIn ";
    var url1 = "t1.txt";    
    var J1;
//    var T1;
        var url2 = "t2.txt";    
        var J2;    
//        var T2;    
        var url3 = "t3.txt";    
        var J3;
//        var T3;
        var url4 = "t4.txt";    
        var J4;
//        var T4;
    
    
    var csvName = '';

    document.addEventListener("DOMContentLoaded", function() {
        
        if (sessionStorage.getItem('stages')) {
            stages = sessionStorage.getItem('stages');
        }

        document.getElementById("stages").value = stages;

    //document.getElementById("demo").innerHTML = obj.options[obj.selectedIndex].text;

        document.getElementById("stages").addEventListener("change", function () {
            
            var obj = document.getElementById("stages");
            
            console.log(obj.options[obj.selectedIndex].value);
            
            stages = obj.options[obj.selectedIndex].value;
            
            Load();
    
            sessionStorage.setItem('stages', stages);
    
        });
  
  
        if (document.getElementById("cleanResults").checked) {
            cleanResults = 1;
        } else {
            cleanResults = 0;
        }
        
        const checkbox = document.getElementById('cleanResults');

        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                cleanResults = 1;
                Load();
            } else {
                cleanResults = 0;
                Load();
            }

        });
  
  
        if (cleanResults == 1) {
            
            document.getElementById("csv").style.display = "block";  
                
            // download results csv
            document.querySelector('button[id="csv"]').addEventListener("click", function () {
                var html = document.querySelector("table").outerHTML;
                
                var ma = new Date();
                var dateString = ma.getUTCFullYear() + ("0" + (ma.getUTCMonth()+1)).slice(-2) + ("0" + ma.getUTCDate()).slice(-2) + "_" + ("0" + (ma.getUTCHours()+3)).slice(-2) + ("0" + ma.getUTCMinutes()).slice(-2) + ("0" + ma.getUTCSeconds()).slice(-2);
                
                export_table_to_csv(html, dateString + "_results_total_" + csvName + ".csv");
            });
            
        }

        
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
        
    function category(choice){
        
        positionArray = []; // empting the array as the info inside is incorrect due to canging between position/category position.
        
        useCategory = choice;
        if (useCategory == "yes") {
            sessionStorage.setItem('categoryOrAll', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('categoryOrAll', 'no');
        }
        
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

//        Rafraichir = 60000; // every 60 seconds

        tableClass = "fadeIn "; // make the table fadeIn on change
        
//        Load();
        document.getElementById("result").innerHTML = createLiveTable();
//        alignTable();
    }


    async function Load() {
        
//        var loop;
//        if (TimerLoad) clearTimeout(TimerLoad);

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

/*
        if (useCategory == "yes") {
            document.getElementById("displayCatButton").style.display = "none";        
            document.getElementById("displayAllButton").style.display = "block";        
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").style.display = "block";        
            document.getElementById("displayAllButton").style.display = "none";        
        }
*/

        if (self.fetch) {

            if (stages == 4) {
                try {
                    const response = await fetch(url4, {cache: "no-store"});
                    if (response.ok) {
                        document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                        J4 = await response.text();
                    }
                }
                catch (err) {
                    console.log('results fetch failed', err);
                }
            }

            if (stages >= 3) {
                try {
                    const response = await fetch(url3, {cache: "no-store"});
                    if (response.ok) {
                        document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                        J3 = await response.text();
                    }
                }
                catch (err) {
                    console.log('results fetch failed', err);
                }
            }
    
            if (stages >= 2) {
                try {
                    const response = await fetch(url2, {cache: "no-store"});
                    if (response.ok) {
                        document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                        J2 = await response.text();
                    }
                }
                catch (err) {
                    console.log('results fetch failed', err);
                }
            }
            try {
                const response = await fetch(url1, {cache: "no-store"});
                if (response.ok) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    J1 = await response.text();
                    document.getElementById("result").innerHTML = createLiveTable();
//                    alignTable();
                }
            }
            catch (err) {
                console.log('results fetch failed', err);
            }

            
            
            
        } else {
            var xhr;

            if (stages >= 2) {
            var xhr2;
                xhr2 = new XMLHttpRequest;
                xhr2.onreadystatechange = function () {
                    if (xhr2.readyState == 4 && xhr2.status == 200) {
                        J2 = xhr2.responseText;
                    }
                };
                xhr2.open("GET", url2 + ((/\?/).test(url2) ? "&" : "?") + (new Date()).getTime());
                xhr2.send();
            }
            if (stages >= 3) {
                var xhr3;
                xhr3 = new XMLHttpRequest;
                xhr3.onreadystatechange = function() {
                    if (xhr3.readyState == 4 && xhr3.status == 200) {
                        J3 = xhr3.responseText;
                    }
                };
                xhr3.open("GET", url3 + ((/\?/).test(url3) ? "&" : "?") + (new Date()).getTime());
                xhr3.send();
            }

            if (stages == 4) {
                var xhr4;
                xhr4 = new XMLHttpRequest;
                xhr4.onreadystatechange = function() {
                    if (xhr4.readyState == 4 && xhr4.status == 200) {
                        J4 = xhr4.responseText;
                    }
                };
                xhr4.open("GET", url4 + ((/\?/).test(url4) ? "&" : "?") + (new Date()).getTime());
                xhr4.send();
            }
            
            xhr = new XMLHttpRequest;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    J1 = xhr.responseText;
                    document.getElementById("result").innerHTML = createLiveTable();
//                    alignTable();
                }
            };
            xhr.open("GET", url1 + ((/\?/).test(url1) ? "&" : "?") + (new Date()).getTime());
            xhr.send();
            }


//            loop = function() {
//                Load();
//        };
        
        document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons

//        TimerLoad = setTimeout(loop, Rafraichir);
//        Rafraichir = 60000; // every 60 seconds


        
        if (cleanResults == 1) {
            
            document.getElementById("csv").style.display = "block";  
                
            // download results csv
            document.querySelector('button[id="csv"]').addEventListener("click", function () {
                var html = document.querySelector("table").outerHTML;
                
                var ma = new Date();
                var dateString = ma.getUTCFullYear() + ("0" + (ma.getUTCMonth()+1)).slice(-2) + ("0" + ma.getUTCDate()).slice(-2) + "_" + ("0" + (ma.getUTCHours()+3)).slice(-2) + ("0" + ma.getUTCMinutes()).slice(-2) + ("0" + ma.getUTCSeconds()).slice(-2);
                
                export_table_to_csv(html, dateString + "_results_total_" + csvName + ".csv");
            });
            
        } else {
            
            document.getElementById("csv").style.display = "none";  
        }
        
        
        
        
        
        
    }

    function createLiveTable() {
//        var lines;
//        var lines2;
        var competitorPosition = 0;
        var competitorNumber = 0;
        var competitorLaps = 0;
//        var qqq = [];
//        var hhh = [];
//        var hhhPro = [];
//        var hhhPro2 = [];
//        var temp = [];
//        var lineArray = [];
        var allArray = [];
//        var lineArray2 = [];
        var allArray2 = [];
        var penalty = "no";
        var ttt = 0;
        var pp = 0;
        var a, b, l;
//        var id;
        var NewCategoryHeader = "";
//        var positionChanged = "";
//        var bestLapComp = 0;
//        var bestLap = "99999999999";
//        var bestLapComp2 = 0;
//        var bestLap2 = "99999999999";
//        var laps = 12; // number of laps
        /*        
        var bestTime2comp = 0;
        var bestTime2 = 0;
        var bestTimecomp = 0;
        var bestTime = 0;
*/        
        
        var m, Text, TextTemp, competitorTime, leaderTime, headerText1, prevCompCat, single1, single2, uci1, uci2, bigFont, catCol;
        
    if (stages >= 3) {
//        var lines3;
//        var hhhPro3 = [];
//        var lineArray3 = [];
        var allArray3 = [];
//        var bestLapComp3 = 0;
//        var bestLap3 = "99999999999";
    }
    if (stages == 4) {
//        var lines4;
//        var hhhPro4 = [];
//        var lineArray4 = [];
        var allArray4 = [];
//        var bestLapComp4 = 0;
//        var bestLap4 = "99999999999";
    }

/*
        text1 = T1.split('<table'); // split the text to title/time and the table
        text1[1] = text1[1].substring(text1[1].indexOf("<tr"),text1[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(text1[1]);

        if (text1[0].includes("+++")) { // clean table for results page
            cleanResults = 1;
            text1[0] = text1[0].replace("+++", "");
        }


        lines = text1[1].split("\n");
        //    console.log(lines.length);
        if (stages == 4) {
            text4 = T4.split('<table'); // split the text to title/time and the table
            text4[1] = text4[1].substring(text4[1].indexOf("<tr"),text4[1].lastIndexOf("</tr>")+5); // clean the table text
        //  console.log(text4[1]);

            lines4 = text4[1].split("\n");
            text4 = [];
        } 


        if (stages >= 3) {
            text3 = T3.split('<table'); // split the text to title/time and the table
            text3[1] = text3[1].substring(text3[1].indexOf("<tr"),text3[1].lastIndexOf("</tr>")+5); // clean the table text
        //  console.log(text3[1]);

            lines3 = text3[1].split("\n");
            text3 = [];
            //    console.log(lines3.length);
        } 


        if (stages >= 2) {
            text2 = T2.split('<table'); // split the text to title/time and the table
            text2[1] = text2[1].substring(text2[1].indexOf("<tr"),text2[1].lastIndexOf("</tr>")+5); // clean the table text
    //      console.log(text2[1]);
            lines2 = text2[1].split("\n");
            text2 = [];
        }
*/
//        var header1 = text1[0].split("\n"); 
//        var finalText = header1[0]; // clear the finalText variable and add the title


    if (stages == 4) {
        
        
        
  // BEGIN stage 4

        allArray4 = JSON.parse(J4);
        
        TextTemp = allArray4.shift();

             for (b = 0; b < allArray4.length; b++) {

                allArray4[b].Id_FinishTime = allArray4[b].F;
                delete allArray4[b].F;
                allArray4[b].Id_Finishblue = allArray4[b].FB;
                delete allArray4[b].FB;

                allArray4[b].Id_Arrow = allArray4[b].A;
                delete allArray4[b].A;
                allArray4[b].Id_Image = allArray4[b].M;
                delete allArray4[b].M;
                allArray4[b].Id_Image_2 = allArray4[b].M2;
                delete allArray4[b].M2;

                allArray4[b].Id_Groupe = allArray4[b].G;
                delete allArray4[b].G;
                allArray4[b].Id_penalty = allArray4[b].P;
                delete allArray4[b].P;
                
                allArray4[b].blue = allArray4[b].B;
                delete allArray4[b].B;
                
                allArray4[b].Id_Numero = allArray4[b].O;
                delete allArray4[b].O;

                // convert 0 to 99999999999
                if (allArray4[b]["Id_FinishTime"] == 0) {
                    allArray4[b]["Id_FinishTime"] = 99999999999;
                }
                 
                // phrase Id_Groupe         
                 
                if (allArray4[b]["Id_Groupe"].includes('s1')) {

                    allArray4[b]["single"] = 1;

                } else if (allArray4[b]["Id_Groupe"].includes('s2')) {

                    allArray4[b]["single"] = 2;

                } else {
                    allArray4[b]["single"] = 0;
                }
                
                if (allArray4[b]["Id_Groupe"].includes('l')) {
                    
                    allArray4[b]["leader"] = 1; // mark leader (yellow shirt)
                } else {
                    allArray4[b]["leader"] = 0;
                }                    
    
    
                if (allArray4[b]["Id_Groupe"].includes('b')) {                    
                    allArray4[b]["oldBlue"] = 1;
                } else {
                    allArray4[b]["oldBlue"] = 0;
                }
    
                if (allArray4[b]["Id_Groupe"].includes('d')) {                    
                    allArray4[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray4[b]["blue"] == 1 || allArray4[b]["Id_Groupe"].includes('b') || allArray4[b]["Id_Groupe"].includes('s') || allArray4[b]["Id_Arrow"] == 11 || allArray4[b]["Id_Arrow"] == 10 || allArray4[b]["Id_FinishTime"] == 99999999999) {
                    allArray4[b]["out"] = 1;
                }

/*                
                if (allArray4[b]["Id_Image"].includes("_Status") || allArray4[b]["Id_Image_2"].includes("_Status") || allArray4[b]["blue"] == 1 || allArray4[b]["Id_FinishTime"] == 99999999999) {
                    
                    allArray4[b].Id_Status = 1;
                } else {
                    allArray4[b].Id_Status = 0;
                }
*/               
        
                 
             } // END b


// END stage 4        
       
        
        
        
        
        
        
        
        
        
        
        
/*
        for (b = 0; b < lines4.length; b++) { 
           
            if (lines4[b].includes('<th class="rnkh_font Id_')) { // header cell
                id = (lines4[b].substring(lines4[b].indexOf('_font ')+6).split('"')[0]);
                hhhPro4.push(id);
            } else if (lines4[b].includes("OddRow") || lines4[b].includes("EvenRow")) { // competitor line
                ttt = 1;
            } else if (lines4[b].includes("</tr>") && ttt == 1) { // end competitor line
                ttt = 0;
                if (penalty == "yes") {
                    lineArray4.Id_penalty = "P";
                } else {
                    lineArray4.Id_penalty = "&nbsp;";
                }
                allArray4.push(lineArray4); // push line to main array
               lineArray4 = [];
                pp = 0;
                penalty = "no";
            } else if (lines4[b].includes("<td ") && ttt == 1) { // clean and add competitor cell
                if (lines4[b].includes("(C)")) {
                    penalty = "yes";
                }

                lineArray4[hhhPro4[pp]] = lines4[b].substring(lines4[b].indexOf(">")+1,lines4[b].lastIndexOf("<")).replace("(C) ", "");
                // convert total time to miliseconds
                    if (hhhPro4[pp] == "Id_FinishTime" && lineArray4[hhhPro4[pp]] != '-') {
                        lineArray4["Id_FinishTime"] = timeString2ms(lineArray4[hhhPro4[pp]]);   
                    }
                if (hhhPro4[pp] == "Id_Categorie" && lineArray4[hhhPro4[pp]] == '&nbsp;' ) {
                    lineArray4[hhhPro4[pp]] = "כללי";   
                }
                if (hhhPro4[pp] != "Id_Categorie" && lineArray4[hhhPro4[pp]] == 'undefined' ) {
                    lineArray4[hhhPro4[pp]] = "-";   
                }
                if (hhhPro4[pp] == "Id_Numero") {
                    if (lines4[b].includes("lightblue")) {
                        lineArray4["blue"] = 1;   
                    } else {
                        lineArray4["blue"] = 0;                   
                    }
                }

//                if (lines4[b].includes("BestTimeOverall") && hhhPro4[pp] == "Id_TpsTour") {
//                    bestTime4=lineArray4["Id_TpsTour"];
//                    bestTime4comp=lineArray4["Id_Numero"];
//                }

                // find best lap overall

                pp += 1;
        //                console.log(lineArray4);
         // console.log("x  "+bestLapComp4+"  "+bestLap4);
            }
            
        }
      //    console.log(allArray4);

            
        ttt = 0;
        pp = 0;
        penalty = "no";
*/
                
        
        
        
    }

    if (stages >= 3) {
        
        
        
        
        
        
 // BEGIN stage 3

        allArray3 = JSON.parse(J3);
        
        TextTemp = allArray3.shift();

             for (b = 0; b < allArray3.length; b++) {

                allArray3[b].Id_FinishTime = allArray3[b].F;
                delete allArray3[b].F;
                allArray3[b].Id_Finishblue = allArray3[b].FB;
                delete allArray3[b].FB;

                allArray3[b].Id_Arrow = allArray3[b].A;
                delete allArray3[b].A;
                allArray3[b].Id_Image = allArray3[b].M;
                delete allArray3[b].M;
                allArray3[b].Id_Image_2 = allArray3[b].M2;
                delete allArray3[b].M2;

                allArray3[b].Id_Groupe = allArray3[b].G;
                delete allArray3[b].G;
                allArray3[b].Id_penalty = allArray3[b].P;
                delete allArray3[b].P;
                
                allArray3[b].blue = allArray3[b].B;
                delete allArray3[b].B;
                
                allArray3[b].Id_Numero = allArray3[b].O;
                delete allArray3[b].O;

                // convert 0 to 99999999999
                if (allArray3[b]["Id_FinishTime"] == 0) {
                    allArray3[b]["Id_FinishTime"] = 99999999999;
                }
                 
                // phrase Id_Groupe         
                 
                if (allArray3[b]["Id_Groupe"].includes('s1')) {

                    allArray3[b]["single"] = 1;

                } else if (allArray3[b]["Id_Groupe"].includes('s2')) {

                    allArray3[b]["single"] = 2;

                } else {
                    allArray3[b]["single"] = 0;
                }
                
                if (allArray3[b]["Id_Groupe"].includes('l')) {
                    
                    allArray3[b]["leader"] = 1; // mark leader (yellow shirt)
                } else {
                    allArray3[b]["leader"] = 0;
                }                    
    
    
                if (allArray3[b]["Id_Groupe"].includes('b')) {                    
                    allArray3[b]["oldBlue"] = 1;
                } else {
                    allArray3[b]["oldBlue"] = 0;
                }
    
                if (allArray3[b]["Id_Groupe"].includes('d')) {                    
                    allArray3[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray3[b]["blue"] == 1 || allArray3[b]["Id_Groupe"].includes('b') || allArray3[b]["Id_Groupe"].includes('s') || allArray3[b]["Id_Arrow"] == 11 || allArray3[b]["Id_Arrow"] == 10 || allArray3[b]["Id_FinishTime"] == 99999999999) {
                    allArray3[b]["out"] = 1;
                }

/*                
                if (allArray3[b]["Id_Image"].includes("_Status") || allArray3[b]["Id_Image_2"].includes("_Status") || allArray3[b]["blue"] == 1 || allArray3[b]["Id_FinishTime"] == 99999999999) {
                    
                    allArray3[b].Id_Status = 1;
                } else {
                    allArray3[b].Id_Status = 0;
                }
*/               
        
                 
             } // END b


// END stage 3        
       
        
        
        
        
        
        
        
        
        
        
        
        
/*
        for (b = 0; b < lines3.length; b++) { 
           
            if (lines3[b].includes('<th class="rnkh_font Id_')) { // header cell
                id = (lines3[b].substring(lines3[b].indexOf('_font ')+6).split('"')[0]);
                hhhPro3.push(id);
            } else if (lines3[b].includes("OddRow") || lines3[b].includes("EvenRow")) { // competitor line
                ttt = 1;
            } else if (lines3[b].includes("</tr>") && ttt == 1) { // end competitor line
                ttt = 0;
                if (penalty == "yes") {
                    lineArray3.Id_penalty = "P";
                } else {
                    lineArray3.Id_penalty = "&nbsp;";
                }
                allArray3.push(lineArray3); // push line to main array
               lineArray3 = [];
                pp = 0;
                penalty = "no";
            } else if (lines3[b].includes("<td ") && ttt == 1) { // clean and add competitor cell
                if (lines3[b].includes("(C)")) {
                    penalty = "yes";
                }

                lineArray3[hhhPro3[pp]] = lines3[b].substring(lines3[b].indexOf(">")+1,lines3[b].lastIndexOf("<")).replace("(C) ", "");
                // convert total time to miliseconds
                    if (hhhPro3[pp] == "Id_FinishTime" && lineArray3[hhhPro3[pp]] != '-') {
                        lineArray3["Id_FinishTime"] = timeString2ms(lineArray3[hhhPro3[pp]]);   
                    }
                if (hhhPro3[pp] == "Id_Categorie" && lineArray3[hhhPro3[pp]] == '&nbsp;' ) {
                    lineArray3[hhhPro3[pp]] = "כללי";   
                }
                if (hhhPro3[pp] != "Id_Categorie" && lineArray3[hhhPro3[pp]] == 'undefined' ) {
                    lineArray3[hhhPro3[pp]] = "-";   
                }
                if (hhhPro3[pp] == "Id_Numero") {
                    if (lines3[b].includes("lightblue")) {
                        lineArray3["blue"] = 1;   
                    } else {
                        lineArray3["blue"] = 0;                   
                    }
                }

//                if (lines3[b].includes("BestTimeOverall") && hhhPro3[pp] == "Id_TpsTour") {
//                    bestTime3=lineArray3["Id_TpsTour"];
//                    bestTime3comp=lineArray3["Id_Numero"];
//                }

                // find best lap overall

                pp += 1;
        //                console.log(lineArray2);
         // console.log("x  "+bestLapComp2+"  "+bestLap2);
            }
            
        }
      //    console.log(allArray2);

            
        ttt = 0;
        pp = 0;
        penalty = "no";

*/       
        
    }


        if (stages >= 2) {
            
            
            
            
// BEGIN stage 2

        allArray2 = JSON.parse(J2);
        
        TextTemp = allArray2.shift();

             for (b = 0; b < allArray2.length; b++) {

                allArray2[b].Id_FinishTime = allArray2[b].F;
                delete allArray2[b].F;
                allArray2[b].Id_Finishblue = allArray2[b].FB;
                delete allArray2[b].FB;

                allArray2[b].Id_Arrow = allArray2[b].A;
                delete allArray2[b].A;
                allArray2[b].Id_Image = allArray2[b].M;
                delete allArray2[b].M;
                allArray2[b].Id_Image_2 = allArray2[b].M2;
                delete allArray2[b].M2;

                allArray2[b].Id_Groupe = allArray2[b].G;
                delete allArray2[b].G;
                allArray2[b].Id_penalty = allArray2[b].P;
                delete allArray2[b].P;
                
                allArray2[b].blue = allArray2[b].B;
                delete allArray2[b].B;
                
                allArray2[b].Id_Numero = allArray2[b].O;
                delete allArray2[b].O;

                // convert 0 to 99999999999
                if (allArray2[b]["Id_FinishTime"] == 0) {
                    allArray2[b]["Id_FinishTime"] = 99999999999;
                }
                 
                // phrase Id_Groupe         
                 
                if (allArray2[b]["Id_Groupe"].includes('s1')) {

                    allArray2[b]["single"] = 1;

                } else if (allArray2[b]["Id_Groupe"].includes('s2')) {

                    allArray2[b]["single"] = 2;

                } else {
                    allArray2[b]["single"] = 0;
                }
                
                if (allArray2[b]["Id_Groupe"].includes('l')) {
                    
                    allArray2[b]["leader"] = 1; // mark leader (yellow shirt)
                } else {
                    allArray2[b]["leader"] = 0;
                }                    
    
    
                if (allArray2[b]["Id_Groupe"].includes('b')) {                    
                    allArray2[b]["oldBlue"] = 1;
                } else {
                    allArray2[b]["oldBlue"] = 0;
                }
    
                if (allArray2[b]["Id_Groupe"].includes('d')) {                    
                    allArray2[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray2[b]["blue"] == 1 || allArray2[b]["Id_Groupe"].includes('b') || allArray2[b]["Id_Groupe"].includes('s') || allArray2[b]["Id_Arrow"] == 11 || allArray2[b]["Id_Arrow"] == 10 || allArray2[b]["Id_FinishTime"] == 99999999999) {
                    allArray2[b]["out"] = 1;
                }

/*                
                if (allArray2[b]["Id_Image"].includes("_Status") || allArray2[b]["Id_Image_2"].includes("_Status") || allArray2[b]["blue"] == 1 || allArray2[b]["Id_FinishTime"] == 99999999999) {
                    
                    allArray2[b].Id_Status = 1;
                } else {
                    allArray2[b].Id_Status = 0;
                }
*/               
        
                 
             } // END b


// END stage 2        
           
            
/*           

            for (b = 0; b < lines2.length; b++) { 
            
                if (lines2[b].includes('<th class="rnkh_font Id_')) { // header cell
                    id = (lines2[b].substring(lines2[b].indexOf('_font ')+6).split('"')[0]);
                    hhhPro2.push(id);
                } else if (lines2[b].includes("OddRow") || lines2[b].includes("EvenRow")) { // competitor line
                    ttt = 1;
                } else if (lines2[b].includes("</tr>") && ttt == 1) { // end competitor line
                    ttt = 0;
                    if (penalty == "yes") {
                        lineArray2.Id_penalty = "P";
                    } else {
                        lineArray2.Id_penalty = "&nbsp;";
                    }
                    allArray2.push(lineArray2); // push line to main array
                lineArray2 = [];
                    pp = 0;
                    penalty = "no";
                } else if (lines2[b].includes("<td ") && ttt == 1) { // clean and add competitor cell
                    if (lines2[b].includes("(C)")) {
                        penalty = "yes";
                    }

                    lineArray2[hhhPro2[pp]] = lines2[b].substring(lines2[b].indexOf(">")+1,lines2[b].lastIndexOf("<")).replace("(C) ", "");
                    // convert total time to miliseconds
                    if (hhhPro2[pp] == "Id_FinishTime" && lineArray2[hhhPro2[pp]] != '-') {
                        lineArray2["Id_FinishTime"] = timeString2ms(lineArray2[hhhPro2[pp]]);   
                    }
                    if (hhhPro2[pp] == "Id_Categorie" && lineArray2[hhhPro2[pp]] == '&nbsp;' ) {
                        lineArray2[hhhPro2[pp]] = "כללי";   
                    }
                    if (hhhPro2[pp] != "Id_Categorie" && lineArray2[hhhPro2[pp]] == 'undefined' ) {
                        lineArray2[hhhPro2[pp]] = "-";   
                    }
                    if (hhhPro2[pp] == "Id_Numero") {
                        if (lines2[b].includes("lightblue")) {
                            lineArray2["blue"] = 1;   
                        } else {
                            lineArray2["blue"] = 0;                   
                        }
                    }
    
//                    if (lines2[b].includes("BestTimeOverall") && hhhPro2[pp] == "Id_TpsTour") {
//                        bestTime2=lineArray2["Id_TpsTour"];
//                        bestTime2comp=lineArray2["Id_Numero"];
//                    }
    
                    // find best lap overall

                    pp += 1;
            //                console.log(lineArray2);
            // console.log("x  "+bestLapComp2+"  "+bestLap2);
                }
                
            }
        //    console.log(allArray2);

                
            ttt = 0;
            pp = 0;
            penalty = "no";
*/            
                }
    
// BEGIN stage 1

        allArray = JSON.parse(J1);
        
        Text = allArray.shift();

        var headerFlag = Text.headerFlag;
        var HeaderEventName = Text.HeaderEventName;
        var DayTime = Text.DayTime;
        var ElapsedTime = Text.ElapsedTime;
        var RemainingTime = Text.RemainingTime;
/*
        if (HeaderEventName.includes("+++")) { // clean table for results page
            cleanResults = 1;
            HeaderEventName = HeaderEventName.replace("+++", "");
        } else {
            cleanResults = 0;
        }
*/
        var HeaderRaceName = HeaderEventName.split('-');
        csvName = (HeaderRaceName[1]).split(' ').join('_'); // replace all spaces with _

        if (stages == 1) {
        var st = 'Prologue';
        } else {
        var st = 'Stage ' + (stages - 1);
        }
        
        var finalText = '<h1 id="Title">Migdal Epic Israel<br>After '+ st + '</h1>\n';

        

             for (b = 0; b < allArray.length; b++) {
                
                allArray[b].Id_Nationalite_2 = allArray[b].NA2;
                delete allArray[b].NA2;
                allArray[b].Id_Nationalite = allArray[b].NA;
                delete allArray[b].NA;
                
                allArray[b].Id_Categorie = allArray[b].C;
                delete allArray[b].C;

                allArray[b].Id_Equipe = allArray[b].Q;
                delete allArray[b].Q;


                allArray[b].Id_FinishTime = allArray[b].F;
                delete allArray[b].F;
                allArray[b].Id_Finishblue = allArray[b].FB;
                delete allArray[b].FB;

                allArray[b].Id_Arrow = allArray[b].A;
                delete allArray[b].A;
                allArray[b].Id_Image = allArray[b].M;
                delete allArray[b].M;
                allArray[b].Id_Image_2 = allArray[b].M2;
                delete allArray[b].M2;

                allArray[b].Id_Groupe = allArray[b].G;
                delete allArray[b].G;
                allArray[b].Id_penalty = allArray[b].P;
                delete allArray[b].P;
                
                allArray[b].blue = allArray[b].B;
                delete allArray[b].B;

                allArray[b].Id_Numero = allArray[b].O;
                delete allArray[b].O;
                allArray[b].Id_Nom = allArray[b].N;
                delete allArray[b].N;
                allArray[b].Id_Nom_2 = allArray[b].N2;
                delete allArray[b].N2;
                
                
                delete allArray[b].B1;
                delete allArray[b].B2;
                delete allArray[b].B3;
                delete allArray[b].E;
                delete allArray[b].E1;
                delete allArray[b].E2;
                delete allArray[b].E3;
                delete allArray[b].L;
                delete allArray[b].PC;
                delete allArray[b].PO;
                delete allArray[b].R;
                delete allArray[b].T;
                delete allArray[b].T1;
                delete allArray[b].T2;
                delete allArray[b].T3;
                delete allArray[b].TT;
                
                

                // convert 0 to 99999999999
                if (allArray[b]["Id_FinishTime"] == 0) {
                    allArray[b]["Id_FinishTime"] = 99999999999;
                }
            
                allArray[b]["Id_Numero_Full_2"] = allArray[b]["Id_Numero"] + '-2';
                allArray[b]["Id_Numero_Full"] = allArray[b]["Id_Numero"] + '-1';
                 
                 
                // phrase Id_Groupe         
                 
                if (allArray[b]["Id_Groupe"].includes('s1')) {

                    allArray[b]["single"] = 1;

                } else if (allArray[b]["Id_Groupe"].includes('s2')) {

                    allArray[b]["single"] = 2;

                } else {
                    allArray[b]["single"] = 0;
                }
                
                if (allArray[b]["Id_Groupe"].includes('u3')) {

                    allArray[b]["uci"] = 3;

                } else if (allArray[b]["Id_Groupe"].includes('u1')) {

                    allArray[b]["uci"] = 1;

                } else if (allArray[b]["Id_Groupe"].includes('u2')) {

                    allArray[b]["uci"] = 2;

                } else {
                    allArray[b]["uci"] = 0;
                }


                if (allArray[b]["Id_Groupe"].includes('l')) {
                    
                    allArray[b]["leader"] = 1; // mark leader (yellow shirt)
                } else {
                    allArray[b]["leader"] = 0;
                }                    
    
    
                if (allArray[b]["Id_Groupe"].includes('b')) {                    
                    allArray[b]["oldBlue"] = 1;
                } else {
                    allArray[b]["oldBlue"] = 0;
                }
    
                    if (allArray[b]["Id_Groupe"].includes('d')) {                    
                    allArray[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray[b]["blue"] == 1 || allArray[b]["Id_Groupe"].includes('b') || allArray[b]["Id_Groupe"].includes('s') || allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_FinishTime"] == 99999999999) {
                    allArray[b]["out"] = 1;
                } else {
                    allArray[b]["out"] = 0;                    
                }

/*                
                if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status") || allArray[b]["blue"] == 1 || allArray[b]["Id_FinishTime"] == 99999999999) {
                    
                    allArray[b].Id_Status = 1;
                } else {
                    allArray[b].Id_Status = 0;
                }
*/               
                allArray[b]["blue_1"] = 0;                    
                allArray[b]["blue_2"] = 0;                    
                allArray[b]["blue_3"] = 0;                    
                allArray[b]["finishTimeTotal"] = 99999999999;
                allArray[b]["dnsfq"] = "";
                allArray[b]["stagesFinished"] = 0;
                allArray[b]["Id_Position_Categorie"] = 0;
                allArray[b]["Id_Position_Overall"] = 0;

                if (allArray[b]["Id_Categorie"] == '&nbsp;' ) {
                    allArray[b]["Id_Categorie"] = " ";   
                }
                if (allArray[b]["Id_Categorie"] == 'undefined' ) {
                    allArray[b]["Id_Categorie"] = "-";   
                }
        
                 
             } // END b


        
//        console.log('allArray before:');
//        console.log(allArray);
        
        
        
/*        
        for (b = 0; b < lines.length; b++) { 
           
            if (lines[b].includes('<th class="rnkh_font Id_')) { // header cell
                id = (lines[b].substring(lines[b].indexOf('_font ')+6).split('"')[0]);
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

                lineArray["blue_1"] = "-";                    
                lineArray["blue_2"] = "-";                    
                lineArray["blue_3"] = "-";                    
                lineArray["finishTimeTotal"] = 99999999999;
                lineArray["dnsfq"] = "";
                
                allArray.push(lineArray); // push line to main array 
               lineArray = [];
                pp = 0;
                penalty = "no";
            } else if (lines[b].includes("<td ") && ttt == 1) { // clean and add competitor cell
                if (lines[b].includes("(C)")) {
                    penalty = "yes";
                }

                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");
                // convert total time to miliseconds
                if (hhhPro[pp] == "Id_FinishTime" && lineArray[hhhPro[pp]] != '-') {
                    lineArray["Id_FinishTime"] = timeString2ms(lineArray[hhhPro[pp]]);   
                }
                if (hhhPro[pp] == "Id_Categorie" && lineArray[hhhPro[pp]] == '&nbsp;' ) {
                    lineArray[hhhPro[pp]] = "כללי";   
                }
                if (hhhPro[pp] != "Id_Categorie" && lineArray[hhhPro[pp]] == 'undefined' ) {
                    lineArray[hhhPro[pp]] = "-";   
                }
                    if (hhhPro[pp] == "Id_Numero") {
                        if (lines[b].includes("lightblue")) {
                            lineArray["blue"] = 1;   
                        } else {
                            lineArray["blue"] = 0;                   
                        }
                    }

//                if (lines[b].includes("BestTimeOverall") && hhhPro[pp] == "Id_TpsTour") {
//                    bestTime=lineArray["Id_TpsTour"];
//                    bestTimecomp=lineArray["Id_Numero"];
                }


                pp += 1;
        //  console.log(lineArray);
       //   console.log(bestLapComp+"  "+bestLap);

            }
            
        }   // END stage 1
*/
 //        console.log('allArray:');

 //        console.log(allArray);
     //    console.log(hhh);
     //    console.log(hhhPro);

     //             console.log(qqq);
      //   console.log(hhhPro2);
         //                console.log(allArray);

         
        if (stages >= 1) {
            for (b = 0; b < allArray.length; b++) { // main table

                if (allArray[b]["Id_FinishTime"] != 99999999999) {
                    allArray[b]["finishTimeTotal"] = allArray[b]["Id_FinishTime"];
                    allArray[b]["stagesFinished"] += 1;
                }

                    if (allArray[b]["Id_Arrow"] == 10) {
                        allArray[b]["dnsfq"] = "dsq";
                    } else if (allArray[b]["Id_Arrow"] == 11) {
                        allArray[b]["dnsfq"] = "dnf";
                    } else if (allArray[b]["blue"] == 1) {
                        allArray[b]["dnsfq"] = "blue";
                    } else if (allArray[b]["finishTimeTotal"] == 99999999999) {
                        allArray[b]["dnsfq"] = ""; // ???
                    }
                
 /*               if (allArray[b]["blue"] == 1 || allArray[b]["finishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                    allArray[b]["dnsfq"] = "dsq";
                }*/
            }
        }
         
        if (stages >= 2) {
            for (b = 0; b < allArray.length; b++) { // first and main table
                for (a = 0; a < allArray2.length; a++) { // secound table

                    // calculating total time from both arrays

                    if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                        
                        allArray[b]["Id_FinishTime_1"] = allArray2[a]["Id_FinishTime"];
                        allArray[b]["blue_1"] = allArray2[a]["blue"];
                        allArray[b]["Id_Arrow_1"] = allArray2[a]["Id_Arrow"];
                        allArray[b]["single"] = allArray2[a]["single"];
                        
                        if (allArray2[a]["out"] == 1) {
                            allArray[b]["out"] = 1;
                        }
                                
                    }
                }  // END a
                        
                        if (allArray[b]["Id_FinishTime"] != 99999999999 && allArray[b]["Id_FinishTime_1"] != 99999999999) {
                            
                            allArray[b]["finishTimeTotal"] = allArray[b]["Id_FinishTime"] + allArray[b]["Id_FinishTime_1"];
                        }
                    
                        if (allArray[b]["Id_FinishTime_1"] != 99999999999) {
                            
                            allArray[b]["stagesFinished"] += 1;
                        }

                        if (allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_Arrow_1"] == 10) {
                            allArray[b]["dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow_1"] == 11) {
                            allArray[b]["dnsfq"] = "dnf";
                        } else if (allArray[b]["blue"] == 1 || allArray[b]["blue_1"] == 1) {
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["finishTimeTotal"] == 99999999999) {
                            allArray[b]["dnsfq"] = ""; // ???
                        }
                   
                    
/*                        if (allArray[b]["blue"] == 1 || allArray[b]["blue_1"] == 1 || allArray[b]["finishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["Id_Arrow_1"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                        allArray[b]["dnsfq"] = "dsq";
                        }*/
                    
            }  // END b
            
            // delete the secound array
            allArray2 = [];
        }  
            
        if (stages >= 3) {
                                    
            for (b = 0; b < allArray.length; b++) { // first and main table
                for (a = 0; a < allArray3.length; a++) { // third table

                    // calculating total time from both arrays

                    if (allArray[b]["Id_Numero"] == allArray3[a]["Id_Numero"]) {
                        
                        allArray[b]["Id_FinishTime_2"] = allArray3[a]["Id_FinishTime"];
                        allArray[b]["blue_2"] = allArray3[a]["blue"];
                        allArray[b]["Id_Arrow_2"] = allArray3[a]["Id_Arrow"];
                        allArray[b]["single"] = allArray3[a]["single"];
                        
                        if (allArray3[a]["out"] == 1) {
                            allArray[b]["out"] = 1;
                        }
                        
                    }
                    
                }  // END a
                        
                        if (allArray[b]["finishTimeTotal"] != 99999999999 && allArray[b]["Id_FinishTime_2"] != 99999999999) {
                            
                            allArray[b]["finishTimeTotal"] = allArray[b]["finishTimeTotal"] + allArray[b]["Id_FinishTime_2"];
                        }
                    
                        if (allArray[b]["Id_FinishTime_2"] != 99999999999) {
                            
                            allArray[b]["stagesFinished"] += 1;
                        }
                    
                
                        if (allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_Arrow_1"] == 10 || allArray[b]["Id_Arrow_2"] == 10) {
                            allArray[b]["dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow_1"] == 11 || allArray[b]["Id_Arrow_2"] == 11) {
                            allArray[b]["dnsfq"] = "dnf";
                        } else if (allArray[b]["blue"] == 1 || allArray[b]["blue_1"] == 1 || allArray[b]["blue_2"] == 1) {
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["finishTimeTotal"] == 99999999999) {
                            allArray[b]["dnsfq"] = ""; // ???
                        }

                        
/*                        if (allArray[b]["blue"] == 1 || allArray[b]["blue_1"] == 1 || allArray[b]["blue_2"] == 1 || allArray[b]["finishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["Id_Arrow_1"].includes('dnsfq') || allArray[b]["Id_Arrow_2"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                        allArray[b]["dnsfq"] = "dsq";
                        }*/
                    
            }  // END b

            // delete the third array
            allArray3 = [];
        }
            
        if (stages == 4) {
      
            for (b = 0; b < allArray.length; b++) { // first and main table
                for (a = 0; a < allArray4.length; a++) { // forth table

                    // calculating total time from both arrays

                    if (allArray[b]["Id_Numero"] == allArray4[a]["Id_Numero"]) {
                        
                        allArray[b]["Id_FinishTime_3"] = allArray4[a]["Id_FinishTime"];
                        allArray[b]["blue_3"] = allArray4[a]["blue"];
                        allArray[b]["Id_Arrow_3"] = allArray4[a]["Id_Arrow"];
                        allArray[b]["single"] = allArray4[a]["single"];
                        
                        if (allArray4[a]["out"] == 1) {
                            allArray[b]["out"] = 1;
                        }
                
                    }
                    
                }  // END a

                        
                        if (allArray[b]["finishTimeTotal"] != 99999999999 && allArray[b]["Id_FinishTime_3"] != 99999999999) {
                            
                            allArray[b]["finishTimeTotal"] = allArray[b]["finishTimeTotal"] + allArray[b]["Id_FinishTime_3"];
                        }
                
                        if (allArray[b]["Id_FinishTime_3"] != 99999999999) {
                            
                            allArray[b]["stagesFinished"] += 1;
                        }
                
                        if (allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_Arrow_1"] == 10 || allArray[b]["Id_Arrow_2"] == 10 || allArray[b]["Id_Arrow_3"] == 10) {
                            allArray[b]["dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow_1"] == 11 || allArray[b]["Id_Arrow_2"] == 11 || allArray[b]["Id_Arrow_3"] == 11) {
                            allArray[b]["dnsfq"] = "dnf";
                        } else if (allArray[b]["blue"] == 1 || allArray[b]["blue_1"] == 1 || allArray[b]["blue_2"] == 1 || allArray[b]["blue_3"] == 1) {
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["finishTimeTotal"] == 99999999999) {
                            allArray[b]["dnsfq"] = ""; // ???
                        }

                        
/*                        if (allArray[b]["blue"] == 1 || allArray[b]["blue_1"] == 1 || allArray[b]["blue_2"] == 1 || allArray[b]["finishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["Id_Arrow_1"].includes('dnsfq') || allArray[b]["Id_Arrow_2"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                        allArray[b]["dnsfq"] = "dsq";
                        }*/
                    
            }  // END b
            
            // delete the forth array
            allArray4 = [];
        }


         // THE MAGIC - sort the array after the merge to get new results
//        if (useCategory == "no") {
            allArray.sort(function(a, b){return a.out - b.out || b.stagesFinished - a.stagesFinished || a.dnsfq.localeCompare(b.dnsfq) || a.finishTimeTotal - b.finishTimeTotal});
            
                // reasign postion number
            for (l = 0; l < allArray.length; l++) {

                allArray[l]["Id_Position_Overall"] = l+1;
            }
            
            
            
            
//        } else if (useCategory == "yes") {
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.out - b.out || b.stagesFinished - a.stagesFinished || a.dnsfq.localeCompare(b.dnsfq) || a.finishTimeTotal - b.finishTimeTotal});
//        }
         
    // fix the position fields of the competitors and start building the final table
            m = 0;
            prevCompCat = ""

            
            for (l = 0; l < allArray.length; l++) {

  
                if (prevCompCat == allArray[l]["Id_Categorie"]) {
                    m += 1;
                } else {
                    m = 1;
                prevCompCat = allArray[l]["Id_Categorie"];
                }
                
                allArray[l]["Id_Position_Categorie"] = m;
                 

            }     
                 
                 
                 
            if (useCategory == "no") {
                
                allArray.sort(function(a, b){return a.out - b.out || b.stagesFinished - a.stagesFinished || a.dnsfq.localeCompare(b.dnsfq) || a.finishTimeTotal - b.finishTimeTotal});
                                
            }                 
                            
                            
    // HEADER         
                            
                            
        headerText1 = '<tr class="rnkh_bkcolor">\n';


    // hard coded header for now
        if (cleanResults == 1) {
            headerText1 += '<th class="rnkh_font Id_Arrow">Status</th>\n';
            headerText1 += '<th class="rnkh_font Id_Position_Overall">General Classification</th>\n';
            headerText1 += '<th class="rnkh_font Id_Position_Categorie">Category Position</th>\n';
            headerText1 += '<th class="rnkh_font Id_Numero">Number</th>\n';
        } else {
            headerText1 += '<th class="rnkh_font Id_Position_Overall">GC</th>\n';
            headerText1 += '<th class="rnkh_font Id_Position_Categorie">CAT</th>\n';
            headerText1 += '<th class="rnkh_font Id_Numero">Nr.</th>\n';
        }
            if (useCategory == "no") {
                headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>\n';
            }
       if (cleanResults == 1) {
            headerText1 += '<th class="rnkh_font Id_Numero_Full">Rider 1 Number</th>\n';
            headerText1 += '<th class="rnkh_font Id_Nom">Rider 1 Name</th>\n';
            headerText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>\n';
            headerText1 += '<th class="rnkh_font uci">UCI</th>\n';
            headerText1 += '<th class="rnkh_font Id_Numero_Full_2">Rider 2 Number</th>\n';
            headerText1 += '<th class="rnkh_font Id_Nom_2">Rider 2 Name</th>\n';
            headerText1 += '<th class="rnkh_font Id_Nationalite_2">Nationality</th>\n';
            headerText1 += '<th class="rnkh_font uci">UCI</th>\n';

            
       } else {
            headerText1 += '<th class="rnkh_font Id_Nom">Riders</th>\n';
       }
            headerText1 += '<th class="rnkh_font Id_Equipe">Team</th>\n';
            headerText1 += '<th class="rnkh_font Id_FinishTime">Prologue</th>\n';
            if (stages >= 2) {
                headerText1 += '<th class="rnkh_font Id_FinishTime_1">Stage 1</th>\n';
            }
            if (stages >= 3) {
                headerText1 += '<th class="rnkh_font Id_FinishTime_2">Stage 2</th>\n';
            }
            if (stages == 4) {
                headerText1 += '<th class="rnkh_font Id_FinishTime_3">Stage 3</th>\n';
            }
            headerText1 += '<th class="rnkh_font finishTimeTotal">Time</th>\n';
            headerText1 += '<th class="rnkh_font Id_Ecart1er">Gap</th>\n';

        
        headerText1 += '</tr>\n';
      //   console.log(headerText1);

         
// END HEADER         

         
    // fix the position fields of the competitors and start building the final table
//            m = 0;
//            prevCompCat = ""

//            finalText += '\n<div id="liveTable"><table class="' + tableClass + 'line_color">\n';
            
            if (useCategory == "no") {
                finalText += '\n<div id="liveTable"><table class="' + tableClass + 'line_color">\n';
            } else {

                finalText += '\n<div id="liveTable">\n';
            }           
            
            
            for (l = 0; l < allArray.length; l++) {
                
                    
                if (useCategory == "no") {
                                                    
                    allArray[l]["Id_Position"] = allArray[l]["Id_Position_Overall"];
                    
                } else {
                    allArray[l]["Id_Position"] = allArray[l]["Id_Position_Categorie"];
                }
                
                
                
                
                

/*                // reasign postion number
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
*/
                if (allArray[l]["Id_Position"] == 1) {
                    leaderTime = allArray[l]["finishTimeTotal"];
                }

                // fix the diff fields of the competitors

                competitorTime = allArray[l]["finishTimeTotal"];
                if (competitorTime != 99999999999 && competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                allArray[l]["Id_Ecart1er"] = ms2TimeString(competitorTime - leaderTime);
                    
                } else {
                allArray[l]["Id_Ecart1er"] = 99999999999;
                }
                    
                // convert back to time
                if (allArray[l]["Id_FinishTime"] != 99999999999) {  
                    allArray[l]["Id_FinishTime"] = ms2TimeString(allArray[l]["Id_FinishTime"]);
                } else {
                    allArray[l]["Id_FinishTime"] = '-';
                }
                            
                if (stages >= 2) {

                    if (allArray[l]["Id_FinishTime_1"] != 99999999999) {  
                        allArray[l]["Id_FinishTime_1"] = ms2TimeString(allArray[l]["Id_FinishTime_1"]);
                    } else {
                        allArray[l]["Id_FinishTime_1"] = '-';
                    }
                }
            
                if (stages >= 3) {
                    if (allArray[l]["Id_FinishTime_2"] != 99999999999) {  
                        allArray[l]["Id_FinishTime_2"] = ms2TimeString(allArray[l]["Id_FinishTime_2"]);
                        
                    } else {
                        allArray[l]["Id_FinishTime_2"] = '-';
                    }
                }
            
                if (stages == 4) {
                    if (allArray[l]["Id_FinishTime_3"] != 99999999999) {  
                        allArray[l]["Id_FinishTime_3"] = ms2TimeString(allArray[l]["Id_FinishTime_3"]);
                        } else {
                        allArray[l]["Id_FinishTime_3"] = '-';
                    }
                }

                if (allArray[l]["finishTimeTotal"] != 99999999999) {
                    
                    if (allArray[l]["finishTimeTotal"] >= 86400000) { // if over 24 hours
                        allArray[l]["finishTimeTotal"] = convertMS(allArray[l]["finishTimeTotal"]);
                    } else {
                        allArray[l]["finishTimeTotal"] = ms2TimeString(allArray[l]["finishTimeTotal"]);
                    }
                    
                }

        
                single1 = ""
                single2 = "";
                uci1 = "";
                uci2 = "";

                if (allArray[l]["single"] == 1) {
                    single2 = "lineThrough";
                }
                if (allArray[l]["single"] == 2) {
                    single1 = "lineThrough";
                }

                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    uci1 = '<span title="UCI Rider" class="Flag UCI"></span>';
                }
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    uci2 = '<span title="UCI Rider" class="Flag UCI"></span>';
                }


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



            if (cleanResults == 1) {
                bigFont = '';
            } else {
                bigFont = 'bigFont';
            }

            if (allArray[l]["Id_Categorie"] == 'Women') {
                catCol = 'pink';
            } else if (allArray[l]["Id_Categorie"] == 'Mixed') {
                catCol = 'greengreen';
            } else if (allArray[l]["Id_Categorie"] == 'Masters') {
                catCol = 'blue';
            } else if (allArray[l]["Id_Categorie"] == 'Grand') {
                catCol = 'purple';
            } else if (allArray[l]["Id_Categorie"] == 'Men'){
                catCol = 'yellow';
            } else {
                catCol = 'black';
            }


            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="rnk_bkcolor OddRow">\n';
            } else {
                finalText += '<tr class="rnk_bkcolor EvenRow">\n';
            }
                       
            if (cleanResults == 0) {
                if (allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td colspan="2" title="Disqualified" class="rnk_font">DSQ</td>\n';
                } else if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td colspan="2" title="Did Not Finished" class="rnk_font">DNF</td>\n';
                } else if (allArray[l]["single"] != 0) {
                    finalText += '<td colspan="2" title="Single Finisher" class="rnk_font">SF</td>\n'; // add postion
                } else if (allArray[l]["out"] == 0) {
                    finalText += '<td class="rnk_font ' + bigFont + '">' + allArray[l]["Id_Position_Overall"] + '</td>\n'; // add postion
                    finalText += '<td class="rnk_font ' + bigFont + ' ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>\n'; // add postion
                } else {
                    finalText += '<td colspan="2" class="rnk_font"></td>\n'; // add postion
                }
                
                 if (allArray[l]["blue"] == 1 || allArray[l]["blue_1"] == 1 || allArray[l]["blue_2"] == 1 || allArray[l]["blue_3"] == 1) {
                finalText += '<td title="Blue Board Rider" class="rnk_font blueCard ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td class="rnk_font highlight ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                }
                               
       //         finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>\n';
       
                
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>\n';// add the Category
                }
       

                finalText += '<td class="rnk_font"><div class="FirstLine ' + single1 + '">' + uci1 + allArray[l]["Id_Nom"];// add the name
                if (typeof allArray[l]["Id_Nationalite"] != 'undefined') {
                    finalText += '<span title="' + allArray[l]["Id_Nationalite"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>'/* + leader*/; // add flag
                }
                finalText += '</div>';// add the name

                
                finalText += '<div class="SecoundLine ' + single2 + '">' + uci2 + allArray[l]["Id_Nom_2"];// add the name
                if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
                    finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single2 + ' ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>'/* + leader*/; // add flag
                }
                finalText += '</div></td>';// add the name
                
       
                finalText += '<td class="rnk_font wrap">' + allArray[l]["Id_Equipe"] + '</td>\n';// add the Team
                

                finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>\n'; // add time 1
                
                if (stages >= 2) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_1"] + '</td>\n'; // add time 2
                }
                if (stages >= 3) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_2"] + '</td>\n'; // add time 3
                }
                if (stages == 4) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_3"] + '</td>\n'; // add time 4
                }
                
                if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add total time
                } else {
                    finalText += '<td class="rnk_font bold">' + allArray[l]["finishTimeTotal"] + '</td>\n'; // add total time
                }
                
                if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add diff
                } else {
                    finalText += '<td class="rnk_font">+' + allArray[l]["Id_Ecart1er"] + '</td>\n'; // add diff
                }
 
                finalText += '</tr>\n';
                
            } else { // cleanResults == 1
                
                if (allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td title="Disqualified" class="rnk_font">DSQ</td>\n';
                } else if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td title="Did Not Finished" class="rnk_font">DNF</td>\n';
                } else if (allArray[l]["single"] != 0) {
                    finalText += '<td title="Single Finisher" class="rnk_font">SF</td>\n'; 
                } else if (allArray[l]["finishTimeTotal"] != 99999999999 && allArray[l]["Id_Position_Categorie"] == 1) { // leader
                    
                    finalText += '<td class="rnk_font">Leader</td>';
                    
                } else if (allArray[l]["finishTimeTotal"] != 99999999999) { // finished
                    
                    finalText += '<td class="rnk_font">Finished</td>';
                    
                } else {
                    finalText += '<td class="rnk_font"></td>\n'; 
                }
                    
                
                if (allArray[l]["out"] == 0) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>\n'; // add postion
                    finalText += '<td class="rnk_font ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>\n'; // add postion
                } else {
                     
                    finalText += '<td class="rnk_font"></td>\n'; // add postion
                    finalText += '<td class="rnk_font"></td>\n'; // add postion
                    
                }
                
         
                 if (allArray[l]["blue"] == 1 || allArray[l]["blue_1"] == 1 || allArray[l]["blue_2"] == 1 || allArray[l]["blue_3"] == 1) {
                finalText += '<td title="Blue Board Rider" class="rnk_font blueCard">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                }
                               
       //         finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>\n';
       
                
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>\n';// add the Category
                }
       
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full"] + '</td>\n';// add the full number
                        
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom"] + '</td>\n';// add the name
                    
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nationalite"] + '</td>\n';// add Id_Nationalite 
                        
                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
        
                
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full_2"] + '</td>\n';// add the full number 2
                    
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom_2"] + '</td>\n';// add the name 2

                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nationalite_2"] + '</td>\n';// add Id_Nationalite 2
                    
                    
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
             
       
                finalText += '<td class="rnk_font wrap">' + allArray[l]["Id_Equipe"] + '</td>\n';// add the Team
                

                finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>\n'; // add time 1
                
                if (stages >= 2) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_1"] + '</td>\n'; // add time 2
                }
                if (stages >= 3) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_2"] + '</td>\n'; // add time 3
                }
                if (stages == 4) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_3"] + '</td>\n'; // add time 4
                }
                
                if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add total time
                } else {
                    finalText += '<td class="rnk_font bold">' + allArray[l]["finishTimeTotal"] + '</td>\n'; // add total time
                }
                
                if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add diff
                } else {
                    finalText += '<td class="rnk_font">+' + allArray[l]["Id_Ecart1er"] + '</td>\n'; // add diff
                }
 
                finalText += '</tr>\n';
   
                
            }
               
        }  // END for l      
         
         
        finalText += '</table></div>\n';
     
//download(finalText, 'finalText.txt', 'text/plain')
                
//        console.log('allArray after:');
        console.log(allArray);
          
//        console.log('allArray2:');
//        console.log(allArray2);


         //    console.log(finalText);
      
    tableClass = "";
            
    return finalText

    }
    
/*    function download(text, name, type) {
        var a = document.getElementById("a");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
        URL.revokeObjectURL(a.href);
    }   
*/    
    function ms2TimeString(mili){
        
        var gfg = ms2TimeStringSub(mili);
        
        if (gfg.toString().substring(0, 3) == "00:") {
            gfg = gfg.substr(3);
        }
        if (gfg.toString().substring(0, 1) == "0" && gfg.toString().substring(1, 2) != ".") {
            gfg = gfg.substr(1);
        }
    return gfg
        
    };


    function timeString2ms(a,b){// time(HH:MM:SS.mss) // optimized
        if (precision == "tenth") {
            return a=a.split('.'), // optimized
            b=a[1]*1||0, // optimized, if a[1] defined, use it, else use 0
            a=a[0].split(':'),
            (b*1e2)+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
        } else {
            return a=a.split('.'), // optimized
            b=a[1]*1||0, // optimized, if a[1] defined, use it, else use 0
            a=a[0].split(':'),
            b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
        }        
    };

    function ms2TimeStringSub(a,k,s,m,h){
        if (precision == "tenth") {
            return k=a%1e3, // optimized by konijn
            s=a/1e3%60|0,
            m=a/6e4%60|0,
            h=a/36e5%24|0,
            (h?(h<10?'0'+h:h)+':':'')+ // optimized
            (m<10?0:'')+m+':'+  // optimized
            (s<10?0:'')+s+'.'+ // optimized
            +(k/1e2) // optimized
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

/*       
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

    function convertMS(milliseconds) { // if over 24 hours
        var day, hour, minute, seconds,millisecond, time;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        millisecond = milliseconds%1e3;
        
        time = ((day*24) + hour) + ':' + (minute<10?0:'') + minute + ':' + (seconds<10?0:'') + seconds + ':' + (millisecond<100?millisecond<10?'00':0:'') + millisecond;
        return time
    }
    

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
    
// csv file create and download
function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

function export_table_to_csv(html, filename) {
	var csv = [];
    csv.push('Migdal Epic Israel - after' + csvName.split('_').join(' '));
	var rows = document.querySelectorAll("table tr");
	
    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
		csv.push(row.join(","));		
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}
    
