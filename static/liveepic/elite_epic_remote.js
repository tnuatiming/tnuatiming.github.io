// 20180518 - array refactoring with all/category toggle, display arrows for position change 
// 20180522 - add fades and competitor info on arrows display 
// 20180523 - add competitor number color/background according to category 
// 20180527 - add message uploading 
// 20180607 - special edition for 2 specials run individually and computation done in live. special 1 live points to: https://tnuatiming.com/live1/livea/p1.html and special 2 live points to: https://tnuatiming.com/live1/liveb/p1.html 
// 20180610 - refactor special edition for 2 specials run individually and computation done in live, added laps time in correct order.  
// 20180701 - added penalty indicator.  
// 20181030 - epic israel version.  

/*
FIXME
add "Id_Sector_FinishTime" - maybe fixed?
fix all the crufafel with "Inter1Leader" tables - maybe fixed?
enable google compiler for production
postion arrow needes to be disabled after the prologue
after removing the status colmun, need to fix the finish flag, gain/lost indicator
use all Ecart1er from Masters
remove all imTheLeader

*/

    var MaximumStageTime = 36000000; // Maximum stage time in miliseconds, 3600000=1hours, 18000000=5hours, 21600000=6hours, 36000000=10hours

// Set the date for start
    var startTime = new Date("May 6, 2019 07:00:00").getTime();

    var showStopwatch = 1;

    var useHash = 1;
    var hash = 'hash.txt';
    var hashOld = '';
    
    var url = 'j1.txt';
    var target = 'result';
    
    var TimerLoad;
    var Rafraichir = 60000; // every 60 seconds

    var P1;
    
    var positionArray_All_Cat = {}; // array with the previous competitor overall and category position. updated every Load, used to show the position change arrow between Loads 
    if (sessionStorage.getItem('positionArray_All_Cat')) {
        positionArray_All_Cat = JSON.parse(sessionStorage.getItem('positionArray_All_Cat'));
    }
    
//    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    
    var eventName = "";    
    
    var cleanResults = 0; // not using, this is just to clean the header
    
    var prologue;
    
    var precision = "tenth"; // "tenth" for 1 digit after the .
    
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
/*    var showArrow = 0; // FIXME disabled maybe not needed
    if (sessionStorage.getItem('showArrow')) {
        showArrow = sessionStorage.getItem('showArrow');
    }
*/    
    var showTvHeader = 0;
    if (sessionStorage.getItem('showTvHeader')) {
        showTvHeader = sessionStorage.getItem('showTvHeader');
    }

    var rows = 5; // number of rows to display on tv
    if (sessionStorage.getItem('rows')) {
        rows = sessionStorage.getItem('rows');
    }

    
    document.addEventListener("DOMContentLoaded", function() {
            
    
    
        if (document.getElementById('epictv')){
            
            epictv = 1;
            
            document.getElementById("rows").value = rows;
            
            if (document.getElementById("showTvHeader").checked) {
                showTvHeader = 1;
            } else {
                showTvHeader = 0;
            }
            
            const checkbox = document.getElementById('showTvHeader');

            checkbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    showTvHeader = 1;
                    rows = Number(document.getElementById("rows").value);
                    sessionStorage.setItem('rows', rows);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                    alignTDforTV();
                } else {
                    showTvHeader = 0;
                    rows = Number(document.getElementById("rows").value);
                    sessionStorage.setItem('rows', rows);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                    alignTDforTV();
                }
            });
            
            
/*            
            document.getElementById("showArrow").value = showArrow;
            
            if (document.getElementById("showArrow").checked) {
                showArrow = 1;
            } else {
                showArrow = 0;
            }
            
            const checkbox1 = document.getElementById('showArrow');

            checkbox1.addEventListener('change', (event) => {
                if (event.target.checked) {
                    showArrow = 1;
                    sessionStorage.setItem('showArrow', showArrow);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                    alignTDforTV();
                } else {
                    showArrow = 0;
                    sessionStorage.setItem('showArrow', showArrow);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                    alignTDforTV();
                }
            });
*/            
            
            
            
            
            if (showStopwatch == 1) {         
                    

                // Update the count down every 1 second
                var x = setInterval(function() {

                // Get todays date and time
                var now = new Date().getTime();
                    
                // Find the distance between now and the start time
                var distance = now - startTime;
                    
                if (distance > MaximumStageTime) { //race finished
                    // Time calculations for days, hours, minutes and seconds
                    //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    //var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    //var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    //var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    //var milliseconds = new Date().getMilliseconds();
                        
                    // Output the result in an element with id="showStopwatch"
                    document.getElementById("showStopwatch").innerHTML = "Finished";
                        
                } else if (distance > 0) { //race in motion
                    // Time calculations for days, hours, minutes and seconds
                    //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    var milliseconds = new Date().getMilliseconds();
                        
                    // Output the result in an element with id="showStopwatch"
                    document.getElementById("showStopwatch").innerHTML = hours.toString() + ":"
                    + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + "." + milliseconds.toString().substring(0, 1);
                        
                    // If the count down is over, write some text 
                } else {
                    //clearInterval(x);
                // Find the distance between now and the start time
                    var distance = startTime - now;
                        
                    // Time calculations for days, hours, minutes and seconds
                    //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        
                    // Output the result in an element with id="showStopwatch"
                    document.getElementById("showStopwatch").innerHTML = "Start in: " + hours.toString() + ":"
                    + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
                    }
                }, 100);
                
            }
            
            
        } // END epictv
            
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

    var tableClass = "fadeIn ";


    function intermediateOrFinish(section){
        
//        positionArray = []; // empting the array as the info inside is incorrect due to changing between sections.

//        positionArray_All_Cat = {}; // empting the array

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
/*            
            if (document.getElementById("showArrow").checked) {
                showArrow = 1;
            } else {
                showArrow = 0;
            }
            sessionStorage.setItem('showArrow', showArrow);
*/
            
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
            
            positionArray_All_Cat = {}; // empting the array
            
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
                positionArray_All_Cat = {}; // empting the array
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
                positionArray_All_Cat = {}; // empting the array
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
        
        Rafraichir = 60000; // every 60 seconds

        tableClass = "fadeIn "; // make the table fadeIn on change
        
//        Load('p1.html', 'result');
        
        document.getElementById("result").innerHTML = createLiveTable(P1);
        alignTable();
        
        if (epictv == 1) {
            alignTDforTV();
        }
        
    }


    function category(choice, cat){
        
//        positionArray = []; // empting the array as the info inside is incorrect due to canging between position/category position.
        
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
/*            
            if (document.getElementById("showArrow").checked) {
                showArrow = 1;
            } else {
                showArrow = 0;
            }
            sessionStorage.setItem('showArrow', showArrow);
*/

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
       
        
        Rafraichir = 60000; // every 60 seconds

        tableClass = "fadeIn "; // make the table fadeIn on change
        
//        Load('j1.html', 'result');
        
        document.getElementById("result").innerHTML = createLiveTable(P1);
        alignTable();

        if (epictv == 1) { 
            alignTDforTV();
        }

    };

    async function Load() {
        
                    
        var loop;
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
            document.getElementById("categoryOrAll").style.display = "block"; // if j1.html exist, display the buttons
            document.getElementById(target).innerHTML = createLiveTable(data);
        })
        .catch(rejected => {
            console.log('page unavailable');
        });
*/
        if (self.fetch) {

            try {
                if (useHash == 1) {
                    const response = await fetch(hash, {cache: "no-store"}); // check if hash changeed, which mean we have a new j1.txt to download
                    if (response.ok) {
                        var hashNew = await response.text();

                        if (hashOld != hashNew) {
                    
                            console.log('found new hash');
                            
                            const response = await fetch(url, {cache: "no-store"});
                            if (response.ok) {
                                document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                                document.getElementById("intermediateOrFinish").style.display = "block"; // if p1.html exist, display the buttons
                                P1 = await response.text();
                                document.getElementById(target).innerHTML = createLiveTable(P1);
            //                    alignTable();
                            
                                hashOld = hashNew;
                            }
                            
                        } else if (typeof P1 != 'undefined') {
                                
                            console.log('no new hash');
                            document.getElementById(target).innerHTML = createLiveTable(P1);
        //                    alignTable();
                        }
                        
                    } else if (typeof P1 != 'undefined') {
                            
                        console.log('no hash on server');
                            
                        document.getElementById(target).innerHTML = createLiveTable(P1);
    //                    alignTable();
                    }
                } else {
                    const response = await fetch(url, {cache: "no-store"});
                    if (response.ok) {
                        document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
                        document.getElementById("intermediateOrFinish").style.display = "block"; // if p1.html exist, display the buttons
                        P1 = await response.text();
                        document.getElementById(target).innerHTML = createLiveTable(P1);
    //                    alignTable();
                    }
                }
                
                if (epictv == 1) { 
                    alignTDforTV();
                }
                
            }
            catch (err) {
                console.log('results fetch failed', err);
            }

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
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById("categoryOrAll").style.display = "block"; // if j1.html exist, display the buttons
                    document.getElementById("intermediateOrFinish").style.display = "block"; // if p1.html exist, display the buttons
                    P1 = xhr.responseText;
                    document.getElementById(target).innerHTML = createLiveTable(P1);
                    alignTable();
    //           } else {
    //               document.getElementById("categoryOrAll").style.display = "none";
                }
            };
            
        //    xhr.open("GET", url + "?r=" + Math.random(), true);
            xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
            xhr.send(null);

            // upload message
        //    populatePre('uploadMsg.txt','updates');

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
        Rafraichir = 60000; // every 60 seconds

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

    function createLiveTable(p1) {
        
        var i;
        var timeGapDisplay = 1; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell
        var timeGapDisplayInter = 3; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell. FIXME - ONLY 3 IS IMPLIMENTED IN THE COMPETITOR RESULTS
        var raceEnded = 0;
        var doNotShowTime = 0; // dont display individuall time
        var lines;
        var competitorPosition = 0;
        var competitorNumber = 0;
        var competitorLaps = 0;

        var allArray = [];
        var positionChanged = "";
        var bestLapComp = 0;
        var bestLap = "99999999999";
        var bestLapComp2 = 0;
        var bestLap2 = "99999999999";
        var laps = 12; // number of laps
        var NewCategoryHeader = "";
/*        
        var bestTime2comp = 0;
        var bestTime2 = 0;
        var bestTimecomp = 0;
        var bestTime = 0;
*/        
        var Inter1Leader = {},Inter2Leader = {}, Inter3Leader = {};

        var Text, l, m, leaderInter1Time, leaderInter2Time, leaderInter3Time, competitorLaps, leaderLaps, leaderTime, prevCompCat, competitorId_Inter1Time, competitorId_Inter2Time, competitorId_Inter3Time, imTheLeaderInter1, imTheLeaderInter2, imTheLeaderInter3, headerText1, TVheaderText1, competitorTime, eeee, ffff, gggg, finished1, finished2, single1, single2, checkeredFlag, showFull, leader, showBlue, uci1, uci2, main_num, pair_num, blued, leaderCard, catCol;


        if (show == 1) {
            showFull = 'Intermediate 1';
        } else if (show == 2) {
            showFull = 'Intermediate 2';
        } else if (show == 3) {
            showFull = 'Intermediate 3';
        } else {
            showFull = 'Finish';
        }
        
        allArray = JSON.parse(p1);
        
        Text = allArray.shift();

        var headerFlag = Text.headerFlag;
        var HeaderEventName = Text.HeaderEventName;
        var DayTime = Text.DayTime;
        var ElapsedTime = Text.ElapsedTime;
        var RemainingTime = Text.RemainingTime;
//        MaximumStageTime = Text.MaximumStageTime;

        if (HeaderEventName.includes("+++")) { // clean table for results page
            cleanResults = 1;
            timeGapDisplay = 1;
            timeGapDisplayInter = 3;
            HeaderEventName = HeaderEventName.replace("+++", "");
        } else {
            cleanResults = 0;
        }

        /*
        var HeaderName = Text.split("\n");  
        var div = document.createElement("div");  
        div.innerHTML = HeaderName[0]; 
        var HeaderEventName = div.textContent || div.innerText || "";  
        var HeaderRaceName = HeaderEventName.split('-')[1].trim();  
     
    //    console.log(HeaderEventName);
*/
        if (eventName != HeaderEventName) {  
            positionArray_All_Cat = {};
//            positionArray = []; 
        }
        
        eventName = HeaderEventName;  // tickerTest
        

        if (HeaderEventName.includes("---")) { // do not show individuall times
            doNotShowTime = 1;
            HeaderEventName = HeaderEventName.replace("---", "");
        }

        if (HeaderEventName.includes("prologue")) { // prologue
            prologue = 1;
        } else {
            prologue = 0;
        }

        if (headerFlag.includes("_Stop.png") || headerFlag.includes("_CheckeredFlag.png")) { // check if race ended
            raceEnded = 1;
        }
        
        var bigFont = ' bigFont';

 //       var finalText = Text; // clear the finalText variable and add the title and time lines
  
  
        var finalText = '<h1 id="Title"><img src="' + headerFlag + '" alt="flag color">' + HeaderEventName.replace(" - ", "<br>") + '<img src="' + headerFlag + '" alt="flag color"></h1>\n<p id="Time"><span id="DayTime">' + DayTime + '</span><span id="ElapsedTime">' + ElapsedTime + '</span><span id="RemainingTime">' + RemainingTime + '</span></p>\n';

        

             for (b = 0; b < allArray.length; b++) {
                 
//                allArray[b].blue = allArray[b].B;
//                delete allArray[b].B;
        
        
                allArray[b].Id_TpsCumule = allArray[b].T;
                delete allArray[b].T;
                allArray[b].Id_TpsCumule_2 = allArray[b].TT;
                delete allArray[b].TT;

                allArray[b].Id_Position_Categorie = allArray[b].PC;
                delete allArray[b].PC;
                allArray[b].Id_Position_Overall = allArray[b].PO;
                delete allArray[b].PO;
                
                allArray[b].Id_Nationalite_2 = allArray[b].NA2;
                delete allArray[b].NA2;
                allArray[b].Id_Nationalite = allArray[b].NA;
                delete allArray[b].NA;
                
                allArray[b].Id_Categorie = allArray[b].C;
                delete allArray[b].C;
                allArray[b].Id_Ecart1er = allArray[b].E;
                delete allArray[b].E;
                allArray[b].Id_Equipe = allArray[b].Q;
                delete allArray[b].Q;


                allArray[b].Id_FinishTime = allArray[b].F;
                delete allArray[b].F;
                allArray[b].Id_Finishblue = allArray[b].FB;
                delete allArray[b].FB;

                allArray[b].Id_Inter1Time = allArray[b].T1;
                delete allArray[b].T1;
                allArray[b].Id_Inter1Ecart1er = allArray[b].E1;
                delete allArray[b].E1;
                allArray[b].Id_Inter1blue = allArray[b].B1;
                delete allArray[b].B1;
                allArray[b].Id_Inter2Time = allArray[b].T2;
                delete allArray[b].T2;
                allArray[b].Id_Inter2Ecart1er = allArray[b].E2;
                delete allArray[b].E2;
                allArray[b].Id_Inter2blue = allArray[b].B2;
                delete allArray[b].B2;
                allArray[b].Id_Inter3Time = allArray[b].T3;
                delete allArray[b].T3;
                allArray[b].Id_Inter3Ecart1er = allArray[b].E3;
                delete allArray[b].E3;
                allArray[b].Id_Inter3blue = allArray[b].B3;
                delete allArray[b].B3;

                allArray[b].Id_Arrow = allArray[b].A;
                delete allArray[b].A;
                allArray[b].Id_Image = allArray[b].M;
                delete allArray[b].M;
                allArray[b].Id_Image_2 = allArray[b].M2;
                delete allArray[b].M2;

                allArray[b].Id_Classe = allArray[b].L;
                delete allArray[b].L;
                allArray[b].Id_Groupe = allArray[b].G;
                delete allArray[b].G;
                allArray[b].Id_penalty = allArray[b].P;
                delete allArray[b].P;

                allArray[b].Id_NbTour = allArray[b].R;
                delete allArray[b].R;
                
                allArray[b].Id_Numero = allArray[b].O;
                delete allArray[b].O;
                allArray[b].Id_Nom = allArray[b].N;
                delete allArray[b].N;
                allArray[b].Id_Nom_2 = allArray[b].N2;
                delete allArray[b].N2;


                allArray[b].fPosition_Categorie = allArray[b].FC;
                delete allArray[b].FC;
                allArray[b].fPosition_Overall = allArray[b].FO;
                delete allArray[b].FO;
                allArray[b].findex = allArray[b].FI;
                delete allArray[b].FI;
                allArray[b].i1Position_Categorie = allArray[b].I1C;
                delete allArray[b].I1C;
                allArray[b].i1Position_Overall = allArray[b].I1O;
                delete allArray[b].I1O;
                allArray[b].i1index = allArray[b].I1;
                delete allArray[b].I1;
                allArray[b].i2Position_Categorie = allArray[b].I2C;
                delete allArray[b].I2C;
                allArray[b].i2Position_Overall = allArray[b].I2O;
                delete allArray[b].I2O;
                allArray[b].i2index = allArray[b].I2;
                delete allArray[b].I2;
                allArray[b].i3Position_Categorie = allArray[b].I3C;
                delete allArray[b].I3C;
                allArray[b].i3Position_Overall = allArray[b].I3O;
                delete allArray[b].I3O;
                allArray[b].i3index = allArray[b].I3;
                delete allArray[b].I3;




                // convert 0 to 99999999999
                if (allArray[b]["Id_Inter1Time"] == 0) {
                    allArray[b]["Id_Inter1Time"] = 99999999999;
                }
                if (allArray[b]["Id_Inter2Time"] == 0) {
                    allArray[b]["Id_Inter2Time"] = 99999999999;
                }
                if (allArray[b]["Id_Inter3Time"] == 0) {
                    allArray[b]["Id_Inter3Time"] = 99999999999;
                }
                if (allArray[b]["Id_Ecart1er"] == 0) {
                    allArray[b]["Id_Ecart1er"] = 99999999999;
                }
                if (allArray[b]["Id_FinishTime"] == 0) {
                    allArray[b]["Id_FinishTime"] = 99999999999;
                }
                if (allArray[b]["Id_Inter1Ecart1er"] == 0) {
                    allArray[b]["Id_Inter1Ecart1er"] = 99999999999;
                }
                if (allArray[b]["Id_Inter2Ecart1er"] == 0) {
                    allArray[b]["Id_Inter2Ecart1er"] = 99999999999;
                }
                if (allArray[b]["Id_Inter3Ecart1er"] == 0) {
                    allArray[b]["Id_Inter3Ecart1er"] = 99999999999;
                }
                if (allArray[b]["Id_TpsCumule"] == 0) {
                    allArray[b]["Id_TpsCumule"] = 99999999999;
                }
                if (allArray[b]["Id_TpsCumule_2"] == 0) {
                    allArray[b]["Id_TpsCumule_2"] = 99999999999;
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
    
/*
                // convert back to time - moved to timing computer
                    
                if (allArray[b]["Id_Inter1Time"] != 99999999999) {  
                    allArray[b]["Id_Inter1Time"] = timeString2ms(allArray[b]["Id_Inter1Time"]);
                }                                
                    
                if (allArray[b]["Id_Inter2Time"] != 99999999999) {  
                    allArray[b]["Id_Inter2Time"] = timeString2ms(allArray[b]["Id_Inter2Time"]);
                }                                
                    
                if (allArray[b]["Id_Inter3Time"] != 99999999999) {  
                    allArray[b]["Id_Inter3Time"] = timeString2ms(allArray[b]["Id_Inter3Time"]);
                }                                
                    
                if (allArray[b]["Id_FinishTime"] != 99999999999) {  
                    allArray[b]["Id_FinishTime"] = timeString2ms(allArray[b]["Id_FinishTime"]);
                }                                
                    
                if (allArray[b]["Id_TpsCumule"] != 99999999999) {  
                    allArray[b]["Id_TpsCumule"] = timeString2ms(allArray[b]["Id_TpsCumule"]);
                }

                if (allArray[b]["Id_TpsCumule_2"] != 99999999999) {  
                    allArray[b]["Id_TpsCumule_2"] = timeString2ms(allArray[b]["Id_TpsCumule_2"]);
                }
*/
/*                        
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
*/                    
                    
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
                
                   
/*                
                if ((allArray[b]["Id_Inter1blue"] == 1 || allArray[b]["Id_Inter2blue"] == 1 || allArray[b]["Id_Inter3blue"] == 1 || allArray[b]["Id_Finishblue"] == 1) && show == 4) {
                   allArray[b]["blue"] = 1;
                } else {
                    allArray[b]["blue"] = 0;
                }
*/
                if (allArray[b]["Id_Finishblue"] == 1 && show == 4) {
                   allArray[b]["blue"] = 1;
                } else {
                    allArray[b]["blue"] = 0;
                }

                
                if (allArray[b]["Id_Image"].includes("_Status") || allArray[b]["Id_Image_2"].includes("_Status") || allArray[b]["blue"] == 1 || (raceEnded == 1 && allArray[b]["Id_FinishTime"] == 99999999999)) {// FIXME Id_Status drops blue competitor to buttom , check if this is what needed
                    allArray[b].Id_Status = 1;
                } else {
                    allArray[b].Id_Status = 0;
                }
               
                 
             }
             
            console.log('in:')
             console.log(allArray);
             
             
// BEGIN SORTING
         
         
// FIXME   SORTING WORKS ONLY IF THERE IS ONE LAP. IF THE RACE IS LONGER NEEDED TO ADD "|| b.Id_NbTour - a.Id_NbTour" BEFORE "|| a.Id_FinishTime - b.Id_FinishTime". THIS IS THEORETICAL, NOT CHECKED!!!, maybe FIXED 

         // THE MAGIC - sort the array after the merge to get new results
         // FIXME Id_Status drops blue competitor to buttom , check if this is what needed


             
             
             
 // TEST
             
                     
    if (show == 1) { // sorting intermediate 1

        if (useCategory == "no") {
                       
            allArray.sort(function(a, b){return a.i1Position_Overall - b.i1Position_Overall});
             
        } else if (useCategory == "yes") {

            allArray.sort(function(a, b){return a.i1index - b.i1index});
        }
                    
    } else if (show == 2) { // sorting intermediate 2

        if (useCategory == "no") {
                       
            allArray.sort(function(a, b){return a.i2Position_Overall - b.i2Position_Overall});
             
        } else if (useCategory == "yes") {

            allArray.sort(function(a, b){return a.i2index - b.i2index});
        }
                    
    } else if (show == 3) { // sorting intermediate 3

        if (useCategory == "no") {
                       
            allArray.sort(function(a, b){return a.i3Position_Overall - b.i3Position_Overall});
             
        } else if (useCategory == "yes") {

            allArray.sort(function(a, b){return a.i3index - b.i3index});
        }
                    
    } else if (show == 4) { // sorting finish

        if (useCategory == "no") {
                       
            allArray.sort(function(a, b){return a.fPosition_Overall - b.fPosition_Overall});
             
        } else if (useCategory == "yes") {

            allArray.sort(function(a, b){return a.findex - b.findex});
        }
                    
    }
         
         
         
         
         
         
         
         
         
         
         // end TEST         

             
             
             
/*             
    if (show == 1) { // sorting intermediate 1

        if (useCategory == "no") {
            
 // calculate categorie position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);
                        
            }
 // END calculate categorie position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);
                    
            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
                    
    } else if (show == 2) { // sorting intermediate 2

        if (useCategory == "no") {
            
 // calculate categorie position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);
                        
            }
 // END calculate categorie position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {
                // reasign postion number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);

 
            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
                    
    }  else if (show == 3) { // sorting intermediate 3

        if (useCategory == "no") {
            
 // calculate categorie position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {
                // reasign postion number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);
                        
            }
 // END calculate categorie position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);
                     
            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }
                    
    } else { // sorting finish
         
         
         
         if (useCategory == "no") {
            
 // calculate categorie position
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["Id_Position_Categorie"] = Number(m);
                    
            }
 // END calculate categorie position
           
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
        } else if (useCategory == "yes") {
            
// calculate overall position
            
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            for (l = 0; l < allArray.length; l++) {

                // reasign postion number
                     allArray[l]["Id_Position_Overall"] = Number(l+1);
                     
            }
             
// END calculate overall position
            
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.single - b.single || a.oldBlue - b.oldBlue || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
        }

                    
                    
    } // END "show"
         
// END SORTING
*/         
         
// HEADER              
                            
        headerText1 = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

    // hard coded header for now
//       if (cleanResults == 0) {

                //  headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
                //  headerText1 += '<th colspan="2" class="rnkh_font Id_Position"><div>CAT</div><div>GC</div></th>';
 /*       } else {
                    headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
                    headerText1 += '<th class="rnkh_font Id_Position">Cat</th>';
                    headerText1 += '<th class="rnkh_font Id_Position">GC</th>';
        }
*/
                    headerText1 += '<th class="rnkh_font Id_Position">GC Position</th>';
                    headerText1 += '<th class="rnkh_font Id_Position">Cat Position</th>';

                    headerText1 += '<th class="rnkh_font Id_Numero">No.</th>';


 //       if (cleanResults == 0) {

                    headerText1 += '<th class="rnkh_font Id_Nom">Riders</th>';
            //        headerText1 += '<th class="rnkh_font Id_Nom_2">Name 2</th>';
                    headerText1 += '<th class="rnkh_font Id_Equipe">Team</th>';

                    if (useCategory == "no") {
                        headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>';
                    }            
/*
                    if (doNotShowTime == 0 && show == 4) {
                        headerText1 += '<th class="rnkh_font Id_TpsCumule">Individual Time</th>';
                    }
*/                    
                    //      headerText1 += '<th class="rnkh_font Id_TpsCumule_2">זמן 2</th>';

                    
/*                    
                    if (show == 4) {
                        headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
                        headerText1 += '<th class="rnkh_font Id_Inter2Time">Inter. 2</th>'; // intermediate 2 time
                        headerText1 += '<th class="rnkh_font Id_Inter3Time">Inter. 3</th>'; // intermediate 3 time
                    if (timeGapDisplayInter == 1) {
                        headerText1 += '<th class="rnkh_font Id_Inter1Ecart1er">Inter. 1 GAP</th>'; // intermediate 1 time diff
                        headerText1 += '<th class="rnkh_font Id_Inter2Ecart1er">Inter. 2 GAP</th>'; // intermediate 2 time diff
                        headerText1 += '<th class="rnkh_font Id_Inter3Ecart1er">Inter. 3 GAP</th>'; // intermediate 3 time diff
                    }
                }
*/

/*       } else {
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

            
        }

*/
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

// END HEADER
 
         
    // fix the position fields of the competitors and start building the final table
            m = 0;
            prevCompCat = ""

//            finalText += '<div id="liveTable"><table class="' + tableClass + 'line_color">';

            if (useCategory == "no") {
                finalText += '\n<div id="liveTable"><table class="' + tableClass + 'line_color">\n';
            } else {

                finalText += '\n<div id="liveTable">\n';
            }           

            
            for (l = 0; l < allArray.length; l++) {

                
               if (show == 1) {
                    allArray[l]["Id_Position_Overall"] = allArray[l]["i1Position_Overall"];
                    allArray[l]["Id_Position_Categorie"] = allArray[l]["i1Position_Categorie"];
                } else if (show == 2) {
                    allArray[l]["Id_Position_Overall"] = allArray[l]["i2Position_Overall"];
                    allArray[l]["Id_Position_Categorie"] = allArray[l]["i2Position_Categorie"];
                } else if (show == 3) {
                    allArray[l]["Id_Position_Overall"] = allArray[l]["i3Position_Overall"];
                    allArray[l]["Id_Position_Categorie"] = allArray[l]["i3Position_Categorie"];
                } else {
                    allArray[l]["Id_Position_Overall"] = allArray[l]["fPosition_Overall"];
                    allArray[l]["Id_Position_Categorie"] = allArray[l]["fPosition_Categorie"];
                }
                
                
                
/*
                // reasign postion number
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
                 
/*                 
                if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
                    leaderTime = allArray[l]["Id_Sector_FinishTime"];
                    leaderLaps = allArray[l]["Id_NbTour"];
                } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
                    leaderTime = allArray[l]["Id_Sector_FinishTime"];
                    leaderLaps = allArray[l]["Id_NbTour"];
                }  
*/
/*
                            if (allArray[l]["Id_Position"] == 1) {
                                leaderTime = allArray[l]["Id_Sector_FinishTime"];
                                leaderLaps = allArray[l]["Id_NbTour"];
                            }
*/

                    // fix the diff fields of the competitors
//                competitorLaps = allArray[l]["Id_NbTour"];
                
/*                
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
                if (competitorLaps == leaderLaps) {
                    competitorTime = allArray[l]["Id_Sector_FinishTime"];
                    
                    if (competitorTime != leaderTime && (competitorTime - leaderTime) > 0 && (competitorTime - leaderTime) < 86400000) { // check time is between 0 and 24h
                    allArray[l]["Id_Ecart1er"] = ms2TimeString(competitorTime - leaderTime);
                    } else {
                    allArray[l]["Id_Ecart1er"] = 99999999999;
                    }
                } else {
                    allArray[l]["Id_Ecart1er"] = 99999999999;
                }
                            
*/                    
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
               
                if (allArray[l]["Id_Sector_Ecart1er"] != 99999999999) {  
                    allArray[l]["Id_Sector_Ecart1er"] = ms2TimeString(allArray[l]["Id_Sector_Ecart1er"]);
                }
         
                             // position change arrow/status prep

                    competitorNumber = allArray[l]["Id_Numero"];
                    competitorPosition = 0;

                    // calculating arrows status
                    
                    positionChanged = "";

                    if (typeof positionArray_All_Cat[allArray[l]["Id_Numero"]] != 'undefined' && useCategory == "no") {
                        
                        if (positionArray_All_Cat[allArray[l]["Id_Numero"]][0] < allArray[l]["Id_Position_Overall"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][0] > 0) {
                            allArray[l]["Id_Arrow"] = 3; // down :(
                            positionChanged = "lostPosition ";
                            
                        } else if (positionArray_All_Cat[allArray[l]["Id_Numero"]][0] > allArray[l]["Id_Position_Overall"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][0] > 0) {
                            allArray[l]["Id_Arrow"] = 4; // up :)
                            positionChanged = "gainedPosition ";
                            
                        }
                        
                    } else if (typeof positionArray_All_Cat[allArray[l]["Id_Numero"]] != 'undefined' && useCategory == "yes") {
                        
                        if (positionArray_All_Cat[allArray[l]["Id_Numero"]][1] < allArray[l]["Id_Position_Categorie"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][1] > 0) {
                            allArray[l]["Id_Arrow"] = 3; // down :(
                            positionChanged = "lostPosition ";
                            
                        } else if (positionArray_All_Cat[allArray[l]["Id_Numero"]][1] > allArray[l]["Id_Position_Categorie"] && positionArray_All_Cat[allArray[l]["Id_Numero"]][1] > 0) {
                            allArray[l]["Id_Arrow"] = 4; // up :)
                            positionChanged = "gainedPosition ";
                            
                        }
                    }
                    
       //     positionArray_All_Cat[allArray[l]["Id_Numero"]] = [allArray[l]["Id_Position_Overall"], allArray[l]["Id_Position_Categorie"]];

       
                    
                    if (allArray[l]["Id_Image"].includes("_Status10") || allArray[l]["Id_Image_2"].includes("_Status10") || (allArray[l]["blue"] == 1 && allArray[l]["oldBlue"] == 1)) {
                        allArray[l]["Id_Arrow"] = 10; // DSQ
                    } else if (allArray[l]["Id_Image"].includes("_Status5") || allArray[l]["Id_Image_2"].includes("_Status5")) {
                        allArray[l]["blue"] = 1; //FIXME
                    } else if (allArray[l]["Id_Image"].includes("_Status11") || allArray[l]["Id_Image_2"].includes("_Status11")) {
                        allArray[l]["Id_Arrow"] = 11; // DNF
                    } else if (allArray[l]["Id_Image"].includes("_Status12") || allArray[l]["Id_Image_2"].includes("_Status12")) {
                        allArray[l]["Id_Arrow"] = 12;
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
                    } else if (allArray[l]["Id_Categorie"] == 'Grand') {
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
                } else if (allArray[l]["Id_Categorie"] == 'Grand') {
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
                }
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    uci2 = '<span title="UCI Rider" class="Flag UCI"></span>';
                }
                

 /*               if (cleanResults == 0) {
                    eeee = '<div class="FirstLine ' + single2 + '">';
                    ffff = '<div class="SecoundLine ' + single1 + '">';
                    gggg = '</div>';
               } else {
                    
                    eeee = '';
                    ffff = '';
                    gggg = '</td>';
                }
*/
                
                if (allArray[l]["Id_FinishTime"] != 99999999999 && allArray[l]["blue"] == 0 && show == 4) {
                    checkeredFlag = "finished ";
                } else {
                    checkeredFlag = "";
                }
                
                if (allArray[l]["blue"] == 1) {
                  blued = 'blued ';  
                } else {
                    blued = '';
                }


                 
// MAIN TABLE DATA, build table for web (TV comes later) 

    if (((catcat != "None" && allArray[l]["Id_Categorie"] == catcat && useCategory == "yes") || (catcat == "None" && useCategory == "yes") || useCategory == "no")  && epictv == 0) {
                 
// if ((allArray[l]["Id_Position"] < 6 && epictv == 1) || (epictv == 0)) { // TV show only 5 competitors



// add category name header and table header
            if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0 && catcat == 'None') { // add table end tag
                    finalText += '</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
                            
                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1 + '\n';                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerText1;
                    finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + headerText1 + '\n';
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
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
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
                    finalText += '<td title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dns.svg" alt="dns"></td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dnf.svg" alt="dnf"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_dsq.svg" alt="dsq"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_nq.svg" alt="nq"></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td title="DNF/DSQ" class="orange ' + blued + 'rnk_font"><img class="dnsfq" src="Images/_status.svg" alt="status"></td>';
                    
                } else if (showBlue == 1) {
                
                    finalText += '<td title="Blue Board Rider" class="blued rnk_font">&nbsp;</td>'; //&#9608;

                } else if (allArray[l]["Id_Arrow"] == 3) { // red
                    
                    if (prologue == 1) {
                        
                        finalText += '<td class="' + checkeredFlag + 'red rnk_font"><img class="postionChanged" src="Images/_MinusPosition.svg" alt="lost places"></td>';
                        
                    } else {

                        finalText += '<td class="' + checkeredFlag + 'red rnk_font"></td>';
                    }
                    
                } else if (allArray[l]["Id_Arrow"] == 4) { // green
                    
                    if (prologue == 1) {
                        
                        finalText += '<td class="' + checkeredFlag + 'green rnk_font"><img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places"></td>';
                        
                    } else {

                        finalText += '<td class="' + checkeredFlag + 'green rnk_font"></td>';
                    }
                    
                } else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td title="Finished" class="finished white rnk_font">&nbsp;</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td class="black rnk_font fadeIn">P</td>';
                    
                } else {

                    finalText += '<td class="white rnk_font fadeIn">&nbsp;</td>'; // &#9671;

                }
                
                if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] != 0 || show != 4) { // enable show != 4, to show postion only on finish
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show position if status or no finish time
//                    
//                    if (cleanResults == 1) {
//
//                        finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show  postiion if status or no finish time
//                    }
                    
                } else {
//                    if (cleanResults == 0) {

                        finalText += '<td class="rnk_font"><div class="pos">' + allArray[l]["Id_Position_Categorie"] + '</div><div class="pos">' + allArray[l]["Id_Position_Overall"] + '</div></td>'; 
                        
//                    } else if (cleanResults == 1) {
//                       
//                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; // category position
//                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; // overall postiion
//                    }
                    
                }

*/

                // add and style the status/arrow
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += '<td colspan="2" title="Did Not Started" class="black ' + blued + 'rnk_font">DNS</td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td colspan="2" title="Did Not Finished" class="black ' + blued + 'rnk_font">DNF</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td colspan="2" title="Disqualified" class="black ' + blued + 'rnk_font">DSQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td colspan="2" title="Not Qualified" class="black ' + blued + 'rnk_font">NQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td colspan="2" title="*" class="black ' + blued + 'rnk_font">*</td>';
                    
                } else if (showBlue == 1) {
                
                    finalText += '<td colspan="2" title="Blue Board Rider" class="blued rnk_font">&nbsp;</td>'; //&#9608;

                } else if (allArray[l]["single"] != 0 && show == 4) {
                    
                    finalText += '<td colspan="2" title="Single Finisher" class="black ' + blued + 'rnk_font">SF</td>';
                    
                } else if (allArray[l]["Id_Sector_FinishTime"] != 99999999999 /*&& show == 4*/ && allArray[l]["oldBlue"] == 0 && allArray[l]["single"] == 0 && !allArray[l]["Id_Image"].includes("_Status") && !(show != 4 && ((show >= 1 && allArray[l]["Id_Inter1blue"] == 1) || (show >= 2 && allArray[l]["Id_Inter2blue"] == 1) || (show >= 3 && allArray[l]["Id_Inter3blue"] == 1))) ) {
                    
                    
                    
                    
                    if (allArray[l]["Id_Arrow"] == 3 && prologue == 1) { // red
                        
                            
                        
                        finalText += '<td class="rnk_font bigFont red"><img class="postionChanged" src="Images/_MinusPosition.svg" alt="gained places">' + allArray[l]["Id_Position_Overall"] + '</td>';
                    
                        finalText += '<td class="rnk_font bigFont fadeIn ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>';

                            
                            
                    } else if (allArray[l]["Id_Arrow"] == 4 && prologue == 1) { // green
                        
                        
                        finalText += '<td class="rnk_font bigFont green"><img class="postionChanged" src="Images/_PlusPosition.svg" alt="gained places">' + allArray[l]["Id_Position_Overall"] + '</td>';
                    
                        finalText += '<td class="rnk_font bigFont fadeIn ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>';
                        
                    } else { // finished
                        
    //                   finalText += '<td class="rnk_font bigFont fadeIn"><span class="' + catCol + '">&nbsp;' + allArray[l]["Id_Position_Categorie"] + '</span>&nbsp;&nbsp;&nbsp;<span class="black">' + allArray[l]["Id_Position_Overall"] + '&nbsp;</span></td>'; 
                            
                        finalText += '<td class="rnk_font bigFont fadeIn">' + allArray[l]["Id_Position_Overall"] + '</td>'; 
                        finalText += '<td class="rnk_font bigFont fadeIn ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>';
                        
                    }                     
                    
                    
                    
                    
                    
                    
                    
                    
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td colspan="2" class="black rnk_font fadeIn">P</td>';
                    
                } else {

                    finalText += '<td colspan="2" class="white rnk_font fadeIn">&nbsp;</td>'; // &#9671;
                }



                if (allArray[l]["oldBlue"] == 1) {
                    finalText += '<td title="Blue Board Rider" class="rnk_font blueCard ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else if (allArray[l]["leader"] == 1) {
                    finalText += '<td title="Epic Leader" class="rnk_font ' + leaderCard + ' ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font highlight ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                }
/*                
                if (cleanResults == 1) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full"] + '</td>'; // add rider 1 number
                }
*/                
                if (allArray[l]["Id_TpsCumule"] != 99999999999 && allArray[l]["Id_TpsCumule_2"] == 99999999999 /*&& cleanResults == 0*/ && allArray[l]["single"] == 0) { // only rider 1 finished at this point
                    finalText += '<td class="rnk_font left"><div class="FirstLine ' + single2 + '">' + finished1 + uci1 + allArray[l]["Id_Nom"];// add the name
                    if (typeof allArray[l]["Id_Nationalite"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                        
//                        if (cleanResults == 0) {
                                
                            finalText += '<span title="' + allArray[l]["Id_Nationalite"] + '" class="Flag ' + single2 + ' ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>'/* + leader*/; // add flag
 //                       }
                    }
                    finalText += '</div>';// add the name
                    
                } else {
                    finalText += '<td class="rnk_font left"><div class="FirstLine ' + single2 + '">' + uci1 + allArray[l]["Id_Nom"];// add the name
                    if (typeof allArray[l]["Id_Nationalite"] != 'undefined') {
 //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
    //                    if (cleanResults == 0) {
                            finalText += '<span title="' + allArray[l]["Id_Nationalite"] + '" class="Flag ' + single2 + ' ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>'/* + leader*/; // add flag
    //                    }
                    }
                    finalText += '</div>';// add the name
                }

    //            if (cleanResults == 0) {
    //                finalText += '</div>';
    //            }
                
                
                
                
                
         //       finalText += '<td class="rnk_font">' + allArray[l]["Id_Nom"] + '</td>';// add the name
//                if (cleanResults == 0) {
       //             finalText += '<div class="SecoundLine">';
                    

                    
                    if (allArray[l]["Id_TpsCumule"] == 99999999999 && allArray[l]["Id_TpsCumule_2"] != 99999999999 && allArray[l]["single"] == 0) { // only rider 2 finished at this point
                        finalText += '<div class="SecoundLine ' + single1 + '">' + finished2 + uci2 + allArray[l]["Id_Nom_2"];// add the name
                        if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
    //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                            finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>'/* + leader*/; // add flag
                        }
                        finalText += '</div></td>';// add the name
                        
                    } else {
                        finalText += '<div class="SecoundLine ' + single1 + '">' + uci2 + allArray[l]["Id_Nom_2"];// add the name
                        if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
    //                       finalText += '<img class="Flag" src="Images/CountryFlags/' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '.svg">'; // add flag
                            finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span>'/* + leader*/; // add flag
                        }
                        finalText += '</div></td>';// add the name
                    }
                   
                    
                if (typeof allArray[l]["Id_Equipe"] == 'undefined') {           
                    finalText += '<td class="rnk_font">&nbsp;</td>';// add team name
                } else {
                    finalText += '<td class="rnk_font left wrap"><div class="team">' + allArray[l]["Id_Equipe"] + '</div></td>';// add team name
                }
                    
                if (useCategory == "no" /*&& cleanResults == 0*/) {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; 
                }            
                     
                    
                    
    //              finalText += '</div>';
                    
//                }
                
/*                
            if (doNotShowTime == 0 && show == 4) {
                
      //          if (cleanResults == 0) {
     //               finalText += '<div class="FirstLine">';
      //          }
                
                if (allArray[l]["Id_TpsCumule"] == 99999999999) {
                    finalText += '<td class="rnk_font"><div class="FirstLine ' + single2 + '">-' + '</div>'; // add time
                } else {
                    finalText += '<td class="rnk_font"><div class="FirstLine ' + single2 + '">' + allArray[l]["Id_TpsCumule"] + '</div>'; // add time
                }

      //          if (cleanResults == 0) {
     //               finalText += '</div>';
     //           }
                
                
                
   //              if (cleanResults == 0) {
     //               finalText += '<div class="SecoundLine">';
               
                
                
                
                  if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                    finalText += '<div class="SecoundLine">-</div></td>'; // add time
                } else {
                    finalText += '<div class="SecoundLine">' + allArray[l]["Id_TpsCumule_2"] + '</div></td>'; // add time
                }
                
                    
           //         finalText += '</div>';
                    
//                }
                
            }          
*/
            
            
/*            
                if (cleanResults == 1) {
                                            
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
                
/*  this is the 3 option for timeGapDisplayInter, only "3" is impimented, DO NOT USE THE OTHERS.
 
            
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

/*                    
if (show == 4 &&) {

// BEGIN intermediate 1
                    if (allArray[l]["Id_Inter1blue"] == 1) {
                        
                         if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += '<td title="Blue Board Rider" class="rnk_font mobile"><span class="Flag blueFlag"></span></td>'; // add intermediate blue
                        } else {
                            finalText += '<td title="Blue Board Rider" class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter1Time"] + '<span class="Flag blueFlag"></span></div>'; // add intermediate time

                            if (allArray[l]["Id_Inter1Ecart1er"] == 99999999999) {
                                finalText += '<div>-</div></td>'; // add diff
                            } else {
                                finalText += '<div>+' + allArray[l]["Id_Inter1Ecart1er"] + '<span class="Flag transparent"></span></div></td>'; // add diff
                            }
                            
                        }
                                                
                    
                    } else if (imTheLeaderInter1 == 1) {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += '<td class="rnk_font mobile">-</td>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter1Time"] + '</div><span class="Flag numberOne"></span></td>'; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter1Time"] == 99999999999) {
                            finalText += '<td class="rnk_font mobile"><div>-</div>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter1Time"] + '</div>'; // add intermediate time
                        }

                        if (allArray[l]["Id_Inter1Ecart1er"] == 99999999999) {
                            finalText += '<div>-</div></td>'; // add diff
                        } else {
                            finalText += '<div>+' + allArray[l]["Id_Inter1Ecart1er"] + '</div></td>'; // add diff
                        }
                    }
// END intermediate 1
                    
// BEGIN intermediate 2
                    if (allArray[l]["Id_Inter2blue"] == 1) {
                                                
                        
                         if (allArray[l]["Id_Inter2Time"] == 99999999999) {
                            finalText += '<td title="Blue Board Rider" class="rnk_font mobile"><span class="Flag blueFlag"></span></td>'; // add intermediate blue
                        } else {
                            finalText += '<td title="Blue Board Rider" class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter2Time"] + '<span class="Flag blueFlag"></span></div>'; // add intermediate time

                            if (allArray[l]["Id_Inter2Ecart1er"] == 99999999999) {
                                finalText += '<div>-</div></td>'; // add diff
                            } else {
                                finalText += '<div>+' + allArray[l]["Id_Inter2Ecart1er"] + '<span class="Flag transparent"></span></div></td>'; // add diff
                            }
                            
                        }
                    
                    } else if (imTheLeaderInter2 == 1) {
                        if (allArray[l]["Id_Inter2Time"] == 99999999999) {
                            finalText += '<td class="rnk_font mobile">-</td>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter2Time"] + '</div><span class="Flag numberOne"></span></td>'; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter2Time"] == 99999999999) {
                            finalText += '<td class="rnk_font mobile"><div>-</div>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter2Time"] + '</div>'; // add intermediate time
                        }

                        if (allArray[l]["Id_Inter2Ecart1er"] == 99999999999) {
                            finalText += '<div>-</div></td>'; // add diff
                        } else {
                            finalText += '<div>+' + allArray[l]["Id_Inter2Ecart1er"] + '</div></td>'; // add diff
                        }
                    }
// END intermediate 2
                    
// BEGIN intermediate 3
                    if (allArray[l]["Id_Inter3blue"] == 1) {
                                                
                        
                         if (allArray[l]["Id_Inter3Time"] == 99999999999) {
                            finalText += '<td title="Blue Board Rider" class="rnk_font mobile"><span class="Flag blueFlag"></span></td>'; // add intermediate blue
                        } else {
                            finalText += '<td title="Blue Board Rider" class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter3Time"] + '<span class="Flag blueFlag"></span></div>'; // add intermediate time

                            if (allArray[l]["Id_Inter3Ecart1er"] == 99999999999) {
                                finalText += '<div>-</div></td>'; // add diff
                            } else {
                                finalText += '<div>+' + allArray[l]["Id_Inter3Ecart1er"] + '<span class="Flag transparent"></span></div></td>'; // add diff
                            }
                            
                        }
                    
                    } else if (imTheLeaderInter3 == 1) {
                        if (allArray[l]["Id_Inter3Time"] == 99999999999) {
                            finalText += '<td class="rnk_font mobile">-</td>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter3Time"] + '</div><span class="Flag numberOne"></span></td>'; // add intermediate time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Inter3Time"] == 99999999999) {
                            finalText += '<td class="rnk_font mobile"><div>-</div>'; // add intermediate time
                        } else {
                            finalText += '<td class="rnk_font mobile"><div class="bold">' + allArray[l]["Id_Inter3Time"] + '</div>'; // add intermediate time
                        }

                        if (allArray[l]["Id_Inter3Ecart1er"] == 99999999999) {
                            finalText += '<div>-</div></td>'; // add diff
                        } else {
                            finalText += '<div>+' + allArray[l]["Id_Inter3Ecart1er"] + '</div></td>'; // add diff
                        }
                    }
// END intermediate 3

    
}
*/


// TOTAL TIME & GAP                
                
                if (timeGapDisplay == 1) {
                    if (allArray[l]["Id_Sector_FinishTime"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // add total time
                    } else {
                        finalText += '<td class="rnk_font bold">' + allArray[l]["Id_Sector_FinishTime"] + '</td>'; // add total time
                    }
        //          } else {
        //             finalText += '<td class="rnk_font bold">' + allArray[l]["Id_Sector_FinishTime"] + '</td>'; // add total time
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
                            finalText += '<td class="rnk_font">-</td>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font"><div class="bold">' + allArray[l]["Id_Sector_FinishTime"] + '</div></td>'; // add total time
                        }
                        
                    } else {
                        if (allArray[l]["Id_Sector_FinishTime"] == 99999999999) {
                            finalText += '<td class="rnk_font"><div>-</div>'; // add total time
                        } else {
                            finalText += '<td class="rnk_font"><div class="bold">' + allArray[l]["Id_Sector_FinishTime"] + '</div>'; // add total time
                        }

                        if (allArray[l]["Id_Sector_Ecart1er"] == 99999999999) {
                            finalText += '<div>-</td>'; // add diff
                        } else {
                            finalText += '<div>+' + allArray[l]["Id_Sector_Ecart1er"] + '</td>'; // add diff
                        }
                    }
                }
                
                
        //       }

                
      //      }    

                    finalText += '</tr>\n';
                   
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


// BEGIN TV

if ((epictv == 1 && ((allArray[l]["Id_Position_Categorie"] <= rows && useCategory == "yes") || (allArray[l]["Id_Position_Overall"] <= rows && useCategory == "no")) && allArray[l]["Id_Sector_FinishTime"] != 99999999999 && allArray[l]["single"] == 0 && allArray[l]["Id_Status"] == 0 && showBlue == 0 && allArray[l]["oldBlue"] == 0) && ((catcat != "None" && allArray[l]["Id_Categorie"] == catcat && useCategory == "yes") || (catcat == "None" && useCategory == "yes") || useCategory == "no")) { // TV show only 'rows' competitors
    
    
    
 // HEADER for tv            
                            
        TVheaderText1 = '<tr class="rnkh_bkcolor">';

   //     for (b = 0; b < qqq.length; b++) { 
   //         if (qqq[b][0] != "Id_MeilleurTour" && qqq[b][0] != "Id_Arrow" && qqq[b][0] != "Id_TpsTour1" && qqq[b][0] != "Id_TpsTour2" && qqq[b][0] != "Id_TpsTour3" && qqq[b][0] != "Id_Sector_Ecart1er" && qqq[b][0] != "Id_Position" && qqq[b][0] != "Id_Categorie" && qqq[b][0] != "Id_Image") {
   //             temp.push(b);
   //         headerText1 += '<th class="rnkh_font" id="' +qqq[b][0]+ '">' +qqq[b][1]+ '</th>';
   //         }
   //     }          

                if (/*showArrow == 1*/ showTvHeader == 0) {
                    TVheaderText1 += '<th style="width: 0; margin: 0; padding: 0;" class="rnkh_font"></th>';
                    TVheaderText1 += '<th class="rnkh_font">&nbsp;</th>';
                }
        
                    TVheaderText1 += '<th class="rnkh_font Id_Position">Rank</th>';
                    TVheaderText1 += '<th class="rnkh_font Id_Nom left">Name</th>';
                    TVheaderText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>';
                    TVheaderText1 += '<th class="rnkh_font Id_Numero">Nr</th>';
                    TVheaderText1 += '<th class="rnkh_font Id_Sector_FinishTime">Time</th>'; // combined time

                  
        TVheaderText1 += '</tr>';
        
       //    console.log(TVheaderText1);

// END HEADER for tv
   
                if (useCategory == "no") {
                    var arrowC = "Men";
                } else {
                    var arrowC = allArray[l]["Id_Categorie"];
                }
   
                var lll = 0;

            // add category name header and table header
            if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + TVheaderText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0 && catcat == 'None') { // add table end tag
                    finalText += '<tr><td style="text-align: right; padding-right: 0;" colspan="99"><img style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></td></tr>';
                    finalText += '</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
//                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + TVheaderText1 + '\n';                
                            


                finalText += '<table class="' + tableClass + 'line_color">\n';
                
                
                if (showTvHeader == 1) {
                    finalText += '<tr><td colspan="99" style="width: 100%; height: 100% text-align:center; margin-buttom: 50px;" class="title_font"><img style="margin: 0; padding: 0; height: 120px; transform: rotate(90deg); " src="Images/arrow' + arrowC + '.svg"></td></tr>\n';

                    finalText += '<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/' + allArray[l]["Id_Categorie"].replace(" ", "").toLowerCase() + '.svg"></div><div class="subHeader">' + showFull + '</div></td></tr>\n';
                } else {
                    finalText += '<tr><td colspan="99" style="width: 100%; height: 100% text-align:center; padding-top: 500px;" class="title_font"></td>&nbsp;</tr>\n'; // just to fill
                }
                
                finalText += TVheaderText1 + '\n';

                lll = 1;
                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
                
                
                if (showTvHeader == 1) {
                    finalText += '<tr><td colspan="99" style="width: 100%; height: 100% text-align:center; margin-buttom: 50px;" class="title_font"><img style="margin: 0; padding: 0; height: 120px; transform: rotate(90deg); " src="Images/arrow.svg"></td></tr>\n';

                    finalText += '<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/gc.svg"></div><div class="subHeader">' + showFull + '</div></td></tr>\n';
                } else {
                    finalText += '<tr><td colspan="99" style="width: 100%; height: 100% text-align:center; padding-top: 500px;" class="title_font">&nbsp;</td></tr>\n'; // just to fill
                }
//                finalText += '<tr><td colspan="99" class="title_font">GC</td></tr>' + TVheaderText1;
                finalText += TVheaderText1 + '\n';
                
                lll = 1;
            }

    
    
            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="rnk_bkcolor EvenRow">';
            }
    
                 if (/*showArrow == 1*/ showTvHeader == 0 && lll == 1) {
                     
                     if (rows <= 3) {
                         var size = "120";
                     } else if (rows > 6) {
                         var size = "160";
                     } else {
                         var size = "140";
                     }
                    
                     
                    finalText += '<td rowspan="' + rows + '" style="vertical-align: middle; margin: 0; padding: 0; overflow: visible; text-align: left;max-width: 0; width: 0;" class="rnk_font"><img style="position: relative; overflow: visible; margin: 0; padding: 0; height: ' + size + 'px; max-width: none; width: auto;" src="Images/arrow' + arrowC + '.svg"></td>';
                    
                    finalText += '<td style="min-width: 80px;" class="rnk_font">&nbsp;</td>';
                                    
                    lll = 0;

                } else if (/*showArrow == 1*/ showTvHeader == 0 && lll == 0) {
                    finalText += '<td style="min-width: 80px;" class="rnk_font">&nbsp;</td>';
                
                }
    
    
 
                if (useCategory == "no") {

                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Overall"] + '</td>'; // add overall position
                
                } else {
                    
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Position_Categorie"] + '</td>'; // add category position
                }
                
                finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom"] + ' / ' + allArray[l]["Id_Nom_2"] + ' ' + leader + '</td>'; // add riders name
                
                finalText += '<td class="rnk_font"><span class="Flag ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>' + ' ' + '<span class="Flag ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span></td>'; // add flags

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
    
} // END TV

                
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


    }        // end for l
         
        if (epictv == 1) {
            finalText += '<tr><td style="text-align: right; padding-right: 0;" colspan="99"><img  style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></td></tr>';
        }
        finalText += '</table></div>';

            console.log('out: ')
             console.log(allArray);
      //       console.log(finalText);
              
      //        var allArrayJSON = JSON.stringify(allArray);             
      //        console.log(JSON.parse(allArrayJSON));     


    sessionStorage.setItem('positionArray_All_Cat', JSON.stringify(positionArray_All_Cat));
            
    // allArray = [];
    
    tableClass = "";
            
    return finalText

    };
        

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

    function alignTable() {
        
        if (/*cleanResults == 0 &&*/ epictv == 0) {
            
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

                var ddd = 88 / (tds.length - 2); // 88% divided by number of columns - first 2 column

                tt[kk].querySelectorAll('td.rnk_font:nth-child(n+4)').forEach(function(element) { // all from column 4
                    element.style.width = ddd + "%";
                });

                tt[kk].querySelectorAll('th.rnkh_font:nth-child(n+4)').forEach(function(element) { // all from column 4
                    element.style.width = ddd + "%";
                });
        //       console.log(kk + " " + numCols)
            }
        }
    };  
    
 
 
 
    function alignTDforTV() {
            if (rows <= 3) {
                //document.getElementsByTagName('td').forEach(e => e.style.lineHeight = "2");
                for(let element of document.getElementsByTagName('td')) { element.style.lineHeight = '45px' }
            } else if (rows > 3 && rows <= 8) {
                //document.getElementsByTagName('td').forEach(e => e.style.lineHeight = "1.5");
                for(let element of document.getElementsByTagName('td')) { element.style.lineHeight = '35px' }
            } else {
                //document.getElementsByTagName('td').forEach(e => e.style.lineHeight = "1");
                for(let element of document.getElementsByTagName('td')) { element.style.lineHeight = '25px' }
            }
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



