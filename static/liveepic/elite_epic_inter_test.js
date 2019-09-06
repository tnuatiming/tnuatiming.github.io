// 20180518 - array refactoring with all/category toggle, display arrows for position change 
// 20180522 - add fades and competitor info on arrows display 
// 20180523 - add competitor number color/background according to category 
// 20180527 - add message uploading 
// 20180607 - special edition for 2 specials run individually and computation done in live. special 1 live points to: https://tnuatiming.com/live1/livea/p1.html and special 2 live points to: https://tnuatiming.com/live1/liveb/p1.html 
// 20180610 - refactor special edition for 2 specials run individually and computation done in live, added laps time in correct order.  
// 20180701 - added penalty indicator.  
// 20181030 - epic israel version.  
/*
 TODO
 json all i3Position_Overall and i3index
 
*/
    var startTime = "2019-09-06 07:15:00"; // start time "2019-09-21 07:00:00"
    if (sessionStorage.getItem('startTimeX')) {
        startTime = sessionStorage.getItem('startTimeX');
    }
        
    var MaximumStageTime = "09:00:00"; // Maximum stage time in milliseconds, 18000000=5hours, 21600000=6hours, 36000000=10hours
    if (sessionStorage.getItem('MaximumStageTime')) {
        MaximumStageTime = sessionStorage.getItem('MaximumStageTime');
    }
    var loop;

    var hash;
    
    var allArrayJ = {};
    var J3text;
    var enableJ1 = 0;   // create j1.txt for remote
    var enableJ3 = 0;  // create p3.html for single day
    var dayCompetitors = 0;
            
    var publishE = 0;
    
    var hideStatus = 0; // for publish hide first column
    
    var messageX = '';
    
    var singleLine = 0;
    
    var showLog = 0;
    
    var url = 'https://tnuatiming.com/liveepic/p1.html';
    var target = 'result';

//    var enableDelta = 0; // time delta only on epic (not single day)
//    var delta = 0; // delta in milliseconds, 60000 = 1minute

    var TimerLoad;
    var Rafraichir = 30000; // every 30 seconds

    var P1 = '';
    
    var useKellner = 1; // get timing info from kellner
    var K1;
    var kellnerArray = {};
//    var urlKellner = 'https://www.4sport-services.com/epic2019/out.txt'; 
    var urlKellner = 'https://tnuatiming.com/liveepic/f1.txt'; 
    
    var enableInter1 = 0; // enable getting intermediate1 from elite live
    var I1;
    var inter1Array = {};
    var urlInter1 = 'https://tnuatiming.com/liveepic/i1/p1.html'; 
    
    var enableInter2 = 0; // enable getting intermediate2 from elite live
    var I2;
    var inter2Array = {};
    var urlInter2 = 'https://tnuatiming.com/liveepic/i2/p1.html'; 
    
    var enableInter3 = 0; // enable getting intermediate3 from elite live
    var I3;
    var inter3Array = {};
    var urlInter3 = 'https://tnuatiming.com/liveepic/i3/p1.html'; 
    
    
    var positionArray_All_Cat = {}; // array with the previous competitor overall and category position. updated every Load, used to show the position change arrow between Loads 
    if (sessionStorage.getItem('positionArray_All_Cat')) {
        positionArray_All_Cat = JSON.parse(sessionStorage.getItem('positionArray_All_Cat'));
    }
    
//    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    
    var eventName = "";    
    
    var cleanResults = 0; // alignTable for TotalIndex
    
    var raceEnded = 0;
    if (sessionStorage.getItem('raceEnded')) {
        raceEnded = sessionStorage.getItem('raceEnded');
    }

    var doNotShowTime = 0; // don't display individual time
    if (sessionStorage.getItem('doNotShowTime')) {
        doNotShowTime = sessionStorage.getItem('doNotShowTime');
    }
    
        
    var prologue;

    var precision = "second"; // "tenth" for 1 digit after the . , "second" no mili
    
    var catcat = "None";
    if (sessionStorage.getItem('catcat')) {
        catcat = sessionStorage.getItem('catcat');
    }
    var useCategory = "no";
    if (sessionStorage.getItem('categoryOrAll')) {
        useCategory = sessionStorage.getItem('categoryOrAll');
    }
    
    var show = 4; // 1 - intermediate 1, 2 - intermediate 2, 3 - intermediate 3, 4 - finish.
    if (sessionStorage.getItem('intermediateOrFinish')) {
        show = sessionStorage.getItem('intermediateOrFinish');
    }
    var showPrevious = show;// used for empting the array when displaying back intermediate.

    var epictv = 0;

    var showTvHeader = 0;
    if (sessionStorage.getItem('showTvHeader')) {
        showTvHeader = sessionStorage.getItem('showTvHeader');
    }
    
    var rows = 5; // number of rows to display on tv
    if (sessionStorage.getItem('rows')) {
        rows = sessionStorage.getItem('rows');
    }

    var csvName = '';

    
    document.addEventListener("DOMContentLoaded", function() {

        document.getElementById('showLog').addEventListener('change', event => {
            if (event.target.checked) {
                showLog = 1;
                document.getElementById("result").innerHTML = createLiveTable(P1);
            } else {
                showLog = 0;
            }

        });


 
        if (document.getElementById("cleanResults").checked) {
            cleanResults = 1;
        } else {
            cleanResults = 0;
        }
        

        document.getElementById('cleanResults').addEventListener('change', event => {
            if (event.target.checked) {
                cleanResults = 1;
                document.getElementById("result").innerHTML = createLiveTable(P1);
                j1Status();
            } else {
                cleanResults = 0;
                document.getElementById("result").innerHTML = createLiveTable(P1);
                j1Status();
            }

        });

        if (document.getElementById("raceEnded").checked) {
            raceEnded = 1;
        } else {
            raceEnded = 0;
        }
        

        document.getElementById('raceEnded').addEventListener('change', event => {
            if (event.target.checked) {
                raceEnded = 1;
                document.getElementById("result").innerHTML = createLiveTable(P1);
                j1Status();
            } else {
                raceEnded = 0;
                document.getElementById("result").innerHTML = createLiveTable(P1);
                j1Status();
            }
                    
            sessionStorage.setItem('raceEnded', raceEnded);

        });

 
        if (document.getElementById("doNotShowTime").checked) {
            doNotShowTime = 1;
        } else {
            doNotShowTime = 0;
        }
        

        document.getElementById('doNotShowTime').addEventListener('change', event => {
            if (event.target.checked) {
                doNotShowTime = 1;
                document.getElementById("result").innerHTML = createLiveTable(P1);
                j1Status();
            } else {
                doNotShowTime = 0;
                document.getElementById("result").innerHTML = createLiveTable(P1);
                j1Status();
            }
                    
            sessionStorage.setItem('doNotShowTime', doNotShowTime);

        });


        if (document.getElementById("enableJ1").checked) {
            enableJ1 = 1;
        } else {
            enableJ1 = 0;
        }
        

        document.getElementById('enableJ1').addEventListener('change', event => {
            if (event.target.checked) {
                enableJ1 = 1;
                j1Status();
//                document.getElementById("result").innerHTML = createLiveTable(P1);
            } else {
                enableJ1 = 0;
                j1Status();
//                document.getElementById("result").innerHTML = createLiveTable(P1);
            }

        });



        if (document.getElementById("enableJ3").checked) {
            enableJ3 = 1;
        } else {
            enableJ3 = 0;
        }
        

        document.getElementById('enableJ3').addEventListener('change', event => {
            if (event.target.checked) {
                enableJ3 = 1;
//                document.getElementById("result").innerHTML = createLiveTable(P1);
            } else {
                enableJ3 = 0;
//                document.getElementById("result").innerHTML = createLiveTable(P1);
            }

        });

                        
            document.getElementById("startTime").value = startTime;

            document.getElementById('startTime').addEventListener('change', event => {

                    startTime = document.getElementById("startTime").value;
                    sessionStorage.setItem('startTimeX', startTime);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
            });



            document.getElementById("MaximumStageTime").value = MaximumStageTime;
            
            document.getElementById('MaximumStageTime').addEventListener('change', (event) => {

                    MaximumStageTime = document.getElementById("MaximumStageTime").value;
                    sessionStorage.setItem('MaximumStageTime', MaximumStageTime);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
            });



//            document.getElementById("message").value = message;
            
            document.getElementById('message').addEventListener('change', (event) => {

                    messageX = document.getElementById("message").value;
                    document.getElementById("result").innerHTML = createLiveTable(P1);
            });

            
        // download results csv
        document.querySelector('button[id="csv"]').addEventListener("click", function () {
            var html = document.querySelector("table").outerHTML;
            
            var ma = new Date();
            var dateString = ma.getUTCFullYear() + ("0" + (ma.getUTCMonth()+1)).slice(-2) + ("0" + ma.getUTCDate()).slice(-2) + "_" + ("0" + (ma.getUTCHours()+3)).slice(-2) + ("0" + ma.getUTCMinutes()).slice(-2) + ("0" + ma.getUTCSeconds()).slice(-2);
            
            export_table_to_csv(html, dateString + "_results_" + csvName + ".csv");
        });

    
    
        if (document.getElementById('epictv')){
            epictv = 1;

            document.getElementById("rows").value = rows;

            document.getElementById('rows').addEventListener('change', (event) => {

                    rows = Number(document.getElementById("rows").value);
                    sessionStorage.setItem('rows', rows);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
            });

//            document.getElementById("MaximumStageTime").value = MaximumStageTime;
            
            if (document.getElementById("showTvHeader").checked) {
                showTvHeader = 1;
            } else {
                showTvHeader = 0;
            }


            document.getElementById('showTvHeader').addEventListener('change', (event) => {
                if (event.target.checked) {
                    showTvHeader = 1;
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                } else {
                    showTvHeader = 0;
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                }
            });
        }
        
        if (show == 1) {
            document.getElementById("intermediate1").classList.remove("active");
            document.getElementById("intermediate1").disabled = true;
            document.getElementById("intermediate2").classList.add("active");
            document.getElementById("intermediate2").disabled = false;
            document.getElementById("intermediate3").classList.add("active");
            document.getElementById("intermediate3").disabled = false;
            document.getElementById("finish").classList.add("active");
            document.getElementById("finish").disabled = false;
            
        } else if (show == 2) {
            document.getElementById("intermediate1").classList.add("active");
            document.getElementById("intermediate1").disabled = false;
            document.getElementById("intermediate2").classList.remove("active");
            document.getElementById("intermediate2").disabled = true;
            document.getElementById("intermediate3").classList.add("active");
            document.getElementById("intermediate3").disabled = false;
            document.getElementById("finish").classList.add("active");
            document.getElementById("finish").disabled = false;
            
        } else if (show == 3) {
            document.getElementById("intermediate1").classList.add("active");
            document.getElementById("intermediate1").disabled = false;
            document.getElementById("intermediate2").classList.add("active");
            document.getElementById("intermediate2").disabled = false;
            document.getElementById("intermediate3").classList.remove("active");
            document.getElementById("intermediate3").disabled = true;
            document.getElementById("finish").classList.add("active");
            document.getElementById("finish").disabled = false;
            
        } else {
            document.getElementById("intermediate1").classList.add("active");
            document.getElementById("intermediate1").disabled = false;
            document.getElementById("intermediate2").classList.add("active");
            document.getElementById("intermediate2").disabled = false;
            document.getElementById("intermediate3").classList.add("active");
            document.getElementById("intermediate3").disabled = false;
            document.getElementById("finish").classList.remove("active");
            document.getElementById("finish").disabled = true;
            
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

    });   
    
    
    function j1Status() {
            if (enableJ1 == 1 && cleanResults == 0 && show == 4 && useCategory == "no") {
                document.getElementById("buttonInfo").style.borderBottom = "12px solid #6c3";
            } else {
                document.getElementById("buttonInfo").style.borderBottom = "12px solid #c00";
            }
    };


    var tableClass = "fadeIn";


    function intermediateOrFinish(section){
        
//        positionArray = []; // emptying the array as the info inside is incorrect due to changing between sections.

//        positionArray_All_Cat = {}; // emptying the array

        startTime = document.getElementById("startTime").value;
        sessionStorage.setItem('startTimeX', startTime);

        MaximumStageTime = document.getElementById("MaximumStageTime").value;
        sessionStorage.setItem('MaximumStageTime', MaximumStageTime);
            
        show = section;
        
        if (epictv == 1) {
            rows = Number(document.getElementById("rows").value);
            sessionStorage.setItem('rows', rows);
            
            if (document.getElementById("showTvHeader").checked) {
                showTvHeader = 1;
            } else {
                showTvHeader = 0;
            }
            sessionStorage.setItem('showTvHeader', showTvHeader);
        }
        
        if (show == 1) {
            document.getElementById("intermediate1").classList.remove("active");
            document.getElementById("intermediate1").disabled = true;
            document.getElementById("intermediate2").classList.add("active");
            document.getElementById("intermediate2").disabled = false;
            document.getElementById("intermediate3").classList.add("active");
            document.getElementById("intermediate3").disabled = false;
            document.getElementById("finish").classList.add("active");
            document.getElementById("finish").disabled = false;
            
            sessionStorage.setItem('intermediateOrFinish', '1');
            
            positionArray_All_Cat = {}; // emptying the array
            
        } else if (show == 2) {
            document.getElementById("intermediate1").classList.add("active");
            document.getElementById("intermediate1").disabled = false;
            document.getElementById("intermediate2").classList.remove("active");
            document.getElementById("intermediate2").disabled = true;
            document.getElementById("intermediate3").classList.add("active");
            document.getElementById("intermediate3").disabled = false;
            document.getElementById("finish").classList.add("active");
            document.getElementById("finish").disabled = false;
            
            sessionStorage.setItem('intermediateOrFinish', '2');
            
            if (showPrevious == 3 || showPrevious == 4) {
                positionArray_All_Cat = {}; // emptying the array
            }
        } else if (show == 3) {
            document.getElementById("intermediate1").classList.add("active");
            document.getElementById("intermediate1").disabled = false;
            document.getElementById("intermediate2").classList.add("active");
            document.getElementById("intermediate2").disabled = false;
            document.getElementById("intermediate3").classList.remove("active");
            document.getElementById("intermediate3").disabled = true;
            document.getElementById("finish").classList.add("active");
            document.getElementById("finish").disabled = false;
            
            sessionStorage.setItem('intermediateOrFinish', '3');
            if (showPrevious == 4) {
                positionArray_All_Cat = {}; // emptying the array
            }
        } else {
            document.getElementById("intermediate1").classList.add("active");
            document.getElementById("intermediate1").disabled = false;
            document.getElementById("intermediate2").classList.add("active");
            document.getElementById("intermediate2").disabled = false;
            document.getElementById("intermediate3").classList.add("active");
            document.getElementById("intermediate3").disabled = false;
            document.getElementById("finish").classList.remove("active");
            document.getElementById("finish").disabled = true;
            
            sessionStorage.setItem('intermediateOrFinish', '4');
        }  

        showPrevious = show;
        
        Rafraichir = 30000; // every 30 seconds

        tableClass = "fadeIn"; // make the table fadeIn on change
        
//        Load('p1.html', 'result');
        
        document.getElementById("result").innerHTML = createLiveTable(P1);
//        alignTable();
                
        j1Status();
        
    }


    function category(choice, cat){
        
//        positionArray = []; // emptying the array as the info inside is incorrect due to changing between position/category position.

        startTime = document.getElementById("startTime").value;
        sessionStorage.setItem('startTimeX', startTime);

        MaximumStageTime = document.getElementById("MaximumStageTime").value;
        sessionStorage.setItem('MaximumStageTime', MaximumStageTime);
            
        
        useCategory = choice;
        catcat = cat;

        if (epictv == 1) {
            rows = Number(document.getElementById("rows").value);
            sessionStorage.setItem('rows', rows);
            
            if (document.getElementById("showTvHeader").checked) {
                showTvHeader = 1;
            } else {
                showTvHeader = 0;
            }
            sessionStorage.setItem('showTvHeader', showTvHeader);
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

            sessionStorage.setItem('catcat', 'Men');
            sessionStorage.setItem('categoryOrAll', 'yes');
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

            sessionStorage.setItem('catcat', 'Women');
            sessionStorage.setItem('categoryOrAll', 'yes');
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

            sessionStorage.setItem('catcat', 'Mixed');
            sessionStorage.setItem('categoryOrAll', 'yes');
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

            sessionStorage.setItem('catcat', 'Masters');
            sessionStorage.setItem('categoryOrAll', 'yes');
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

            sessionStorage.setItem('catcat', 'Grand');
            sessionStorage.setItem('categoryOrAll', 'yes');
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

            sessionStorage.setItem('catcat', 'None');
            sessionStorage.setItem('categoryOrAll', 'yes');
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

            sessionStorage.setItem('catcat', 'None');
            sessionStorage.setItem('categoryOrAll', 'no');
        }
       
        
        Rafraichir = 30000; // every 30 seconds

        tableClass = "fadeIn"; // make the table fadeIn on change
        
//        Load('p1.html', 'result');
        
        document.getElementById("result").innerHTML = createLiveTable(P1);
//        alignTable();

        j1Status();
    };

    async function Load() {
                
        console.time('total');
                    
        if (TimerLoad) clearTimeout(TimerLoad);


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

            if (enableInter1 == 1) {
                
                
                try {
                const response = await fetch(urlInter1, {cache: "no-store"});
                if (response.ok) {
                    I1 = await response.text();
                    interTable(I1, 1);
  
                    }
                }
                catch (err) {
                    console.log('results fetch failed', err);
                }

                    
                
            }

            if (enableInter2 == 1) {
                
                
                try {
                const response = await fetch(urlInter2, {cache: "no-store"});
                if (response.ok) {
                    I2 = await response.text();
                    interTable(I2, 2);
  
                    }
                }
                catch (err) {
                    console.log('results fetch failed', err);
                }

                    
                
            }

            if (enableInter3 == 1) {
                
                
                try {
                const response = await fetch(urlInter3, {cache: "no-store"});
                if (response.ok) {
                    I3 = await response.text();
                    interTable(I3, 3);
  
                    }
                }
                catch (err) {
                    console.log('results fetch failed', err);
                }

                    
                
            }
            
            if (useKellner == 1) {
                
                
                try {
//                    const response = await fetch(urlKellner, {cache: "no-store", mode: "no-cors"});
                    // use to bypass cors:  https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
                    const response = await fetch(urlKellner, {cache: "no-store"});
                    if (response.ok) {
                        K1 = await response.text();
                        kellnerTable(K1);
                        if (P1 != '') {
                                document.getElementById(target).innerHTML = createLiveTable(P1);
            
                                if (enableJ1 == 1 && cleanResults == 0 && show == 4 && useCategory == "no") { // FIXME check if need all(mainly show), so we can watch different results on timing computer
                                    download(allArrayJ, 'j1.txt', 'text/plain');    
                                    console.log((new Date()).toLocaleTimeString() + ' downloaded j1.txt')
                            
                            //       console.log(JSON.parse(allArrayJ));  
                                }
                                
                                if (enableJ3 == 1 && dayCompetitors == 1) { 
                                    download(J3text, 'p3.html', 'text/plain');    // download the html for single day 
                                    console.log((new Date()).toLocaleTimeString() + ' downloaded p3.html')
                                }
                        
                        }
                     }
                }
                catch (err) {
                    console.log('results fetch failed', err);
                }

                    
                
            }

/*            try {
                const response = await fetch(url, {cache: "no-store"});
                if (response.ok) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    document.getElementById("intermediateOrFinish").style.display = "block"; // if p1.html exist, display the buttons
                    P1 = await response.text();
                    document.getElementById(target).innerHTML = createLiveTable(P1);
  
                    if (enableJ1 == 1 && cleanResults == 0 && show == 4 && useCategory == "no") { // FIXME check if need all(mainly show), so we can watch different results on timing computer
                        download(allArrayJ, 'j1.txt', 'text/plain');    
                        console.log((new Date()).toLocaleTimeString() + ' downloaded j1.txt')
                
                //       console.log(JSON.parse(allArrayJ));  
                    }
                    
                    if (enableJ3 == 1 && dayCompetitors == 1) { 
                        download(J3text, 'p3.html', 'text/plain');    // download the html for single day 
                        console.log((new Date()).toLocaleTimeString() + ' downloaded p3.html')
                    }
                                        
//                    alignTable();
                }
            }
            catch (err) {
                console.log('results fetch failed', err);
            }
*/

            
            
            
            
            
            
/*            try {
                const response1 = await fetch('uploadMsg.txt', {cache: "no-store"});
                if (response1.ok) {
                    document.getElementById('updates').innerHTML = (await response1.text());
                }
            }
            catch (err) {
                console.log('msg fetch failed', err);
            }
*/
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
            xhr.onload = function() {
                if (this.status == 200) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    document.getElementById("intermediateOrFinish").style.display = "block"; // if p1.html exist, display the buttons
                    P1 = this.responseText;
                    document.getElementById(target).innerHTML = createLiveTable(P1);
     //               alignTable();
    //           } else {
    //               document.getElementById("categoryOrAll").style.display = "none";
                } else if (this.status == 404) {
                    console.log('no results on server');
                } else {
                    console.log(`Error ${xhr.status}: ${xhr.statusText}`);
                }
            };
            
        //    xhr.open("GET", url + "?r=" + Math.random(), true);
            xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
            xhr.send(null);

            // upload message
       //     populatePre('uploadMsg.txt','updates');

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
            Load();
        };

        TimerLoad = setTimeout(loop, Rafraichir);
        Rafraichir = 30000; // every 30 seconds
        
        console.timeEnd('total');

    }

/*    
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
*/

    async function importCompetitors() {
        if (self.fetch) {

            
            try {
                const response = await fetch(url, {cache: "no-store"});
                if (response.ok) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    document.getElementById("intermediateOrFinish").style.display = "block"; // if p1.html exist, display the buttons
                    P1 = await response.text();
                    document.getElementById(target).innerHTML = createLiveTable(P1);
                                          
//                    alignTable();
                }
            }
            catch (err) {
                console.log('results fetch failed', err);
            }
            
            
            
            
        } else {
            var xhr;
            xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (this.status == 200) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                    document.getElementById("intermediateOrFinish").style.display = "block"; // if p1.html exist, display the buttons
                    P1 = this.responseText;
                    document.getElementById(target).innerHTML = createLiveTable(P1);
                } else if (this.status == 404) {
                    console.log('no results on server');
                } else {
                    console.log(`Error ${xhr.status}: ${xhr.statusText}`);
                }
            };
            
            xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
            xhr.send(null);

            
        }
        
    };

    String.prototype.hashCode = function(){
        var hash = 0;
        if (this.length == 0) return hash;
        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    function kellnerTable(k1) {
        
       kellnerArray = {};
        var kellnerArrayTemp = JSON.parse(k1);
        
   //     Text = kellnerArray.shift();

// option 1
        const arrayToObject = (arr, keyField) => Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})));
        kellnerArray = arrayToObject(kellnerArrayTemp, "No")

// option 2
/*        for (var i in kellnerArrayTemp) {

            kellnerArray[kellnerArrayTemp[i].No] = kellnerArrayTemp[i]; 
            delete kellnerArray[kellnerArrayTemp[i].No].No;
        }
*/
//        console.log("hash: " + k1.hashCode());
        
        if (hash != k1.hashCode()) {
            const d = new Date()
            document.getElementById("lastUpdated").innerHTML = d.getHours() + ":" + (d.getMinutes()).toString().padStart(2, "0") + ":" + (d.getSeconds()).toString().padStart(2, "0");
            hash = k1.hashCode();
        }

        if (showLog == 1) {
            console.log("K1:");
            console.log(kellnerArray);
        }
    };


     
    function interTable(ii, ix) {
        
        var Text, lines, pp, ttt, b, id;
        var lineArray = {};
        var hhhPro = [];
        if (ix == 1) {
            inter1Array = {};
        } else if (ix == 2) {
            inter2Array = {};
        } else if (ix == 3) {
            inter3Array = {};
        }
        
        Text = ii.split('<table'); // split the text to title/time and the table
        Text[1] = Text[1].substring(Text[1].indexOf("<tr"),Text[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(Text[1]);

        lines = Text[1].split("\n");

        ttt = 0;
        pp = 0;
            
        for (b = 0; b < lines.length; b++) { 
           
            if (lines[b].includes('<td id="Id_')) { // header cell
                id = (lines[b].substring(lines[b].indexOf(' id="')+4).split('"')[1]);
                hhhPro.push(id);

            } else if (lines[b].includes("OddRow") || lines[b].includes("EvenRow")) { // competitor line
                ttt = 1;
            } else if (lines[b].includes("</tr>") && ttt == 1) { // end competitor line
                ttt = 0;
                
       //          if (lineArray["Id_Classe"] != 'ss' && lineArray["Id_Classe"] != 'sf' && lineArray["Id_Nom"] != '???') { 
                                   
                    
                    if (ix == 1) {
                        inter1Array[lineArray["Id_Numero"]] = (lineArray["Id_TpsCumule"]); 
                    //    console.log(inter1Array);
                    } else if (ix == 2) {
                        inter2Array[lineArray["Id_Numero"]] = (lineArray["Id_TpsCumule"]);  
                    //    console.log(inter2Array);
                    } else if (ix == 3) {
                        inter3Array[lineArray["Id_Numero"]] = (lineArray["Id_TpsCumule"]);  
                    //    console.log(inter3Array);
                    }
                    
     //           }

                lineArray = {};
                pp = 0;
                
            } else if ((lines[b].includes("<td ") && ttt == 1)) { // clean and add competitor cell

                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");

                if (lineArray[hhhPro[pp]] == '&nbsp;' ) {
                    lineArray[hhhPro[pp]] = "";   
                }
                

                pp += 1;
      //    console.log(lineArray);

            }
            
        }
                
     };




    function createLiveTable(p1) {
            
        console.time('main');

        var i;
        var timeGapDisplay = 3; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell
        var timeGapDisplayInter = 3; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell. FIXME - ONLY 3 IS IMPLEMENTED IN THE COMPETITOR RESULTS
        var lines;
        var competitorPosition = 0;
        var competitorNumber = 0;
        var competitorLaps = 0;
//        var qqq = [];
//        var hhh = [];
        var hhhPro = [];
//        var temp = [];
        var lineArray = {};
        var allArray = [];
//        var allArray2 = [];
        var allArray2obj = [];
        var allArray3 = [];
        var allArray31 = [];
        var allArray32 = [];
        var allArray3f = [];
        var ttt = 0;
        var pp = 0;
        var b;
        var a;
        var id;
        var positionChanged = "";
        var laps = 12; // number of laps
        var NewCategoryHeader = "";
/*        
        var bestTime2comp = 0;
        var bestTime2 = 0;
        var bestTimecomp = 0;
        var bestTime = 0;
*/        
        var finishers = [0, 0, 0, 0];
        
        var Inter1Leader = {},Inter2Leader = {}, Inter3Leader = {};

        var Text, l, m, leaderInter1Time, leaderInter2Time, leaderInter3Time, competitorLaps, leaderLaps, leaderTime, prevCompCat, competitorId_Inter1Time, competitorId_Inter2Time, competitorId_Inter3Time, imTheLeaderInter1, imTheLeaderInter2, imTheLeaderInter3, headerText1, TVheaderText1, competitorTime, finished1, finished2, single1, single2, checkeredFlag, showFull, leader, showBlue, uci1, main_num, pair_num, blued, leaderCard, catCol, markBlue, MaximumStageTimeMili, fullNumber;
        
// TEST        var allArrayMinimized = [], allArrayNew = [];

        MaximumStageTimeMili = timeString2ms(MaximumStageTime);

        if (show == 1) {
            showFull = 'Intermediate 1';
        } else if (show == 2) {
            showFull = 'Intermediate 2';
        } else if (show == 3) {
            showFull = 'Intermediate 3';
        } else {
            showFull = 'Finish';
        }
        
        
        Text = p1.split('<table'); // split the text to title/time and the table
        Text[1] = Text[1].substring(Text[1].indexOf("<tr"),Text[1].lastIndexOf("</tr>")+5); // clean the table text
      //  console.log(Text[1]);

        lines = Text[1].split("\n");
    //  console.log(lines.length);
     //   console.log(lines);

        var HeaderName = Text[0].split("\n");  
        var div = document.createElement("div");  
        div.innerHTML = HeaderName[0]; 
        var HeaderEventName = div.textContent || div.innerText || "";  
        var HeaderRaceName = HeaderEventName.split('-')[1].trim();  
        csvName = HeaderRaceName.split(' ').join('_'); // replace all spaces with _

    //    console.log(HeaderEventName);

        if (eventName != HeaderEventName) {  
            positionArray_All_Cat = {};
//            positionArray = []; 
        }
        
        eventName = HeaderEventName;
        
/*        
        if (Text[0].includes("+++")) { // clean table for results page
            cleanResults = 1;
            timeGapDisplay = 1;
            timeGapDisplayInter = 3;
            Text[0] = Text[0].replace("+++", "");
        } else {
            cleanResults = 0;
        }
*/            
        if (Text[0].includes("---")) { // do not show individual times
            doNotShowTime = 1;
            Text[0] = Text[0].replace("---", "");
        }


        if (Text[0].includes("prologue")) { // prologue
            prologue = 1;
            enableInter1 = 0;
            enableInter2 = 0;
            enableInter3 = 0;
            precision = "tenth";
        } else {
            prologue = 0;
            precision = "second";
        }

        if (Text[0].includes("_Stop.png") || Text[0].includes("_CheckeredFlag.png")) { // check if race ended
            raceEnded = 1;
        }
                
        if (raceEnded == 1) {
            Text[0] = Text[0].replace(/_GreenFlag.png/g, "_CheckeredFlag.png")
            
        }

        if (cleanResults == 1) {
            document.getElementById("csv").style.display = "block";  
            document.getElementById("Men").style.display = "none";  
            document.getElementById("Women").style.display = "none";  
            document.getElementById("Mixed").style.display = "none";  
            document.getElementById("Masters").style.display = "none";  
            document.getElementById("Grand").style.display = "none";  
            document.getElementById("intermediate1").style.display = "none";  
            document.getElementById("intermediate2").style.display = "none";  
            document.getElementById("intermediate3").style.display = "none";  
            var bigFont = '';
        } else {
            document.getElementById("csv").style.display = "none";  
            document.getElementById("Men").style.display = "inline-block";  
            document.getElementById("Women").style.display = "inline-block";  
            document.getElementById("Mixed").style.display = "inline-block";  
            document.getElementById("Masters").style.display = "inline-block";  
            document.getElementById("Grand").style.display = "inline-block";  
            document.getElementById("intermediate1").style.display = "inline-block";  
            document.getElementById("intermediate2").style.display = "inline-block";  
            document.getElementById("intermediate3").style.display = "inline-block";  
            var bigFont = ' bigFont';
        }

        if (useKellner == 1) {

            Text[0] = Text[0].replace(/ElapsedTime">\S*</g, 'ElapsedTime">&nbsp;&nbsp;&nbsp;<');
            Text[0] = Text[0].replace(/RemainingTime">\S*</g, 'RemainingTime">&nbsp;&nbsp;&nbsp;<');
        }

        
        var finalText = Text[0].replace(" - ", "<br>"); // clear the finalText variable and add the title and time lines


         // console.log(allArray2);

            
        ttt = 0;
        pp = 0;
  
            
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
                
                if ((lineArray["Id_Classe"] == 'ss' || lineArray["Id_Classe"] == 'sf') && lineArray["Id_Nom"] != '???') { // single day

                    
                    delete lineArray.Id_penalty;   
                    delete lineArray.Id_Groupe;   
                    lineArray.Id_Ecart1er = 99999999999;
                    
                    if (lineArray["Id_Categorie"] == '&nbsp;' ) {
                        lineArray["Id_Categorie"] = "";   
                    } else if (lineArray["Id_Categorie"] == 'undefined' ) {
                        lineArray["Id_Categorie"] = "-";   
                    }
                    
                    
                  
// time from kellner                    
                    fullNumber = lineArray["Id_Numero_Full"].replace('-', '');
                    
                    if (useKellner == 1) {
                        
                        if (kellnerArray.hasOwnProperty(fullNumber)) {

                            lineArray["Id_TpsCumule"] = kellnerArray[fullNumber]['Time']; 
                       }
                        
                    }
                    
                    // convert total time to miliseconds
                    if (lineArray["Id_TpsCumule"] != "" ) { // "-"
                        lineArray["Id_TpsCumule"] = timeString2ms(lineArray["Id_TpsCumule"]);   
                    } else {
                        lineArray["Id_TpsCumule"] = 99999999999;   
                    }

                    
                    if (pair_num == 1) {
                        
                        lineArray.Id_Image_2 = "";
                        
                        allArray31.push(lineArray); // push line to main array 
                        
                    } else if (pair_num == 2) {
                        
                        allArray32.push(lineArray); // push line to main array
                        
                    } else {
                        
                        allArray3.push(lineArray); // push line to main array 
                        
                    }
                    
               } else if (pair_num == 1 && lineArray["Id_Nom"] != '???') { // to epic main array 
                   
                   
                   
                    
                    lineArray.Id_Image_2 = "";
                    lineArray.Id_TpsCumule_2 = 99999999999;
                    lineArray.Id_FinishTime = 99999999999;
                    lineArray.Id_Inter1_2 = 99999999999;
                    lineArray.Id_Inter1Time = 99999999999;
                    lineArray.Id_Inter1Ecart1er = 99999999999; // maybe needs to be '-'
                    lineArray.Id_Inter2_2 = 99999999999;
                    lineArray.Id_Inter2Time = 99999999999;
                    lineArray.Id_Inter2Ecart1er = 99999999999; // maybe needs to be '-'
                    lineArray.Id_Inter3_2 = 99999999999;
                    lineArray.Id_Inter3Time = 99999999999;
                    lineArray.Id_Inter3Ecart1er = 99999999999; // maybe needs to be '-'
                    lineArray.Id_Nom_2 = "";
                    lineArray.Id_Nationalite_2 = "";
                    lineArray.Id_Canal_2 = "";
                    lineArray.Id_Arrow = 0;
                    lineArray.Id_Status = 0;
                    lineArray.oldBlue = 0;
                    lineArray.blue = 0;
                    lineArray.Id_Inter1blue = 0;
                    lineArray.Id_Inter2blue = 0;
                    lineArray.Id_Inter3blue = 0;
                    lineArray.Id_Finishblue = 0;
                    lineArray.single = 0;
                    lineArray.leader = 0;
                    lineArray.uci = 0; // 0 - none, 1 - first rider is uci, 2 - second rider is uci, 3 - both
//                    lineArray.Id_penalty = "";   
                    lineArray.e2min = 0; // exedded 2 minutes


                    
/*    // intermediate from file                
                    
                    if (inter1Array.hasOwnProperty(lineArray["Id_Numero_Full"].replace('-', ''))) {
                        console.log(lineArray["Id_Numero_Full"] + ' : ' + inter1Array[lineArray["Id_Numero_Full"].replace('-', '')] + ' : ' + timeString2ms(lineArray["Id_TpsCumule"]));
                    }
                    
                    
                    if (inter2Array.hasOwnProperty(lineArray["Id_Numero_Full"].replace('-', ''))) {
                        console.log(lineArray["Id_Numero_Full"] + ' : ' + inter2Array[lineArray["Id_Numero_Full"].replace('-', '')] + ' : ' + timeString2ms(lineArray["Id_TpsCumule"]));
                    }
                    
                    if (inter3Array.hasOwnProperty(lineArray["Id_Numero_Full"].replace('-', ''))) {
                        console.log(lineArray["Id_Numero_Full"] + ' : ' + inter3Array[lineArray["Id_Numero_Full"].replace('-', '')] + ' : ' + timeString2ms(lineArray["Id_TpsCumule"]));
                    }
  
*/  
  
                    
                    
                    if (lineArray["Id_Groupe"] == '&nbsp;') {
                        lineArray["Id_Groupe"] = "";   
                    }

                    if (lineArray["Id_Categorie"] == '&nbsp;' ) {
                        lineArray["Id_Categorie"] = "";   
                    } else if (lineArray["Id_Categorie"] == 'undefined' ) {
                        lineArray["Id_Categorie"] = "-";   
                    }
                    
// intermediate from file 
                    fullNumber = lineArray["Id_Numero_Full"].replace('-', '');

                    if (enableInter1 == 1 && inter1Array.hasOwnProperty(fullNumber)) {

                        lineArray["Id_Inter1"] = inter1Array[fullNumber]; 
                    }
                                        
                    if (enableInter2 == 1 && inter2Array.hasOwnProperty(fullNumber)) {

                        lineArray["Id_Inter2"] = inter2Array[fullNumber]; 
                    }
                     
                    if (enableInter3 == 1 && inter3Array.hasOwnProperty(fullNumber)) {

                        lineArray["Id_Inter3"] = inter3Array[fullNumber]; 
                    }
                    
// time from kellner                    
                    if (useKellner == 1) {
                        
                        if (kellnerArray.hasOwnProperty(fullNumber)) {

                            lineArray["Id_TpsCumule"] = kellnerArray[fullNumber]['Time']; 
                            lineArray["Id_Inter1"] = kellnerArray[fullNumber]['T1']; 
                            lineArray["Id_Inter2"] = kellnerArray[fullNumber]['T2']; 
                            lineArray["Id_Inter3"] = kellnerArray[fullNumber]['T3']; 
                        }
                        
                    }
                    
                    
                    // convert total time to miliseconds
                    if (typeof lineArray["Id_TpsCumule"] != 'undefined' && lineArray["Id_TpsCumule"] != "" ) { // "-"
                        lineArray["Id_TpsCumule"] = timeString2ms(lineArray["Id_TpsCumule"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_TpsCumule"] = lineArray["Id_TpsCumule"] + delta;
                        }
*/                    } else {
                        lineArray["Id_TpsCumule"] = 99999999999;   
                    }

                    // convert intermediate time to miliseconds
                    if (typeof lineArray["Id_Inter1"] != 'undefined' && lineArray["Id_Inter1"] != "" ) { // "-"
                        lineArray["Id_Inter1"] = timeString2ms(lineArray["Id_Inter1"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter1"] = lineArray["Id_Inter1"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter1"] = 99999999999;   
                    }                    
                    
                    if (typeof lineArray["Id_Inter2"] != 'undefined' && lineArray["Id_Inter2"] != "" ) { // "-"
                        lineArray["Id_Inter2"] = timeString2ms(lineArray["Id_Inter2"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter2"] = lineArray["Id_Inter2"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter2"] = 99999999999;   
                    }
                    if (typeof lineArray["Id_Inter3"] != 'undefined' && lineArray["Id_Inter3"] != "" ) { // "-"
                        lineArray["Id_Inter3"] = timeString2ms(lineArray["Id_Inter3"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter3"] = lineArray["Id_Inter3"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter3"] = 99999999999;   
                    }

                   
                   
                   
                    allArray.push(lineArray); // push line to main array 
                    
                } else if (pair_num == 2 && lineArray["Id_Nom"] != '???') { // to epic secoundry array
                    
 
/*    // intermediate from file                

                    
                    if (inter1Array.hasOwnProperty(lineArray["Id_Numero_Full"].replace('-', ''))) {
                        console.log(lineArray["Id_Numero_Full"] + ' : ' + inter1Array[lineArray["Id_Numero_Full"].replace('-', '')] + ' : ' + timeString2ms(lineArray["Id_TpsCumule"]));
                    }
                    
                    if (inter2Array.hasOwnProperty(lineArray["Id_Numero_Full"].replace('-', ''))) {
                        console.log(lineArray["Id_Numero_Full"] + ' : ' + inter2Array[lineArray["Id_Numero_Full"].replace('-', '')] + ' : ' + timeString2ms(lineArray["Id_TpsCumule"]));
                    }
                    
                    if (inter3Array.hasOwnProperty(lineArray["Id_Numero_Full"].replace('-', ''))) {
                        console.log(lineArray["Id_Numero_Full"] + ' : ' + inter3Array[lineArray["Id_Numero_Full"].replace('-', '')] + ' : ' + timeString2ms(lineArray["Id_TpsCumule"]));
                    }
                    
*/                     
                    
                    
                    
                    
                    
                    if (lineArray["Id_Groupe"] == '&nbsp;') {
                        lineArray["Id_Groupe"] = "";   
                    }

                    if (lineArray["Id_Categorie"] == '&nbsp;' ) {
                        lineArray["Id_Categorie"] = "";   
                    } else if (lineArray["Id_Categorie"] == 'undefined' ) {
                        lineArray["Id_Categorie"] = "-";   
                    }

                    
// intermediate from file                    
                    fullNumber = lineArray["Id_Numero_Full"].replace('-', '');
                    
                    if (enableInter1 == 1 && inter1Array.hasOwnProperty(fullNumber)) {

                        lineArray["Id_Inter1"] = inter1Array[fullNumber]; 
                    }
                                        
                    if (enableInter2 == 1 && inter2Array.hasOwnProperty(fullNumber)) {

                        lineArray["Id_Inter2"] = inter2Array[fullNumber]; 
                    }
                     
                    if (enableInter3 == 1 && inter3Array.hasOwnProperty(fullNumber)) {

                        lineArray["Id_Inter3"] = inter3Array[fullNumber]; 
                    }
                  
// time from kellner                    
                    if (useKellner == 1) {
                        
                        if (kellnerArray.hasOwnProperty(fullNumber)) {

                            lineArray["Id_TpsCumule"] = kellnerArray[fullNumber]['Time']; 
                            lineArray["Id_Inter1"] = kellnerArray[fullNumber]['T1']; 
                            lineArray["Id_Inter2"] = kellnerArray[fullNumber]['T2']; 
                            lineArray["Id_Inter3"] = kellnerArray[fullNumber]['T3']; 
                       }
                        
                    }
                    
                    
                    
                    // convert total time to miliseconds
                    if (typeof lineArray["Id_TpsCumule"] != 'undefined' && lineArray["Id_TpsCumule"] != "" ) { // "-"
                        lineArray["Id_TpsCumule"] = timeString2ms(lineArray["Id_TpsCumule"]); 
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_TpsCumule"] = lineArray["Id_TpsCumule"] + delta;
                        }
*/                    } else {
                        lineArray["Id_TpsCumule"] = 99999999999;   
                    }
                
                    // convert intermediate time to miliseconds
                    if (typeof lineArray["Id_Inter1"] != 'undefined' && lineArray["Id_Inter1"] != "" ) { // "-"
                        lineArray["Id_Inter1"] = timeString2ms(lineArray["Id_Inter1"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter1"] = lineArray["Id_Inter1"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter1"] = 99999999999;   
                    }
                    
                    if (typeof lineArray["Id_Inter2"] != 'undefined' && lineArray["Id_Inter2"] != "" ) { // "-"
                        lineArray["Id_Inter2"] = timeString2ms(lineArray["Id_Inter2"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter2"] = lineArray["Id_Inter2"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter2"] = 99999999999;   
                    }
                    if (typeof lineArray["Id_Inter3"] != 'undefined' && lineArray["Id_Inter3"] != "" ) { // "-"
                        lineArray["Id_Inter3"] = timeString2ms(lineArray["Id_Inter3"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter3"] = lineArray["Id_Inter3"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter3"] = 99999999999;   
                    }
                    
                    
                    
                    
//                    allArray2.push(lineArray); // push line to main array 
                    allArray2obj[lineArray["Id_Numero"]] = (lineArray); // push line to main array 
                    
                }

                lineArray = {};
                pp = 0;
                pair_num = "";
                main_num = "";
                
            } else if ((lines[b].includes("<td ") && ttt == 1)) { // clean and add competitor cell
                if (lines[b].includes("(C)")) {
                    lineArray.Id_penalty = "P";
                } else {
                    lineArray.Id_penalty = "";
                }

                lineArray[hhhPro[pp]] = lines[b].substring(lines[b].indexOf(">")+1,lines[b].lastIndexOf("<")).replace("(C) ", "");

                if (lineArray[hhhPro[pp]] == '&nbsp;' ) {
                    lineArray[hhhPro[pp]] = "";   
                }
                

                if (hhhPro[pp] == "Id_Numero" && lineArray[hhhPro[pp]] != "-" ) {
                    pair_num = String(lineArray[hhhPro[pp]]).slice(-1);
                    main_num = String(lineArray[hhhPro[pp]]).slice(0, -1);
                    
                    if (pair_num == "1" || pair_num == "2") {
                        lineArray[hhhPro[pp]] = main_num;
                        lineArray["Id_Numero_Full"] = main_num + '-' + pair_num;
                    } else {
                        lineArray["Id_Numero_Full"] = lineArray["Id_Numero"];
                    }
                }

                if (useKellner == 1) {
                    lineArray.Id_TpsCumule = "";
                    lineArray.Id_Inter1 = "";
                    lineArray.Id_Inter2 = "";
                    lineArray.Id_Inter3 = "";
                    
                }
                
                pp += 1;
      //    console.log(lineArray);

            }
            
        }

        lines = '';
        
     //    console.log(hhh);
     //    console.log(hhhPro);

     //             console.log(qqq);
      //   console.log(hhhPro2);
         //                console.log(allArray);

     //    console.log(allArray);
         // console.log(allArray2);



        for (b = 0; b < allArray.length; b++) {  // main array
//            for (a = 0; a < allArray2.length; a++) {  // replaced allArray2[a] with allArray2obj[allArray[b]["Id_Numero"]]
//let obj = allArray2.find(o => o.Id_Numero === allArray[b]["Id_Numero"]); // replace for a

/*                // calculating total time and total laps from both arrays
                if (allArray[b]["Id_Numero"] == allArray2obj[allArray[b]["Id_Numero"]]["Id_Numero"] && allArray[b]["Id_TpsCumule"] != 99999999999 && allArray2obj[allArray[b]["Id_Numero"]]["Id_TpsCumule"] != 99999999999) {
                    
          //          allArray[b]["Id_TpsCumule"] = allArray[b]["Id_TpsCumule"] + allArray2obj[allArray[b]["Id_Numero"]]["Id_TpsCumule"];
                }
*/            
//                if (allArray[b]["Id_Numero"] == allArray2obj[allArray[b]["Id_Numero"]]["Id_Numero"]) {
                    
        
                    if (allArray[b]["Id_Groupe"].includes('s')) {

                        allArray[b]["Id_Groupe"] = allArray[b]["Id_Groupe"].replace('s', 's1');
// remove for kellner                        allArray[b]["Id_NbTour"] = 2 * Number(allArray2obj[b]["Id_NbTour"]); // need to 2* the laps as it 1 rider and not 2 

                    } else if (allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].includes('s')) {

                        allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].replace('s', 's2');
// remove for kellner                        allArray[b]["Id_NbTour"] = 2 * Number(allArray2obj[allArray[b]["Id_Numero"]]["Id_NbTour"]);

// remove for kellner                    } else {
        
// remove for kellner                        allArray[b]["Id_NbTour"] = Number(allArray[b]["Id_NbTour"]) + Number(allArray2obj[allArray[b]["Id_Numero"]]["Id_NbTour"]);
                    }
                    
                    if (allArray[b]["Id_Groupe"].includes('u') && allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].includes('u')) {

                        allArray[b]["uci"] = 3;
                        allArray[b]["Id_Groupe"] = allArray[b]["Id_Groupe"].replace('u', 'u3');
                        allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].replace('u', '');

                    } else if (allArray[b]["Id_Groupe"].includes('u') && !(allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].includes('u'))) {

                        allArray[b]["uci"] = 1;
                        allArray[b]["Id_Groupe"] = allArray[b]["Id_Groupe"].replace('u', 'u1');

                        
                    } else if (!(allArray[b]["Id_Groupe"].includes('u')) && allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].includes('u')) {

                        allArray[b]["uci"] = 2;
                        allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].replace('u', 'u2');
                    }


                    if (allArray[b]["Id_Groupe"].includes('l') || allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].includes('l')) {
                        
                        allArray[b]["leader"] = 1; // mark leader (yellow shirt)
                        
                    }                    
                    
                    if (allArray[b]["Id_Groupe"].includes('d') || allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"].includes('d')) {
                        
                        allArray[b]["Id_Image"] = '_Status10'; // mark DSQ
                        
                    }                    

                    
                    allArray[b]["Id_Groupe"] = (allArray2obj[allArray[b]["Id_Numero"]]["Id_Groupe"] + allArray[b]["Id_Groupe"]).replace('dd', 'd').replace('ll', 'l').replace('bb', 'b'); // combine blue, single, leader


                    
                    // transfer fields from second array to the first that needed later, use _2 to mark
                    allArray[b]["Id_Image_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Image"];   
                    allArray[b]["Id_Nom_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Nom"];
                    allArray[b]["Id_Numero_Full_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Numero_Full"];
                    allArray[b]["Id_Nationalite_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Nationalite"];
                    allArray[b]["Id_TpsCumule_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_TpsCumule"];
                    allArray[b]["Id_Canal_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Canal"];
                    
                    if (typeof allArray2obj[allArray[b]["Id_Numero"]]["Id_Inter1"] != 'undefined') {
                        allArray[b]["Id_Inter1_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Inter1"];
                    }
                    if (typeof allArray[b]["Id_Inter1"] == '-') {
                        allArray[b]["Id_Inter1"] = 99999999999;
                    }
                    if (typeof allArray2obj[allArray[b]["Id_Numero"]]["Id_Inter2"] != 'undefined') {
                        allArray[b]["Id_Inter2_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Inter2"];
                    }
                    if (typeof allArray[b]["Id_Inter2"] == '-') {
                        allArray[b]["Id_Inter2"] = 99999999999;
                    }
                    if (typeof allArray2obj[allArray[b]["Id_Numero"]]["Id_Inter3"] != 'undefined') {
                        allArray[b]["Id_Inter3_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Inter3"];
                    }
                    if (typeof allArray[b]["Id_Inter3"] == '-') {
                        allArray[b]["Id_Inter3"] = 99999999999;
                    }
 //                   if (typeof allArray2obj[allArray[b]["Id_Numero"]]["Id_Discipline"] != 'undefined') {
 //                       allArray[b]["Id_Discipline_2"] = allArray2obj[allArray[b]["Id_Numero"]]["Id_Discipline"];
 //                   }

                    if (allArray2obj[allArray[b]["Id_Numero"]]["Id_penalty"] == "P") {
                        allArray[b].Id_penalty = "P";   
                    }
/*                    
                } // END compare

                if (allArray[b]["Id_Numero"] == allArray2obj[allArray[b]["Id_Numero"]]["Id_Numero"]) {
                    break;
                }
                
            }// END for a
*/            
            // find finish time and check for 2 minutes difference
                        
                        if (allArray[b]["Id_Groupe"].includes("s1")) {
                            allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule"]);
                            allArray[b]["single"] = 1;
                        } else if ( allArray[b]["Id_Groupe"].includes("s2")) {
                            allArray[b]["Id_FinishTime"] = Number(allArray[b]["Id_TpsCumule_2"]);
                            allArray[b]["single"] = 2;
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
                            //      allArray[b]["Id_FinishTime"] = 99999999999;
                   //             allArray[b].Id_Finishblue = 1; // make blue DSQ
                                allArray[b].e2min = 1;

                            }
                            
                            
                            
                        } else if (raceEnded == 1 && (allArray[b]["Id_TpsCumule"] == 99999999999 || allArray[b]["Id_TpsCumule_2"] == 99999999999)) {
                            
                            allArray[b]["Id_FinishTime"] = 99999999999;
                            allArray[b].Id_Finishblue = 1; // make blue DSQ
                            
                        }

 // make blue if exceed MaximumStageTime, ENABLE after testing
                        allArray[b].mst = 0;
                        if ((allArray[b]["Id_FinishTime"] != 99999999999 && allArray[b]["Id_FinishTime"] > MaximumStageTimeMili) || (raceEnded == 1 && allArray[b]["Id_FinishTime"] == 99999999999)) {
                            allArray[b]["Id_FinishTime"] = 99999999999;
                            allArray[b].Id_Finishblue = 1; // make blue DSQ
                            allArray[b].mst = 1;
                        }

                        if (allArray[b]["Id_Finishblue"] == 1 && show == 4) {
                            allArray[b]["blue"] = 1;
                        }
               
                
        
            // find intermediate time 1 and check for 2 minutes difference
                        if (allArray[b]["Id_Groupe"].includes("s1")) {
                            allArray[b]["Id_Inter1Time"] = Number(allArray[b]["Id_Inter1"]);
                            allArray[b]["single"] = 1;
                        } else if (allArray[b]["Id_Groupe"].includes("s2")) {
                            allArray[b]["Id_Inter1Time"] = Number(allArray[b]["Id_Inter1_2"]);
                            allArray[b]["single"] = 2;
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
                    //               allArray[b]["Id_Inter1Time"] = 99999999999;
//                                if (show == 4) {
//                                    allArray[b].blue = 1; // make blue DSQ
//                                }
                                allArray[b].Id_Inter1blue = 1; // make blue DSQ
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
                
            // find intermediate time 2 and check for 2 minutes difference
                        if (allArray[b]["Id_Groupe"].includes("s1")) {
                            allArray[b]["Id_Inter2Time"] = Number(allArray[b]["Id_Inter2"]);
                            allArray[b]["single"] = 1;
                        } else if (allArray[b]["Id_Groupe"].includes("s2")) {
                            allArray[b]["Id_Inter2Time"] = Number(allArray[b]["Id_Inter2_2"]);
                            allArray[b]["single"] = 2;
                        } else if (allArray[b]["Id_Inter2"] != 99999999999 && allArray[b]["Id_Inter2_2"] != 99999999999) {
                            if (allArray[b]["Id_Inter2"] > allArray[b]["Id_Inter2_2"]) {
                                allArray[b]["Id_Inter2Time"] = Number(allArray[b]["Id_Inter2"]);
                            }
                            else if (allArray[b]["Id_Inter2"] <= allArray[b]["Id_Inter2_2"]) {
                                allArray[b]["Id_Inter2Time"] = Number(allArray[b]["Id_Inter2_2"]);
                            } else {
                                allArray[b]["Id_Inter2Time"] = 99999999999;
                            }
                            
                            
                            if (Math.abs(allArray[b]["Id_Inter2"] - allArray[b]["Id_Inter2_2"]) > 120000) { // check more then 2 minutes apart
                //                 allArray[b]["Id_Inter2Time"] = 99999999999;
//                                if (show == 4) {
//                                    allArray[b].blue = 1; // make blue DSQ
//                                }
                                allArray[b].Id_Inter2blue = 1; // make blue DSQ
                            }
                            
                        }                

                                
                        // update intermediate 2 leader array 
                        if (typeof Inter2Leader["overall"] == 'undefined') { // overall
                            Inter2Leader["overall"] = 99999999999;
                            
                        }
                        if (allArray[b]["Id_Inter2Time"] != 99999999999 && Inter2Leader["overall"] > allArray[b]["Id_Inter2Time"]) {
                            
                            Inter2Leader["overall"] = allArray[b]["Id_Inter2Time"];
                        }

                        if (typeof Inter2Leader[allArray[b]["Id_Categorie"]] == 'undefined') { // category
                            Inter2Leader[allArray[b]["Id_Categorie"]] = 99999999999;
                            
                        }
                        if (allArray[b]["Id_Inter2Time"] != 99999999999 && Inter2Leader[allArray[b]["Id_Categorie"]] > allArray[b]["Id_Inter2Time"]) {
                            
                            Inter2Leader[allArray[b]["Id_Categorie"]] = allArray[b]["Id_Inter2Time"];
                        }
                    
                
             //   console.log(Inter2Leader);
                
            // find intermediate time 3 and check for 2 minutes difference
                        if (allArray[b]["Id_Groupe"].includes("s1")) {
                            allArray[b]["Id_Inter3Time"] = Number(allArray[b]["Id_Inter3"]);
                            allArray[b]["single"] = 1;
                        } else if (allArray[b]["Id_Groupe"].includes("s2")) {
                            allArray[b]["Id_Inter3Time"] = Number(allArray[b]["Id_Inter3_2"]);
                            allArray[b]["single"] = 2;
                        } else if (allArray[b]["Id_Inter3"] != 99999999999 && allArray[b]["Id_Inter3_2"] != 99999999999) {
                            if (allArray[b]["Id_Inter3"] > allArray[b]["Id_Inter3_2"]) {
                                allArray[b]["Id_Inter3Time"] = Number(allArray[b]["Id_Inter3"]);
                            }
                            else if (allArray[b]["Id_Inter3"] <= allArray[b]["Id_Inter3_2"]) {
                                allArray[b]["Id_Inter3Time"] = Number(allArray[b]["Id_Inter3_2"]);
                            } else {
                                allArray[b]["Id_Inter3Time"] = 99999999999;
                            }
                            
                            
                            if (Math.abs(allArray[b]["Id_Inter3"] - allArray[b]["Id_Inter3_2"]) > 120000) { // check more then 2 minutes apart
                //                   allArray[b]["Id_Inter3Time"] = 99999999999;
//                                if (show == 4) {
//                                    allArray[b].blue = 1; // make blue DSQ
//                                }
                                allArray[b].Id_Inter3blue = 1; // make blue DSQ
                            }
                            
                        }                

                                
                        // update intermediate 3 leader array 
                        if (typeof Inter3Leader["overall"] == 'undefined') { // overall
                            Inter3Leader["overall"] = 99999999999;
                            
                        }
                        if (allArray[b]["Id_Inter3Time"] != 99999999999 && Inter3Leader["overall"] > allArray[b]["Id_Inter3Time"]) {
                            
                            Inter3Leader["overall"] = allArray[b]["Id_Inter3Time"];
                        }

                        if (typeof Inter3Leader[allArray[b]["Id_Categorie"]] == 'undefined') { // category
                            Inter3Leader[allArray[b]["Id_Categorie"]] = 99999999999;
                            
                        }
                        if (allArray[b]["Id_Inter3Time"] != 99999999999 && Inter3Leader[allArray[b]["Id_Categorie"]] > allArray[b]["Id_Inter3Time"]) {
                            
                            Inter3Leader[allArray[b]["Id_Categorie"]] = allArray[b]["Id_Inter3Time"];
                        }
                    
                
             //   console.log(Inter3Leader);

             
                    //combine class
                    if (allArray[b]["Id_Groupe"].includes('b')) {                    
                        allArray[b]["oldBlue"] = 1;
                    }
         

                if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status")) {
                    allArray[b].Id_Statusi1 = 1;
                } else {
                    allArray[b].Id_Statusi1 = 0;
                }
                if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status")) {
                    allArray[b].Id_Statusi2 = 1;
                } else {
                    allArray[b].Id_Statusi2 = 0;
                }
                if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status")) {
                    allArray[b].Id_Statusi3 = 1;
                } else {
                    allArray[b].Id_Statusi3 = 0;
                }
                
                if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status")) {
                    allArray[b].Id_Status = 1;
                } else {
                    allArray[b].Id_Status = 0;
                }
            
               

               // display result for selected intermediate or finish
               if (show == 1) {
                    allArray[b]["Id_Sector_FinishTime"] = allArray[b]["Id_Inter1Time"];
                } else if (show == 2) {
                    allArray[b]["Id_Sector_FinishTime"] = allArray[b]["Id_Inter2Time"];
                } else if (show == 3) {
                    allArray[b]["Id_Sector_FinishTime"] = allArray[b]["Id_Inter3Time"];
                } else {
                    allArray[b]["Id_Sector_FinishTime"] = allArray[b]["Id_FinishTime"];
                }
               
               // get the number of finishers
               if (allArray[b]["Id_Inter1Time"] != 99999999999) {
                   finishers[0] += 1;
               }
               if (allArray[b]["Id_Inter2Time"] != 99999999999) {
                   finishers[1] += 1;
               }
               if (allArray[b]["Id_Inter3Time"] != 99999999999) {
                   finishers[2] += 1;
               }
               if (allArray[b]["Id_FinishTime"] != 99999999999) {
                   finishers[3] += 1;
               }
               
               
              
        } // END for b
         // delete the second array
//         allArray2 = [];
//         console.log(finishers);
        
         document.getElementById('status').innerHTML = `  I1: ${finishers[0]}  |  I2: ${finishers[1]}  |  I3: ${finishers[2]}  |  Finish: ${finishers[3]}`;
         
//  CONVERT allArray to JSON for uploading to remote. FIXME Inter1Leader tables needs addressing.
         
//        var allArrayJ = JSON.stringify(allArray);             
//        console.log(JSON.parse(allArrayJ));     
//        download(allArrayJ, 'j1.txt', 'text/plain');    
         
         
// BEGIN SORTING
         
         
// FIXME   SORTING WORKS ONLY IF THERE IS ONE LAP. IF THE RACE IS LONGER NEEDED TO ADD "|| b.Id_NbTour - a.Id_NbTour" BEFORE "|| a.Id_FinishTime - b.Id_FinishTime". THIS IS THEORETICAL, NOT CHECKED!!!, maybe FIXED 

         // THE MAGIC - sort the array after the merge to get new results
         // FIXME Id_Status drops blue competitor to bottom , check if this is what needed

         

// TEST doing ALL sorting (inc intermediate) on master         
         
// sorting intermediate 1
//          allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi1 - b.Id_Statusi1 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            allArray.sort((a, b) => (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi1 - b.Id_Statusi1 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2);

            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["i1index"] = Number(l+1);
                // reassign position number

                    if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                        
                    // gap in category
                        competitorTime = allArray[l]["Id_Inter1Time"];
                        
                        if (competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                        allArray[l]["Inter1Ecart1erCategory"] = ms2TimeString(competitorTime - leaderTime);
                        } else {
                        allArray[l]["Inter1Ecart1erCategory"] = 99999999999;
                        }
                 //       console.log(allArray[l]["Id_Numero"] +': '+ allArray[l]["Inter1Ecart1erCategory"]);
                        
                    } else {
                        m = 1;
                        
                        prevCompCat = allArray[l]["Id_Categorie"];
                        leaderTime = allArray[l]["Id_Inter1Time"];
                        allArray[l]["Inter1Ecart1erCategory"] = 99999999999;
                //        console.log(allArray[l]["Inter1Ecart1erCategory"]);
                        
                    }
                    allArray[l]["i1Position_Categorie"] = Number(m);
                    
                    if (show == 1) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }

            }
         
//            allArray.sort(function(a, b){return a.Id_Statusi1 - b.Id_Statusi1 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            allArray.sort((a, b) => a.Id_Statusi1 - b.Id_Statusi1 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2);

            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["i1Position_Overall"] = Number(l+1);
                    
                    if (show == 1) {
                        allArray[l]["Id_Position_Overall"] = Number(l+1);
                        if (useCategory == "no") {
                            allArray[l]["Id_Position"] = Number(l+1);
                        }
                    }

            }
         
// sorting intermediate 2
         
//            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi2 - b.Id_Statusi2 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
                        
            allArray.sort((a, b) => (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi2 - b.Id_Statusi2 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2);

            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["i2index"] = Number(l+1);
                // reassign position number
 
                    if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                        
                    // gap in category
                        competitorTime = allArray[l]["Id_Inter2Time"];
                        
                        if (competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                        allArray[l]["Inter2Ecart1erCategory"] = ms2TimeString(competitorTime - leaderTime);
                        } else {
                        allArray[l]["Inter2Ecart1erCategory"] = 99999999999;
                        }
                 //       console.log(allArray[l]["Id_Numero"] +': '+ allArray[l]["Inter2Ecart1erCategory"]);
                        
                    } else {
                        m = 1;
                        
                        prevCompCat = allArray[l]["Id_Categorie"];
                        leaderTime = allArray[l]["Id_Inter2Time"];
                        allArray[l]["Inter2Ecart1erCategory"] = 99999999999;
                //        console.log(allArray[l]["Inter2Ecart1erCategory"]);
                        
                    }
                    allArray[l]["i2Position_Categorie"] = Number(m);
                    
                    if (show == 2) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }

            }
         
//            allArray.sort(function(a, b){return a.Id_Statusi2 - b.Id_Statusi2 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            allArray.sort((a, b) => a.Id_Statusi2 - b.Id_Statusi2 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2);

            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["i2Position_Overall"] = Number(l+1);
                    
                    if (show == 2) {
                        allArray[l]["Id_Position_Overall"] = Number(l+1);
                        if (useCategory == "no") {
                            allArray[l]["Id_Position"] = Number(l+1);
                        }
                    }

            }

// sorting intermediate 3
         
//            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi3 - b.Id_Statusi3 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            allArray.sort((a, b) => (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi3 - b.Id_Statusi3 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2);

            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["i3index"] = Number(l+1);
                // reassign position number
 
                    if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                        
                    // gap in category
                        competitorTime = allArray[l]["Id_Inter3Time"];
                        
                        if (competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                        allArray[l]["Inter3Ecart1erCategory"] = ms2TimeString(competitorTime - leaderTime);
                        } else {
                        allArray[l]["Inter3Ecart1erCategory"] = 99999999999;
                        }
                 //       console.log(allArray[l]["Id_Numero"] +': '+ allArray[l]["Inter3Ecart1erCategory"]);
                        
                    } else {
                        m = 1;
                        
                        prevCompCat = allArray[l]["Id_Categorie"];
                        leaderTime = allArray[l]["Id_Inter3Time"];
                        allArray[l]["Inter3Ecart1erCategory"] = 99999999999;
                //        console.log(allArray[l]["Inter3Ecart1erCategory"]);
                        
                    }
                    allArray[l]["i3Position_Categorie"] = Number(m);
                    
                    if (show == 3) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }


            }
         
//            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.oldBlue - b.oldBlue || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            allArray.sort((a, b) => a.Id_Status - b.Id_Status || a.oldBlue - b.oldBlue || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2);

            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["i3Position_Overall"] = Number(l+1);
                    
                    if (show == 3) {
                        allArray[l]["Id_Position_Overall"] = Number(l+1);
                        if (useCategory == "no") {
                            allArray[l]["Id_Position"] = Number(l+1);
                        }
                    }

            }
         
// sorting finish
         
           
//            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.blue - b.blue || a.oldBlue - b.oldBlue || a.single - b.single || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            allArray.sort((a, b) => (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.blue - b.blue || a.oldBlue - b.oldBlue || a.single - b.single /*|| b.Id_NbTour - a.Id_NbTour*/ || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2); // remove Id_NbTour for kellner

            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["findex"] = Number(l+1);
                // reassign position number
 
                    if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                        
                    // gap in category
                        competitorTime = allArray[l]["Id_FinishTime"];
                        
                        if (competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                        allArray[l]["FinishEcart1erCategory"] = ms2TimeString(competitorTime - leaderTime);
                        } else {
                        allArray[l]["FinishEcart1erCategory"] = 99999999999;
                        }
                 //       console.log(allArray[l]["Id_Numero"] +': '+ allArray[l]["FinishEcart1erCategory"]);
                        
                    } else {
                        m = 1;
                        
                        prevCompCat = allArray[l]["Id_Categorie"];
                        leaderTime = allArray[l]["Id_FinishTime"];
                        allArray[l]["FinishEcart1erCategory"] = 99999999999;
                //        console.log(allArray[l]["FinishEcart1erCategory"]);
                        
                    }
                    allArray[l]["fPosition_Categorie"] = Number(m);
                    
                    if (show == 4) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }

            }
         
//            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.blue - b.blue || a.oldBlue - b.oldBlue || a.single - b.single || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            allArray.sort((a, b) => a.Id_Status - b.Id_Status || a.blue - b.blue || a.oldBlue - b.oldBlue || a.single - b.single/* || b.Id_NbTour - a.Id_NbTour*/ || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2); // remove Id_NbTour for kellner

            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["fPosition_Overall"] = Number(l+1);
                    
                    if (show == 4) {
                        allArray[l]["Id_Position_Overall"] = Number(l+1);
                        if (useCategory == "no") {
                            allArray[l]["Id_Position"] = Number(l+1);
                        }
                    }

            }
         

         
         
         
         
      //   console.log(allArray);
         
         
    if (show == 1) { // sorting intermediate 1

        if (useCategory == "no") {
                       
//            allArray.sort(function(a, b){return a.i1Position_Overall - b.i1Position_Overall});
            allArray.sort((a, b) => a.i1Position_Overall - b.i1Position_Overall);
             
        } else if (useCategory == "yes") {

//            allArray.sort(function(a, b){return a.i1index - b.i1index});
            allArray.sort((a, b) => a.i1index - b.i1index);
        }
                    
    } else if (show == 2) { // sorting intermediate 2

        if (useCategory == "no") {
                       
//            allArray.sort(function(a, b){return a.i2Position_Overall - b.i2Position_Overall});
            allArray.sort((a, b) => a.i2Position_Overall - b.i2Position_Overall);
             
        } else if (useCategory == "yes") {

//            allArray.sort(function(a, b){return a.i2index - b.i2index});
            allArray.sort((a, b) => a.i2index - b.i2index);
        }
                    
    } else if (show == 3) { // sorting intermediate 3

        if (useCategory == "no") {
                       
//            allArray.sort(function(a, b){return a.i3Position_Overall - b.i3Position_Overall});
            allArray.sort((a, b) => a.i3Position_Overall - b.i3Position_Overall);
             
        } else if (useCategory == "yes") {

//            allArray.sort(function(a, b){return a.i3index - b.i3index});
            allArray.sort((a, b) => a.i3index - b.i3index);
        }
                    
    } else if (show == 4) { // sorting finish

        if (useCategory == "no") {
                       
//            allArray.sort(function(a, b){return a.fPosition_Overall - b.fPosition_Overall});
            allArray.sort((a, b) => a.fPosition_Overall - b.fPosition_Overall);
             
        } else if (useCategory == "yes") {

//            allArray.sort(function(a, b){return a.findex - b.findex});
            allArray.sort((a, b) => a.findex - b.findex);
        }
                    
    }
         
         
         
         // end TEST         
/*         
    if (show == 1) { // sorting intermediate 1

        if (useCategory == "no") {
            
 // calculate category position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);

            }
 // END calculate category position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);

            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
                    
    } else if (show == 2) { // sorting intermediate 2

        if (useCategory == "no") {
            
 // calculate category position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);

            }
 // END calculate category position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);

            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
                    
    }  else if (show == 3) { // sorting intermediate 3

        if (useCategory == "no") {
            
 // calculate category position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);

            }
 // END calculate category position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);

            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
                    
    } else { // sorting finish
         
         
         
         if (useCategory == "no") {
            
 // calculate category position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);

            }
 // END calculate category position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reassign position number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);

            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }

                    
                    
    } // END "show"
         
// END SORTING
*/         
         
// HEADER              
    if (cleanResults == 0) {                            
                            
        headerText1 = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

    // hard coded header for now
//        if (cleanResults == 0) {
                    if (hideStatus == 0) {
                        headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
                    }
//                    headerText1 += '<th colspan="2" class="rnkh_font Id_Position"><div>Cat</div><div>GC</div></th>';
                    headerText1 += '<th class="rnkh_font Id_Position">Position</th>'; // overall
                    headerText1 += '<th class="rnkh_font Id_Position">Cat Position</th>';
/*        } else {
                    headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
                    headerText1 += '<th class="rnkh_font Id_Position_Categorie">Cat</th>';
                    headerText1 += '<th class="rnkh_font Id_Position_Overall">GC</th>';
        }
*/
                    headerText1 += '<th class="rnkh_font Id_Numero">No.</th>';

 //       if (cleanResults == 0) {

//                    headerText1 += '<th class="rnkh_font uci">&nbsp;</th>';
 //                   headerText1 += '<th class="rnkh_font Id_Numero">&nbsp;</th>';
                    headerText1 += '<th class="rnkh_font Id_Nom">Riders</th>';
 //                   headerText1 += '<th class="rnkh_font Id_Nationalite">&nbsp;</th>';
            //        headerText1 += '<th class="rnkh_font Id_Nom_2">Name 2</th>';

                    //      headerText1 += '<th class="rnkh_font Id_TpsCumule_2">Time 2</th>';
//                    headerText1 += '<th class="rnkh_font Id_Equipe">Team</th>';

                    if (useCategory == "no") {
                        headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>';
                    }            
                    
                    if (show == 4) {
                        headerText1 += '<th class="rnkh_font mobile Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
                        headerText1 += '<th class="rnkh_font mobile Id_Inter2Time">Inter. 2</th>'; // intermediate 2 time
                        headerText1 += '<th class="rnkh_font mobile Id_Inter3Time">Inter. 3</th>'; // intermediate 3 time
                    if (timeGapDisplayInter == 1) {
                        headerText1 += '<th class="rnkh_font mobile Id_Inter1Ecart1er">Inter. 1 GAP</th>'; // intermediate 1 time diff
                        headerText1 += '<th class="rnkh_font mobile Id_Inter2Ecart1er">Inter. 2 GAP</th>'; // intermediate 2 time diff
                        headerText1 += '<th class="rnkh_font mobile Id_Inter3Ecart1er">Inter. 3 GAP</th>'; // intermediate 3 time diff
                    }
                }
                
/*        } else {
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
// display intermediate in cleanResults
                if (show == 4) {

                    headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
                    headerText1 += '<th class="rnkh_font Id_Inter2Time">Inter. 2</th>'; // intermediate 2 time
                    headerText1 += '<th class="rnkh_font Id_Inter3Time">Inter. 3</th>'; // intermediate 3 time
                    if (timeGapDisplayInter == 1) {
                        headerText1 += '<th class="rnkh_font Id_Inter1Ecart1er">Inter. 1 Gap</th>'; // intermediate 1 time diff
                        headerText1 += '<th class="rnkh_font Id_Inter2Ecart1er">Inter. 2 Gap</th>'; // intermediate 2 time diff
                        headerText1 += '<th class="rnkh_font Id_Inter3Ecart1er">Inter. 3 Gap</th>'; // intermediate 3 time diff
                    }
                }

            
        }
*/

                if (doNotShowTime == 0) {
                    headerText1 += '<th class="rnkh_font Id_TpsCumule">Individual Time</th>';
                }
                
                if (show == 1) {
                    headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
                } else if (show == 2) {
                    headerText1 += '<th class="rnkh_font Id_Inter2Time">Inter. 2</th>'; // intermediate 2 time
                } else if (show == 3) {
                    headerText1 += '<th class="rnkh_font Id_Inter3Time">Inter. 3</th>'; // intermediate 3 time
                } else {
                    headerText1 += '<th class="rnkh_font Id_FinishTime">Time</th>'; // combined time
                }
                
                if (timeGapDisplay == 1) {
                    headerText1 += '<th class="rnkh_font Id_Ecart1er">Gap</th>';
                }
                
        headerText1 += '</tr>';
        
       //    console.log(headerText1);
    }
// END HEADER
 

        
        
// HEADER cleanResults = 1              
    if (cleanResults == 1) {                            
    if (singleLine == 1) {                            
        headerText1 = '<tr class="rnkh_bkcolor">';

                headerText1 += '<th class="rnkh_font Id_Position_Overall">Overall Position</th>';
                headerText1 += '<th class="rnkh_font Id_Position_Categorie">Category Position</th>';
                headerText1 += '<th class="rnkh_font Id_Numero">Number</th>';

                if (useCategory == "no") {
                    headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>';
                }            
                headerText1 += '<th class="rnkh_font Id_Arrow">finish status</th>';
                headerText1 += '<th class="rnkh_font Id_Groupe">start status</th>';

                headerText1 += '<th class="rnkh_font Id_Numero_Full">Rider 1 Number</th>';
                
                headerText1 += '<th class="rnkh_font Id_Nom">Rider 1 Name</th>';
                headerText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>';
                headerText1 += '<th class="rnkh_font UCI">UCI</th>';

                headerText1 += '<th class="rnkh_font Id_Numero_Full_2">Rider 2 Number</th>';
                headerText1 += '<th class="rnkh_font Id_Nom_2">Rider 2 Name</th>';
                headerText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>';
                headerText1 += '<th class="rnkh_font UCI">UCI</th>';
                headerText1 += '<th class="rnkh_font Id_Equipe">Team</th>';
                if (doNotShowTime == 0) {
                    headerText1 += '<th class="rnkh_font Id_TpsCumule">Rider 1 Time</th>';
                    headerText1 += '<th class="rnkh_font Id_TpsCumule_2">Rider 2 Time</th>';
                }
// display intermediate in cleanResults
//                if (show == 4) {

//                    headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
//                    headerText1 += '<th class="rnkh_font Id_Inter2Time">Inter. 2</th>'; // intermediate 2 time
//                    headerText1 += '<th class="rnkh_font Id_Inter3Time">Inter. 3</th>'; // intermediate 3 time
//                    if (timeGapDisplayInter == 1) {
//                        headerText1 += '<th class="rnkh_font Id_Inter1Ecart1er">Inter. 1 Gap</th>'; // intermediate 1 time diff
//                        headerText1 += '<th class="rnkh_font Id_Inter2Ecart1er">Inter. 2 Gap</th>'; // intermediate 2 time diff
//                        headerText1 += '<th class="rnkh_font Id_Inter3Ecart1er">Inter. 3 Gap</th>'; // intermediate 3 time diff
//                    }
//                }
        

            headerText1 += '<th class="rnkh_font Id_FinishTime">Time</th>'; // time


//            if (timeGapDisplay == 1) {
                headerText1 += '<th class="rnkh_font Id_Ecart1er">Gap</th>';
//            }
                
        headerText1 += '</tr>';
        
       //    console.log(headerText1);
    
        
     
    } else {
        headerText1 = '<tr class="rnkh_bkcolor">';

                headerText1 += '<th class="rnkh_font Id_Position_Overall">Overall Position</th>';
                headerText1 += '<th class="rnkh_font Id_Position_Categorie">Category Position</th>';
                headerText1 += '<th class="rnkh_font Id_Numero">Number</th>';

                if (useCategory == "no") {
                    headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>';
                }            
                headerText1 += '<th class="rnkh_font Id_Arrow">finish status</th>';
                headerText1 += '<th class="rnkh_font Id_Groupe">start status</th>';

                
                headerText1 += '<th class="rnkh_font Id_Nom">Name</th>';
                headerText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>';
                headerText1 += '<th class="rnkh_font Id_Equipe">Team</th>';
                headerText1 += '<th class="rnkh_font UCI">UCI</th>';

                if (doNotShowTime == 0) {
                    headerText1 += '<th class="rnkh_font Id_TpsCumule">Rider Time</th>';
                }
// display intermediate in cleanResults
//                if (show == 4) {

//                    headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
//                    headerText1 += '<th class="rnkh_font Id_Inter2Time">Inter. 2</th>'; // intermediate 2 time
//                    headerText1 += '<th class="rnkh_font Id_Inter3Time">Inter. 3</th>'; // intermediate 3 time
//                    if (timeGapDisplayInter == 1) {
//                        headerText1 += '<th class="rnkh_font Id_Inter1Ecart1er">Inter. 1 Gap</th>'; // intermediate 1 time diff
//                        headerText1 += '<th class="rnkh_font Id_Inter2Ecart1er">Inter. 2 Gap</th>'; // intermediate 2 time diff
//                        headerText1 += '<th class="rnkh_font Id_Inter3Ecart1er">Inter. 3 Gap</th>'; // intermediate 3 time diff
//                    }
//                }
        

            headerText1 += '<th class="rnkh_font Id_FinishTime">Time</th>'; // time


//            if (timeGapDisplay == 1) {
                headerText1 += '<th class="rnkh_font Id_Ecart1er">Gap</th>';
//            }
                
        headerText1 += '</tr>';
        
       //    console.log(headerText1);
        
        
    }
        
    }
// END HEADER cleanResults = 1
        
        
        
        
            if (messageX != '') {
                finalText += `<div class="marquee"><p>${messageX}</p></div>`;
            }

        
        
        
    // fix the position fields of the competitors and start building the final table
            m = 0;
            prevCompCat = ""

//            finalText += '<div id="liveTable"><table class="' + tableClass + 'line_color">';

            if (useCategory == "no") {
                finalText += `\n<div id="liveTable">\n<table class="${tableClass} line_color">\n`;
            } else {

                finalText += `\n<div id="liveTable">\n`;
            }           

            
            for (l = 0; l < allArray.length; l++) {
/*
                // reassign position number
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
*/
                 
                 
                if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
                    leaderTime = allArray[l]["Id_Sector_FinishTime"];
// remove for kellner                    leaderLaps = allArray[l]["Id_NbTour"];
                } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
                    leaderTime = allArray[l]["Id_Sector_FinishTime"];
// remove for kellner                    leaderLaps = allArray[l]["Id_NbTour"];
                }  
/*
                            if (allArray[l]["Id_Position"] == 1) {
                                leaderTime = allArray[l]["Id_Sector_FinishTime"];
                                leaderLaps = allArray[l]["Id_NbTour"];
                            }
*/
                                    // fix the diff fields of the competitors
// remove for kellner                                competitorLaps = allArray[l]["Id_NbTour"];
                                
                                
                                if (useCategory == "yes") {
                                    leaderInter1Time = Inter1Leader[allArray[l]["Id_Categorie"]];
                                    leaderInter2Time = Inter2Leader[allArray[l]["Id_Categorie"]];
                                    leaderInter3Time = Inter3Leader[allArray[l]["Id_Categorie"]];
                                } else {
                                    leaderInter1Time = Inter1Leader["overall"];
                                    leaderInter2Time = Inter2Leader["overall"];
                                    leaderInter3Time = Inter3Leader["overall"];
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
                                     
                                    } else {
                                        allArray[l]["Id_Inter1Ecart1er"] = 99999999999;
                                    }
                                } else {
                                    allArray[l]["Id_Inter1Ecart1er"] = 99999999999;
                                }
                                

                                
                                imTheLeaderInter2 = 0;
                                if (allArray[l]["Id_Inter2Time"] == leaderInter2Time) {
                                    imTheLeaderInter2 = 1;
                                }

                                // diff on intermediate 2 time
                                if (allArray[l]["Id_Inter2Time"] != 99999999999) {
                                    competitorId_Inter2Time = allArray[l]["Id_Inter2Time"];
                                    if (competitorId_Inter2Time != leaderInter2Time && (competitorId_Inter2Time - leaderInter2Time) > 0 && (competitorId_Inter2Time - leaderInter2Time) < 86400000) { // check time is between 0 and 24h
                                    allArray[l]["Id_Inter2Ecart1er"] = ms2TimeString(competitorId_Inter2Time - leaderInter2Time);
                                     
                                    } else {
                                        allArray[l]["Id_Inter2Ecart1er"] = 99999999999;
                                    }
                                } else {
                                    allArray[l]["Id_Inter2Ecart1er"] = 99999999999;
                                }
                                

                                
                                imTheLeaderInter3 = 0;
                                if (allArray[l]["Id_Inter3Time"] == leaderInter3Time) {
                                    imTheLeaderInter3 = 1;
                                }

                                // diff on intermediate 3 time
                                if (allArray[l]["Id_Inter3Time"] != 99999999999) {
                                    competitorId_Inter3Time = allArray[l]["Id_Inter3Time"];
                                    if (competitorId_Inter3Time != leaderInter3Time && (competitorId_Inter3Time - leaderInter3Time) > 0 && (competitorId_Inter3Time - leaderInter3Time) < 86400000) { // check time is between 0 and 24h
                                    allArray[l]["Id_Inter3Ecart1er"] = ms2TimeString(competitorId_Inter3Time - leaderInter3Time);
                                     
                                    } else {
                                        allArray[l]["Id_Inter3Ecart1er"] = 99999999999;
                                    }
                                } else {
                                    allArray[l]["Id_Inter3Ecart1er"] = 99999999999;
                                }
                                

                                
                                // diff on total time
                                competitorTime = allArray[l]["Id_Sector_FinishTime"];
// remove for kellner                                if (competitorLaps == leaderLaps) {
                                if (competitorTime != 99999999999 && leaderTime != 99999999999) {
                                    
                                    if (competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                                    allArray[l]["Id_Ecart1er"] = ms2TimeString(competitorTime - leaderTime);
                                    } else {
                                    allArray[l]["Id_Ecart1er"] = 99999999999;
                                    }
                                } else {
                                    allArray[l]["Id_Ecart1er"] = 99999999999;
                                }
                                
                                
                             // position change arrow/status prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;
                     


                    // calculating arrows status
                    
                    positionChanged = "";

                    if (typeof positionArray_All_Cat[allArray[l]["Id_Numero"]] != 'undefined' && useCategory == "no" && allArray[l]["Id_Sector_FinishTime"] != 99999999999) {
                        
                        if (positionArray_All_Cat[allArray[l]["Id_Numero"]][0] < allArray[l]["Id_Position_Overall"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][0] > 0) {
                            allArray[l]["Id_Arrow"] = 3; // down :(
                            positionChanged = "lostPosition";
                            
                        } else if (positionArray_All_Cat[allArray[l]["Id_Numero"]][0] > allArray[l]["Id_Position_Overall"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][0] > 0) {
                            allArray[l]["Id_Arrow"] = 4; // up :)
                            positionChanged = "gainedPosition";
                            
                        }
                        
                    } else if (typeof positionArray_All_Cat[allArray[l]["Id_Numero"]] != 'undefined' && useCategory == "yes" && allArray[l]["Id_Sector_FinishTime"] != 99999999999) {
                        
                        if (positionArray_All_Cat[allArray[l]["Id_Numero"]][1] < allArray[l]["Id_Position_Categorie"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][1] > 0) {
                            allArray[l]["Id_Arrow"] = 3; // down :(
                            positionChanged = "lostPosition";
                            
                        } else if (positionArray_All_Cat[allArray[l]["Id_Numero"]][1] > allArray[l]["Id_Position_Categorie"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][1] > 0) {
                            allArray[l]["Id_Arrow"] = 4; // up :)
                            positionChanged = "gainedPosition";
                            
                        }
                    }
                    
       //     positionArray_All_Cat[allArray[l]["Id_Numero"]] = [allArray[l]["Id_Position_Overall"], allArray[l]["Id_Position_Categorie"]];


                                // convert back to time
                                
                            if (allArray[l]["Id_Inter1Time"] != 99999999999) {  
                                allArray[l]["Id_Inter1Time"] = ms2TimeString(allArray[l]["Id_Inter1Time"]);
                            }                                
                                
                            if (allArray[l]["Id_Inter2Time"] != 99999999999) {  
                                allArray[l]["Id_Inter2Time"] = ms2TimeString(allArray[l]["Id_Inter2Time"]);
                            }                                
                                
                            if (allArray[l]["Id_Inter3Time"] != 99999999999) {  
                                allArray[l]["Id_Inter3Time"] = ms2TimeString(allArray[l]["Id_Inter3Time"]);
                            }                                
                                
                            if (allArray[l]["Id_FinishTime"] != 99999999999) {  
                                allArray[l]["Id_FinishTime"] = ms2TimeString(allArray[l]["Id_FinishTime"]);
                            }                                
                                
                            if (allArray[l]["Id_Sector_FinishTime"] != 99999999999) {  
                                allArray[l]["Id_Sector_FinishTime"] = ms2TimeString(allArray[l]["Id_Sector_FinishTime"]);
                            }                                

                            if (allArray[l]["Id_TpsCumule"] != 99999999999) {  
                                allArray[l]["Id_TpsCumule"] = ms2TimeString(allArray[l]["Id_TpsCumule"]);
                            }

                            if (allArray[l]["Id_TpsCumule_2"] != 99999999999) {  
                                allArray[l]["Id_TpsCumule_2"] = ms2TimeString(allArray[l]["Id_TpsCumule_2"]);
                            }
                            
                showBlue = 0;
               // display result for selected intermediate or finish
               if (show == 1) {
                    allArray[l]["Id_Sector_Ecart1er"] = allArray[l]["Id_Inter1Ecart1er"];
                    if (allArray[l]["Id_Inter1blue"] == 1) {
                        showBlue = 1;
                    }
                } else if (show == 2) {
                    allArray[l]["Id_Sector_Ecart1er"] = allArray[l]["Id_Inter2Ecart1er"];
                    if (allArray[l]["Id_Inter2blue"] == 1) {
                        showBlue = 1;
                    }
                } else if (show == 3) {
                    allArray[l]["Id_Sector_Ecart1er"] = allArray[l]["Id_Inter3Ecart1er"];
                    if (allArray[l]["Id_Inter3blue"] == 1) {
                        showBlue = 1;
                    }
                } else if (show == 4) {
                    allArray[l]["Id_Sector_Ecart1er"] = allArray[l]["Id_Ecart1er"];
                    if (allArray[l]["blue"] == 1) {
                        showBlue = 1;
                    }
                }
               
                            
    //    console.log(allArray[l]["Id_Sector_Ecart1er"] + ' | ' + allArray[l]["Inter1Ecart1erCategory"] + ' | ' + allArray[l]["Inter2Ecart1erCategory"] + ' | ' + allArray[l]["Inter3Ecart1erCategory"] + ' | ' + allArray[l]["FinishEcart1erCategory"]);

       
                    
                    if (allArray[l]["Id_Image"].includes("_Status10") || allArray[l]["Id_Image_2"].includes("_Status10") || (allArray[l]["blue"] == 1 && allArray[l]["oldBlue"] == 1)) {
                        allArray[l]["Id_Arrow"] = 10; // DSQ
                    } else if (allArray[l]["Id_Image"].includes("_Status4") || allArray[l]["Id_Image_2"].includes("_Status4")) {
                        allArray[l]["blue"] = 1; //FIXME
                        showBlue = 1;
                    } else if (allArray[l]["Id_Image"].includes("_Status5") || allArray[l]["Id_Image_2"].includes("_Status5")) {
               //         allArray[l]["e2min"] = 1; 
                        allArray[l]["blue"] = 1; //FIXME
                        showBlue = 1;
                    } else if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image_2"].includes("_Status11")) {
                        allArray[l]["Id_Arrow"] = 11; // DNF
                    } else if (allArray[l]["Id_Image"].includes("_Status12") || allArray[l]["Id_Image_2"].includes("_Status12")) {
                        allArray[l]["Id_Arrow"] = 12; // DNS
                        allArray[l]["blue"] = 1;
                    } else if (allArray[l]["Id_Image"].includes("_Status2") || allArray[l]["Id_Image_2"].includes("_Status2")) {
                        allArray[l]["Id_Arrow"] = 9;
                    } else if (raceEnded == 1 && allArray[l]["Id_FinishTime"] == 99999999999) {
                        allArray[l]["Id_Arrow"] = 11; // DNF
                    } else if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image_2"].includes("_Status")) {
                        allArray[l]["Id_Arrow"] = 8; // astrix
                    } else if (allArray[l]["Id_penalty"] == "P") {
                        allArray[l]["Id_Arrow"] = 7; // penalty
                    }
            
            
            
/*            
            // calculating arrows status
                    if (allArray[l]["Id_Position"]) { 
                            competitorPosition = Number(allArray[l]["Id_Position"]);  // get the position value and clean penalty indicator
                    }
                     
                    if (competitorPosition > 0 && competitorNumber > 0 && allArray[l]["Id_NbTour"] && allArray[l]["Id_Sector_FinishTime"] != 99999999999) { // position change arrow calc
                    positionChanged = "";
                    
                        if (positionArray[competitorNumber]) {

                            if (positionArray[competitorNumber] < competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'; // down :(
                                positionChanged = "lostPosition ";
                            } else if (positionArray[competitorNumber] > competitorPosition) {
                                allArray[l]["Id_Arrow"] = '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'; // up :)
                                positionChanged = "gainedPosition ";
//                            } else if (positionArray[competitorNumber] == competitorPosition && !(allArray[l]["Id_Image"].includes("_Status")) && !(allArray[l]["Id_Image_2"].includes("_Status"))) {
//                        allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'; // same :|
                             //   positionChanged = "same ";
//                    }                        
                                 
                            }                            
                        }
                        // console.log("competitorNumber: " + competitorNumber + ",competitorPosition: " + competitorPosition + ", positionArray:" + positionArray[competitorNumber]);
                        positionArray[competitorNumber] = competitorPosition;// update array with current position for next Load calc
                    }
*/       

       
       
/*                    // mark on track
                    if (positionChanged == "" && !(allArray[l]["Id_Image"].includes("_Status")) && !(allArray[l]["Id_Image_2"].includes("_Status"))) {
                        allArray[l]["Id_Arrow"] = '<img class="postionSame" src="Images/_TrackPassing.svg" alt="same places">'+allArray[l]["Id_penalty"]; // same :|
                             //   positionChanged = "same ";
                    }                        
*/        
        
                if (allArray[l]["leader"] == 1) {
                    if (allArray[l]["Id_Categorie"] == 'Women') {
                        leader = '<span title="Women Leader" class="Flag PinkShirt"></span>';
                        leaderCard = 'pinkCard';
                    } else if (allArray[l]["Id_Categorie"] == 'Mixed') {
                        leader = '<span title="Mixed Leader" class="Flag GreenShirt"></span>';
                        leaderCard = 'greenCard';
                    } else if (allArray[l]["Id_Categorie"] == 'Masters') {
                        leader = '<span title="Masters Leader" class="Flag BlueShirt"></span>';
                        leaderCard = 'DarkBlueCard';
                    } else if (allArray[l]["Id_Categorie"] == 'Grand Masters') {
                        leader = '<span title="Grand Leader" class="Flag PurpleShirt"></span>';
                        leaderCard = 'purpleCard';
                    } else {
                        leader = '<span title="Men Leader" class="Flag YellowShirt"></span>';
                        leaderCard = 'yellowCard';
                    }
                } else {
                    leader = '';
                    leaderCard = '';
                }

                if (allArray[l]["Id_Categorie"] == 'Women') {
                    catCol = 'pink';
                } else if (allArray[l]["Id_Categorie"] == 'Mixed') {
                    catCol = 'greengreen';
                } else if (allArray[l]["Id_Categorie"] == 'Masters') {
                    catCol = 'blue';
                } else if (allArray[l]["Id_Categorie"] == 'Grand Masters') {
                    catCol = 'purple';
                } else if (allArray[l]["Id_Categorie"] == 'Men'){
                    catCol = 'yellow';
                } else {
                    catCol = 'black';
                }
                
                finished1 = "";
                finished2 = "";
                single1 = ""
                single2 = "";
                uci1 = "";
                uci2 = "";
                
                if (allArray[l]["single"] == 0 && show == 4) {
                    if (allArray[l]["Id_TpsCumule"] != 99999999999 && allArray[l]["Id_TpsCumule_2"] == 99999999999) {      
                        finished1 = '<span title="Finished" class="Flag CheckeredFlag"></span>';
                    }
                    else if (allArray[l]["Id_TpsCumule"] == 99999999999 && allArray[l]["Id_TpsCumule_2"] != 99999999999) {      
                        finished2 = '<span title="Finished" class="Flag CheckeredFlag"></span>';
                    }
                }
                
                if (allArray[l]["single"] == 2) {
                    single2 = "lineThrough";
                }
                if (allArray[l]["single"] == 1) {
                    single1 = "lineThrough";
                }
                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    uci1 = '<span title="UCI Rider" class="Flag UCI"></span>';
                } else {
                    uci1 = '';
                }
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    uci2 = '<span title="UCI Rider" class="Flag UCI"></span>';
                } else {
                    uci2 = '';
                }
                

                
                if (allArray[l]["Id_FinishTime"] != 99999999999 && allArray[l]["blue"] == 0 && show == 4) {
                    checkeredFlag = 'finished';
                } else {
                    checkeredFlag = '';
                }
                
                if (allArray[l]["blue"] == 1) {
                  blued = 'blued ';  
                } else {
                    blued = '';
                }
               
// add blue flag after Nationality flag for old blue, not used
                if (allArray[l]["oldBlue"] == 1) {
//                    markBlue = '<span title="Blue Board Rider" class="Flag blueFlag"></span>'; 
                    markBlue = '';
                } else {
                    markBlue = '';
                }
              


                 
// MAIN TABLE DATA, build table for web (cleanResults & TV comes later)  

    if (((catcat != "None" && allArray[l]["Id_Categorie"] == catcat && useCategory == "yes") || (catcat == "None" && useCategory == "yes") || useCategory == "no")  && epictv == 0 && cleanResults == 0) {
                 
// if ((allArray[l]["Id_Position"] < 6 && epictv == 1) || (epictv == 0)) { // TV show only 5 competitors

// add category name header and table header
            if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0 && catcat == 'None') { // add table end tag
                    finalText += '\n</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
                            
                finalText += `\n<table class="${tableClass} line_color">\n<tr><td colspan="99" class="title_font">${allArray[l]["Id_Categorie"]}</td></tr>\n${headerText1}`;                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerText1;
                    finalText += `\n<tr><td colspan="99" class="title_font">Overall</td></tr>\n${headerText1}`;
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
                finalText += `<tr class="${positionChanged} rnk_bkcolor OddRow">`;
            } else {
                finalText += `<tr class="${positionChanged} rnk_bkcolor EvenRow">`;
            }
        
        
    //        for(var key in allArray[l]) {
    //        var opt3 = allArray[l][key];
 
            
    //          if (key != "Id_Ecart1erCategorie" && key != "Id_MeilleurTour" && key != "Id_PositionCategorie" && key != "Id_Image" && key != "Id_Arrow" && key != "Id_TpsTour1" && key != "Id_TpsTour2" && key != "Id_TpsTour3" && key != "Id_Categorie" && key != 'undefined' && key != null && key != "&nbsp;") {
                
                
/*
allArray[l]["Id_Arrow"]                    
0 ''

3 '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'
4 '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'

7 'P'                    
8 '<img class="dnsfq" src="Images/_status.svg" alt="status">'                    
9 '<img class="dnsfq" src="Images/_nq.svg" alt="nq">'
10 '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">'
11 '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">'
12 '<img class="dnsfq" src="Images/_dns.svg" alt="dns">'                    
*/                
                
/*                
                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += '<td aria-label="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dns.svg" alt="dns"></td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td aria-label="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dnf.svg" alt="dnf"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td aria-label="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dsq.svg" alt="dsq"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td aria-label="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_nq.svg" alt="nq"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td aria-label="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_status.svg" alt="status"></td>';
                    
                } else if (showBlue == 1) {
                
                    finalText += '<td aria-label="Blue Board Rider" class="blued rnk_font">&nbsp;</td>'; //&#9608;

                } else if (allArray[l]["Id_Arrow"] == 3) { // red
                    
                    finalText += '<td class="' + checkeredFlag + 'red rnk_font"><img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 4) { // green
                    
                    finalText += '<td class="' + checkeredFlag + 'green rnk_font"><img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places"></td>';
                    
                } else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td aria-label="Finished" class="finished white rnk_font">&nbsp;</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td class="black rnk_font fadeIn">P</td>';
                    
                } else {

                    finalText += '<td class="white rnk_font fadeIn">&nbsp;</td>'; // &#9671;

                }
                
                if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] == 1 || show != 4) {
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show position if status or no finish time
                    
//                    if (cleanResults == 1) {
//                        finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show  postiion if status or no finish time
//                    }
                    
                } else {
//                   if (cleanResults == 0) {

                        finalText += '<td class="rnk_font"><div class="pos">' + allArray[l]["Id_Position_Categorie"] + '</div><div class="pos">' + allArray[l]["Id_Position_Overall"] + '</div></td>'; 
                        
//                    } else if (cleanResults == 1) {
//                        
//                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; // category position
//                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; // overall postiion
//                    }
                    
                }
*/

/*
                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += '<td colspan="2" title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dns.svg" alt="dns"></td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td colspan="2" title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dnf.svg" alt="dnf"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td colspan="2" title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dsq.svg" alt="dsq"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td colspan="2" title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_nq.svg" alt="nq"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td colspan="2" title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_status.svg" alt="status"></td>';
                    
                } else if (showBlue == 1) {
                
                    finalText += '<td colspan="2" title="Blue Board Rider" class="blued rnk_font">&nbsp;</td>'; //&#9608;

                } else if (allArray[l]["Id_Sector_FinishTime"] != 99999999999 && allArray[l]["oldBlue"] == 0 && allArray[l]["single"] == 0 && !allArray[l]["Id_Image"].includes("_Status")) { // finished
                    
//                   finalText += '<td class="rnk_font bigFont fadeIn"><span class="' + catCol + '">&nbsp;' + allArray[l]["Id_Position_Categorie"] + '</span>&nbsp;&nbsp;&nbsp;<span class="black">' + allArray[l]["Id_Position_Overall"] + '&nbsp;</span></td>'; 
                        
                    finalText += '<td class="rnk_font bigFont fadeIn">' + allArray[l]["Id_Position_Overall"] + '</td>'; 
                    finalText += '<td class="rnk_font bigFont fadeIn ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td colspan="2" class="black rnk_font fadeIn">P</td>';
                    
                } else {

                    finalText += '<td colspan="2" class="white rnk_font fadeIn">&nbsp;</td>'; // &#9671;
                }
                

*/                
               

                // add and style the status/arrow
            if (hideStatus == 0) {
                if (allArray[l]["Id_Image"] == "_Status5") { // e2min
                    if (doNotShowTime == 0) {

                        finalText += `<td title="${allArray[l]["Id_TpsCumule"]}\n${allArray[l]["Id_TpsCumule_2"]}" class="blued rnk_font">&nbsp;</td>`; //&#9608;
                    } else {
                        finalText += `<td title="Blue Board Rider" class="blued rnk_font">&nbsp;</td>`; //&#9608;
                    }
                } else if (showBlue == 1) {
                
                    finalText += `<td title="Blue Board Rider" class="blued rnk_font">&nbsp;</td>`; //&#9608;

                } else if (allArray[l]["Id_Arrow"] == 3) { // red
                    
                    if (prologue == 1) {
                        
                        finalText += `<td class="${checkeredFlag} red rnk_font"><img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places"></td>`;
                        
                    } else {

                        finalText += `<td class="${checkeredFlag} red rnk_font"></td>`;
                    }
                    
                } else if (allArray[l]["Id_Arrow"] == 4) { // green
                    
                    if (prologue == 1) {
                        
                        finalText += `<td class="${checkeredFlag} green rnk_font"><img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places"></td>`;
                        
                    } else {

                        finalText += `<td class="${checkeredFlag} green rnk_font"></td>`;
                    }
                    
                } else if (checkeredFlag == "finished " || (show == 4 && allArray[l]["Id_FinishTime"] != 99999999999)) { // finished
                    
                    finalText += `<td title="Finished" class="finished white rnk_font">&nbsp;</td>`;
                    
                } else if ((prologue == 1 && allArray[l]["Id_FinishTime"] == 99999999999 && (!allArray[l]["Id_Image"].includes("_Status")) && (!allArray[l]["Id_Image_2"].includes("_Status")) && (allArray[l]["Id_Canal"] == 1 || allArray[l]["Id_Canal_2"] == 1)) || (kellnerArray.hasOwnProperty(fullNumber))) { // on track
                    
                    finalText += `<td class="rnk_font fadeIn"><span title="Started" class="Flag Started"></span></td>`;
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += `<td class="black rnk_font fadeIn">P</td>`;
                    
                } else {

                    finalText += `<td class="white rnk_font fadeIn">&nbsp;</td>`; // &#9671;

                }
                
            } // END hideStatus
                
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += `<td colspan="2" title="Did Not Started" class="rnk_font">DNS</td>`;

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += `<td colspan="2" title="Did Not Finished" class="rnk_font">DNF</td>`;
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += `<td colspan="2" title="Disqualified" class="rnk_font">DSQ</td>`;
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += `<td colspan="2" title="Not Qualified" class="rnk_font">NQ</td>`;
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += `<td colspan="2" title="*" class="rnk_font">*</td>`;
                    
                } else if (allArray[l]["mst"] == 1 && show == 4) {
                    
                    finalText += `<td colspan="2" title="Exceeded Maximum Stage Time" class="rnk_font">MST</td>`;
                    
                } else if (allArray[l]["Id_Image"] == "_Status5" && show == 4) { // e2min
                    
                    finalText += `<td colspan="2" title="Exceeded 2 Minutes Separation" class="rnk_font">E2M</td>`;
                    
                } else if (allArray[l]["single"] == 1 && show == 4) {
                    
                    finalText += `<td colspan="2" title="Individual Finisher" class="rnk_font">IF1</td>`;
                    
                } else if (allArray[l]["single"] == 2 && show == 4) {
                    
                    finalText += `<td colspan="2" title="Individual Finisher" class="rnk_font">IF2</td>`;
                    
                } else if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image_2"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] != 0 || (show != 4 && ((show >= 1 && allArray[l]["Id_Inter1blue"] == 1) || (show >= 2 && allArray[l]["Id_Inter2blue"] == 1) || (show >= 3 && allArray[l]["Id_Inter3blue"] == 1)))) { // enable show != 4, to show postion only on finish
                
                    finalText += `<td class="rnk_font">&nbsp;</td>`; // dont show position if status or no finish time
                    finalText += `<td class="rnk_font">&nbsp;</td>`; // dont show position if status or no finish time
//                    
//                    if (cleanResults == 1) {
//
//                        finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show  postiion if status or no finish time
//                    }
                    
                } else {
                    finalText += `<td class="rnk_font bigFont fadeIn">${allArray[l]["Id_Position_Overall"]}</td>`; 
                    finalText += `<td class="rnk_font bigFont fadeIn ${catCol}">${allArray[l]["Id_Position_Categorie"]}</td>`;
                }

                // show all array key:value in the number title
                var keyValueLog = '';
                if (showLog == 1) {
                    for (var key in allArray[l]) {
                //      var value = allArray[l][key];
                        if ((key == "Id_Inter1" || key == "Id_Inter1_2" || key == "Id_Inter2" || key == "Id_Inter2_2" || key == "Id_Inter3" || key == "Id_Inter3_2") && allArray[l][key] != 99999999999) {
                            keyValueLog += `${key}: ${ms2TimeString(allArray[l][key])}  |  `;
                        } else {
                            keyValueLog += `${key}: ${allArray[l][key]}  |  `;
                        }
                    }
                }

                if (allArray[l]["oldBlue"] == 1) { // "Blue Board Rider"
                    finalText += `<td title="${keyValueLog}" class="rnk_font blueCard ${bigFont}">${allArray[l]["Id_Numero"]}</td>`;
                } else if (allArray[l]["leader"] == 1) { // "Epic Leader"
                    finalText += `<td title="${keyValueLog}" class="rnk_font ${leaderCard} ${bigFont}">${allArray[l]["Id_Numero"]}</td>`;
                } else {
                    finalText += `<td title="${keyValueLog}" class="rnk_font highlight ${bigFont}">${allArray[l]["Id_Numero"]}</td>`;
                }
                


/*                if (allArray[l]["oldBlue"] == 1) {
                    finalText += '<td title="Blue Board Rider" class="rnk_font blueCard"><div class="FirstLine">' + allArray[l]["Id_Numero_Full"] + '</div><div class="SecoundLine">' + allArray[l]["Id_Numero_Full_2"] + '</div></td>';
                } else if (allArray[l]["leader"] == 1) {
                    finalText += '<td title="Epic Leader" class="rnk_font ' + leaderCard + '"><div class="FirstLine">' + allArray[l]["Id_Numero_Full"] + '</div><div class="SecoundLine">' + allArray[l]["Id_Numero_Full_2"] + '</div></td>';
                } else {
*/                    

//                finalText += '<td class="rnk_font highlight"><div class="FirstLine ' + single2 + '">' + allArray[l]["Id_Numero_Full"] + '</div><div class="SecoundLine ' + single1 + '">' + allArray[l]["Id_Numero_Full_2"] + '</div></td>';
//                }

                   
                if (allArray[l]["Id_TpsCumule"] != 99999999999 && allArray[l]["Id_TpsCumule_2"] == 99999999999 /*&& cleanResults == 0 */&& allArray[l]["single"] == 0) { // only rider 1 finished at this point
                    finalText += `<td class="rnk_font left"><div class="FirstLine ${single2}"><span class="number">${allArray[l]["Id_Numero_Full"]}</span>${finished1} ${uci1} ${allArray[l]["Id_Nom"]}</span><span title="${allArray[l]["Id_Nationalite"]}" class="nation ${allArray[l]["Id_Nationalite"]} Flag"></span>${leader} ${markBlue}</div>`;// add the name
                    
                } else {
                    finalText += `<td class="rnk_font left"><div class="FirstLine ${single2}"><span class="number">${allArray[l]["Id_Numero_Full"]}</span><span class="name">${uci1} ${allArray[l]["Id_Nom"]}</span><span title="${allArray[l]["Id_Nationalite"]}" class="nation ${allArray[l]["Id_Nationalite"]} Flag"></span>${leader} ${markBlue}</div>`;// add the name
                }

                    
                    
                if (allArray[l]["Id_TpsCumule"] == 99999999999 && allArray[l]["Id_TpsCumule_2"] != 99999999999 && allArray[l]["single"] == 0) { // only rider 2 finished at this point
                    finalText += `<div class="SecoundLine ${single1}"><span class="number">${allArray[l]["Id_Numero_Full_2"]}</span>${finished2 + uci2} ${allArray[l]["Id_Nom_2"]}</span><span title="${allArray[l]["Id_Nationalite_2"]}" class="nation ${allArray[l]["Id_Nationalite_2"]} Flag"></span>${leader} ${markBlue}</div></td>`;// add the name
                    
                } else {
                    finalText += `<div class="SecoundLine ${single1}"><span class="number">${allArray[l]["Id_Numero_Full_2"]}</span><span class="name">${uci2} ${allArray[l]["Id_Nom_2"]}</span><span title="${allArray[l]["Id_Nationalite_2"]}" class="nation ${allArray[l]["Id_Nationalite_2"]} Flag"></span>${leader} ${markBlue}</div></td>`;// add the name
                }
                
                                     

/*
                if (typeof allArray[l]["Id_Equipe"] == 'undefined') {           
                    finalText += '<td class="rnk_font">&nbsp;</td>';// add team name
                } else {
                    finalText += '<td class="rnk_font left wrap"><div class="team">' + allArray[l]["Id_Equipe"] + '</div></td>';// add team name
                }
                
*/
                if (useCategory == "no") {
                    finalText += `<td class="rnk_font">${allArray[l]["Id_Categorie"]}</td>`; // add category
                }            


           //         finalText += '</div>';
                    
//                }
                
                
/*                if (cleanResults == 1) {
                                            
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full_2"] + '</td>'; // add rider 2 number

                    finalText += '<td class="rnk_font ' + single1 + '">' + allArray[l]["Id_Nom_2"]; // add the name
                    if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                        finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>'; // add flag
                    }
                    finalText += '</td>';// add the name
                    
            if (doNotShowTime == 0 && show == 4) {
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
*/                
      //          if (overTheTime == "yes") {
                // make color change FIXME
                
/*  this is the 3 option for timeGapDisplayInter, only "3" is implemented, DO NOT USE THE OTHERS.
 
            
// intermediate time 1
                if (timeGapDisplayInter == 1) {
                    if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // add intermediate time
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Inter1Time"] + '</td>'; // add intermediate time
                    }
        //          } else {
        //             finalText += '<td class="rnk_font">' + allArray[l]["Id_Inter1Time"] + '</td>'; // add intermediate time
        //         }
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Inter1Ecart1er"] + '</td>'; // add diff
                } else if (timeGapDisplayInter == 2) {
                    
                    if (allArray[l]["Id_Inter1blue"] == 1) {
                                                
                        finalText += '<td title="Blue Board Rider" class="rnk_font"><span class="Flag blueFlag"></span></td>'; // add intermediate blue

                    
                    } else if (imTheLeaderInter1 == 1) {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font"><span class="Flag numberOne"></span>' + allArray[l]["Id_Inter1Time"] + '</td>'; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter1Ecart1er"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add diff
                        } else {
                            finalText += '<td class="rnk_font">+' + allArray[l]["Id_Inter1Ecart1er"] + '</td>'; // add diff
                        }
                    }
                } else if (timeGapDisplayInter == 3) {
                    
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

                        if (allArray[l]["Id_Inter1Ecart1er"] == 99999999999) {
                            finalText += '<div>-</div></td>'; // add diff
                        } else {
                            finalText += '<div>+' + allArray[l]["Id_Inter1Ecart1er"] + '</div></td>'; // add diff
                        }
                    }
                }
// END intermediate 1              
*/
                
if (show == 4) {

// BEGIN intermediate 1
                    var title1 = '';
                    if (doNotShowTime == 0) {
                        if (allArray[l]["Id_Inter1"] != 99999999999 && allArray[l]["Id_Inter1_2"] != 99999999999) {
                            title1 = `${ms2TimeString(allArray[l]["Id_Inter1"])}\n${ms2TimeString(allArray[l]["Id_Inter1_2"])}`;

                        } else if (allArray[l]["Id_Inter1"] == 99999999999 && allArray[l]["Id_Inter1_2"] == 99999999999) {
                            title1 = `-\n-`;

                        } else if (allArray[l]["Id_Inter1"] == 99999999999 && allArray[l]["Id_Inter1_2"] != 99999999999) {
                            title1 = `-\n${ms2TimeString(allArray[l]["Id_Inter1_2"])}`;

                        } else if (allArray[l]["Id_Inter1"] != 99999999999 && allArray[l]["Id_Inter1_2"] == 99999999999) {
                            title1 = `${ms2TimeString(allArray[l]["Id_Inter1"])}\n-`;
                        }
                    }

                    if (allArray[l]["Id_Inter1blue"] == 1) {
                        
                         if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += `<td title="${title1}" class="rnk_font mobile"><span title="Blue Board Rider" class="Flag blueFlag"></span></td>`; // add intermediate blue
                        } else {
                            if (doNotShowTime == 0) {

                                finalText += `<td title="${title1}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter1Time"]}<span class="Flag blueFlag"></span></div>`; // add intermediate time
                            } else {
                                finalText += `<td title="${title1}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter1Time"]}<span title="Blue Board Rider" class="Flag blueFlag"></span></div>`; // add intermediate time
                            }

                            if (allArray[l]["Id_Inter1Ecart1er"] == 99999999999) {
                                finalText += '<div>-</div></td>'; // add diff
                            } else {
                                finalText += `<div>+${allArray[l]["Id_Inter1Ecart1er"]}<span class="Flag transparent"></span></div></td>`; // add diff
                            }
                            
                        }
                                                
                    
                    } else if (imTheLeaderInter1 == 1) {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += `<td title="${title1}" class="rnk_font mobile">-</td>`; // add intermediate time
                        } else {
                            finalText += `<td title="${title1}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter1Time"]}</div><span class="Flag numberOne"></span></td>`; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += `<td title="${title1}" class="rnk_font mobile"><div>-</div>`; // add intermediate time
                        } else {
                            finalText += `<td title="${title1}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter1Time"]}</div>`; // add intermediate time
                        }

                        if (allArray[l]["Id_Inter1Ecart1er"] == 99999999999) {
                            finalText += `<div>-</div></td>`; // add diff
                        } else {
                            finalText += `<div>+${allArray[l]["Id_Inter1Ecart1er"]}</div></td>`; // add diff
                        }
                    }
// END intermediate 1
                    
// BEGIN intermediate 2
                    var title2 = '';
                    if (doNotShowTime == 0) {
                        if (allArray[l]["Id_Inter2"] != 99999999999 && allArray[l]["Id_Inter2_2"] != 99999999999) {
                            title2 = `${ms2TimeString(allArray[l]["Id_Inter2"])}\n${ms2TimeString(allArray[l]["Id_Inter2_2"])}`;

                        } else if (allArray[l]["Id_Inter2"] == 99999999999 && allArray[l]["Id_Inter2_2"] == 99999999999) {
                            title2 = `-\n-`;

                        } else if (allArray[l]["Id_Inter2"] == 99999999999 && allArray[l]["Id_Inter2_2"] != 99999999999) {
                            title2 = `-\n${ms2TimeString(allArray[l]["Id_Inter2_2"])}`;

                        } else if (allArray[l]["Id_Inter2"] != 99999999999 && allArray[l]["Id_Inter2_2"] == 99999999999) {
                            title2 = `${ms2TimeString(allArray[l]["Id_Inter2"])}\n-`;
                        }
                    }

                    if (allArray[l]["Id_Inter2blue"] == 1) {
                                                
                        
                         if (allArray[l]["Id_Inter2Time"] == 99999999999) {
                            finalText += `<td title="${title2}" class="rnk_font mobile"><span title="Blue Board Rider" class="Flag blueFlag"></span></td>`; // add intermediate blue
                        } else {
                            if (doNotShowTime == 0) {

                                finalText += `<td title="${title2}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter2Time"]}<span class="Flag blueFlag"></span></div>`; // add intermediate time
                            } else {
                                finalText += `<td title="${title2}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter2Time"]}<span title="Blue Board Rider" class="Flag blueFlag"></span></div>`; // add intermediate time
                            }

                            if (allArray[l]["Id_Inter2Ecart1er"] == 99999999999) {
                                finalText += `<div>-</div></td>`; // add diff
                            } else {
                                finalText += `<div>+${allArray[l]["Id_Inter2Ecart1er"]}<span class="Flag transparent"></span></div></td>`; // add diff
                            }
                            
                        }
                    
                    } else if (imTheLeaderInter2 == 1) {
                        if (allArray[l]["Id_Inter2Time"] == 99999999999) {
                            finalText += `<td title="${title2}" class="rnk_font mobile">-</td>`; // add intermediate time
                        } else {
                            finalText += `<td title="${title2}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter2Time"]}</div><span class="Flag numberOne"></span></td>`; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter2Time"] == 99999999999) {
                            finalText += `<td title="${title2}" class="rnk_font mobile"><div>-</div>`; // add intermediate time
                        } else {
                            finalText += `<td title="${title2}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter2Time"]}</div>`; // add intermediate time
                        }

                        if (allArray[l]["Id_Inter2Ecart1er"] == 99999999999) {
                            finalText += `<div>-</div></td>`; // add diff
                        } else {
                            finalText += `<div>+${allArray[l]["Id_Inter2Ecart1er"]}</div></td>`; // add diff
                        }
                    }
// END intermediate 2
                    
// BEGIN intermediate 3
                    var title3 = '';
                    if (doNotShowTime == 0) {
                        if (allArray[l]["Id_Inter3"] != 99999999999 && allArray[l]["Id_Inter3_2"] != 99999999999) {
                            title3 = `${ms2TimeString(allArray[l]["Id_Inter3"])}\n${ms2TimeString(allArray[l]["Id_Inter3_2"])}`;

                        } else if (allArray[l]["Id_Inter3"] == 99999999999 && allArray[l]["Id_Inter3_2"] == 99999999999) {
                            title3 = `-\n-`;

                        } else if (allArray[l]["Id_Inter3"] == 99999999999 && allArray[l]["Id_Inter3_2"] != 99999999999) {
                            title3 = `-\n${ms2TimeString(allArray[l]["Id_Inter3_2"])}`;

                        } else if (allArray[l]["Id_Inter3"] != 99999999999 && allArray[l]["Id_Inter3_2"] == 99999999999) {
                            title3 = `${ms2TimeString(allArray[l]["Id_Inter3"])}\n-`;
                        }
                    }

                    if (allArray[l]["Id_Inter3blue"] == 1) {
                                                
                        
                         if (allArray[l]["Id_Inter3Time"] == 99999999999) {
                            finalText += `<td title="${title3}" class="rnk_font mobile"><span title="Blue Board Rider" class="Flag blueFlag"></span></td>`; // add intermediate blue
                        } else {
                            if (doNotShowTime == 0) {

                                finalText += `<td title="${title3}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter3Time"]}<span class="Flag blueFlag"></span></div>`; // add intermediate time
                            } else {
                                finalText += `<td title="${title3}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter3Time"]}<span title="Blue Board Rider" class="Flag blueFlag"></span></div>`; // add intermediate time
                            }

                            if (allArray[l]["Id_Inter3Ecart1er"] == 99999999999) {
                                finalText += `<div>-</div></td>`; // add diff
                            } else {
                                finalText += `<div>+${allArray[l]["Id_Inter3Ecart1er"]}<span class="Flag transparent"></span></div></td>`; // add diff
                            }
                            
                        }
                    
                    } else if (imTheLeaderInter3 == 1) {
                        if (allArray[l]["Id_Inter3Time"] == 99999999999) {
                            finalText += `<td title="${title3}" class="rnk_font mobile">-</td>`; // add intermediate time
                        } else {
                            finalText += `<td title="${title3}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter3Time"]}</div><span class="Flag numberOne"></span></td>`; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter3Time"] == 99999999999) {
                            finalText += `<td title="${title3}" class="rnk_font mobile"><div>-</div>`; // add intermediate time
                        } else {
                            finalText += `<td title="${title3}" class="rnk_font mobile"><div class="bold">${allArray[l]["Id_Inter3Time"]}</div>`; // add intermediate time
                        }

                        if (allArray[l]["Id_Inter3Ecart1er"] == 99999999999) {
                            finalText += `<div>-</div></td>`; // add diff
                        } else {
                            finalText += `<div>+${allArray[l]["Id_Inter3Ecart1er"]}</div></td>`; // add diff
                        }
                    }
// END intermediate 3

    
}

// individual time
            if (doNotShowTime == 0 && show == 1) {
                
                if (allArray[l]["Id_Inter1"] == 99999999999) {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">-</div>`; // add time
                } else {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">${ms2TimeString(allArray[l]["Id_Inter1"])}</div>`; // add time
                }
                
                  if (allArray[l]["Id_Inter1_2"] == 99999999999) {
                    finalText += `<div class="SecoundLine">-</div></td>`; // add time
                } else {
                    finalText += `<div class="SecoundLine">${ms2TimeString(allArray[l]["Id_Inter1_2"])}</div></td>`; // add time
                }
            }

            if (doNotShowTime == 0 && show == 2) {
                
                if (allArray[l]["Id_Inter2"] == 99999999999) {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">-</div>`; // add time
                } else {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">${ms2TimeString(allArray[l]["Id_Inter2"])}</div>`; // add time
                }
                
                  if (allArray[l]["Id_Inter2_2"] == 99999999999) {
                    finalText += `<div class="SecoundLine">-</div></td>`; // add time
                } else {
                    finalText += `<div class="SecoundLine">${ms2TimeString(allArray[l]["Id_Inter2_2"])}</div></td>`; // add time
                }
            }

            if (doNotShowTime == 0 && show == 3) {
                
                if (allArray[l]["Id_Inter3"] == 99999999999) {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">-</div>`; // add time
                } else {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">${ms2TimeString(allArray[l]["Id_Inter3"])}</div>`; // add time
                }
                
                  if (allArray[l]["Id_Inter3_2"] == 99999999999) {
                    finalText += `<div class="SecoundLine">-</div></td>`; // add time
                } else {
                    finalText += `<div class="SecoundLine">${ms2TimeString(allArray[l]["Id_Inter3_2"])}</div></td>`; // add time
                }
            }
            
            if (doNotShowTime == 0 && show == 4) {
                
                if (allArray[l]["Id_TpsCumule"] == 99999999999) {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">-</div>`; // add time
                } else {
                    finalText += `<td class="rnk_font"><div class="FirstLine ${single2}">${allArray[l]["Id_TpsCumule"]}</div>`; // add time
                }
                
                  if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                    finalText += `<div class="SecoundLine">-</div></td>`; // add time
                } else {
                    finalText += `<div class="SecoundLine">${allArray[l]["Id_TpsCumule_2"]}</div></td>`; // add time
                }
            }          


// TOTAL TIME & GAP                
                
                if (timeGapDisplay == 1) {
                    if (allArray[l]["Id_Sector_FinishTime"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // add total time
                    } else {
                        finalText += '<td class="rnk_font bold">' + allArray[l]["Id_Sector_FinishTime"] + '</td>'; // add total time
                    }
        //          } else {
        //             finalText += '<td class="rnk_font">' + allArray[l]["Id_Sector_FinishTime"] + '</td>'; // add total time
        //         }

    
                    if (allArray[l]["Id_Sector_Ecart1er"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // add diff
                    } else {
                        finalText += '<td class="rnk_font">+' + allArray[l]["Id_Sector_Ecart1er"] + '</td>'; // add diff
                    }
        
        
        
        
                } else if (timeGapDisplay == 2) {
                    if ((allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") || (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no")) {
                        if (allArray[l]["Id_Sector_FinishTime"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font bold">' + allArray[l]["Id_Sector_FinishTime"] + '</td>'; // add total time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Sector_Ecart1er"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add diff
                        } else {
                            finalText += '<td class="rnk_font">+' + allArray[l]["Id_Sector_Ecart1er"] + '</td>'; // add diff
                        }
                    }
                } else if (timeGapDisplay == 3) {
                    if ((allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") || (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no")) {
                        if (allArray[l]["Id_Sector_FinishTime"] == 99999999999) {
                            finalText += `<td class="rnk_font">-</td>`; // add total time
                        } else if (allArray[l]["e2min"] == 1 && show == 4) {
                            if (doNotShowTime == 0) {
                                finalText += `<td class="rnk_font"><div class="bold">${allArray[l]["Id_Sector_FinishTime"]}<span title="${allArray[l]["Id_TpsCumule"]}\n${allArray[l]["Id_TpsCumule_2"]}" class="Flag blueFlag"></span></div></td>`; // add total time
                            } else {
                                finalText += `<td class="rnk_font"><div class="bold">${allArray[l]["Id_Sector_FinishTime"]}<span class="Flag blueFlag"></span></div></td>`; // add total time
                            }
                        } else {
                            finalText += `<td class="rnk_font"><div class="bold">${allArray[l]["Id_Sector_FinishTime"]}</div></td>`; // add total time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Sector_FinishTime"] == 99999999999) {
                            finalText += `<td class="rnk_font"><div>-</div>`; // add total time
                        } else if (allArray[l]["e2min"] == 1 && show == 4) {
                            if (doNotShowTime == 0) {
                                finalText += `<td class="rnk_font"><div class="bold">${allArray[l]["Id_Sector_FinishTime"]}<span title="${allArray[l]["Id_TpsCumule"]}\n${allArray[l]["Id_TpsCumule_2"]}" class="Flag blueFlag"></div>`; // add total time
                            } else {
                                finalText += `<td class="rnk_font"><div class="bold">${allArray[l]["Id_Sector_FinishTime"]}<span class="Flag blueFlag"></div>`; // add total time
                            }
                        } else {
                            finalText += `<td class="rnk_font"><div class="bold">${allArray[l]["Id_Sector_FinishTime"]}</div>`; // add total time
                        }

                        if (allArray[l]["Id_Sector_Ecart1er"] == 99999999999) {
                            finalText += `<div>-</div></td>`; // add diff
                        } else {
                            if (allArray[l]["e2min"] == 1 && show == 4) {
                                finalText += `<div>+${allArray[l]["Id_Sector_Ecart1er"]}<span class="Flag transparent"></span></div></td>`; // add diff
                            } else {
                                finalText += `<div>+${allArray[l]["Id_Sector_Ecart1er"]}</div></td>`; // add diff
                            }
                        }
                    }
                }
                
                
        //       }

                
      //      }    

                    finalText += `</tr>`;
                   
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
 



 } // END MAIN TABLE DATA
 
 
 
 
 
 
 
 // DATA cleanResults = 1
 
    if (cleanResults == 1) { 
        if (singleLine == 1) {
        
// add category name header and table header
            if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0 && catcat == 'None') { // add table end tag
                    finalText += `</table>`;
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
                            
                finalText += `<table class="${tableClass} line_color"><tr><td colspan="99" class="title_font">${allArray[l]["Id_Categorie"]}</td></tr>${headerText1}`;                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerText1;
                    finalText += `<tr><td colspan="99" class="title_font">Overall</td></tr>${headerText1}`;
            }
            
            
            
            if (l % 2 == 0) { // start building competitor line
                finalText += `<tr class="${positionChanged} rnk_bkcolor OddRow">`;
            } else {
                finalText += `<tr class="${positionChanged} rnk_bkcolor EvenRow">`;
            }
        
                 

// allArray[l]["Id_Arrow"]                    
// 0 ''

// 3 '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'
// 4 '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'

// 7 'P'                    
// 8 '<img class="dnsfq" src="Images/_status.svg" alt="status">'                    
// 9 '<img class="dnsfq" src="Images/_nq.svg" alt="nq">'
// 10 '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">'
// 11 '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">'
// 12 '<img class="dnsfq" src="Images/_dns.svg" alt="dns">'                    
                
                
                if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image_2"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] != 0) {
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // don't show position if status or no finish time
                    //allArray[l]["Id_Position_Categorie"] = 0; // for upload json, not needed, its for third party FIXME wrong place needs to move up to clean results 0

                    finalText += '<td class="rnk_font">&nbsp;</td>'; // don't show  position if status or no finish time
                    //allArray[l]["Id_Position_Overall"] = 0; // for upload json, not needed, its for third party FIXME wrong place needs to move up to clean results 0
                    
                } else {
                        
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; // overall position
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; // category position
                    
                }

                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>'; // Nr
       
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; // CAT
                }
                
                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += '<td class="rnk_font">DNS</td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td class="rnk_font">DNF</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td class="rnk_font">DSQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td class="rnk_font">NQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td class="rnk_font">*</td>';
                    
                } else if (showBlue == 1) {
                
                    finalText += '<td class="rnk_font">Blue</td>';

                } else if (checkeredFlag == "finished" && allArray[l]["Id_Position_Categorie"] == 1) { // leader
                    
                    finalText += '<td class="rnk_font">Leader</td>';
                    
                } else if (allArray[l]["single"] == 1 && checkeredFlag == "finished") {
                    
                    finalText += '<td class="rnk_font">IF1</td>'; // single finished
                    
                } else if (allArray[l]["single"] == 2 && checkeredFlag == "finished") {
                    
                    finalText += '<td class="rnk_font">IF2</td>'; // single finished
                    
                } else if (checkeredFlag == "finished") { // finished
                    
                    finalText += '<td class="rnk_font">Finished</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td class="rnk_font">Penalty</td>';
                    
                } else {

                    finalText += '<td class="rnk_font">&nbsp;</td>';

                }

                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Groupe"].replace(/u/g, '').replace('d', 'DSQ').replace('l', 'Leader').replace('b', 'Blue').replace('s', 'IF').replace(/[0-9]/g, '') + '</td>'; // status
                
                        
                finalText += '<td class="rnk_font ' + single1 + '">' + allArray[l]["Id_Numero_Full"] + '</td>'; // Rider 1 Nr
                
                finalText += '<td class="rnk_font left ' + single1 + '">' + allArray[l]["Id_Nom"] + '</td>'; // Rider 1
                
                finalText += '<td class="rnk_font ' + single1 + '">' + allArray[l]["Id_Nationalite"] + '</td>'; // Nation
                
                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
                 
                finalText += '<td class="rnk_font ' + single2 + '">' + allArray[l]["Id_Numero_Full_2"] + '</td>'; // Rider 2 Nr
                
                finalText += '<td class="rnk_font left ' + single2 + '">' + allArray[l]["Id_Nom_2"] + '</td>'; // Rider 2
                
                finalText += '<td class="rnk_font ' + single2 + '">' + allArray[l]["Id_Nationalite_2"] + '</td>'; // Nation
                
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Equipe"] + '</td>'; // Team

                if (doNotShowTime == 0) {
                    if (allArray[l]["Id_TpsCumule"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // Time Rider 1
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule"] + '</td>'; // Time Rider 1
                    }
                    if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // Time Rider 2
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule_2"] + '</td>'; // Time Rider 2
                    }
                }
                
                    if (allArray[l]["Id_FinishTime"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // time
                    } else {
                        finalText += '<td class="rnk_font bold">' + allArray[l]["Id_FinishTime"] + '</td>'; // time
                    }
                
//                if (timeGapDisplay == 1) {
                    if (allArray[l]["Id_Ecart1er"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // Gap
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>'; // Gap
                    }
//                }
                
                finalText += '</tr>';

        } else {

// first rider                
        
// add category name header and table header
            if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0 && catcat == 'None') { // add table end tag
                    finalText += `</table>`;
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
                            
                finalText += `<table class="${tableClass} line_color"><tr><td colspan="99" class="title_font">${allArray[l]["Id_Categorie"]}</td></tr>${headerText1}`;                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerText1;
                    finalText += `<tr><td colspan="99" class="title_font">Overall</td></tr>${headerText1}`;
            }
            
            
            
            if (l % 2 == 0) { // start building competitor line
                finalText += `<tr class="${positionChanged} rnk_bkcolor OddRow">`;
            } else {
                finalText += `<tr class="${positionChanged} rnk_bkcolor EvenRow">`;
            }
        
                 

// allArray[l]["Id_Arrow"]                    
// 0 ''

// 3 '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'
// 4 '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'

// 7 'P'                    
// 8 '<img class="dnsfq" src="Images/_status.svg" alt="status">'                    
// 9 '<img class="dnsfq" src="Images/_nq.svg" alt="nq">'
// 10 '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">'
// 11 '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">'
// 12 '<img class="dnsfq" src="Images/_dns.svg" alt="dns">'                    
                
                
                if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image_2"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] != 0) {
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // don't show position if status or no finish time
                    //allArray[l]["Id_Position_Categorie"] = 0; // for upload json, not needed, its for third party FIXME wrong place needs to move up to clean results 0

                    finalText += '<td class="rnk_font">&nbsp;</td>'; // don't show  position if status or no finish time
                    //allArray[l]["Id_Position_Overall"] = 0; // for upload json, not needed, its for third party FIXME wrong place needs to move up to clean results 0
                    
                } else {
                        
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; // overall position
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; // category position
                    
                }

                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero_Full"] + '</td>'; // No
       
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; // CAT
                }
                
                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += '<td class="rnk_font">DNS</td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td class="rnk_font">DNF</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td class="rnk_font">DSQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td class="rnk_font">NQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td class="rnk_font">*</td>';
                    
                } else if (showBlue == 1) {
                
                    finalText += '<td class="rnk_font">Blue</td>';

                } else if (checkeredFlag == "finished" && allArray[l]["Id_Position_Categorie"] == 1) { // leader
                    
                    finalText += '<td class="rnk_font">Leader</td>';
                    
                } else if (allArray[l]["single"] == 2 && checkeredFlag == "finished") {
                    
                    finalText += '<td class="rnk_font">IF2</td>'; // single finished
                    
                } else if (allArray[l]["single"] == 1 && checkeredFlag == "finished") {
                    
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // single finished
                    
                } else if (checkeredFlag == "finished") { // finished
                    
                    finalText += '<td class="rnk_font">Finished</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td class="rnk_font">Penalty</td>';
                    
                } else {

                    finalText += '<td class="rnk_font">&nbsp;</td>';

                }

                finalText += '<td class="rnk_font">' + allArray[l]["Id_Groupe"].replace(/u/g, '').replace('d', 'DSQ').replace('l', 'Leader').replace('b', 'Blue').replace('s1', 'IF1').replace('s2', 'IF2').replace(/[0-9]/g, '') + '</td>'; // status
                
                        
                
                finalText += '<td class="rnk_font left ' + single1 + '">' + allArray[l]["Id_Nom"] + '</td>'; // Rider 1
                
                finalText += '<td class="rnk_font ' + single1 + '">' + allArray[l]["Id_Nationalite"] + '</td>'; // Nation
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Equipe"] + '</td>'; // Team

                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
                 
                
                if (doNotShowTime == 0) {
                    if (allArray[l]["Id_TpsCumule"] == 99999999999 || allArray[l]["single"] == 1) {
                        finalText += '<td class="rnk_font">-</td>'; // Time Rider 1
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule"] + '</td>'; // Time Rider 1
                    }
                }
                
                    if (allArray[l]["Id_FinishTime"] == 99999999999 || allArray[l]["single"] == 1) {
                        finalText += '<td class="rnk_font">-</td>'; // time
                    } else {
                        finalText += '<td class="rnk_font bold">' + allArray[l]["Id_FinishTime"] + '</td>'; // time
                    }
                
//                if (timeGapDisplay == 1) {
                    if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["single"] == 1) {
                        finalText += '<td class="rnk_font">-</td>'; // Gap
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>'; // Gap
                    }
//                }
                
                finalText += '</tr>';


                
                
                
// secound rider                
                
                
            
            if (l % 2 == 0) { // start building competitor line
                finalText += `<tr class="${positionChanged} rnk_bkcolor OddRow">`;
            } else {
                finalText += `<tr class="${positionChanged} rnk_bkcolor EvenRow">`;
            }
        
                 

// allArray[l]["Id_Arrow"]                    
// 0 ''

// 3 '<img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places">'
// 4 '<img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">'

// 7 'P'                    
// 8 '<img class="dnsfq" src="Images/_status.svg" alt="status">'                    
// 9 '<img class="dnsfq" src="Images/_nq.svg" alt="nq">'
// 10 '<img class="dnsfq" src="Images/_dsq.svg" alt="dsq">'
// 11 '<img class="dnsfq" src="Images/_dnf.svg" alt="dnf">'
// 12 '<img class="dnsfq" src="Images/_dns.svg" alt="dns">'                    
                
                
                if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Image_2"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] != 0) {
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // don't show position if status or no finish time
                    //allArray[l]["Id_Position_Categorie"] = 0; // for upload json, not needed, its for third party FIXME wrong place needs to move up to clean results 0

                    finalText += '<td class="rnk_font">&nbsp;</td>'; // don't show  position if status or no finish time
                    //allArray[l]["Id_Position_Overall"] = 0; // for upload json, not needed, its for third party FIXME wrong place needs to move up to clean results 0
                    
                } else {
                        
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; // overall position
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; // category position
                    
                }

                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero_Full_2"] + '</td>'; // Nr
       
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; // CAT
                }
                
                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += '<td class="rnk_font">DNS</td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td class="rnk_font">DNF</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td class="rnk_font">DSQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td class="rnk_font">NQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td class="rnk_font">*</td>';
                    
                } else if (showBlue == 1) {
                
                    finalText += '<td class="rnk_font">Blue</td>';

                } else if (checkeredFlag == "finished" && allArray[l]["Id_Position_Categorie"] == 1) { // leader
                    
                    finalText += '<td class="rnk_font">Leader</td>';
                    
                } else if (allArray[l]["single"] == 1 && checkeredFlag == "finished") {
                    
                    finalText += '<td class="rnk_font">IF1</td>'; // single finished
                    
                } else if (allArray[l]["single"] == 2 && checkeredFlag == "finished") {
                    
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // single finished
                    
                } else if (checkeredFlag == "finished") { // finished
                    
                    finalText += '<td class="rnk_font">Finished</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td class="rnk_font">Penalty</td>';
                    
                } else {

                    finalText += '<td class="rnk_font">&nbsp;</td>';

                }

                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Groupe"].replace(/u/g, '').replace('d', 'DSQ').replace('l', 'Leader').replace('b', 'Blue').replace('s1', 'IF1').replace('s2', 'IF2').replace(/[0-9]/g, '') + '</td>'; // status
                        
                 
                
                finalText += '<td class="rnk_font left ' + single2 + '">' + allArray[l]["Id_Nom_2"] + '</td>'; // Rider 2
                
                finalText += '<td class="rnk_font ' + single2 + '">' + allArray[l]["Id_Nationalite_2"] + '</td>'; // Nation
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Equipe"] + '</td>'; // Team

                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
                
                if (doNotShowTime == 0) {
                    if (allArray[l]["Id_TpsCumule_2"] == 99999999999 || allArray[l]["single"] == 2) {
                        finalText += '<td class="rnk_font">-</td>'; // Time Rider 2
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_TpsCumule_2"] + '</td>'; // Time Rider 2
                    }
                }
                
                    if (allArray[l]["Id_FinishTime"] == 99999999999 || allArray[l]["single"] == 2) {
                        finalText += '<td class="rnk_font">-</td>'; // time
                    } else {
                        finalText += '<td class="rnk_font bold">' + allArray[l]["Id_FinishTime"] + '</td>'; // time
                    }
                
//                if (timeGapDisplay == 1) {
                    if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["single"] == 2) {
                        finalText += '<td class="rnk_font">-</td>'; // Gap
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>'; // Gap
                    }
//                }
                
                finalText += '</tr>';
            
        }
    
    }
// END DATA cleanResults = 1

 
 
 
 



if ((epictv == 1 && ((allArray[l]["Id_Position_Categorie"] <= rows && useCategory == "yes") || (allArray[l]["Id_Position_Overall"] <= rows && useCategory == "no")) && allArray[l]["Id_Sector_FinishTime"] != 99999999999 && allArray[l]["single"] == 0 && allArray[l]["Id_Status"] == 0 && showBlue == 0 && allArray[l]["oldBlue"] == 0) && ((catcat != "None" && allArray[l]["Id_Categorie"] == catcat && useCategory == "yes") || (catcat == "None" && useCategory == "yes") || useCategory == "no")) { // TV show only 5 competitors
    
    
    
 // HEADER for tv            
                            
        TVheaderText1 = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Sector_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

        
                    TVheaderText1 += '<th class="rnkh_font Id_Position">Rank</th>';
                    TVheaderText1 += '<th class="rnkh_font left Id_Nom">Name</th>';
                    TVheaderText1 += '<th class="rnkh_font Id_Nationalite">Nation</th>';
                    TVheaderText1 += '<th class="rnkh_font Id_Numero">No</th>';
                    TVheaderText1 += '<th class="rnkh_font Id_Sector_FinishTime">Time</th>'; // combined time

                  
        TVheaderText1 += '</tr>';
        
       //    console.log(TVheaderText1);

// END HEADER for tv
   
   
    
            // add category name header and table header
            if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + TVheaderText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0 && catcat == 'None') { // add table end tag
                    finalText += '<tr><td style="text-align: right; padding-right: 0;" colspan="99"><img  style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></td></tr>';
                    finalText += '</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
//                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + TVheaderText1 + '\n';                
                            
                finalText += `<table class="${tableClass} line_color">`;
                
                if (showTvHeader == 1) {
                    finalText += `<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/${allArray[l]["Id_Categorie"].replace(" ", "").toLowerCase()}.svg"></div><div class="subHeader">Results at ${showFull}</div></td></tr>`;
                }
                
                finalText += TVheaderText1 + '\n';

                
                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
                
                if (showTvHeader == 1) {
                    finalText += `<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/gc.svg"></div><div class="subHeader">Results at ${showFull}</div></td></tr>`;
                }
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + TVheaderText1;
                finalText += TVheaderText1 + '\n';
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
                
                finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom"] + ' / ' + allArray[l]["Id_Nom_2"] + ' ' + leader + '</td>'; // add riders name
                
                finalText += '<td class="rnk_font"><span class="Flag tv ' + allArray[l]["Id_Nationalite"] + '"></span>' + ' ' + '<span class="Flag tv ' + allArray[l]["Id_Nationalite_2"] + '"></span></td>'; // add flags

                finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero"] + '</td>'; // add number
                

                    if ((allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") || (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no")) {
                        if (allArray[l]["Id_Sector_FinishTime"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font">' + allArray[l]["Id_Sector_FinishTime"] + '</td>'; // add total time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Sector_Ecart1er"] == 99999999999) {
                            finalText += '<td class="rnk_font">-</td>'; // add diff
                        } else {
                            finalText += '<td class="rnk_font">+' + allArray[l]["Id_Sector_Ecart1er"] + '</td>'; // add diff
                        }
                    }

                
        finalText += '</tr>\n';
    
} // end TV

                
// update competitor previous overall and category position array
                
        positionArray_All_Cat[allArray[l]["Id_Numero"]] = [0, 0];

        if (typeof allArray[l]["Id_Position_Overall"] != 0) {
            positionArray_All_Cat[allArray[l]["Id_Numero"]][0] = allArray[l]["Id_Position_Overall"];
        } 
        if (typeof allArray[l]["Id_Position_Categorie"] != 0) {
            positionArray_All_Cat[allArray[l]["Id_Numero"]][1] = allArray[l]["Id_Position_Categorie"];
        } 

//console.log(positionArray_All_Cat[allArray[l]["Id_Numero"]]);

//console.log("all "+positionArray_All_Cat[allArray[l]["Id_Numero"]][0]);
// console.log("pos "+positionArray_All_Cat[allArray[l]["Id_Numero"]][1]);


/*
// TEST create array without keys to minimize size of sending data

if (l == 0) {
    var result = Object.keys(allArray[l]).map(function(key) {
    return key;
    });
allArrayMinimized.push(result);
    
}
var result = Object.keys(allArray[l]).map(function(key) {
  return allArray[l][key];
});

allArrayMinimized.push(result);


// END TEST

*/

if (enableJ1 == 1) {
// get flag image src, DayTime, ElapsedTime, RemainingTime from header

    if (cleanResults == 0) {
        var headerFlag = (div.getElementsByTagName("img"))[0].getAttribute("src");
        if (raceEnded == 1) {
            headerFlag = '_CheckeredFlag.png';
            
        }

        var div1 = document.createElement("div");  
        div1.innerHTML = HeaderName[1]; 
        var header2 = div1.getElementsByTagName("span");
   
        var DayTime =  header2[0].textContent || div.innerText || "";
        var ElapsedTime =  header2[1].textContent || div.innerText || "";
        var RemainingTime =  header2[2].textContent || div.innerText || "";

// order the array for JSON.stringify
        

            if (allArray[l]["Id_Arrow"] == 3 || allArray[l]["Id_Arrow"] == 4) { // delete arrow postion as it messes in remote
                allArray[l]["Id_Arrow"] = 0;
            }
            
            if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                allArray[l]["Id_Inter1Time"] = 0;
            } else {
                allArray[l]["Id_Inter1Time"] = timeString2ms(allArray[l]["Id_Inter1Time"]);
            }
            if (allArray[l]["Id_Inter2Time"] == 99999999999) {
                allArray[l]["Id_Inter2Time"] = 0;
            } else {
                allArray[l]["Id_Inter2Time"] = timeString2ms(allArray[l]["Id_Inter2Time"]);
            }
            if (allArray[l]["Id_Inter3Time"] == 99999999999) {
                allArray[l]["Id_Inter3Time"] = 0;
            } else {
                allArray[l]["Id_Inter3Time"] = timeString2ms(allArray[l]["Id_Inter3Time"]);
            }
            if (allArray[l]["Id_FinishTime"] == 99999999999) {
                allArray[l]["Id_FinishTime"] = 0;
            } else {
                allArray[l]["Id_FinishTime"] = timeString2ms(allArray[l]["Id_FinishTime"]);
            }
            if (allArray[l]["Id_Ecart1er"] == 99999999999) {
                allArray[l]["Id_Ecart1er"] = 0;
            } else {
                allArray[l]["Id_Ecart1er"] = timeString2ms(allArray[l]["Id_Ecart1er"]);
            }
            if (allArray[l]["Id_Inter1Ecart1er"] == 99999999999) {
                allArray[l]["Id_Inter1Ecart1er"] = 0;
            } else {
                allArray[l]["Id_Inter1Ecart1er"] = timeString2ms(allArray[l]["Id_Inter1Ecart1er"]);
            }
            if (allArray[l]["Id_Inter2Ecart1er"] == 99999999999) {
                allArray[l]["Id_Inter2Ecart1er"] = 0;
            } else {
                allArray[l]["Id_Inter2Ecart1er"] = timeString2ms(allArray[l]["Id_Inter2Ecart1er"]);
            }
            if (allArray[l]["Id_Inter3Ecart1er"] == 99999999999) {
                allArray[l]["Id_Inter3Ecart1er"] = 0;
            } else {
                allArray[l]["Id_Inter3Ecart1er"] = timeString2ms(allArray[l]["Id_Inter3Ecart1er"]);
            }
            if (allArray[l]["Inter1Ecart1erCategory"] == 99999999999) {
                allArray[l]["Inter1Ecart1erCategory"] = 0;
            } else {
                allArray[l]["Inter1Ecart1erCategory"] = timeString2ms(allArray[l]["Inter1Ecart1erCategory"]);
            }
            if (allArray[l]["Inter2Ecart1erCategory"] == 99999999999) {
                allArray[l]["Inter2Ecart1erCategory"] = 0;
            } else {
                allArray[l]["Inter2Ecart1erCategory"] = timeString2ms(allArray[l]["Inter2Ecart1erCategory"]);
            }
            if (allArray[l]["Inter3Ecart1erCategory"] == 99999999999) {
                allArray[l]["Inter3Ecart1erCategory"] = 0;
            } else {
                allArray[l]["Inter3Ecart1erCategory"] = timeString2ms(allArray[l]["Inter3Ecart1erCategory"]);
            }
            if (allArray[l]["FinishEcart1erCategory"] == 99999999999) {
                allArray[l]["FinishEcart1erCategory"] = 0;
            } else {
                allArray[l]["FinishEcart1erCategory"] = timeString2ms(allArray[l]["FinishEcart1erCategory"]);
            }
            if (allArray[l]["Id_TpsCumule"] == 99999999999) {
                allArray[l]["Id_TpsCumule"] = 0;
            } else {
                allArray[l]["Id_TpsCumule"] = timeString2ms(allArray[l]["Id_TpsCumule"]);
            }
            if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                allArray[l]["Id_TpsCumule_2"] = 0;
            } else {
                allArray[l]["Id_TpsCumule_2"] = timeString2ms(allArray[l]["Id_TpsCumule_2"]);
            }
  

        delete allArray[l].Id_Discipline;
        delete allArray[l].Id_Inter1;
        delete allArray[l].Id_Inter1_2;
        delete allArray[l].Id_Inter2;
        delete allArray[l].Id_Inter2_2;
        delete allArray[l].Id_Inter3;
        delete allArray[l].Id_Inter3_2;
        delete allArray[l].Id_PenaliteNbTour;
        delete allArray[l].Id_PenalitePosition;
        delete allArray[l].Id_PenaliteTpsCumule;
        delete allArray[l].Id_Position;
        delete allArray[l].Id_PositionCategorie;
        delete allArray[l].Id_TpsTour;
        delete allArray[l].Id_TpsTour1;
        delete allArray[l].Id_TpsTour2;
        delete allArray[l].Id_TpsTour3;
        delete allArray[l].Id_TpsTour4;
        delete allArray[l].Id_TpsTour5;
        delete allArray[l].Id_TpsTour6;
        delete allArray[l].Id_Sector_FinishTime;
        delete allArray[l].Id_Sector_Ecart1er;
        delete allArray[l].oldBlue; // will be phrased on remote from Id_Groupe
        delete allArray[l].leader; // will be phrased on remote from Id_Groupe
        delete allArray[l].single; // will be phrased on remote from Id_Groupe
        delete allArray[l].uci; // will be phrased on remote from Id_Groupe
        delete allArray[l].Id_Numero_Full_2;
        delete allArray[l].Id_Numero_Full;
        delete allArray[l].Id_Status;
        delete allArray[l].Id_Statusi1;
        delete allArray[l].Id_Statusi2;
        delete allArray[l].Id_Statusi3;
        delete allArray[l].Id_Canal;
        delete allArray[l].Id_Canal_2;
        delete allArray[l].e2min;
        
        
        allArray[l].B = allArray[l].blue; // needed for total
        delete allArray[l].blue;
        allArray[l].T = allArray[l].Id_TpsCumule;
        delete allArray[l].Id_TpsCumule;
        allArray[l].TT = allArray[l].Id_TpsCumule_2;
        delete allArray[l].Id_TpsCumule_2;

        allArray[l].PC = allArray[l].Id_Position_Categorie; // needed only for third party
        delete allArray[l].Id_Position_Categorie;
        allArray[l].PO = allArray[l].Id_Position_Overall; // needed only for third party
        delete allArray[l].Id_Position_Overall;
        
        allArray[l].NA2 = allArray[l].Id_Nationalite_2;
        delete allArray[l].Id_Nationalite_2;
        allArray[l].NA = allArray[l].Id_Nationalite;
        delete allArray[l].Id_Nationalite;
        
        allArray[l].C = allArray[l].Id_Categorie;
        delete allArray[l].Id_Categorie;
        allArray[l].E = allArray[l].Id_Ecart1er;
        delete allArray[l].Id_Ecart1er;
        allArray[l].EC = allArray[l].FinishEcart1erCategory;
        delete allArray[l].FinishEcart1erCategory;
        allArray[l].Q = allArray[l].Id_Equipe;
        delete allArray[l].Id_Equipe;


        allArray[l].F = allArray[l].Id_FinishTime;
        delete allArray[l].Id_FinishTime;
        allArray[l].FB = allArray[l].Id_Finishblue;
        delete allArray[l].Id_Finishblue;
        
        allArray[l].T1 = allArray[l].Id_Inter1Time;
        delete allArray[l].Id_Inter1Time;
        allArray[l].E1 = allArray[l].Id_Inter1Ecart1er;
        delete allArray[l].Id_Inter1Ecart1er;
        allArray[l].E1C = allArray[l].Inter1Ecart1erCategory;
        delete allArray[l].Inter1Ecart1erCategory;
        allArray[l].B1 = allArray[l].Id_Inter1blue;
        delete allArray[l].Id_Inter1blue;
        allArray[l].T2 = allArray[l].Id_Inter2Time;
        delete allArray[l].Id_Inter2Time;
        allArray[l].E2 = allArray[l].Id_Inter2Ecart1er;
        delete allArray[l].Id_Inter2Ecart1er;
        allArray[l].E2C = allArray[l].Inter2Ecart1erCategory;
        delete allArray[l].Inter2Ecart1erCategory;
        allArray[l].B2 = allArray[l].Id_Inter2blue;
        delete allArray[l].Id_Inter2blue;
         allArray[l].T3 = allArray[l].Id_Inter3Time;
        delete allArray[l].Id_Inter3Time;
        allArray[l].E3 = allArray[l].Id_Inter3Ecart1er;
        delete allArray[l].Id_Inter3Ecart1er;
        allArray[l].E3C = allArray[l].Inter3Ecart1erCategory;
        delete allArray[l].Inter3Ecart1erCategory;
        allArray[l].B3 = allArray[l].Id_Inter3blue;
        delete allArray[l].Id_Inter3blue;
   
        allArray[l].FC = allArray[l].fPosition_Categorie;
        delete allArray[l].fPosition_Categorie;
        allArray[l].FO = allArray[l].fPosition_Overall;
        delete allArray[l].fPosition_Overall;
        allArray[l].FI = allArray[l].findex;
        delete allArray[l].findex;
        allArray[l].I1C = allArray[l].i1Position_Categorie;
        delete allArray[l].i1Position_Categorie;
        allArray[l].I1O = allArray[l].i1Position_Overall;
        delete allArray[l].i1Position_Overall;
        allArray[l].I1 = allArray[l].i1index;
        delete allArray[l].i1index;
        allArray[l].I2C = allArray[l].i2Position_Categorie;
        delete allArray[l].i2Position_Categorie;
        allArray[l].I2O = allArray[l].i2Position_Overall;
        delete allArray[l].i2Position_Overall;
        allArray[l].I2 = allArray[l].i2index;
        delete allArray[l].i2index;
        allArray[l].I3C = allArray[l].i3Position_Categorie;
        delete allArray[l].i3Position_Categorie;
        allArray[l].I3O = allArray[l].i3Position_Overall;
        delete allArray[l].i3Position_Overall;
        allArray[l].I3 = allArray[l].i3index;
        delete allArray[l].i3index;


        allArray[l].A = allArray[l].Id_Arrow;
        delete allArray[l].Id_Arrow;
        allArray[l].M = allArray[l].Id_Image;
        delete allArray[l].Id_Image;
        allArray[l].M2 = allArray[l].Id_Image_2;
        delete allArray[l].Id_Image_2;

        allArray[l].L = allArray[l].Id_Classe;
        delete allArray[l].Id_Classe;
        allArray[l].G = allArray[l].Id_Groupe;
        delete allArray[l].Id_Groupe;
        allArray[l].P = allArray[l].Id_penalty;
        delete allArray[l].Id_penalty;

        allArray[l].R = allArray[l].Id_NbTour;
        delete allArray[l].Id_NbTour;

        allArray[l].O = allArray[l].Id_Numero;
        delete allArray[l].Id_Numero;
        allArray[l].N = allArray[l].Id_Nom;
        delete allArray[l].Id_Nom;
        allArray[l].N2 = allArray[l].Id_Nom_2;
        delete allArray[l].Id_Nom_2;


//        const allArrayJ = {};
        allArrayJ = {};
        Object.keys(allArray[l]).sort().forEach(function(key) {
            if (allArray[l][key] == '&nbsp;') { // FIXME 99999999999 need checking
                allArray[l][key] = '';
            }
            allArrayJ[key] = allArray[l][key];
        });
        allArray[l] = allArrayJ;
    }
}

    }        // END for l
         
                
                
        if (epictv == 1) {
            finalText += '<tr><td style="text-align: right; padding-right: 0;" colspan="99"><img  style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></td></tr>';
        }
        finalText += '\n</table>\n</div>\n';
             
/*
// TEST create array without keys to minimize size of sending data
        
console.log("allArrayMinimized test:");
console.log(allArrayMinimized);

//download(JSON.stringify(allArrayMinimized), 'jx1.txt', 'text/plain');  // small gain, not sure worth it  
//download(allArrayMinimized, 'jx2.txt', 'text/plain'); // ok gain, make sure no "," in data, better not to use...

// extract back:

var arrayKeys = allArrayMinimized.shift();
console.log(arrayKeys);
            

for (a = 0; a < allArrayMinimized.length; a++) { 

    var result =  allArrayMinimized[a].reduce(function(result, field, index) {
    result[arrayKeys[index]] = field;
    return result;
    }, {})

    allArrayNew.push(result);
    

}
                        

console.log(allArrayNew);

// END TEST
*/

                
// BEGIN single day   
    // BEGIN allArray31, 32                
                
        for (b = 0; b < allArray31.length; b++) {  // main array
            for (a = 0; a < allArray32.length; a++) { 


                if (allArray31[b]["Id_Numero"] == allArray32[a]["Id_Numero"]) {
                     
                    // transfer fields from second array to the first that needed later, use _2 to mark
                    allArray31[b]["Id_Image_2"] = allArray32[a]["Id_Image"];   
                    allArray31[b]["Id_Nom_2"] = allArray32[a]["Id_Nom"];
                    allArray31[b]["Id_Numero_Full_2"] = allArray32[a]["Id_Numero_Full"];
                    allArray31[b]["Id_TpsCumule_2"] = allArray32[a]["Id_TpsCumule"];
                }
            }                  // END allArray32
                        
                    allArray31[b]["blue"] = "highlight";
                                
                    // find finish time and check for 2 minutes difference
                    if (allArray31[b]["Id_TpsCumule"] != 99999999999 && allArray31[b]["Id_TpsCumule_2"] != 99999999999) {
                        if (allArray31[b]["Id_TpsCumule"] > allArray31[b]["Id_TpsCumule_2"]) {
                            allArray31[b]["Id_FinishTime"] = Number(allArray31[b]["Id_TpsCumule"]);
                        }
                        else if (allArray31[b]["Id_TpsCumule"] <= allArray31[b]["Id_TpsCumule_2"]) {
                            allArray31[b]["Id_FinishTime"] = Number(allArray31[b]["Id_TpsCumule_2"]);
                        } else {
                            allArray31[b]["Id_FinishTime"] = 99999999999;
                        }
                                                
                        if (Math.abs(allArray31[b]["Id_TpsCumule"] - allArray31[b]["Id_TpsCumule_2"]) > 120000) { // check more then 2 minutes apart
                        //      allArray31[b]["Id_FinishTime"] = 99999999999;
                        // allArray31[b]["Id_Arrow"] == 10; // make DSQ
                        allArray31[b]["Id_Image"] = ("_Status10"); // make DSQ
                        allArray31[b]["blue"] = "blueCard"; // make blue
                        }
                        
                    } /*else if (raceEnded == 1 && (allArray31[b]["Id_TpsCumule"] == 99999999999 || allArray31[b]["Id_TpsCumule_2"] == 99999999999)) {
                        
                        allArray31[b]["Id_FinishTime"] = 99999999999;
                        // allArray31[b]["Id_Arrow"] == 11; // make DNF
                        allArray31[b]["Id_Image"] == ("_Status11"); // make DNF
                    }*/ else {
                        allArray31[b]["Id_FinishTime"] = 99999999999;
                    }
               
                    
                    if (allArray31[b]["Id_Image"].includes("_Status") || allArray31[b]["Id_Image_2"].includes("_Status")/* || (raceEnded == 1 && allArray31[b]["Id_FinishTime"] == 99999999999)*/) {
                        allArray31[b].Id_Status = 1;
                    } else {
                        allArray31[b].Id_Status = 0;
                    }
                
                
              
         
               
        }                // END allArray31
                


// BEGIN allArray3                
        for (b = 0; b < allArray3.length; b++) {  

            allArray3[b]["Id_FinishTime"] = allArray3[b]["Id_TpsCumule"];
            
            allArray3[b]["blue"] = "highlight";
            
            if (allArray3[b]["Id_Image"].includes("_Status")/* || (raceEnded == 1 && allArray3[b]["Id_FinishTime"] == 99999999999)*/) {
                allArray3[b].Id_Status = 1;
            } else {
                allArray3[b].Id_Status = 0;
            }
        } // END allArray3
                
                
//  console.log('allArray3:');
//console.log(allArray3);
              
                        
                
                
                
                
    allArray3f = allArray3.concat(allArray31); // combine arrays                
                
                
    allArray3 = [];               
    allArray31 = [];               
    allArray32 = [];               
               
                

    
    
//            allArray3f.sort(function(a, b){return a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
    
            allArray3f.sort((a, b) => a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status/* || b.Id_NbTour - a.Id_NbTour*/ || a.Id_FinishTime - b.Id_FinishTime || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2);// remove Id_NbTour for kellner
    
//console.log('allArray3f:');
//console.log(allArray3f);
  
//    if (cleanResults == 0) { 
        



        var flagText = HeaderName[0].match(/Images\/\s*(.*?)\s*\.png/);
//        console.log(flagText[0]); // Images/_Stop.png
//        console.log(flagText[1]); // _Stop

        var finalText3header = '<div id="Title"><img class="TitleFlag1" src="' + flagText[0] + '"><h2 id="TitleH1">מגדל אפיק ישראל - חד יומי</h2><img class="TitleFlag2" src="' + flagText[0] + '"></div>'; // clear the finalText variable and add the title and time lines

//        var finalText3header = '<div id="Title"><img class="TitleFlag1" src="' + flagText[0] + '"><h2 id="TitleH1">'+HeaderEventName.replace(" - ", "<br>") + ' - Single Day</h2><img class="TitleFlag2" src="' + flagText[0] + '"></div>'; // clear the finalText variable and add the title and time lines
        
        finalText3header += HeaderName[1];
        finalText3 = '\n<div id="liveTableS">\n';

                                                            
                headerText31 = '<tr class="rnkh_bkcolor">\n';
                headerText31 += '<th class="rnkh_font">מקום</th>\n'; //  Id_Position
                headerText31 += '<th class="rnkh_font">מספר</th>\n'; // Id_Nom
                headerText31 += '<th class="rnkh_font">רוכב</th>\n'; // Id_Nom
                headerText31 += '<th class="rnkh_font">זמן</th>\n'; // Id_TpsCumule
                headerText31 += '<th class="rnkh_font">פער</th>\n'; // Id_Ecart1er
                headerText31 += '</tr>\n';

                headerText32 = '<tr class="rnkh_bkcolor">\n';
                headerText32 += '<th class="rnkh_font">מקום</th>\n'; //  Id_Position
                headerText32 += '<th class="rnkh_font">מספר</th>\n'; // Id_Nom
                headerText32 += '<th class="rnkh_font">רוכב 1</th>\n'; // Id_Nom
                headerText32 += '<th class="rnkh_font">רוכב 2</th>\n'; // Id_Nom_2
                headerText32 += '<th class="rnkh_font">זמן</th>\n'; // Id_TpsCumule
                headerText32 += '<th class="rnkh_font">פער</th>\n'; // Id_Ecart1er
                headerText32 += '</tr>\n';

                
            m = 0;
            prevCompCat = ""
        
            leaderTime = 0;
            var t = 1;

        for (l = 0; l < allArray3f.length; l++) {
            
             
            
            if (prevCompCat == allArray3f[l]["Id_Categorie"]) {
                m += 1;
                
                if (allArray3f[l]["Id_FinishTime"] != 99999999999 && !(allArray3f[l]["Id_Image"].includes('_Status'))) {
                    allArray3f[l]["Id_Ecart1er"] = allArray3f[l]["Id_FinishTime"] - leaderTime;
                } else {
                    allArray3f[l]["Id_Ecart1er"] = 99999999999;
                }
                
            } else {
                m = 1;
                prevCompCat = allArray3f[l]["Id_Categorie"];
                
                if (allArray3f[l]["Id_FinishTime"] != 99999999999) {
                    leaderTime = allArray3f[l]["Id_FinishTime"];
                }
                
                if (t == 0) { // skip the first category
                    
                    finalText3 += '</table>\n';                
                }

                t = 0;
                
                if (allArray3f[l]["Id_Categorie"].includes('יחיד')) {
                    finalText3 += '<table class="line_color fadeIn">\n<tr>\n<td colspan="99" class="title_font">' + allArray3f[l]["Id_Categorie"] + '</td>\n</tr>' + headerText31 + '\n';
                } else {
                    finalText3 += '<table class="line_color fadeIn">\n<tr>\n<td colspan="99" class="title_font">' + allArray3f[l]["Id_Categorie"] + '</td>\n</tr>' + headerText32 + '\n';
                }
            }
            
            allArray3f[l]["Id_Position"] = m;
            
             if (l % 2 == 0) {
                finalText3 += '<tr class="rnk_bkcolor OddRow">\n';
                } else {
                finalText3 += '<tr class="rnk_bkcolor EvenRow">\n';
            }
           
           
           if (allArray3f[l]["Id_Image"].includes('_Status10')) {
            finalText3 += '<td class="rnk_font dnsfq">DSQ</td>\n';
           } else if (allArray3f[l]["Id_Image"].includes('_Status11')) {
            finalText3 += '<td class="rnk_font dnsfq">DNF</td>\n';
           } else if (allArray3f[l]["Id_Status"] == 1) {
            finalText3 += '<td class="rnk_font dnsfq">*</td>\n';
           } else if (allArray3f[l]["Id_FinishTime"] != 99999999999) {
            finalText3 += '<td class="rnk_font">' + allArray3f[l]["Id_Position"] + '</td>\n';
           }  else {
            finalText3 += '<td class="rnk_font"></td>\n';
           }
            
            finalText3 += '<td class="rnk_font ' + allArray3f[l]["blue"] + '">' + allArray3f[l]["Id_Numero"] + '</td>\n';
            finalText3 += '<td class="rnk_font">' + allArray3f[l]["Id_Nom"] + '</td>\n';
            
            if (!allArray3f[l]["Id_Categorie"].includes('יחיד')) {
                finalText3 += '<td class="rnk_font">' + allArray3f[l]["Id_Nom_2"] + '</td>\n';
            }
            
            if (allArray3f[l]["Id_FinishTime"] != 99999999999) {  
                allArray3f[l]["Id_FinishTime"] = ms2TimeString(allArray3f[l]["Id_FinishTime"]);
                finalText3 += '<td class="rnk_font bold">' + allArray3f[l]["Id_FinishTime"] + '</td>\n';
            } else {
                finalText3 += '<td class="rnk_font">-</td>\n';
            }                                
            
            
            if (allArray3f[l]["Id_Ecart1er"] != 99999999999 && allArray3f[l]["Id_Position"] != 1) {  
                allArray3f[l]["Id_Ecart1er"] = ms2TimeString(allArray3f[l]["Id_Ecart1er"]);
                finalText3 += '<td class="rnk_font">' + allArray3f[l]["Id_Ecart1er"] + '</td>\n';
            } else {
                finalText3 += '<td class="rnk_font">-</td>\n';
            }
            
            finalText3 += '</tr>\n';
            
            
            
            
            
if (enableJ3 == 1) {

        delete allArray3f[l].Id_Discipline;
        delete allArray3f[l].Id_Inter1;
        delete allArray3f[l].Id_Inter1_2;
        delete allArray3f[l].Id_Inter2;
        delete allArray3f[l].Id_Inter2_2;
        delete allArray3f[l].Id_Inter3;
        delete allArray3f[l].Id_Inter3_2;
        delete allArray3f[l].Id_PenaliteNbTour;
        delete allArray3f[l].Id_PenalitePosition;
        delete allArray3f[l].Id_PenaliteTpsCumule;
//        delete allArray3f[l].Id_Position;
        delete allArray3f[l].Id_PositionCategorie;
        delete allArray3f[l].Id_TpsTour;
        delete allArray3f[l].Id_TpsTour1;
        delete allArray3f[l].Id_TpsTour2;
        delete allArray3f[l].Id_TpsTour3;
        delete allArray3f[l].Id_TpsTour4;
        delete allArray3f[l].Id_TpsTour5;
        delete allArray3f[l].Id_TpsTour6;
        delete allArray3f[l].Id_Sector_FinishTime;
        delete allArray3f[l].Id_Sector_Ecart1er;
        delete allArray3f[l].oldBlue; // will be phrased on remote from Id_Groupe
        delete allArray3f[l].leader; // will be phrased on remote from Id_Groupe
        delete allArray3f[l].single; // will be phrased on remote from Id_Groupe
        delete allArray3f[l].uci; // will be phrased on remote from Id_Groupe
        delete allArray3f[l].Id_Numero_Full_2;
        delete allArray3f[l].Id_Numero_Full;
        delete allArray3f[l].Id_Canal;
        delete allArray3f[l].Id_Arrow;
//        delete allArray3f[l].Id_Status;
        delete allArray3f[l].Id_Nationalite;
        delete allArray3f[l].Id_Nationalite_2;


        delete allArray3f[l].blue;
        delete allArray3f[l].Id_NbTour;
        delete allArray3f[l].Id_Classe;
        delete allArray3f[l].Id_TpsCumule;
        delete allArray3f[l].Id_TpsCumule_2;
        delete allArray3f[l].Id_Image;
        delete allArray3f[l].Id_Image_2;
        delete allArray3f[l].Id_Status;

            
            if (allArray3f[l]["Id_FinishTime"] == 99999999999) {
                allArray3f[l]["Id_FinishTime"] = 0;
            } else {
                allArray3f[l]["Id_FinishTime"] = timeString2ms(allArray3f[l]["Id_FinishTime"]);
            }

            if (allArray3f[l]["Id_Ecart1er"] == 99999999999) {
                allArray3f[l]["Id_Ecart1er"] = 0;
            } else {
                allArray3f[l]["Id_Ecart1er"] = timeString2ms(allArray3f[l]["Id_Ecart1er"]);
            }
             
        allArray3f[l].O = allArray3f[l].Id_Numero;
        delete allArray3f[l].Id_Numero;
        allArray3f[l].N = allArray3f[l].Id_Nom;
        delete allArray3f[l].Id_Nom;
        allArray3f[l].N2 = allArray3f[l].Id_Nom_2;
        delete allArray3f[l].Id_Nom_2;
        allArray3f[l].C = allArray3f[l].Id_Categorie;
        delete allArray3f[l].Id_Categorie;
        allArray3f[l].F = allArray3f[l].Id_FinishTime;
        delete allArray3f[l].Id_FinishTime;
        allArray3f[l].E = allArray3f[l].Id_Ecart1er;
        delete allArray3f[l].Id_Ecart1er;
        allArray3f[l].Q = allArray3f[l].Id_Equipe;
        delete allArray3f[l].Id_Equipe;
        allArray3f[l].PC = allArray3f[l].Id_Position; // needed only for third party
        delete allArray3f[l].Id_Position;
            
            const allArrayJ3 = {};
            Object.keys(allArray3f[l]).sort().forEach(function(key) {
                if (allArray3f[l][key] == '&nbsp;') { // FIXME 99999999999 need checking
                    allArray3f[l][key] = '';
                }
                allArrayJ3[key] = allArray3f[l][key];
            });
            allArray3f[l] = allArrayJ3;
}
            
            
            
        } // END for l single day
        
        if (m != 0) { // check if we have competitors
            dayCompetitors = 1;
            finalText3 += '</table>\n</div>\n';  // close after last category   

        if (enableJ3 == 1) { 
            J3text = finalText3header + finalText3;
//            download((finalText3header + finalText3), 'p3.html', 'text/plain');    // download the html for single day 
        }

            finalText3 = '<h2>Single Day</h2>\n' + finalText3;

        } else {
            dayCompetitors = 0;
            finalText3 += '</div>\n';  // close "liveTableS" 
        }

        
if (enableJ3 == 1) {

        var headerFlag = (div.getElementsByTagName("img"))[0].getAttribute("src");

        var div1 = document.createElement("div");  
        div1.innerHTML = HeaderName[1]; 
        var header2 = div1.getElementsByTagName("span");
   
        var DayTime =  header2[0].textContent || div.innerText || "";
        var ElapsedTime =  header2[1].textContent || div.innerText || "";
        var RemainingTime =  header2[2].textContent || div.innerText || "";


        var header = {};
/*        
        header.headerFlag = headerFlag;
        header.HeaderEventName = HeaderEventName;
        header.DayTime = DayTime;
        header.ElapsedTime = ElapsedTime;
        header.RemainingTime = RemainingTime;
*/
// same header as j1
        header.headerFlag = headerFlag;
        header.HeaderEventName = HeaderEventName;
        header.DayTime = DayTime;
        header.ElapsedTime = ElapsedTime;
        header.RemainingTime = RemainingTime;
        header.MaximumStageTime = MaximumStageTime;
        header.startTime = (new Date(startTime)).toISOString();
        header.message = messageX;
        
        
        
        allArray3f.unshift(header); // add the header at the beginning
        allArrayJ3 = JSON.stringify(allArray3f);             
        download(allArrayJ3, 'j3.txt', 'text/plain');    
        console.log((new Date()).toLocaleTimeString() + ' downloaded j3.txt')
}

//    }
 
        
        //       console.log(JSON.parse(allArrayJ3));     


if (showLog == 1) {                              
    console.log('single day:');                

const arrayToObject = (arr, keyField) => Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})));

const allArray3fObject = arrayToObject(allArray3f, "Id_Numero")

    console.log(allArray3fObject);                
//    console.table(allArray3fObject);
}                
     
    
    //console.log(finalText3);
    
    // END single day    
                
                
                
                
                
                
if (showLog == 1) {               
    console.log('epic:');                

const arrayToObject = (arr, keyField) => Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})));

const allArrayObject = arrayToObject(allArray, "Id_Numero")

    console.log(allArrayObject);                
//    console.table(allArrayObject);
}
    
if (enableJ1 == 1) {
  
    if (cleanResults == 0 && show == 4 && useCategory == "no") { // FIXME check if need all(mainly show), so we can watch different results on timing computer
        var header = {};
        header.headerFlag = headerFlag;
        header.HeaderEventName = HeaderEventName;
        header.DayTime = DayTime;
        header.ElapsedTime = ElapsedTime;
        header.RemainingTime = RemainingTime;
        header.MaximumStageTime = MaximumStageTime;
        header.startTime = (new Date(startTime)).toISOString();
        header.message = messageX;
        console.log((new Date(startTime)).toISOString());     

        allArray.unshift(header); // add the header at the beginning
        allArrayJ = JSON.stringify(allArray);             
//        download(allArrayJ, 'j1.txt', 'text/plain');    
//        console.log((new Date()).toLocaleTimeString() + ' downloaded j1.txt')
    }
 //       console.log(JSON.parse(allArrayJ));     
}

 
// if (Array.isArray(allArray3) || allArray3.length != 0) {
 
     // build secound table
//}        
          
      //       console.log(finalText);
              
//console.log("allArray2obj");
//console.log(allArray2obj);

    sessionStorage.setItem('positionArray_All_Cat', JSON.stringify(positionArray_All_Cat));
            
    // allArray = [];
    
    tableClass = "";
    
    console.timeEnd('main');
    
      //  debugger;
    if (publishE == 0) {
        return (finalText + finalText3)
    } else {
        return (finalText)
    }

    };
        

    function ms2TimeString(mili){
        
        var d, a, f, g, z;

        if (precision == "tenth") {
            d = mili % 1E3;
            a = mili / 1E3 % 60 | 0;
            f = mili / 6E4 % 60 | 0;
            g = mili / 36E5 % 24 | 0;
            z = (g ? (10 > g ? "0" + g : g) + ":" : "") + (10 > f ? 0 : "") + f + ":" + (10 > a ? 0 : "") + a + "." + +(d / 100);        
        } else if (precision == "second") {
            d = mili % 1E3;
            a = mili / 1E3 % 60 | 0;
            f = mili / 6E4 % 60 | 0;
            g = mili / 36E5 % 24 | 0;
            z = (g ? (10 > g ? "0" + g : g) + ":" : "") + (10 > f ? 0 : "") + f + ":" + (10 > a ? 0 : "") + a  ;       
        } else {
            d = mili % 1E3;
            a = mili / 1E3 % 60 | 0;
            f = mili / 6E4 % 60 | 0;
            g = mili / 36E5 % 24 | 0;
            z = (g ? (10 > g ? "0" + g : g) + ":" : "") + (10 > f ? 0 : "") + f + ":" + (10 > a ? 0 : "") + a + "." + (100 > d ? 10 > d ? "00" : 0 : "") + d ;       
        }     
                
        if (z.toString().substring(0, 3) == "00:" && ((z.length > 5 && precision == "second") || (z.length > 7 && precision == "tenth"))) {
            z = z.substr(3);
        }
        if (z.toString().substring(0, 1) == "0" && z.toString().substring(1, 2) != ".") {
            z = z.substr(1);
        }
    
        return z
        
    };


    function timeString2ms(a,b){// time(HH:MM:SS.mss) // optimized
        if (precision == "tenth") {
            return a=a.split('.'), // optimized
            b=a[1]*1||0, // optimized, if a[1] defined, use it, else use 0
            a=a[0].split(':'),
            (b*1e2)+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
        } else if (precision == "second") {
            return a=a.split('.'), // optimized
            b= 0, // mili is 0
            a=a[0].split(':'),
            b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
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
        } else if (precision == "second") {
            return k=a%1e3, // optimized by konijn
            s=a/1e3%60|0,
            m=a/6e4%60|0,
            h=a/36e5%24|0,
            (h?(h<10?'0'+h:h)+':':'')+ // optimized
            (m<10?0:'')+m+':'+  // optimized
            (s<10?0:'')+s
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

    function alignTable() {
        
        if (cleanResults == 0 && epictv == 0) {
            
            // aligning table columns according to number of columns
            var tt = document.querySelectorAll('.line_color');

            for (let kk = 0; kk < tt.length; kk++) {

        /*
                var numCols = 0;

                for (let ii = 0; ii < tt[kk].rows.length; ii++) {//loop through HTMLTableRowElement

                    row = tt[kk].rows[ii];
                    
                    if (numCols < row.cells.length) { // find max number of columns
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
    }; 
    
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        a.setAttribute("id", "download");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
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
    };

    function export_table_to_csv(html, filename) {
        var csv = [];
        csv.push('Migdal Epic Israel -' + csvName.split('_').join(' '));
        var rowx = document.querySelectorAll("table tr");
        
        for (var i = 0; i < rowx.length; i++) {
            var row = [], cols = rowx[i].querySelectorAll("td, th");
            
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row.join(","));		
        }

        // Download CSV
        download_csv(csv.join("\n"), filename);
    };


    function publish(){
                
        if (TimerLoad) clearTimeout(TimerLoad);

        var useCategoryTemp = useCategory;
        publishE = 1;
        var publishText = '';
        
        publishText += `<!DOCTYPE html><html class="no-js" lang="he" xml:lang="he" dir="rtl"><head> <title>תנועה מדידת זמנים &ndash; live timing</title> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="google-site-verification" content="fksQzLHsNNdUr7KUw53_2thUPno2gvM0oe_MRxWvjSo"> <meta name="description" content="תנועה מדידת זמנים עוסקת במדידת זמנים בארועי ספורט"> <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png"> <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png"> <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png"> <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png"> <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png"> <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png"> <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png"> <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png"> <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png"> <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32"> <link rel="icon" type="image/png" href="/favicon-194x194.png" sizes="194x194"> <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"> <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192"> <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16"> <link rel="manifest" href="/manifest.json"> <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffcc33"> <meta name="apple-mobile-web-app-title" content="תנועה מדדית זמנים"> <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="application-name" content="תנועה מדדית זמנים"> <meta name="msapplication-TileColor" content="#ffcc33"> <meta name="msapplication-TileImage" content="/mstile-144x144.png"> <meta name="theme-color" content="#ffcc33"> <link rel="stylesheet" media="all" type="text/css" href="/style/global.css"> <link rel="stylesheet" media="print" href="/style/print.css"> <meta property="og:locale" content="he_IL"> <meta property="og:site_name" content="tnua timing - תנועה מדידת זמנים"> <meta property="og:title" content="תנועה מדידת זמנים &ndash; live timing"> <meta property="og:description" content="live timing"> <meta property="og:url" content="https://tnuatiming.com/liveepic/"> <meta property="og:image" content="http://tnuatiming.com/images/logo2_og.png"> <meta property="og:image:type" content="image/png"> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <style>#live #buttonInfo{flex-direction: column; direction: ltr;}#live table.line_color{margin-top: 10px; direction: ltr;}#live tr.rnk_bkcolor:hover{background-color: #f0f0f0bf;}h1 img{height: 32px; vertical-align: middle; margin: 0 5px;}.Flag:before{content: "\\00a0";}.Flag{background-size: contain; background-position: 50%; background-repeat: no-repeat; position: relative; display: inline-block; width: 1.33333333em; vertical-align: middle; margin: 0 5px;}.australia{background-image: url(Images/CountryFlags/australia.svg);}.austria{background-image: url(Images/CountryFlags/austria.svg);}.belgium{background-image: url(Images/CountryFlags/belgium.svg);}.brazil{background-image: url(Images/CountryFlags/brazil.svg);}.canada{background-image: url(Images/CountryFlags/canada.svg);}.czechrepublic{background-image: url(Images/CountryFlags/czechrepublic.svg);}.denmark{background-image: url(Images/CountryFlags/denmark.svg);}.ecuador{background-image: url(Images/CountryFlags/ecuador.svg);}.england{background-image: url(Images/CountryFlags/england.svg);}.finland{background-image: url(Images/CountryFlags/finland.svg);}.france{background-image: url(Images/CountryFlags/france.svg);}.germany{background-image: url(Images/CountryFlags/germany.svg);}.greece{background-image: url(Images/CountryFlags/greece.svg);}.hungary{background-image: url(Images/CountryFlags/hungary.svg);}.iceland{background-image: url(Images/CountryFlags/iceland.svg);}.ireland{background-image: url(Images/CountryFlags/ireland.svg);}.israel{background-image: url(Images/CountryFlags/israel.svg);}.italy{background-image: url(Images/CountryFlags/italy.svg);}.latvia{background-image: url(Images/CountryFlags/latvia.svg);}.lithuania{background-image: url(Images/CountryFlags/lithuania.svg);}.netherlands{background-image: url(Images/CountryFlags/netherlands.svg);}.newzealand{background-image: url(Images/CountryFlags/newzealand.svg);}.norway{background-image: url(Images/CountryFlags/norway.svg);}.poland{background-image: url(Images/CountryFlags/poland.svg);}.portugal{background-image: url(Images/CountryFlags/portugal.svg);}.russia{background-image: url(Images/CountryFlags/russia.svg);}.serbia{background-image: url(Images/CountryFlags/serbia.svg);}.southafrica{background-image: url(Images/CountryFlags/southafrica.svg);}.spain{background-image: url(Images/CountryFlags/spain.svg);}.sweden{background-image: url(Images/CountryFlags/sweden.svg);}.switzerland{background-image: url(Images/CountryFlags/switzerland.svg);}.ukraine{background-image: url(Images/CountryFlags/ukraine.svg);}.unitedkingdom{background-image: url(Images/CountryFlags/unitedkingdom.svg);}.usa{background-image: url(Images/CountryFlags/usa.svg);}.transparent{background-image: url(Images/transparent.png);}.blueFlag{background-image: url(Images/_LightBlueFlag.png);}.CheckeredFlag{background-image: url(Images/_CheckeredFlag.png);}.numberOne{background-image: url(Images/numbreOne.svg); width: 1em;}.YellowShirt{background-image: url(Images/YellowShirt.svg);margin: 0;}.PinkShirt{background-image: url(Images/PinkShirt.svg);margin: 0;}.GreenShirt{background-image: url(Images/GreenShirt.svg);margin: 0;}.BlueShirt{background-image: url(Images/BlueShirt.svg);margin: 0;}.PurpleShirt{background-image: url(Images/PurpleShirt.svg);margin: 0;}.UCI{background-image: url(Images/uci.svg);margin: 0;}.dnf{background-image: url(Images/_dnf.svg);}.dsq{background-image: url(Images/_dsq.svg);}.dns{background-image: url(Images/_dns.svg);}#live td.blued{background-image: url(Images/_LightBlueFlag.png); background-position: center center; background-size: auto 50%; background-repeat: no-repeat; min-width: 16px;}#live td.rnk_font.blueCard{color:#111; background-color:#add8e6bf; font-weight:700;}#live td.rnk_font.DarkBlueCard{color:#111; background-color:#2f5999ff; font-weight:700;}#live td.rnk_font.redCard{color:white; background-color:red; font-weight:700;}#live td.rnk_font.yellowCard{background-color:#fae100ff; font-weight:700;}#live td.rnk_font.pinkCard{color:white; background-color:#ff1493ff; font-weight:700;}#live td.rnk_font.greenCard{color:white; background-color:#427f4dfe; font-weight:700;}#live td.rnk_font.purpleCard{color:white; background-color:#412297ff; font-weight:700;}#live td.left,#live th.left{text-align: left;}#live td.right,#live th.right{text-align: right;}.lineThrough{filter: opacity(35%);}#live td.rnk_font.wrap{max-width: 200px; overflow: hidden; text-overflow: ellipsis;}#live td.rnk_font.bold{font-weight: 700;}#live td.rnk_font.bigFont{font-size: 1.5em; min-width: 35px;}#live .btn{display: inline-block;}#live #buttonInfo{margin-bottom: 10px;}#live .btn.active{cursor: pointer; filter: opacity(50%);}#live #Title{justify-content: space-evenly; vertical-align: middle; font-weight: 700; font-size: 1em; color: #58585a; margin: 5px 0; text-align: center;}#live h1#Title img{margin: 0 10px;}div#legend{width: 100%; text-align: left; direction: ltr;}div#legend ul{width: 100%; text-align: left; float: left;}div#legend li{text-align: left;}#csv{display: none;}@media (max-width:767px){#live td.rnk_font.bigFont{font-size: 1.2em; min-width: 25px;}#live td.rnk_font.wrap{max-width: 120px;}}</style></head> <body id="live"><div class="full-bg fadeIn"> <div class="page"> <div class="row header"> <div class="row language"> <a href="/english/index.html" title="go to English home page"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="27" height="19"> <clipPath id="t"> <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/> </clipPath> <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/> <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/> <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/> <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/> <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" stroke-width="6"/> </svg> </a> </div><div class="logoNav"> <div class="logo_main"> <div class="logo_image"> <ul class="logo"> <li></li><li></li><li></li><li></li></ul> </div><div class="logo_text"> <a class="main_logo" href="http://tnuatiming.com/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235 90"><switch><g fill="#58585a"><path d="M188.274 11.634h-8.35V1h30.586q12.656 0 18.15 5.36 5.537 5.318 5.537 17.667v31.508h-11.91V24.202q0-7.03-2.856-9.8-2.855-2.768-9.623-2.768h-9.668V34.66q0 7.648-1.76 12.174-1.713 4.527-5.36 6.636-3.647 2.065-10.59 2.065h-2.99V44.9h.748q3.076 0 4.834-1.098 1.758-1.143 2.505-3.516.747-2.373.747-7.163v-21.49zM169.51 55.535h-28.433V44.9h16.567V24.775q0-5.933-.79-8.438-.792-2.55-2.638-3.603-1.845-1.1-5.405-1.1h-5.228V1h7.47q7.56 0 11.294 2.02 3.736 2.022 5.45 6.636 1.713 4.615 1.713 12.833v33.045zM118.313 1h11.865v54.535h-11.865V1zM56.746 45.91q11.337-.174 17.622-2.24L58.81 1h12.877L84.65 38.352q4.967-4 7.076-12.656Q93.836 17.04 93.836 1h12.216q0 20.96-4.702 32.826-4.658 11.822-15.117 17.403-10.46 5.536-29.487 6.37V45.91zM13.547 55.535H1.682V22.4h11.865v33.135zm34.234 0H35.873V23.85q0-6.723-2.857-9.447-2.856-2.77-9.932-2.77H.803V1H23.83Q36.795 1 42.29 6.316q5.493 5.317 5.493 17.622v31.595z"/><path d="M223.98 61.6q5.317 0 7.756 3.253 2.46 3.23 2.46 10.283V89H220.97v-3.735h9.14V75.64q0-5.382-1.384-7.82-1.385-2.44-4.703-2.44-2.966 0-4.878 2.703-1.91 2.68-3.537 9.448L212.86 89h-4.35l3.01-11.8q1.034-4.107 2.066-6.7l-5.493-8.46h4.768l2.748 4.46q1.714-2.592 3.67-3.735 1.955-1.164 4.7-1.164zM202.27 89h-4.064V65.777h-15.38V62.04h22.806v3.736h-3.362V89zM174.058 62.04h4.043v14.173h-4.042V62.04zM165.62 89h-4.065V65.777h-15.38V62.04h22.807v3.736h-3.362V89zM119.917 65.776h-4.175V62.04h14.568q6.065 0 8.7 2.593 2.638 2.57 2.638 8.57V89h-4.043V73.16q0-4.043-1.648-5.712-1.626-1.67-5.69-1.67h-6.307v12.788q0 4.043-.747 6.262-.725 2.22-2.35 3.208-1.627.967-5.12.967h-.243v-3.735h.374q1.538 0 2.417-.55.88-.57 1.253-1.757.374-1.186.374-3.58V65.775zM102.35 65.95v4.198l-2.396-.813q-1.297.68-1.802 1.275-.506.593-.725 1.428-.22.813-.22 2.065V89h-4.043V74.28q0-2.33.88-3.78.9-1.45 3.03-2.154L89.56 65.82v-4.175l12.79 4.306zM74.597 61.6q5.317 0 7.756 3.253 2.46 3.23 2.46 10.283V89H71.588v-3.735h9.14V75.64q0-5.382-1.384-7.82-1.384-2.44-4.702-2.44-2.965 0-4.877 2.703-1.912 2.68-3.538 9.448L63.48 89h-4.352l3.01-11.8q1.033-4.107 2.066-6.7l-5.493-8.46h4.77l2.745 4.46q1.714-2.592 3.67-3.735Q71.85 61.6 74.597 61.6zM53.92 89H41.595v-3.735h8.284V73.62q0-3.516-.374-5.032-.35-1.516-1.208-2.153-.857-.66-2.483-.66h-2.966V62.04h2.834q3.517 0 5.12.99 1.627.966 2.374 3.207.747 2.22.747 6.24V89zM32.146 62.04h4.043v14.173h-4.044V62.04zM24.74 89H1.65V62.04h11.8q6.064 0 8.678 2.593 2.615 2.593 2.615 8.57V89zM5.69 65.777v19.49h14.986V73.157q0-4-1.626-5.69-1.604-1.692-5.647-1.692H5.69z"/></g><foreignObject width="235" height="90" requiredExtensions="http://example.com/SVGExtensions/EmbeddedXHTML"><img src="/images/logo2.png" width="235" height="90" alt="תנועה מדידת זמנים"/></foreignObject></switch></svg></a> </div></div><div class="navigation"> <svg style="display:none;"> <symbol id="live-icon" viewBox="0 0 32 32"> <path style="fill-opacity:1" d="M 17,6.03787 17,4 21,4 21,2 C 21,0.89544 20.104563,0 18.999938,0 L 13,0 c -1.104562,0 -2,0.89544 -2,2 l 0,2 4,0 0,2.03787 C 8.287563,6.54844 3,12.15669 3,19 3,26.17969 8.820313,32 16,32 23.179688,32 29,26.17969 29,19 29,12.15675 23.712438,6.5485 17,6.03787 Z m 6.071062,20.03319 C 21.18225,27.95981 18.671125,29 16,29 13.328875,29 10.817688,27.95981 8.928938,26.07106 7.040188,24.18231 6,21.67106 6,19 c 0,-2.67106 1.040188,-5.18231 2.928938,-7.07106 1.81375,-1.81369 4.2015,-2.84431 6.753562,-2.92338 l -0.677437,9.81313 C 14.946943,19.64025 15.394563,20 15.999938,20 16.605313,20 17.053,19.64025 16.994813,18.81869 L 16.317438,9.0055 c 2.552062,0.0791 4.939875,1.10975 6.753625,2.92344 C 24.959813,13.81769 26,16.32894 26,19 c 0,2.67106 -1.040187,5.18231 -2.928937,7.07106 z"/> </symbol> <symbol id="home-icon" viewBox="0 0 32 32"> <path style="fill-opacity:1" d="m 32,18.5 -6,-6 0,-9 -4,0 0,5 -6,-6 -16,16 0,1 4,0 0,10 10,0 0,-6 4,0 0,6 10,0 0,-10 4,0 z"/> </symbol> <symbol id="race-icon" viewBox="0 0 32 32"> <path style="fill-opacity:1" d="M 26,6 26,2 6,2 6,6 0,6 0,10 c 0,3.31369 2.6861875,6 6,6 0.627375,0 1.2321875,-0.0964 1.800625,-0.27506 1.4429375,2.06275 3.644,3.55612 6.199375,4.07487 L 14,26 12,26 c -2.2091875,0 -4,1.79081 -4,4 l 16,0 c 0,-2.20919 -1.790813,-4 -4,-4 l -2,0 0,-6.20019 c 2.555375,-0.51875 4.756437,-2.01206 6.199375,-4.07487 C 24.767813,15.90356 25.372625,16 26,16 c 3.313812,0 6,-2.68631 6,-6 L 32,6 26,6 Z M 6,13.625 C 4.0011875,13.625 2.375,11.99881 2.375,10 l 0,-2 L 6,8 6,10 c 0,1.25581 0.2321875,2.45725 0.6548125,3.56462 C 6.44225,13.60356 6.223625,13.625 6,13.625 Z M 29.625,10 c 0,1.99881 -1.626188,3.625 -3.625,3.625 -0.223625,0 -0.44225,-0.0214 -0.654812,-0.0604 C 25.767813,12.45725 26,11.25581 26,10 l 0,-2 3.625,0 0,2 z"/> </symbol> </svg> <ul> <li><a class=home href="/index.html"><svg class="home-icon"><use xlink:href="#home-icon"></use></svg><span>עמוד&nbsp;הבית</span></a></li><li><a class=races href="/results/index.html"><svg class="race-icon"><use xlink:href="#race-icon"></use></svg><span>תוצאות&nbsp;מרוצים</span></a></li><li class="last"><a class="live" href="/live/index.html"><span class="css3-blink"><span>live&nbsp;timing</span><svg class="live-icon"><use xlink:href="#live-icon"></use></svg></span></a></li></ul> </div></div></div><div class="row main_content"> <div id="raceheader"><h1>Stage Results</h1></div><div id="buttonInfo"> <div id="categoryOrAll" style="display: block;"> <button id="displayCatButton" class="btn" onClick="category('yes')">By Category</button> <button id="displayAllButton" class="btn" onClick="category('no')">Overall</button> </div></div>`;
        
        publishText += '\n<h1 id="Title">' + eventName + '</h1>\n';
        
        publishText += '<div id="finalTextCategory" style="display: block;">\n';

        useCategory = "yes";
        publishText += createLiveTable(P1).replace(/<h1.*?<\/h1>/g, '').replace(/<p.*?<\/p>/g, '');
        
        publishText += '\n</div>\n';
        publishText += '\n\n';
        
        publishText += '<div id="finalTextAll" style="display: none;">\n';
        
        useCategory = "no";
        publishText += createLiveTable(P1).replace(/<h1.*?<\/h1>/g, '').replace(/<p.*?<\/p>/g, '');
        publishText += '\n</div>\n';
        
        publishText += `<div style="width:100%;text-align:right;margin-top:10px;"><a href="https://tnuatiming.com"><img style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></a></div></div><div class="row footer"> <a class=mail href="mailto:119raz@walla.com">רז הימן - 119raz&#64;walla.com</a> <a class=copyright href="/terms.html">&#169; כל הזכויות שמורות לתנועה מדידת זמנים</a> <a class=logo_tiny href="http://tnuatiming.com"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"> <switch> <g style="fill-opacity:1;stroke:none"> <circle r="7" transform="matrix(0.86602544,0.49999993,-0.49999993,0.86602544,0,0)" style="fill:#ff6600;" cx="24.284611" cy="-5.9378204"/> <circle r="7" transform="matrix(-0.86602544,0.49999993,-0.49999993,-0.86602544,0,0)" style="fill:#cc0000;" cx="5.9378204" cy="-24.284611"/> <circle r="7" transform="matrix(0.2588191,0.96592581,-0.96592581,0.25881909,0,0)" style="fill:#003399;" cx="33.793804" cy="-33.3913"/> <circle r="7" transform="matrix(0.86602544,-0.49999993,0.49999993,0.86602544,0,0)" style="fill:#66cc33;" cx="0.28461337" cy="47.507042"/> </g> <foreignObject width="16" height="16" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><img src="/images/logo16.png" width="16" height="16" alt="לוגו תנועה מדידת זמנים"/></foreignObject> </switch> </svg> </a> </div></div></div><script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-38104277-1', 'auto'); ga('set', 'anonymizeIp', true); ga('send', 'pageview');</script><script>var useCategory="yes"; if (sessionStorage.getItem('categoryOrAll')){useCategory=sessionStorage.getItem('categoryOrAll');}category(useCategory); function category(choice){useCategory=choice; if (useCategory=="yes"){sessionStorage.setItem('categoryOrAll', 'yes');}else if (useCategory=="no"){sessionStorage.setItem('categoryOrAll', 'no');}if (useCategory=="yes"){document.getElementById("displayCatButton").classList.remove("active"); document.getElementById("displayCatButton").disabled=true; document.getElementById("displayAllButton").classList.add("active"); document.getElementById("displayAllButton").disabled=false;}else if (useCategory=="no"){document.getElementById("displayCatButton").classList.add("active"); document.getElementById("displayCatButton").disabled=false; document.getElementById("displayAllButton").classList.remove("active"); document.getElementById("displayAllButton").disabled=true;}if (useCategory=="yes"){document.getElementById("finalTextAll").style.display="none"; document.getElementById("finalTextCategory").style.display="block";}else if (useCategory=="no"){document.getElementById("finalTextAll").style.display="block"; document.getElementById("finalTextCategory").style.display="none";}}</script> </body></html> `;
        
        
        download(publishText, 'stage.html', 'text/plain');        
        
        publishE = 0;
        useCategory = useCategoryTemp;
        
        loop = function() {
            Load();
        };

        TimerLoad = setTimeout(loop, Rafraichir);
        
    };



    function publishBox(){
                
        if (TimerLoad) clearTimeout(TimerLoad);

        var useCategoryTemp = useCategory;
        publishE = 1;
        var publishText = '';
        
        
        publishText += '<h1 id="Title">' + eventName + '</h1>\n';
        
        publishText += '<div id="finalTextCategory" style="display: block;">\n';

        useCategory = "yes";
        
        hideStatus = 1;
        
        publishText += createLiveTable(P1).replace(/<h1.*?<\/h1>/g, '').replace(/<p.*?<\/p>/g, '');
        
        publishText += '\n</div>\n';
        publishText += '\n\n';
        
        publishText += '<div id="finalTextAll" style="display: none;">\n';
        
        useCategory = "no";
        publishText += createLiveTable(P1).replace(/<h1.*?<\/h1>/g, '').replace(/<p.*?<\/p>/g, '');

        hideStatus = 0;

        publishText += '\n</div>\n';
        
        
        
        download(publishText, 'stageBox.html', 'text/plain');        
        
        publishE = 0;
        useCategory = useCategoryTemp;
        
        loop = function() {
            Load();
        };

        TimerLoad = setTimeout(loop, Rafraichir);
        
    };


