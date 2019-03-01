var TimerLoad, TimerChange;
    var MaxNum, Rafraichir, Changement, ClassementReduit, ClassementReduitXpremier;
    var UrlRefresh, UrlChange;
    Rafraichir = 60000;
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

    var stages = 4; // day of competition

    var tableClass = "fadeIn ";
    var url1 = "stage1/p1.html";    
    var text1;
    if (stages >= 2) {
        var url2 = "stage2/p1.html";    
        var text2;    
    }
    if (stages >= 3) {
        var url3 = "stage3/p1.html";    
        var text3;
    }
    if (stages == 4) {
        var url4 = "stage4/p1.html";    
        var text4;
    }

    function category(choice){
        
        positionArray = []; // empting the array as the info inside is incorrect due to canging between position/category position.
        
        useCategory = choice;
        if (useCategory == "yes") {
            sessionStorage.setItem('categoryOrAll', 'yes');
        } else if (useCategory == "no") {
            sessionStorage.setItem('categoryOrAll', 'no');
        }
        
        Rafraichir = 60000;

        tableClass = "fadeIn "; // make the table fadeIn on change
        
        Load();
    }


    async function Load() {
        
        var loop;
        if (TimerLoad) clearTimeout(TimerLoad);


        if (useCategory == "yes") {
            document.getElementById("displayCatButton").style.display = "none";        
            document.getElementById("displayAllButton").style.display = "block";        
        } else if (useCategory == "no") {
            document.getElementById("displayCatButton").style.display = "block";        
            document.getElementById("displayAllButton").style.display = "none";        
        }

        if (self.fetch) {

            if (stages == 4) {
                try {
                    const response = await fetch(url4, {cache: "no-store"});
                    if (response.ok) {
                        document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                        text4 = await response.text();
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
                        text3 = await response.text();
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
                        text2 = await response.text();
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
                    text1 = await response.text();
                    document.getElementById("result").innerHTML = createLiveTable();
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
                        text2 = xhr2.responseText;
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
                        text3 = xhr3.responseText;
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
                        text4 = xhr4.responseText;
                    }
                };
                xhr4.open("GET", url4 + ((/\?/).test(url4) ? "&" : "?") + (new Date()).getTime());
                xhr4.send();
            }
            
            xhr = new XMLHttpRequest;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    text1 = xhr.responseText;
                    document.getElementById("result").innerHTML = createLiveTable();
                }
            };
            xhr.open("GET", url1 + ((/\?/).test(url1) ? "&" : "?") + (new Date()).getTime());
            xhr.send();
            }


            loop = function() {
                Load();
        };
        
        document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons

        TimerLoad = setTimeout(loop, Rafraichir);
        Rafraichir = 60000;

    }

    function createLiveTable() {
        var lines;
        var lines2;
        competitorPosition = 0;
        competitorNumber = 0;
        competitorLaps = 0;
//        var qqq = [];
//        var hhh = [];
        var hhhPro = [];
        var hhhPro2 = [];
//        var temp = [];
        var lineArray = [];
        var allArray = [];
        var lineArray2 = [];
        var allArray2 = [];
        var penalty = "no";
        var ttt = 0;
        var pp = 0;
        var a, b, l;
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
    if (stages >= 3) {
        var lines3;
        var hhhPro3 = [];
        var lineArray3 = [];
        var allArray3 = [];
        var bestLapComp3 = 0;
        var bestLap3 = "99999999999";
    }
    if (stages == 4) {
        var lines4;
        var hhhPro4 = [];
        var lineArray4 = [];
        var allArray4 = [];
        var bestLapComp4 = 0;
        var bestLap4 = "99999999999";
    }


        text1 = text1.split('<table'); // split the text to title/time and the table
        text1[1] = text1[1].substring(text1[1].indexOf("<tr"),text1[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(text1[1]);

        lines = text1[1].split("\n");
        //    console.log(lines.length);

        if (stages == 4) {
            text4 = text4.split('<table'); // split the text to title/time and the table
            text4[1] = text4[1].substring(text4[1].indexOf("<tr"),text4[1].lastIndexOf("</tr>")+5); // clean the table text
        //  console.log(text4[1]);

            lines4 = text4[1].split("\n");
            text4 = [];
        } 


        if (stages >= 3) {
            text3 = text3.split('<table'); // split the text to title/time and the table
            text3[1] = text3[1].substring(text3[1].indexOf("<tr"),text3[1].lastIndexOf("</tr>")+5); // clean the table text
        //  console.log(text3[1]);

            lines3 = text3[1].split("\n");
            text3 = [];
            //    console.log(lines3.length);
        } 


        if (stages >= 2) {
            text2 = text2.split('<table'); // split the text to title/time and the table
            text2[1] = text2[1].substring(text2[1].indexOf("<tr"),text2[1].lastIndexOf("</tr>")+5); // clean the table text
    //      console.log(text2[1]);
            lines2 = text2[1].split("\n");
            text2 = [];
        }
        var header1 = text1[0].split("\n"); 
        var finalText = header1[0]; // clear the finalText variable and add the title


    if (stages == 4) {

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
/*
                if (lines4[b].includes("BestTimeOverall") && hhhPro4[pp] == "Id_TpsTour") {
                    bestTime4=lineArray4["Id_TpsTour"];
                    bestTime4comp=lineArray4["Id_Numero"];
                }
*/
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
    }

    if (stages >= 3) {

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
/*
                if (lines3[b].includes("BestTimeOverall") && hhhPro3[pp] == "Id_TpsTour") {
                    bestTime3=lineArray3["Id_TpsTour"];
                    bestTime3comp=lineArray3["Id_Numero"];
                }
*/
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
    }


        if (stages >= 2) {

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
    /*
                    if (lines2[b].includes("BestTimeOverall") && hhhPro2[pp] == "Id_TpsTour") {
                        bestTime2=lineArray2["Id_TpsTour"];
                        bestTime2comp=lineArray2["Id_Numero"];
                    }
    */
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
        }
            
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

                lineArray["Id_Classe_2"] = "-";                    
                lineArray["Id_Classe_3"] = "-";                    
                lineArray["Id_Classe_4"] = "-";                    
                lineArray["Id_FinishTimeTotal"] = 99999999999;
                lineArray["Id_dnsfq"] = "";
                
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
/*
                if (lines[b].includes("BestTimeOverall") && hhhPro[pp] == "Id_TpsTour") {
                    bestTime=lineArray["Id_TpsTour"];
                    bestTimecomp=lineArray["Id_Numero"];
                }
*/

                pp += 1;
        //  console.log(lineArray);
       //   console.log(bestLapComp+"  "+bestLap);

            }
            
        }

      //   console.log(allArray);
     //    console.log(hhh);
     //    console.log(hhhPro);

     //             console.log(qqq);
      //   console.log(hhhPro2);
         //                console.log(allArray);

         
        if (stages == 1) {
            for (b = 0; b < allArray.length; b++) { // main table

                if (allArray[b]["Id_FinishTime"] != "-") {
                    allArray[b]["Id_FinishTimeTotal"] = allArray[b]["Id_FinishTime"];
                }

                    if (allArray[b]["Id_Arrow"].includes('_dsq.svg')) {
                        allArray[b]["Id_dnsfq"] = "dsq";
                    } else if (allArray[b]["Id_Arrow"].includes('_dnf.svg')) {
                        allArray[b]["Id_dnsfq"] = "dnf";
                    } else if (allArray[b]["Id_Classe"] == "blue"  || allArray[b]["blue"] == 1) {
                        allArray[b]["Id_dnsfq"] = "blue";
                    } else if (allArray[b]["Id_FinishTimeTotal"] == 99999999999) {
                        allArray[b]["Id_dnsfq"] = ""; // ???
                    }
                
 /*               if (allArray[b]["Id_Classe"] == "blue" || allArray[b]["Id_FinishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                    allArray[b]["Id_dnsfq"] = "dsq";
                }*/
            }
        }
         
        if (stages >= 2) {
            for (b = 0; b < allArray.length; b++) { // first and main table
                for (a = 0; a < allArray2.length; a++) { // secound table

                    // calculating total time from both arrays

                    if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                        
                        allArray[b]["Id_FinishTime_2"] = allArray2[a]["Id_FinishTime"];
                        allArray[b]["Id_Classe_2"] = allArray2[a]["Id_Classe"];
                        allArray[b]["Id_Arrow_2"] = allArray3[a]["Id_Arrow"];
                        
                        if (allArray[b]["Id_FinishTime"] != "-" && allArray[b]["Id_FinishTime_2"] != "-") {
                            
                            allArray[b]["Id_FinishTimeTotal"] = allArray[b]["Id_FinishTime"] + allArray[b]["Id_FinishTime_2"];
                        }
                
                        if (allArray[b]["blue"] == 1 || allArray2[a]["blue"] == 1) {
                            
                            allArray[b]["blue"] = 1;
                        }
                
                    }
                    
                    if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                    
                        if (allArray[b]["Id_Arrow"].includes('_dsq.svg') || allArray[b]["Id_Arrow_2"].includes('_dsq.svg')) {
                            allArray[b]["Id_dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"].includes('_dnf.svg') || allArray[b]["Id_Arrow_2"].includes('_dnf.svg')) {
                            allArray[b]["Id_dnsfq"] = "dnf";
                        } else if (allArray[b]["Id_Classe"] == "blue" || allArray[b]["Id_Classe_2"] == "blue" || allArray[b]["blue"] == 1) {
                            allArray[b]["Id_dnsfq"] = "blue";
                        } else if (allArray[b]["Id_FinishTimeTotal"] == 99999999999) {
                            allArray[b]["Id_dnsfq"] = ""; // ???
                        }
                   
                    
/*                        if (allArray[b]["Id_Classe"] == "blue" || allArray[b]["Id_Classe_2"] == "blue" || allArray[b]["Id_FinishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["Id_Arrow_2"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                        allArray[b]["Id_dnsfq"] = "dsq";
                        }*/
                    }
                } 
            }
            // delete the secound array
            allArray2 = [];
        }  
            
        if (stages >= 3) {
                                    
            for (b = 0; b < allArray.length; b++) { // first and main table
                for (a = 0; a < allArray3.length; a++) { // third table

                    // calculating total time from both arrays

                    if (allArray[b]["Id_Numero"] == allArray3[a]["Id_Numero"]) {
                        
                        allArray[b]["Id_FinishTime_3"] = allArray3[a]["Id_FinishTime"];
                        allArray[b]["Id_Classe_3"] = allArray3[a]["Id_Classe"];
                        allArray[b]["Id_Arrow_3"] = allArray3[a]["Id_Arrow"];

                        
                        if (allArray[b]["Id_FinishTimeTotal"] != 99999999999 && allArray[b]["Id_FinishTimeTotal"] != "-" && allArray[b]["Id_FinishTime_3"] != "-") {
                            
                            allArray[b]["Id_FinishTimeTotal"] = allArray[b]["Id_FinishTimeTotal"] + allArray[b]["Id_FinishTime_3"];
                        }
                
                        if (allArray[b]["blue"] == 1 || allArray3[a]["blue"] == 1) {
                            
                            allArray[b]["blue"] = 1;
                        }

                
                    }
                    
                    if (allArray[b]["Id_Numero"] == allArray3[a]["Id_Numero"]) {
                    
                
                        if (allArray[b]["Id_Arrow"].includes('_dsq.svg') || allArray[b]["Id_Arrow_2"].includes('_dsq.svg') || allArray[b]["Id_Arrow_3"].includes('_dsq.svg')) {
                            allArray[b]["Id_dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"].includes('_dnf.svg') || allArray[b]["Id_Arrow_2"].includes('_dnf.svg') || allArray[b]["Id_Arrow_3"].includes('_dnf.svg')) {
                            allArray[b]["Id_dnsfq"] = "dnf";
                        } else if (allArray[b]["Id_Classe"] == "blue" || allArray[b]["Id_Classe_2"] == "blue" || allArray[b]["Id_Classe_3"] == "blue" || allArray[b]["blue"] == 1) {
                            allArray[b]["Id_dnsfq"] = "blue";
                        } else if (allArray[b]["Id_FinishTimeTotal"] == 99999999999) {
                            allArray[b]["Id_dnsfq"] = ""; // ???
                        }

                        
/*                        if (allArray[b]["Id_Classe"] == "blue" || allArray[b]["Id_Classe_2"] == "blue" || allArray[b]["Id_Classe_3"] == "blue" || allArray[b]["Id_FinishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["Id_Arrow_2"].includes('dnsfq') || allArray[b]["Id_Arrow_3"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                        allArray[b]["Id_dnsfq"] = "dsq";
                        }*/
                    }
                } 
            }
            // delete the third array
            allArray3 = [];
        }
            
        if (stages == 4) {
      
            for (b = 0; b < allArray.length; b++) { // first and main table
                for (a = 0; a < allArray4.length; a++) { // forth table

                    // calculating total time from both arrays

                    if (allArray[b]["Id_Numero"] == allArray4[a]["Id_Numero"]) {
                        
                        allArray[b]["Id_FinishTime_4"] = allArray4[a]["Id_FinishTime"];
                        allArray[b]["Id_Classe_4"] = allArray4[a]["Id_Classe"];
                        allArray[b]["Id_Arrow_4"] = allArray4[a]["Id_Arrow"];

                        
                        if (allArray[b]["Id_FinishTimeTotal"] != 99999999999 && allArray[b]["Id_FinishTimeTotal"] != "-" && allArray[b]["Id_FinishTime_4"] != "-") {
                            
                            allArray[b]["Id_FinishTimeTotal"] = allArray[b]["Id_FinishTimeTotal"] + allArray[b]["Id_FinishTime_4"];
                        }
                
                        if (allArray[b]["blue"] == 1 || allArray4[a]["blue"] == 1) {
                            
                            allArray[b]["blue"] = 1;
                        }

                
                    }
                    
                    if (allArray[b]["Id_Numero"] == allArray4[a]["Id_Numero"]) {
                    
                
                        if (allArray[b]["Id_Arrow"].includes('_dsq.svg') || allArray[b]["Id_Arrow_2"].includes('_dsq.svg') || allArray[b]["Id_Arrow_3"].includes('_dsq.svg') || allArray[b]["Id_Arrow_4"].includes('_dsq.svg')) {
                            allArray[b]["Id_dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"].includes('_dnf.svg') || allArray[b]["Id_Arrow_2"].includes('_dnf.svg') || allArray[b]["Id_Arrow_3"].includes('_dnf.svg') || allArray[b]["Id_Arrow_4"].includes('_dnf.svg')) {
                            allArray[b]["Id_dnsfq"] = "dnf";
                        } else if (allArray[b]["Id_Classe"] == "blue" || allArray[b]["Id_Classe_2"] == "blue" || allArray[b]["Id_Classe_3"] == "blue" || allArray[b]["Id_Classe_4"] == "blue" || allArray[b]["blue"] == 1) {
                            allArray[b]["Id_dnsfq"] = "blue";
                        } else if (allArray[b]["Id_FinishTimeTotal"] == 99999999999) {
                            allArray[b]["Id_dnsfq"] = ""; // ???
                        }

                        
/*                        if (allArray[b]["Id_Classe"] == "blue" || allArray[b]["Id_Classe_2"] == "blue" || allArray[b]["Id_Classe_3"] == "blue" || allArray[b]["Id_FinishTimeTotal"] == 99999999999 || allArray[b]["Id_Arrow"].includes('dnsfq') || allArray[b]["Id_Arrow_2"].includes('dnsfq') || allArray[b]["Id_Arrow_3"].includes('dnsfq') || allArray[b]["blue"] == 1) {
                        allArray[b]["Id_dnsfq"] = "dsq";
                        }*/
                    }
                } 
            }
            // delete the forth array
            allArray4 = [];
        }


         // THE MAGIC - sort the array after the merge to get new results
        if (useCategory == "no") {
            allArray.sort(function(a, b){return a.Id_dnsfq.localeCompare(b.Id_dnsfq) || a.Id_FinishTime - b.Id_FinishTime});
        } else if (useCategory == "yes") {
            allArray.sort(function(a, b){return a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_dnsfq.localeCompare(b.Id_dnsfq) || a.Id_FinishTime - b.Id_FinishTime});
        }
         
         

         
    // fix the position fields of the competitors and start building the final table
            var m = 0;
            var prevCompCat = ""

            finalText += '\n<div id="liveTable"><table class="' + tableClass + 'line_color">\n';
            
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
                                var leaderTime = allArray[l]["Id_FinishTimeTotal"];
                            }

                                    // fix the diff fields of the competitors

                                    var competitorTime = allArray[l]["Id_FinishTimeTotal"];
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
                               
                            // convert back to time
                            if (allArray[l]["Id_FinishTime"] != "-") {  
                                allArray[l]["Id_FinishTime"] = ms2TimeString(allArray[l]["Id_FinishTime"]);

                                
                                if (allArray[l]["Id_FinishTime"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_FinishTime"] = allArray[l]["Id_FinishTime"].substr(3);
                                }
                                if (allArray[l]["Id_FinishTime"].toString().substring(0, 1) == "0" && allArray[l]["Id_FinishTime"].includes(":")) {
                                    allArray[l]["Id_FinishTime"] = allArray[l]["Id_FinishTime"].substr(1);
                                }
                                
                            }
                if (stages >= 2) {

                            if (allArray[l]["Id_FinishTime_2"] != "-") {  
                                allArray[l]["Id_FinishTime_2"] = ms2TimeString(allArray[l]["Id_FinishTime_2"]);

                                
                                if (allArray[l]["Id_FinishTime_2"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_FinishTime_2"] = allArray[l]["Id_FinishTime_2"].substr(3);
                                }
                                if (allArray[l]["Id_FinishTime_2"].toString().substring(0, 1) == "0" && allArray[l]["Id_FinishTime_2"].includes(":")) {
                                    allArray[l]["Id_FinishTime_2"] = allArray[l]["Id_FinishTime_2"].substr(1);
                                }
                                
                            }
                }
            
                if (stages >= 3) {
                            if (allArray[l]["Id_FinishTime_3"] != "-") {  
                                allArray[l]["Id_FinishTime_3"] = ms2TimeString(allArray[l]["Id_FinishTime_3"]);

                                
                                if (allArray[l]["Id_FinishTime_3"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_FinishTime_3"] = allArray[l]["Id_FinishTime_3"].substr(3);
                                }
                                if (allArray[l]["Id_FinishTime_3"].toString().substring(0, 1) == "0" && allArray[l]["Id_FinishTime_3"].includes(":")) {
                                    allArray[l]["Id_FinishTime_3"] = allArray[l]["Id_FinishTime_3"].substr(1);
                                }
                                
                            }
                }
            
                if (stages == 4) {
                            if (allArray[l]["Id_FinishTime_4"] != "-") {  
                                allArray[l]["Id_FinishTime_4"] = ms2TimeString(allArray[l]["Id_FinishTime_4"]);

                                
                                if (allArray[l]["Id_FinishTime_4"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_FinishTime_4"] = allArray[l]["Id_FinishTime_4"].substr(3);
                                }
                                if (allArray[l]["Id_FinishTime_4"].toString().substring(0, 1) == "0" && allArray[l]["Id_FinishTime_4"].includes(":")) {
                                    allArray[l]["Id_FinishTime_4"] = allArray[l]["Id_FinishTime_4"].substr(1);
                                }
                                
                            }
                }
     
                            if (allArray[l]["Id_FinishTimeTotal"] != 99999999999) {  
                                allArray[l]["Id_FinishTimeTotal"] = ms2TimeString(allArray[l]["Id_FinishTimeTotal"]);

                                
                                if (allArray[l]["Id_FinishTimeTotal"].toString().substring(0, 3) == "00:") {
                                    allArray[l]["Id_FinishTimeTotal"] = allArray[l]["Id_FinishTimeTotal"].substr(3);
                                }
                                if (allArray[l]["Id_FinishTimeTotal"].toString().substring(0, 1) == "0" && allArray[l]["Id_FinishTimeTotal"].includes(":")) {
                                    allArray[l]["Id_FinishTimeTotal"] = allArray[l]["Id_FinishTimeTotal"].substr(1);
                                }
                                
                            }

                            
                            
                            
        var headerText1 = '<tr class="rnkh_bkcolor">\n';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>\n';
   //         }
   //     }          

    // hard coded header for now
            headerText1 += '<th class="rnkh_font" id="Id_Position">Rank</th>\n';
            headerText1 += '<th class="rnkh_font" id="Id_Numero">No.</th>\n';
            headerText1 += '<th class="rnkh_font" id="Id_Nom">Rider 1</th>\n';
            headerText1 += '<th class="rnkh_font" id="Id_Nom_2">Rider 2</th>\n';
            if (useCategory == "no") {
                headerText1 += '<th class="rnkh_font" id="Id_Categorie">Category</th>\n';
            }
            headerText1 += '<th class="rnkh_font" id="Id_FinishTime">Stage 1</th>\n';
            if (stages >= 2) {
                headerText1 += '<th class="rnkh_font" id="Id_FinishTime_2">Stage 2</th>\n';
            }
            if (stages >= 3) {
                headerText1 += '<th class="rnkh_font" id="Id_FinishTime_3">Stage 3</th>\n';
            }
            if (stages == 4) {
                headerText1 += '<th class="rnkh_font" id="Id_FinishTime_4">Stage 4</th>\n';
            }
            headerText1 += '<th class="rnkh_font" id="Id_FinishTimeTotal">Time</th>\n';
            headerText1 += '<th class="rnkh_font" id="Id_Ecart1er">Gap</th>\n';

        
        headerText1 += '</tr>\n';
      //   console.log(headerText1);
      //          console.log(temp);

         
        
        
            // add category name header and table header
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1 + '\n';
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
                finalText += '<tr><td colspan="99" class="title_font">כללי</td></tr>' + headerText1 + '\n';
            }


            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="rnk_bkcolor OddRow">\n';
            } else {
                finalText += '<tr class="rnk_bkcolor EvenRow">\n';
            }
                       

                if (allArray[l]["Id_dnsfq"] == "dsq" || allArray[l]["Id_dnsfq"] == "blue") {
                    finalText += '<td class="rnk_font"><img class="dnsfq" src="Images/_dsq.svg" alt="dsq"></td>\n'; // add postion
                } else if (allArray[l]["Id_FinishTimeTotal"] == 99999999999 || allArray[l]["Id_dnsfq"] == "dnf") {
                    finalText += '<td class="rnk_font"><img class="dnsfq" src="Images/_dnf.svg" alt="dnf"></td>\n'; // add postion
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position"] + '</td>\n'; // add postion
                }
                
                 if (allArray[l]["Id_Classe"] == "blue" || allArray[l]["Id_Classe_2"] == "blue" || allArray[l]["Id_Classe_3"] == "blue" || allArray[l]["Id_Classe_4"] == "blue" || allArray[l]["blue"] == 1) {
                finalText += '<td style="color:#111; background-color:#add8e6bf;" class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                }
                               
       //         finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>\n';
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>\n';// add the name
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom_2"] + '</td>\n';// add the name

            if (useCategory == "no") {
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>\n';// add the name
            }


                finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>\n'; // add total time
                if (stages >= 2) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_2"] + '</td>\n'; // add total time
                }
                if (stages >= 3) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_3"] + '</td>\n'; // add total time
                }
                if (stages == 4) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_4"] + '</td>\n'; // add total time
                }
                if (allArray[l]["Id_FinishTimeTotal"] == 99999999999) {
                    finalText += '<td class="rnk_font">-</td>\n'; // add total time
                } else {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTimeTotal"] + '</td>\n'; // add total time
                }
                
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>\n'; // add diff
 
                
     //       }

                 
                
      //      }    

                    finalText += '</tr>\n';

               
            }        
         
         
                finalText += '</table></div>\n';
     
//download(finalText, 'finalText.txt', 'text/plain')
                
             console.log(allArray);

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
