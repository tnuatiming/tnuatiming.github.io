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
    var MaximumStageTime = 36000000; // Maximum stage time in milliseconds, 18000000=5hours, 21600000=6hours, 36000000=10hours
    if (sessionStorage.getItem('MaximumStageTime')) {
        MaximumStageTime = sessionStorage.getItem('MaximumStageTime');
    }

    var enableJ1 = 1;   // for remote
    var enableJ3 = 0;  // for single day
    
    var url = 'p1.html';
    var target = 'result';

//    var enableDelta = 0; // time delta only on epic (not single day)
//    var delta = 0; // delta in milliseconds, 60000 = 1minute

    var TimerLoad;
    var Rafraichir = 60000; // every 60 seconds

    var P1;
    
    var positionArray_All_Cat = {}; // array with the previous competitor overall and category position. updated every Load, used to show the position change arrow between Loads 
    if (sessionStorage.getItem('positionArray_All_Cat')) {
        positionArray_All_Cat = JSON.parse(sessionStorage.getItem('positionArray_All_Cat'));
    }
    
//    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    
    var eventName = "";    
    
    var cleanResults = 0; // alignTable for TotalIndex
        
    var prologue;

    var precision = "tenth"; // "tenth" for 1 digit after the .
    
    var catcat = "None";
    if (sessionStorage.getItem('catcat')) {
        catcat = sessionStorage.getItem('catcat');
    }
    var useCategory = "yes";
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
            

 
        if (document.getElementById("cleanResults").checked) {
            cleanResults = 1;
        } else {
            cleanResults = 0;
        }
        
        const checkbox1 = document.getElementById('cleanResults');

        checkbox1.addEventListener('change', (event) => {
            if (event.target.checked) {
                cleanResults = 1;
                document.getElementById("result").innerHTML = createLiveTable(P1);
            } else {
                cleanResults = 0;
                document.getElementById("result").innerHTML = createLiveTable(P1);
            }

        });



        if (document.getElementById("enableJ1").checked) {
            enableJ1 = 1;
        } else {
            enableJ1 = 0;
        }
        
        const checkbox2 = document.getElementById('enableJ1');

        checkbox2.addEventListener('change', (event) => {
            if (event.target.checked) {
                enableJ1 = 1;
                document.getElementById("result").innerHTML = createLiveTable(P1);
            } else {
                enableJ1 = 0;
                document.getElementById("result").innerHTML = createLiveTable(P1);
            }

        });



        if (document.getElementById("enableJ3").checked) {
            enableJ3 = 1;
        } else {
            enableJ3 = 0;
        }
        
        const checkbox3 = document.getElementById('enableJ3');

        checkbox3.addEventListener('change', (event) => {
            if (event.target.checked) {
                enableJ3 = 1;
                document.getElementById("result").innerHTML = createLiveTable(P1);
            } else {
                enableJ3 = 0;
                document.getElementById("result").innerHTML = createLiveTable(P1);
            }

        });

                        
            document.getElementById("MaximumStageTime").value = MaximumStageTime;

            const checkbox4 = document.getElementById('MaximumStageTime');

            checkbox4.addEventListener('change', (event) => {
                if (event.target.checked) {
                    MaximumStageTime = Number(document.getElementById("MaximumStageTime").value);
                    sessionStorage.setItem('MaximumStageTime', MaximumStageTime);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                } else {
                    MaximumStageTime = Number(document.getElementById("MaximumStageTime").value);
                    sessionStorage.setItem('MaximumStageTime', MaximumStageTime);
                    document.getElementById("result").innerHTML = createLiveTable(P1);
                }
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
            if (document.getElementById("showTvHeader").checked) {
                showTvHeader = 1;
            } else {
                showTvHeader = 0;
            }

            const checkbox = document.getElementById('showTvHeader');

            checkbox.addEventListener('change', (event) => {
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

    var tableClass = "fadeIn ";


    function intermediateOrFinish(section){
        
//        positionArray = []; // emptying the array as the info inside is incorrect due to changing between sections.

//        positionArray_All_Cat = {}; // emptying the array

        MaximumStageTime = Number(document.getElementById("MaximumStageTime").value);
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
        
        Rafraichir = 60000; // every 60 seconds

        tableClass = "fadeIn "; // make the table fadeIn on change
        
//        Load('p1.html', 'result');
        
        document.getElementById("result").innerHTML = createLiveTable(P1);
//        alignTable();
        
    }


    function category(choice, cat){
        
//        positionArray = []; // emptying the array as the info inside is incorrect due to changing between position/category position.

        MaximumStageTime = Number(document.getElementById("MaximumStageTime").value);
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
       
        
        Rafraichir = 60000; // every 60 seconds

        tableClass = "fadeIn "; // make the table fadeIn on change
        
//        Load('p1.html', 'result');
        
        document.getElementById("result").innerHTML = createLiveTable(P1);
//        alignTable();

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
            document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
            document.getElementById(target).innerHTML = createLiveTable(data);
        })
        .catch(rejected => {
            console.log('page unavailable');
        });
*/
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
                    document.getElementById("categoryOrAll").style.display = "block"; // if p1.html exist, display the buttons
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
        var timeGapDisplay = 3; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell
        var timeGapDisplayInter = 3; // 1 - separate time/gap ; 2 - combined ; 3 - both in same cell. FIXME - ONLY 3 IS IMPLEMENTED IN THE COMPETITOR RESULTS
        var raceEnded = 0;
        var doNotShowTime = 0; // don't display individual time
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
        var allArray2 = [];
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
        var Inter1Leader = {},Inter2Leader = {}, Inter3Leader = {};

        var Text, l, m, leaderInter1Time, leaderInter2Time, leaderInter3Time, competitorLaps, leaderLaps, leaderTime, prevCompCat, competitorId_Inter1Time, competitorId_Inter2Time, competitorId_Inter3Time, imTheLeaderInter1, imTheLeaderInter2, imTheLeaderInter3, headerText1, TVheaderText1, competitorTime, finished1, finished2, single1, single2, checkeredFlag, showFull, leader, showBlue, uci1, main_num, pair_num, blued, leaderCard, catCol, markBlue;


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
        
        eventName = HeaderEventName;  // tickerTest
        
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
        } else {
            prologue = 0;
        }

        if (Text[0].includes("_Stop.png") || Text[0].includes("_CheckeredFlag.png")) { // check if race ended
            raceEnded = 1;
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
                    
                    if (lineArray["Id_Categorie"] == '&nbsp;' ) {
                        lineArray["Id_Categorie"] = "";   
                    } else if (lineArray["Id_Categorie"] == 'undefined' ) {
                        lineArray["Id_Categorie"] = "-";   
                    }
                    
                    // convert total time to miliseconds
                    if (lineArray["Id_TpsCumule"] != "-" ) {
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

                    if (lineArray["Id_Groupe"] == '&nbsp;') {
                        lineArray["Id_Groupe"] = "";   
                    }

                    if (lineArray["Id_Categorie"] == '&nbsp;' ) {
                        lineArray["Id_Categorie"] = "";   
                    } else if (lineArray["Id_Categorie"] == 'undefined' ) {
                        lineArray["Id_Categorie"] = "-";   
                    }
                    
                    // convert intermediate time to miliseconds
                    if (lineArray["Id_Inter1"] != "-") {
                        lineArray["Id_Inter1"] = timeString2ms(lineArray["Id_Inter1"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter1"] = lineArray["Id_Inter1"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter1"] = 99999999999;   
                    }
                    if (lineArray["Id_Inter2"] != "-") {
                        lineArray["Id_Inter2"] = timeString2ms(lineArray["Id_Inter2"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter2"] = lineArray["Id_Inter2"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter2"] = 99999999999;   
                    }
                    if (lineArray["Id_Inter3"] != "-") {
                        lineArray["Id_Inter3"] = timeString2ms(lineArray["Id_Inter3"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter3"] = lineArray["Id_Inter3"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter3"] = 99999999999;   
                    }
                    
                    // convert total time to miliseconds
                    if (lineArray["Id_TpsCumule"] != "-" ) {
                        lineArray["Id_TpsCumule"] = timeString2ms(lineArray["Id_TpsCumule"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_TpsCumule"] = lineArray["Id_TpsCumule"] + delta;
                        }
*/                    } else {
                        lineArray["Id_TpsCumule"] = 99999999999;   
                    }

                   
                   
                   
                    allArray.push(lineArray); // push line to main array 
                    
                } else if (pair_num == 2 && lineArray["Id_Nom"] != '???') { // to epic secoundry array
                    
 

                    
                    if (lineArray["Id_Groupe"] == '&nbsp;') {
                        lineArray["Id_Groupe"] = "";   
                    }

                    if (lineArray["Id_Categorie"] == '&nbsp;' ) {
                        lineArray["Id_Categorie"] = "";   
                    } else if (lineArray["Id_Categorie"] == 'undefined' ) {
                        lineArray["Id_Categorie"] = "-";   
                    }

                    // convert intermediate time to miliseconds
                    if (lineArray["Id_Inter1"] != "-") {
                        lineArray["Id_Inter1"] = timeString2ms(lineArray["Id_Inter1"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter1"] = lineArray["Id_Inter1"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter1"] = 99999999999;   
                    }
                    if (lineArray["Id_Inter2"] != "-") {
                        lineArray["Id_Inter2"] = timeString2ms(lineArray["Id_Inter2"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter2"] = lineArray["Id_Inter2"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter2"] = 99999999999;   
                    }
                    if (lineArray["Id_Inter3"] != "-") {
                        lineArray["Id_Inter3"] = timeString2ms(lineArray["Id_Inter3"]);   
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_Inter3"] = lineArray["Id_Inter3"] + delta;
                        }
*/                    } else {
                        lineArray["Id_Inter3"] = 99999999999;   
                    }
                    
                    // convert total time to miliseconds
                    if (lineArray["Id_TpsCumule"] != "-" ) {
                        lineArray["Id_TpsCumule"] = timeString2ms(lineArray["Id_TpsCumule"]); 
                        
/*                        if (enableDelta == 1) {
                            lineArray["Id_TpsCumule"] = lineArray["Id_TpsCumule"] + delta;
                        }
*/                    } else {
                        lineArray["Id_TpsCumule"] = 99999999999;   
                    }
                
                    
                    
                    
                    
                    allArray2.push(lineArray); // push line to main array 
                    
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
            for (a = 0; a < allArray2.length; a++) { 

/*                // calculating total time and total laps from both arrays
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"] && allArray[b]["Id_TpsCumule"] != 99999999999 && allArray2[a]["Id_TpsCumule"] != 99999999999) {
                    
          //          allArray[b]["Id_TpsCumule"] = allArray[b]["Id_TpsCumule"] + allArray2[a]["Id_TpsCumule"];
                }
*/            
                if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                    
        
                    if (allArray[b]["Id_Groupe"].includes('s')) {

                        allArray[b]["Id_Groupe"] = allArray[b]["Id_Groupe"].replace('s', 's1');
                        allArray[b]["Id_NbTour"] = 2 * Number(allArray2[b]["Id_NbTour"]); // need to 2* the laps as it 1 rider and not 2 

                    } else if (allArray2[a]["Id_Groupe"].includes('s')) {

                        allArray2[a]["Id_Groupe"] = allArray2[a]["Id_Groupe"].replace('s', 's2');
                        allArray[b]["Id_NbTour"] = 2 * Number(allArray2[a]["Id_NbTour"]);

                    } else {
        
                        allArray[b]["Id_NbTour"] = Number(allArray[b]["Id_NbTour"]) + Number(allArray2[a]["Id_NbTour"]);
                    }
                    
                    if (allArray[b]["Id_Groupe"].includes('u') && allArray2[a]["Id_Groupe"].includes('u')) {

                        allArray[b]["uci"] = 3;
                        allArray[b]["Id_Groupe"] = allArray[b]["Id_Groupe"].replace('u', 'u3');
                        allArray2[a]["Id_Groupe"] = allArray2[a]["Id_Groupe"].replace('u', '');

                    } else if (allArray[b]["Id_Groupe"].includes('u') && !(allArray2[a]["Id_Groupe"].includes('u'))) {

                        allArray[b]["uci"] = 1;
                        allArray[b]["Id_Groupe"] = allArray[b]["Id_Groupe"].replace('u', 'u1');

                        
                    } else if (!(allArray[b]["Id_Groupe"].includes('u')) && allArray2[a]["Id_Groupe"].includes('u')) {

                        allArray[b]["uci"] = 2;
                        allArray2[a]["Id_Groupe"] = allArray2[a]["Id_Groupe"].replace('u', 'u2');
                    }


                    if (allArray[b]["Id_Groupe"].includes('l') || allArray2[a]["Id_Groupe"].includes('l')) {
                        
                        allArray[b]["leader"] = 1; // mark leader (yellow shirt)
                        
                    }                    
                    
                    if (allArray[b]["Id_Groupe"].includes('d') || allArray2[a]["Id_Groupe"].includes('d')) {
                        
                        allArray[b]["Id_Image"] = '_Status10'; // mark DSQ
                        
                    }                    

                    
                    allArray[b]["Id_Groupe"] = (allArray2[a]["Id_Groupe"] + allArray[b]["Id_Groupe"]).replace('dd', 'd').replace('ll', 'l').replace('bb', 'b'); // combine blue, single, leader


                    
                    // transfer fields from second array to the first that needed later, use _2 to mark
                    allArray[b]["Id_Image_2"] = allArray2[a]["Id_Image"];   
                    allArray[b]["Id_Nom_2"] = allArray2[a]["Id_Nom"];
                    allArray[b]["Id_Numero_Full_2"] = allArray2[a]["Id_Numero_Full"];
                    allArray[b]["Id_Nationalite_2"] = allArray2[a]["Id_Nationalite"];
                    allArray[b]["Id_TpsCumule_2"] = allArray2[a]["Id_TpsCumule"];
                    allArray[b]["Id_Canal_2"] = allArray2[a]["Id_Canal"];
                    
                    if (typeof allArray2[a]["Id_Inter1"] != 'undefined') {
                        allArray[b]["Id_Inter1_2"] = allArray2[a]["Id_Inter1"];
                    }
                    if (typeof allArray[b]["Id_Inter1"] == '-') {
                        allArray[b]["Id_Inter1"] = 99999999999;
                    }
                    if (typeof allArray2[a]["Id_Inter2"] != 'undefined') {
                        allArray[b]["Id_Inter2_2"] = allArray2[a]["Id_Inter2"];
                    }
                    if (typeof allArray[b]["Id_Inter2"] == '-') {
                        allArray[b]["Id_Inter2"] = 99999999999;
                    }
                    if (typeof allArray2[a]["Id_Inter3"] != 'undefined') {
                        allArray[b]["Id_Inter3_2"] = allArray2[a]["Id_Inter3"];
                    }
                    if (typeof allArray[b]["Id_Inter3"] == '-') {
                        allArray[b]["Id_Inter3"] = 99999999999;
                    }
 //                   if (typeof allArray2[a]["Id_Discipline"] != 'undefined') {
 //                       allArray[b]["Id_Discipline_2"] = allArray2[a]["Id_Discipline"];
 //                   }

                    if (allArray2[a]["Id_penalty"] == "P") {
                        allArray[b].Id_penalty = "P";   
                    }
                    
            } // END for a

            
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
                                allArray[b].Id_Finishblue = 1; // make blue DSQ
                            }
                            
                            
                            
                        } else if (raceEnded == 1 && (allArray[b]["Id_TpsCumule"] == 99999999999 || allArray[b]["Id_TpsCumule_2"] == 99999999999)) {
                            
                            allArray[b]["Id_FinishTime"] = 99999999999;
                            allArray[b].Id_Finishblue = 1; // make blue DSQ
                            
                        }

 // make blue if exceed MaximumStageTime, ENABLE after testing
                        if ((allArray[b]["Id_FinishTime"] != 99999999999 && allArray[b]["Id_FinishTime"] > MaximumStageTime) || (raceEnded == 1 && allArray[b]["Id_FinishTime"] == 99999999999)) {
                            allArray[b]["Id_FinishTime"] = 99999999999;
                            allArray[b].Id_Finishblue = 1; // make blue DSQ
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
                                if (show == 4) {
                                    allArray[b].blue = 1; // make blue DSQ
                                }
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
                    
                
             //   console.log(Inter2Leader);
                
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
                                if (show == 4) {
                                    allArray[b].blue = 1; // make blue DSQ
                                }
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
                                if (show == 4) {
                                    allArray[b].blue = 1; // make blue DSQ
                                }
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
               
               
               
               
               
        } // END for b
         // delete the second array
         allArray2 = [];
         

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
         allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi1 - b.Id_Statusi1 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["i1index"] = Number(l+1);
                // reassign position number

                    if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["i1Position_Categorie"] = Number(m);
                    
                    if (show == 1) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }

            }
         
            allArray.sort(function(a, b){return a.Id_Statusi1 - b.Id_Statusi1 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
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
         
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi2 - b.Id_Statusi2 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["i2index"] = Number(l+1);
                // reassign position number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["i2Position_Categorie"] = Number(m);
                    
                    if (show == 2) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }

            }
         
            allArray.sort(function(a, b){return a.Id_Statusi2 - b.Id_Statusi2 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
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
         
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Statusi3 - b.Id_Statusi3 || a.oldBlue - b.oldBlue || a.single - b.single || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["i3index"] = Number(l+1);
                // reassign position number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["i3Position_Categorie"] = Number(m);
                    
                    if (show == 3) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }


            }
         
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.oldBlue - b.oldBlue || a.single - b.single || a.oldBlue - b.oldBlue || a.Id_Inter3blue - b.Id_Inter3blue || a.Id_Inter2blue - b.Id_Inter2blue || a.Id_Inter1blue - b.Id_Inter1blue || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
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
         
           
            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || a.blue - b.blue || a.oldBlue - b.oldBlue || a.single - b.single || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
            m = 0;
            prevCompCat = ""
            
            for (l = 0; l < allArray.length; l++) {

                     allArray[l]["findex"] = Number(l+1);
                // reassign position number
 
                     if (prevCompCat == allArray[l]["Id_Categorie"]) {
                        m += 1;
                     } else {
                         m = 1;
                      prevCompCat = allArray[l]["Id_Categorie"];
                    }
                    allArray[l]["fPosition_Categorie"] = Number(m);
                    
                    if (show == 4) {
                        allArray[l]["Id_Position_Categorie"] = Number(m);
                        if (useCategory == "yes") {
                            allArray[l]["Id_Position"] = Number(m);
                        }
                    }

            }
         
            allArray.sort(function(a, b){return a.Id_Status - b.Id_Status || a.blue - b.blue || a.oldBlue - b.oldBlue || a.single - b.single || a.blue - b.blue || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_Inter3Time - b.Id_Inter3Time || a.Id_Inter2Time - b.Id_Inter2Time || a.Id_Inter1Time - b.Id_Inter1Time || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
            
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

                  headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
//                    headerText1 += '<th colspan="2" class="rnkh_font Id_Position"><div>Cat</div><div>GC</div></th>';
                    headerText1 += '<th class="rnkh_font Id_Position">GC</th>';
                    headerText1 += '<th class="rnkh_font Id_Position">Cat</th>';
/*        } else {
                    headerText1 += '<th class="rnkh_font Id_Arrow">&nbsp;&nbsp;&nbsp;</th>';
                    headerText1 += '<th class="rnkh_font Id_Position_Categorie">Cat</th>';
                    headerText1 += '<th class="rnkh_font Id_Position_Overall">GC</th>';
        }
*/
                    headerText1 += '<th class="rnkh_font Id_Numero">&nbsp;Nr</th>';

                    if (useCategory == "no") {
                        headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>';
                    }            
                    

 //       if (cleanResults == 0) {

//                    headerText1 += '<th class="rnkh_font uci">&nbsp;</th>';
 //                   headerText1 += '<th class="rnkh_font Id_Numero">&nbsp;</th>';
                    headerText1 += '<th class="rnkh_font Id_Nom">Riders</th>';
 //                   headerText1 += '<th class="rnkh_font Id_Nationalite">&nbsp;</th>';
            //        headerText1 += '<th class="rnkh_font Id_Nom_2">Name 2</th>';

                    //      headerText1 += '<th class="rnkh_font Id_TpsCumule_2">Time 2</th>';
                    headerText1 += '<th class="rnkh_font Id_Equipe">Team</th>';
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

               if (show == 1) {
                    headerText1 += '<th class="rnkh_font Id_Inter1Time">Inter. 1</th>'; // intermediate 1 time
                } else if (show == 2) {
                    headerText1 += '<th class="rnkh_font Id_Inter2Time">Inter. 2</th>'; // intermediate 2 time
                } else if (show == 3) {
                    headerText1 += '<th class="rnkh_font Id_Inter3Time">Inter. 3</th>'; // intermediate 3 time
                } else {
                    if (doNotShowTime == 0 && show == 4) {
                        headerText1 += '<th class="rnkh_font Id_TpsCumule">Individual Time</th>';
                    }
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
        headerText1 = '<tr class="rnkh_bkcolor">';

                headerText1 += '<th class="rnkh_font Id_Position_Overall">General<br>Classification</th>';
                headerText1 += '<th class="rnkh_font Id_Position_Categorie">Category<br>Position</th>';
                headerText1 += '<th class="rnkh_font Id_Numero">Number</th>';

                if (useCategory == "no") {
                    headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>';
                }            
                headerText1 += '<th class="rnkh_font Id_Arrow">finish<br>status</th>';
                headerText1 += '<th class="rnkh_font Id_Groupe">start<br>status</th>';

                headerText1 += '<th class="rnkh_font Id_Numero_Full">Rider<br>1<br>Number</th>';
                
                headerText1 += '<th class="rnkh_font Id_Nom">Rider<br>1<br>Name</th>';
                headerText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>';
                headerText1 += '<th class="rnkh_font UCI">UCI</th>';

                headerText1 += '<th class="rnkh_font Id_Numero_Full_2">Rider<br>2<br>Number</th>';
                headerText1 += '<th class="rnkh_font Id_Nom_2">Rider<br>2<br>Name</th>';
                headerText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>';
                headerText1 += '<th class="rnkh_font UCI">UCI</th>';
                if (doNotShowTime == 0) {
                    headerText1 += '<th class="rnkh_font Id_TpsCumule">Rider<br>1<br>Time</th>';
                    headerText1 += '<th class="rnkh_font Id_TpsCumule_2">Rider<br>2<br>Time</th>';
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


            if (timeGapDisplay == 1) {
                headerText1 += '<th class="rnkh_font Id_Ecart1er">Gap</th>';
            }
                
        headerText1 += '</tr>';
        
       //    console.log(headerText1);
    }
// END HEADER cleanResults = 1
        
        
        
        
        
        
        
        
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
                    leaderLaps = allArray[l]["Id_NbTour"];
                } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
                    leaderTime = allArray[l]["Id_Sector_FinishTime"];
                    leaderLaps = allArray[l]["Id_NbTour"];
                }  
/*
                            if (allArray[l]["Id_Position"] == 1) {
                                leaderTime = allArray[l]["Id_Sector_FinishTime"];
                                leaderLaps = allArray[l]["Id_NbTour"];
                            }
*/
                                    // fix the diff fields of the competitors
                                competitorLaps = allArray[l]["Id_NbTour"];
                                
                                
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
                } else {
                    uci1 = '';
                }
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    uci2 = '<span title="UCI Rider" class="Flag UCI"></span>';
                } else {
                    uci2 = '';
                }
                

                
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
                
                if (allArray[l]["oldBlue"] == 1) {
                    markBlue = '<span title="Blue Board Rider" class="Flag blueFlag"></span>';
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
               if (showBlue == 1) {
                
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
                    
                } else if (prologue == 1 && allArray[l]["Id_FinishTime"] == 99999999999 && (!allArray[l]["Id_Image"].includes("_Status")) && (allArray[l]["Id_Canal"] == 1 || allArray[l]["Id_Canal_2"] == 1)) { // on track
                    
                    finalText += '<td class="rnk_font fadeIn"><span title="Started" class="Flag Started"></span></td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td class="black rnk_font fadeIn">P</td>';
                    
                } else {

                    finalText += '<td class="white rnk_font fadeIn">&nbsp;</td>'; // &#9671;

                }
                
                if (allArray[l]["Id_Arrow"] == 12) {
                    finalText += '<td colspan="2" title="Did Not Started" class="rnk_font">DNS</td>';

                } else if (allArray[l]["Id_Arrow"] == 11) {
                    
                    finalText += '<td colspan="2" title="Did Not Finished" class="rnk_font">DNF</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 10) {
                    
                    finalText += '<td colspan="2" title="Disqualified" class="rnk_font">DSQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 9) {
                    
                    finalText += '<td colspan="2" title="Not Qualified" class="rnk_font">NQ</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 8) {
                    
                    finalText += '<td colspan="2" title="*" class="rnk_font">*</td>';
                    
                } else if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] != 0 /*|| show != 4*/) { // enable show != 4, to show postion only on finish
                
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show position if status or no finish time
                    finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show position if status or no finish time
//                    
//                    if (cleanResults == 1) {
//
//                        finalText += '<td class="rnk_font">&nbsp;</td>'; // dont show  postiion if status or no finish time
//                    }
                    
                } else {
                    finalText += '<td class="rnk_font bigFont fadeIn">' + allArray[l]["Id_Position_Overall"] + '</td>'; 
                    finalText += '<td class="rnk_font bigFont fadeIn ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>';
                    
                }

                if (allArray[l]["oldBlue"] == 1) {
                    finalText += '<td title="Blue Board Rider" class="rnk_font blueCard ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else if (allArray[l]["leader"] == 1) {
                    finalText += '<td title="Epic Leader" class="rnk_font ' + leaderCard + ' ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                    finalText += '<td class="rnk_font highlight ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                }
                
                

                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>'; // add category
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
                    finalText += '<td class="rnk_font left"><div class="FirstLine ' + single2 + '"><span class="number">' + allArray[l]["Id_Numero_Full"] + '</span>' + finished1 + uci1 + allArray[l]["Id_Nom"] + '</span><span title="' + allArray[l]["Id_Nationalite"] + '" class="nation ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + ' Flag"></span>' + leader + markBlue + '</div>';// add the name
                    
                } else {
                    finalText += '<td class="rnk_font left"><div class="FirstLine ' + single2 + '"><span class="number">' + allArray[l]["Id_Numero_Full"] + '</span><span class="name">' + uci1 + allArray[l]["Id_Nom"] + '</span><span title="' + allArray[l]["Id_Nationalite"] + '" class="nation ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + ' Flag"></span>' + leader + markBlue + '</div>';// add the name
                }

                    
                    
                if (allArray[l]["Id_TpsCumule"] == 99999999999 && allArray[l]["Id_TpsCumule_2"] != 99999999999 && allArray[l]["single"] == 0) { // only rider 2 finished at this point
                    finalText += '<div class="SecoundLine ' + single1 + '"><span class="number">' + allArray[l]["Id_Numero_Full_2"] + '</span>' + finished2 + uci2 + allArray[l]["Id_Nom_2"] + '</span><span title="' + allArray[l]["Id_Nationalite_2"] + '" class="nation ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + ' Flag"></span>' + leader + markBlue + '</div></td>';// add the name
                    
                } else {
                    finalText += '<div class="SecoundLine ' + single1 + '"><span class="number">' + allArray[l]["Id_Numero_Full_2"] + '</span><span class="name">' + uci2 + allArray[l]["Id_Nom_2"] + '</span><span title="' + allArray[l]["Id_Nationalite_2"] + '" class="nation ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + ' Flag"></span>' + leader + markBlue + '</div></td>';// add the name
                }
                
                                     


                if (typeof allArray[l]["Id_Equipe"] == 'undefined') {           
                    finalText += '<td class="rnk_font">&nbsp;</td>';// add team name
                } else {
                    finalText += '<td class="rnk_font wrap"><div class="team">' + allArray[l]["Id_Equipe"] + '</div></td>';// add team name
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

// individual time
            if (doNotShowTime == 0 && show == 4) {
                
                if (allArray[l]["Id_TpsCumule"] == 99999999999) {
                    finalText += '<td class="rnk_font"><div class="FirstLine ' + single2 + '">-' + '</div>'; // add time
                } else {
                    finalText += '<td class="rnk_font"><div class="FirstLine ' + single2 + '">' + allArray[l]["Id_TpsCumule"] + '</div>'; // add time
                }
                
                  if (allArray[l]["Id_TpsCumule_2"] == 99999999999) {
                    finalText += '<div class="SecoundLine">-</div></td>'; // add time
                } else {
                    finalText += '<div class="SecoundLine">' + allArray[l]["Id_TpsCumule_2"] + '</div></td>'; // add time
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
 
 
 
 
 
 
 
 // DATA cleanResults = 1
 
    if (cleanResults == 1) { 
        
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
            
            
            
            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor OddRow">';
            } else {
                finalText += '<tr class="' + positionChanged + 'rnk_bkcolor EvenRow">';
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
                
                
                if (allArray[l]["Id_Image"].includes("_Status") || allArray[l]["Id_Sector_FinishTime"] == 99999999999 || allArray[l]["oldBlue"] == 1 || showBlue == 1 || allArray[l]["single"] != 0) {
                
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

                } else if (checkeredFlag == "finished " && allArray[l]["Id_Position_Categorie"] == 1) { // leader
                    
                    finalText += '<td class="rnk_font">Leader</td>';
                    
                } else if (checkeredFlag == "finished ") { // finished
                    
                    finalText += '<td class="rnk_font">Finished</td>';
                    
                } else if (allArray[l]["Id_Arrow"] == 7) { // black
                    
                    finalText += '<td class="rnk_font">Penalty</td>';
                    
                } else {

                    finalText += '<td class="rnk_font">&nbsp;</td>';

                }

                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Groupe"].replace(/u/g, '').replace('d', 'DSQ').replace('l', 'Leader').replace('b', 'Blue') + '</td>'; // status
                
                        
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full"] + '</td>'; // Rider 1 Nr
                
                finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom"] + '</td>'; // Rider 1
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nationalite"] + '</td>'; // Nation
                
                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
                 
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full_2"] + '</td>'; // Rider 2 Nr
                
                finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom_2"] + '</td>'; // Rider 2
                
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Nationalite_2"] + '</td>'; // Nation
                
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
                
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
                
                if (timeGapDisplay == 1) {
                    if (allArray[l]["Id_Ecart1er"] == 99999999999) {
                        finalText += '<td class="rnk_font">-</td>'; // Gap
                    } else {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_Ecart1er"] + '</td>'; // Gap
                    }
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
                    TVheaderText1 += '<th class="rnkh_font Id_Numero">Nr</th>';
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
                            
                finalText += '<table class="' + tableClass + 'line_color">\n';
                
                if (showTvHeader == 1) {
                    finalText += '<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/' + allArray[l]["Id_Categorie"].replace(" ", "").toLowerCase() + '.svg"></div><div class="subHeader">Results at ' + showFull + '</div></td></tr>\n';
                }
                
                finalText += TVheaderText1 + '\n';

                
                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
                
                if (showTvHeader == 1) {
                    finalText += '<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/gc.svg"></div><div class="subHeader">Results at ' + showFull + '</div></td></tr>\n';
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
                
                finalText += '<td class="rnk_font"><span class="Flag tv ' + allArray[l]["Id_Nationalite"].replace(" ", "").toLowerCase() + '"></span>' + ' ' + '<span class="Flag tv ' + allArray[l]["Id_Nationalite_2"].replace(" ", "").toLowerCase() + '"></span></td>'; // add flags

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



if (enableJ1 == 1) {
// get flag image src, DayTime, ElapsedTime, RemainingTime from header

    if (cleanResults == 0) {
        var headerFlag = (div.getElementsByTagName("img"))[0].getAttribute("src");

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
        delete allArray[l].Id_Canal;
        delete allArray[l].Id_Status;
        delete allArray[l].Id_Statusi1;
        delete allArray[l].Id_Statusi2;
        delete allArray[l].Id_Statusi3;
        delete allArray[l].Id_Canal;
        delete allArray[l].Id_Canal_2;
        
        
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
        allArray[l].B1 = allArray[l].Id_Inter1blue;
        delete allArray[l].Id_Inter1blue;
        allArray[l].T2 = allArray[l].Id_Inter2Time;
        delete allArray[l].Id_Inter2Time;
        allArray[l].E2 = allArray[l].Id_Inter2Ecart1er;
        delete allArray[l].Id_Inter2Ecart1er;
        allArray[l].B2 = allArray[l].Id_Inter2blue;
        delete allArray[l].Id_Inter2blue;
         allArray[l].T3 = allArray[l].Id_Inter3Time;
        delete allArray[l].Id_Inter3Time;
        allArray[l].E3 = allArray[l].Id_Inter3Ecart1er;
        delete allArray[l].Id_Inter3Ecart1er;
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


        const allArrayJ = {};
        Object.keys(allArray[l]).sort().forEach(function(key) {
            if (allArray[l][key] == '&nbsp;') { // FIXME 99999999999 need checking
                allArray[l][key] == '';
            }
            allArrayJ[key] = allArray[l][key];
        });
        allArray[l] = allArrayJ;
    }
}

    }        // end for l
         
                
                
        if (epictv == 1) {
            finalText += '<tr><td style="text-align: right; padding-right: 0;" colspan="99"><img  style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></td></tr>';
        }
        finalText += '</table></div>';
             

                
                
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
               
                

    
    
            allArray3f.sort(function(a, b){return a.Id_Categorie.localeCompare(b.Id_Categorie) || a.Id_Status - b.Id_Status || b.Id_NbTour - a.Id_NbTour || a.Id_FinishTime - b.Id_FinishTime || a.Id_TpsCumule - b.Id_TpsCumule || a.Id_TpsCumule_2 - b.Id_TpsCumule_2});
    
    
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
                
                if (allArray3f[l]["Id_FinishTime"] != 99999999999) {
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

            
            
            
            
            
            
            const allArrayJ3 = {};
            Object.keys(allArray3f[l]).sort().forEach(function(key) {
                if (allArray3f[l][key] == '&nbsp;') { // FIXME 99999999999 need checking
                    allArray3f[l][key] == '';
                }
                allArrayJ3[key] = allArray3f[l][key];
            });
            allArray3f[l] = allArrayJ3;
}
            
            
            
        } // END for l single day
        
        if (m != 0) { // check if we have competitors
            finalText3 += '</table>\n</div>\n';  // close after last category   
            
            download((finalText3header + finalText3), 'p3.html', 'text/plain');    // download the html for single day 
            finalText3 = '<h2>Single Day</h2>\n' + finalText3;

        } else {
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
        header.headerFlag = headerFlag;
        header.HeaderEventName = HeaderEventName;
        header.DayTime = DayTime;
        header.ElapsedTime = ElapsedTime;
        header.RemainingTime = RemainingTime;

        allArray3f.unshift(header); // add the header at the beginning
        allArrayJ3 = JSON.stringify(allArray3f);             
        download(allArrayJ3, 'j3.txt', 'text/plain');    
        console.log((new Date()).toLocaleTimeString() + ' downloaded j3.txt')
}
//    }
 
        
        //       console.log(JSON.parse(allArrayJ3));     


               
    console.log('single day:');                
    console.log(allArray3f);
                
     
    
    //console.log(finalText3);
    
    // END single day    
                
                
                
                
                
                
                
    console.log('epic:');                
    console.log(allArray);
    
    
if (enableJ1 == 1) {
  
    if (cleanResults == 0/* && show == 4 && useCategory == "no"*/) { // FIXME check if need all(mainly show), so we can watch different results on timing computer
        var header = {};
        header.headerFlag = headerFlag;
        header.HeaderEventName = HeaderEventName;
        header.DayTime = DayTime;
        header.ElapsedTime = ElapsedTime;
        header.RemainingTime = RemainingTime;

        allArray.unshift(header); // add the header at the beginning
        allArrayJ = JSON.stringify(allArray);             
        download(allArrayJ, 'j1.txt', 'text/plain');    
        console.log((new Date()).toLocaleTimeString() + ' downloaded j1.txt')
    }
 //       console.log(JSON.parse(allArrayJ));     
}

 
// if (Array.isArray(allArray3) || allArray3.length != 0) {
 
     // build secound table
//}        
          
      //       console.log(finalText);
              


    sessionStorage.setItem('positionArray_All_Cat', JSON.stringify(positionArray_All_Cat));
            
    // allArray = [];
    
    tableClass = "";
    
      //  debugger;
        
    return (finalText + finalText3)

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
    }  
    
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
}

function export_table_to_csv(html, filename) {
	var csv = [];
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



