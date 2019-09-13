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

//'use strict';

    var stages = 1; // day of competition
    var showStage;
    
    var cleanResults = 0;

    var showLog = 0;

    var positionArray = []; // array with the previous competitor position. updated every Load, used to show the position change arrow between Loads 
    
    var useCategory = "yes";
    if (sessionStorage.getItem('categoryOrAll')) {
        useCategory = sessionStorage.getItem('categoryOrAll');
    }

    var precision = "tenth"; // "tenth" for 1 digit after the . , "second" no mili
    
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
    
    
    var epictv = 0;
    
    var provisional = '';
    if (sessionStorage.getItem('provisional')) {
        provisional = sessionStorage.getItem('provisional');
    }
    
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
            
            
            


            
            document.getElementById('rows').addEventListener('change', (event) => {

                    rows = document.getElementById("rows").value;
                    sessionStorage.setItem('rows', rows);
                    document.getElementById("result").innerHTML = createLiveTable();
            });
           
            
            
            
            
            
            
            if (document.getElementById("showTvHeader").checked) {
                showTvHeader = 1;
            } else {
                showTvHeader = 0;
            }
            
            document.getElementById('showTvHeader').addEventListener('change', (event) => {
                if (event.target.checked) {
                    showTvHeader = 1;
                    rows = Number(document.getElementById("rows").value);
                    sessionStorage.setItem('rows', rows);
                    document.getElementById("result").innerHTML = createLiveTable();
                    alignTDforTV();
                } else {
                    showTvHeader = 0;
                    rows = Number(document.getElementById("rows").value);
                    sessionStorage.setItem('rows', rows);
                    document.getElementById("result").innerHTML = createLiveTable();
                    alignTDforTV();
                }
            });
            
            
            if (document.getElementById("provisional").checked) {
                provisional = "Provisional ";
            } else {
                provisional = "";
            }
            
            document.getElementById('provisional').addEventListener('change', (event) => {
                if (event.target.checked) {
                    provisional = "Provisional ";
                    sessionStorage.setItem('provisional', provisional);
                    document.getElementById("result").innerHTML = createLiveTable();
                    alignTDforTV();
                } else {
                    provisional = "";
                    sessionStorage.setItem('provisional', provisional);
                    document.getElementById("result").innerHTML = createLiveTable();
                    alignTDforTV();
                }
            });

            
          
        } else { // END epictv
         
               
            document.getElementById('showLog').addEventListener('change', event => {
                if (event.target.checked) {
                    showLog = 1;
                    document.getElementById("result").innerHTML = createLiveTable();
                } else {
                    showLog = 0;
                }

            });

        }
        
        if (sessionStorage.getItem('stages')) {
            stages = sessionStorage.getItem('stages');
        }

        document.getElementById("stages").value = stages;

    //document.getElementById("demo").innerHTML = obj.options[obj.selectedIndex].text;

        document.getElementById("stages").addEventListener("change", function () {
            
            var obj = document.getElementById("stages");
            
            //console.log(obj.options[obj.selectedIndex].value);
            
            stages = obj.options[obj.selectedIndex].value;
            
            Load();
    
            sessionStorage.setItem('stages', stages);
    
        });
  
  
        if (document.getElementById("cleanResults").checked) {
            cleanResults = 1;
        } else {
            cleanResults = 0;
        }
        

        document.getElementById('cleanResults').addEventListener('change', (event) => {
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
        


    function publish(){
        var useCategoryTemp = useCategory;
        
        var publishText = '';
        
        publishText += `<!DOCTYPE html><html class="no-js" lang="he" xml:lang="he" dir="rtl"><head> <title>תנועה מדידת זמנים &ndash; live timing</title> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="google-site-verification" content="fksQzLHsNNdUr7KUw53_2thUPno2gvM0oe_MRxWvjSo"> <meta name="description" content="תנועה מדידת זמנים עוסקת במדידת זמנים בארועי ספורט"> <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png"> <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png"> <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png"> <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png"> <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png"> <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png"> <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png"> <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png"> <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png"> <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32"> <link rel="icon" type="image/png" href="/favicon-194x194.png" sizes="194x194"> <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"> <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192"> <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16"> <link rel="manifest" href="/manifest.json"> <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffcc33"> <meta name="apple-mobile-web-app-title" content="תנועה מדדית זמנים"> <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="application-name" content="תנועה מדדית זמנים"> <meta name="msapplication-TileColor" content="#ffcc33"> <meta name="msapplication-TileImage" content="/mstile-144x144.png"> <meta name="theme-color" content="#ffcc33"> <link rel="stylesheet" media="all" type="text/css" href="/style/global.css"> <link rel="stylesheet" media="print" href="/style/print.css"> <meta property="og:locale" content="he_IL"> <meta property="og:site_name" content="tnua timing - תנועה מדידת זמנים"> <meta property="og:title" content="תנועה מדידת זמנים &ndash; live timing"> <meta property="og:description" content="live timing"> <meta property="og:url" content="https://tnuatiming.com/liveepic/"> <meta property="og:image" content="http://tnuatiming.com/images/logo2_og.png"> <meta property="og:image:type" content="image/png"> <meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630"> <style>#live #buttonInfo{flex-direction: column; direction: ltr;}#live table.line_color{margin-top: 10px; direction: ltr;}#live #finalTextAll, #live #finalTextCategory{width: 100%;}#live tr.rnk_bkcolor:hover{background-color: #f0f0f0bf;}h1 img{height: 32px; vertical-align: middle; margin: 0 5px;}.Flag:before{content: "\\00a0";}.Flag{background-size: contain; background-position: 50%; background-repeat: no-repeat; position: relative; display: inline-block; width: 1.33333333em; vertical-align: middle; margin: 0 5px;}.australia{background-image: url(Images/CountryFlags/australia.svg);}.austria{background-image: url(Images/CountryFlags/austria.svg);}.belgium{background-image: url(Images/CountryFlags/belgium.svg);}.brazil{background-image: url(Images/CountryFlags/brazil.svg);}.canada{background-image: url(Images/CountryFlags/canada.svg);}.czechrepublic{background-image: url(Images/CountryFlags/czechrepublic.svg);}.denmark{background-image: url(Images/CountryFlags/denmark.svg);}.ecuador{background-image: url(Images/CountryFlags/ecuador.svg);}.england{background-image: url(Images/CountryFlags/england.svg);}.finland{background-image: url(Images/CountryFlags/finland.svg);}.france{background-image: url(Images/CountryFlags/france.svg);}.germany{background-image: url(Images/CountryFlags/germany.svg);}.greece{background-image: url(Images/CountryFlags/greece.svg);}.hungary{background-image: url(Images/CountryFlags/hungary.svg);}.iceland{background-image: url(Images/CountryFlags/iceland.svg);}.ireland{background-image: url(Images/CountryFlags/ireland.svg);}.israel{background-image: url(Images/CountryFlags/israel.svg);}.italy{background-image: url(Images/CountryFlags/italy.svg);}.latvia{background-image: url(Images/CountryFlags/latvia.svg);}.lithuania{background-image: url(Images/CountryFlags/lithuania.svg);}.netherlands{background-image: url(Images/CountryFlags/netherlands.svg);}.newzealand{background-image: url(Images/CountryFlags/newzealand.svg);}.norway{background-image: url(Images/CountryFlags/norway.svg);}.poland{background-image: url(Images/CountryFlags/poland.svg);}.portugal{background-image: url(Images/CountryFlags/portugal.svg);}.russia{background-image: url(Images/CountryFlags/russia.svg);}.serbia{background-image: url(Images/CountryFlags/serbia.svg);}.southafrica{background-image: url(Images/CountryFlags/southafrica.svg);}.spain{background-image: url(Images/CountryFlags/spain.svg);}.sweden{background-image: url(Images/CountryFlags/sweden.svg);}.switzerland{background-image: url(Images/CountryFlags/switzerland.svg);}.ukraine{background-image: url(Images/CountryFlags/ukraine.svg);}.unitedkingdom{background-image: url(Images/CountryFlags/unitedkingdom.svg);}.usa{background-image: url(Images/CountryFlags/usa.svg);}.transparent{background-image: url(Images/transparent.png);}.blueFlag{background-image: url(Images/_LightBlueFlag.png);}.CheckeredFlag{background-image: url(Images/_CheckeredFlag.png);}.numberOne{background-image: url(Images/numbreOne.svg); width: 1em;}.YellowShirt{background-image: url(Images/YellowShirt.svg);margin: 0;}.PinkShirt{background-image: url(Images/PinkShirt.svg);margin: 0;}.GreenShirt{background-image: url(Images/GreenShirt.svg);margin: 0;}.BlueShirt{background-image: url(Images/BlueShirt.svg);margin: 0;}.PurpleShirt{background-image: url(Images/PurpleShirt.svg);margin: 0;}.UCI{background-image: url(Images/uci.svg);margin: 0;}.dnf{background-image: url(Images/_dnf.svg);}.dsq{background-image: url(Images/_dsq.svg);}.dns{background-image: url(Images/_dns.svg);}#live td.rnk_font, #live th.rnkh_font{padding: 0 2px;}#live td.rnk_font.blueCard{color: #111; background-color: #add8e6bf; font-weight: 700;}#live td.left, #live th.left{text-align: left; padding-left: 10px;}#live td.right,#live th.right{text-align: right;}.lineThrough{filter: opacity(35%);}#live td.rnk_font.wrap{max-width: 200px; overflow: hidden; text-overflow: ellipsis;}#live td.rnk_font.bold{font-weight: 700;}#live td.rnk_font.bigFont{font-size: 1.5em; min-width: 35px;}#live .btn{display: inline-block;}#live #buttonInfo{margin-bottom: 10px;}#live .btn.active{cursor: pointer; filter: opacity(50%);}#live #Title{justify-content: space-evenly; vertical-align: middle; font-weight: 700; font-size: 1em; color: #58585a; margin: 5px 0; text-align: center;}#live h1#Title img{margin: 0 10px;}div#legend{width: 100%; text-align: left; direction: ltr;}div#legend ul{width: 100%; text-align: left; float: left;}div#legend li{text-align: left;}#csv{display: none;}@media (max-width:767px){#live td.rnk_font.bigFont{font-size: 1.2em; min-width: 25px;}#live td.rnk_font.wrap{max-width: 120px;}}</style></head> <body id="live"><div class="full-bg fadeIn"> <div class="page"> <div class="row header"> <div class="row language"> <a href="/english/index.html" title="go to English home page"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="27" height="19"> <clipPath id="t"> <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/> </clipPath> <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/> <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/> <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/> <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/> <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" stroke-width="6"/> </svg> </a> </div><div class="logoNav"> <div class="logo_main"> <div class="logo_image"> <ul class="logo"> <li></li><li></li><li></li><li></li></ul> </div><div class="logo_text"> <a class="main_logo" href="http://tnuatiming.com/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235 90"><switch><g fill="#58585a"><path d="M188.274 11.634h-8.35V1h30.586q12.656 0 18.15 5.36 5.537 5.318 5.537 17.667v31.508h-11.91V24.202q0-7.03-2.856-9.8-2.855-2.768-9.623-2.768h-9.668V34.66q0 7.648-1.76 12.174-1.713 4.527-5.36 6.636-3.647 2.065-10.59 2.065h-2.99V44.9h.748q3.076 0 4.834-1.098 1.758-1.143 2.505-3.516.747-2.373.747-7.163v-21.49zM169.51 55.535h-28.433V44.9h16.567V24.775q0-5.933-.79-8.438-.792-2.55-2.638-3.603-1.845-1.1-5.405-1.1h-5.228V1h7.47q7.56 0 11.294 2.02 3.736 2.022 5.45 6.636 1.713 4.615 1.713 12.833v33.045zM118.313 1h11.865v54.535h-11.865V1zM56.746 45.91q11.337-.174 17.622-2.24L58.81 1h12.877L84.65 38.352q4.967-4 7.076-12.656Q93.836 17.04 93.836 1h12.216q0 20.96-4.702 32.826-4.658 11.822-15.117 17.403-10.46 5.536-29.487 6.37V45.91zM13.547 55.535H1.682V22.4h11.865v33.135zm34.234 0H35.873V23.85q0-6.723-2.857-9.447-2.856-2.77-9.932-2.77H.803V1H23.83Q36.795 1 42.29 6.316q5.493 5.317 5.493 17.622v31.595z"/><path d="M223.98 61.6q5.317 0 7.756 3.253 2.46 3.23 2.46 10.283V89H220.97v-3.735h9.14V75.64q0-5.382-1.384-7.82-1.385-2.44-4.703-2.44-2.966 0-4.878 2.703-1.91 2.68-3.537 9.448L212.86 89h-4.35l3.01-11.8q1.034-4.107 2.066-6.7l-5.493-8.46h4.768l2.748 4.46q1.714-2.592 3.67-3.735 1.955-1.164 4.7-1.164zM202.27 89h-4.064V65.777h-15.38V62.04h22.806v3.736h-3.362V89zM174.058 62.04h4.043v14.173h-4.042V62.04zM165.62 89h-4.065V65.777h-15.38V62.04h22.807v3.736h-3.362V89zM119.917 65.776h-4.175V62.04h14.568q6.065 0 8.7 2.593 2.638 2.57 2.638 8.57V89h-4.043V73.16q0-4.043-1.648-5.712-1.626-1.67-5.69-1.67h-6.307v12.788q0 4.043-.747 6.262-.725 2.22-2.35 3.208-1.627.967-5.12.967h-.243v-3.735h.374q1.538 0 2.417-.55.88-.57 1.253-1.757.374-1.186.374-3.58V65.775zM102.35 65.95v4.198l-2.396-.813q-1.297.68-1.802 1.275-.506.593-.725 1.428-.22.813-.22 2.065V89h-4.043V74.28q0-2.33.88-3.78.9-1.45 3.03-2.154L89.56 65.82v-4.175l12.79 4.306zM74.597 61.6q5.317 0 7.756 3.253 2.46 3.23 2.46 10.283V89H71.588v-3.735h9.14V75.64q0-5.382-1.384-7.82-1.384-2.44-4.702-2.44-2.965 0-4.877 2.703-1.912 2.68-3.538 9.448L63.48 89h-4.352l3.01-11.8q1.033-4.107 2.066-6.7l-5.493-8.46h4.77l2.745 4.46q1.714-2.592 3.67-3.735Q71.85 61.6 74.597 61.6zM53.92 89H41.595v-3.735h8.284V73.62q0-3.516-.374-5.032-.35-1.516-1.208-2.153-.857-.66-2.483-.66h-2.966V62.04h2.834q3.517 0 5.12.99 1.627.966 2.374 3.207.747 2.22.747 6.24V89zM32.146 62.04h4.043v14.173h-4.044V62.04zM24.74 89H1.65V62.04h11.8q6.064 0 8.678 2.593 2.615 2.593 2.615 8.57V89zM5.69 65.777v19.49h14.986V73.157q0-4-1.626-5.69-1.604-1.692-5.647-1.692H5.69z"/></g><foreignObject width="235" height="90" requiredExtensions="http://example.com/SVGExtensions/EmbeddedXHTML"><img src="/images/logo2.png" width="235" height="90" alt="תנועה מדידת זמנים"/></foreignObject></switch></svg></a> </div></div><div class="navigation"> <svg style="display:none;"> <symbol id="live-icon" viewBox="0 0 32 32"> <path style="fill-opacity:1" d="M 17,6.03787 17,4 21,4 21,2 C 21,0.89544 20.104563,0 18.999938,0 L 13,0 c -1.104562,0 -2,0.89544 -2,2 l 0,2 4,0 0,2.03787 C 8.287563,6.54844 3,12.15669 3,19 3,26.17969 8.820313,32 16,32 23.179688,32 29,26.17969 29,19 29,12.15675 23.712438,6.5485 17,6.03787 Z m 6.071062,20.03319 C 21.18225,27.95981 18.671125,29 16,29 13.328875,29 10.817688,27.95981 8.928938,26.07106 7.040188,24.18231 6,21.67106 6,19 c 0,-2.67106 1.040188,-5.18231 2.928938,-7.07106 1.81375,-1.81369 4.2015,-2.84431 6.753562,-2.92338 l -0.677437,9.81313 C 14.946943,19.64025 15.394563,20 15.999938,20 16.605313,20 17.053,19.64025 16.994813,18.81869 L 16.317438,9.0055 c 2.552062,0.0791 4.939875,1.10975 6.753625,2.92344 C 24.959813,13.81769 26,16.32894 26,19 c 0,2.67106 -1.040187,5.18231 -2.928937,7.07106 z"/> </symbol> <symbol id="home-icon" viewBox="0 0 32 32"> <path style="fill-opacity:1" d="m 32,18.5 -6,-6 0,-9 -4,0 0,5 -6,-6 -16,16 0,1 4,0 0,10 10,0 0,-6 4,0 0,6 10,0 0,-10 4,0 z"/> </symbol> <symbol id="race-icon" viewBox="0 0 32 32"> <path style="fill-opacity:1" d="M 26,6 26,2 6,2 6,6 0,6 0,10 c 0,3.31369 2.6861875,6 6,6 0.627375,0 1.2321875,-0.0964 1.800625,-0.27506 1.4429375,2.06275 3.644,3.55612 6.199375,4.07487 L 14,26 12,26 c -2.2091875,0 -4,1.79081 -4,4 l 16,0 c 0,-2.20919 -1.790813,-4 -4,-4 l -2,0 0,-6.20019 c 2.555375,-0.51875 4.756437,-2.01206 6.199375,-4.07487 C 24.767813,15.90356 25.372625,16 26,16 c 3.313812,0 6,-2.68631 6,-6 L 32,6 26,6 Z M 6,13.625 C 4.0011875,13.625 2.375,11.99881 2.375,10 l 0,-2 L 6,8 6,10 c 0,1.25581 0.2321875,2.45725 0.6548125,3.56462 C 6.44225,13.60356 6.223625,13.625 6,13.625 Z M 29.625,10 c 0,1.99881 -1.626188,3.625 -3.625,3.625 -0.223625,0 -0.44225,-0.0214 -0.654812,-0.0604 C 25.767813,12.45725 26,11.25581 26,10 l 0,-2 3.625,0 0,2 z"/> </symbol> </svg> <ul> <li><a class=home href="/index.html"><svg class="home-icon"><use xlink:href="#home-icon"></use></svg><span>עמוד&nbsp;הבית</span></a></li><li><a class=races href="/results/index.html"><svg class="race-icon"><use xlink:href="#race-icon"></use></svg><span>תוצאות&nbsp;מרוצים</span></a></li><li class="last"><a class="live" href="/live/index.html"><span class="css3-blink"><span>live&nbsp;timing</span><svg class="live-icon"><use xlink:href="#live-icon"></use></svg></span></a></li></ul> </div></div></div><div class="row main_content"> <div id="raceheader"><h1>Results Total</h1></div><div id="buttonInfo"> <div id="categoryOrAll" style="display: block;"> <button id="displayCatButton" class="btn" onClick="category('yes')">By Category</button> <button id="displayAllButton" class="btn" onClick="category('no')">GC</button> </div></div>`;
        
        publishText += '\n<h1 id="Title">Migdal Epic Israel<br>GC '+ showStage + '</h1>\n';
        
        publishText += '<div id="finalTextCategory" style="display: block;">\n';

        useCategory = "yes";
        publishText += createLiveTable().replace(/<h1.*?<\/h1>/g, '');
        
        publishText += '\n</div>\n';
        publishText += '\n\n';
        
        publishText += '<div id="finalTextAll" style="display: none;">\n';
        
        useCategory = "no";
        publishText += createLiveTable().replace(/<h1.*?<\/h1>/g, '');
        publishText += '\n</div>\n';
        
        publishText += `<div style="width:100%;text-align:right;margin-top:10px;"><a href="https://tnuatiming.com"><img style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></a></div></div><div class="row footer"> <a class=mail href="mailto:119raz@walla.com">רז הימן - 119raz&#64;walla.com</a> <a class=copyright href="/terms.html">&#169; כל הזכויות שמורות לתנועה מדידת זמנים</a> <a class=logo_tiny href="http://tnuatiming.com"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"> <switch> <g style="fill-opacity:1;stroke:none"> <circle r="7" transform="matrix(0.86602544,0.49999993,-0.49999993,0.86602544,0,0)" style="fill:#ff6600;" cx="24.284611" cy="-5.9378204"/> <circle r="7" transform="matrix(-0.86602544,0.49999993,-0.49999993,-0.86602544,0,0)" style="fill:#cc0000;" cx="5.9378204" cy="-24.284611"/> <circle r="7" transform="matrix(0.2588191,0.96592581,-0.96592581,0.25881909,0,0)" style="fill:#003399;" cx="33.793804" cy="-33.3913"/> <circle r="7" transform="matrix(0.86602544,-0.49999993,0.49999993,0.86602544,0,0)" style="fill:#66cc33;" cx="0.28461337" cy="47.507042"/> </g> <foreignObject width="16" height="16" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><img src="/images/logo16.png" width="16" height="16" alt="לוגו תנועה מדידת זמנים"/></foreignObject> </switch> </svg> </a> </div></div></div><script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-38104277-1', 'auto'); ga('set', 'anonymizeIp', true); ga('send', 'pageview');</script><script>var useCategory="yes"; if (sessionStorage.getItem('categoryOrAll')){useCategory=sessionStorage.getItem('categoryOrAll');}category(useCategory); function category(choice){useCategory=choice; if (useCategory=="yes"){sessionStorage.setItem('categoryOrAll', 'yes');}else if (useCategory=="no"){sessionStorage.setItem('categoryOrAll', 'no');}if (useCategory=="yes"){document.getElementById("displayCatButton").classList.remove("active"); document.getElementById("displayCatButton").disabled=true; document.getElementById("displayAllButton").classList.add("active"); document.getElementById("displayAllButton").disabled=false;}else if (useCategory=="no"){document.getElementById("displayCatButton").classList.add("active"); document.getElementById("displayCatButton").disabled=false; document.getElementById("displayAllButton").classList.remove("active"); document.getElementById("displayAllButton").disabled=true;}if (useCategory=="yes"){document.getElementById("finalTextAll").style.display="none"; document.getElementById("finalTextCategory").style.display="block";}else if (useCategory=="no"){document.getElementById("finalTextAll").style.display="block"; document.getElementById("finalTextCategory").style.display="none";}}</script> </body></html> `;
        
        
        download(publishText, 'total.html', 'text/plain');        
        
        useCategory = useCategoryTemp;
    }

    function publishBox(){
        var useCategoryTemp = useCategory;
        
        var publishText = '';
        
        
        publishText += '<div id="' + showStage + '">\n';
        
        publishText += '<div id="finalTextCategory" style="display: block;">\n';

        useCategory = "yes";
        publishText += createLiveTable().replace(/<h1.*?<\/h1>/g, '');
        
        publishText += '\n</div>\n';
        publishText += '\n\n';
        
        publishText += '<div id="finalTextAll" style="display: none;">\n';
        
        useCategory = "no";
        publishText += createLiveTable().replace(/<h1.*?<\/h1>/g, '');
        publishText += '\n</div>\n';
        
        publishText += '</div>\n';
        
        publishText = publishText.replace(/<td colspan="2"/gi, '<td></td><td ');
                
        download(publishText, 'q' + stages + '.txt', 'text/plain');        
        
        useCategory = useCategoryTemp;
    }

    function category(choice){
        
        if (epictv == 1) {
            rows = Number(document.getElementById("rows").value);
            sessionStorage.setItem('rows', rows);
            
            if (document.getElementById("showTvHeader").checked) {
                showTvHeader = 1;
            } else {
                showTvHeader = 0;
            }
            sessionStorage.setItem('showTvHeader', showTvHeader);

            if (document.getElementById("provisional").checked) {
                provisional = "Provisional ";
            } else {
                provisional = "";
            }
            sessionStorage.setItem('provisional', provisional);
            
            
/*            
            if (document.getElementById("showArrow").checked) {
                showArrow = 1;
            } else {
                showArrow = 0;
            }
            sessionStorage.setItem('showArrow', showArrow);
*/
            
        }

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

        if (epictv == 1) {
            alignTDforTV();
        }

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

                
                if (epictv == 1) { 
                    alignTDforTV();
                }
                
            
            
            
        } else {
            var xhr;

            if (stages >= 2) {
            var xhr2;
                xhr2 = new XMLHttpRequest;
                xhr2.onload = function () {
                    if (this.status == 200) {
                        J2 = this.responseText;
                    }
                };
                xhr2.open("GET", url2 + ((/\?/).test(url2) ? "&" : "?") + (new Date()).getTime());
                xhr2.send();
            }
            if (stages >= 3) {
                var xhr3;
                xhr3 = new XMLHttpRequest;
                xhr3.onload = function() {
                    if (this.status == 200) {
                        J3 = this.responseText;
                    }
                };
                xhr3.open("GET", url3 + ((/\?/).test(url3) ? "&" : "?") + (new Date()).getTime());
                xhr3.send();
            }

            if (stages == 4) {
                var xhr4;
                xhr4 = new XMLHttpRequest;
                xhr4.onload = function() {
                    if (this.this == 200) {
                        J4 = this.responseText;
                    }
                };
                xhr4.open("GET", url4 + ((/\?/).test(url4) ? "&" : "?") + (new Date()).getTime());
                xhr4.send();
            }
            
            xhr = new XMLHttpRequest;
            xhr.onload = function() {
                if (this.status == 200) {
                    J1 = this.responseText;
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
                 
                if (allArray4[b]["Id_Groupe"].includes('s1') || allArray4[b]["Id_Image_2"] == '_Status6') {

                    allArray4[b]["single"] = 1;

                } else if (allArray4[b]["Id_Groupe"].includes('s2') || allArray4[b]["Id_Image_2"] == '_Status6') {

                    allArray4[b]["single"] = 2;

                } else {
                    allArray4[b]["single"] = 0;
                }
                    
    
                if (allArray4[b]["Id_Groupe"].includes('b')) {                    
                    allArray4[b]["oldBlue"] = 1;
                } else {
                    allArray4[b]["oldBlue"] = 0;
                }
    
                if (allArray4[b]["Id_Groupe"].includes('d')) {                    
                    allArray4[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray4[b]["blue"] == 1 || allArray4[b]["Id_Groupe"].includes('d') || allArray4[b]["Id_Groupe"].includes('b') || allArray4[b]["Id_Groupe"].includes('s') || allArray4[b]["Id_Arrow"] == 12 || allArray4[b]["Id_Arrow"] == 11 || allArray4[b]["Id_Arrow"] == 10 || allArray4[b]["Id_FinishTime"] == 99999999999 || allArray4[b]["single"] != 0) {
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
                 
                if (allArray3[b]["Id_Groupe"].includes('s1') || allArray3[b]["Id_Image_2"] == '_Status6') {

                    allArray3[b]["single"] = 1;

                } else if (allArray3[b]["Id_Groupe"].includes('s2') || allArray3[b]["Id_Image_2"] == '_Status6') {

                    allArray3[b]["single"] = 2;

                } else {
                    allArray3[b]["single"] = 0;
                }
                    
                if (allArray3[b]["Id_Groupe"].includes('b')) {                    
                    allArray3[b]["oldBlue"] = 1;
                } else {
                    allArray3[b]["oldBlue"] = 0;
                }
    
                if (allArray3[b]["Id_Groupe"].includes('d')) {                    
                    allArray3[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray3[b]["blue"] == 1 || allArray3[b]["Id_Groupe"].includes('d') || allArray3[b]["Id_Groupe"].includes('b') || allArray3[b]["Id_Groupe"].includes('s') || allArray3[b]["Id_Arrow"] == 12 || allArray3[b]["Id_Arrow"] == 11 || allArray3[b]["Id_Arrow"] == 10 || allArray3[b]["Id_FinishTime"] == 99999999999 || allArray3[b]["single"] != 0) {
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
                 
                if (allArray2[b]["Id_Groupe"].includes('s1') || allArray2[b]["Id_Image_2"] == '_Status6') {

                    allArray2[b]["single"] = 1;

                } else if (allArray2[b]["Id_Groupe"].includes('s2') || allArray2[b]["Id_Image_2"] == '_Status6') {

                    allArray2[b]["single"] = 2;

                } else {
                    allArray2[b]["single"] = 0;
                }
                
    
                if (allArray2[b]["Id_Groupe"].includes('b')) {                    
                    allArray2[b]["oldBlue"] = 1;
                } else {
                    allArray2[b]["oldBlue"] = 0;
                }
    
                if (allArray2[b]["Id_Groupe"].includes('d')) {                    
                    allArray2[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray2[b]["blue"] == 1 || allArray2[b]["Id_Groupe"].includes('d') || allArray2[b]["Id_Groupe"].includes('b') || allArray2[b]["Id_Groupe"].includes('s') || allArray2[b]["Id_Arrow"] == 12 || allArray2[b]["Id_Arrow"] == 11 || allArray2[b]["Id_Arrow"] == 10 || allArray2[b]["Id_FinishTime"] == 99999999999 || allArray2[b]["single"] != 0) {
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
        
        var finalText = '<h1 id="Title">Migdal Epic Israel<br>GC '+ st + '</h1>\n';

        showStage = st;
        

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
                
                allArray[b].T11 = allArray[b].T; // rider 1 time in mili
                delete allArray[b].T;
                allArray[b].T12 = allArray[b].TT; // rider 2 time in mili
                delete allArray[b].TT;
                
                allArray[b].Id_Perso1 = allArray[b].G1; // gender
                delete allArray[b].G1;
                allArray[b].Id_Perso1_2 = allArray[b].G2;
                delete allArray[b].G2;
                allArray[b].Id_Federation = allArray[b].U1; // uci no.
                delete allArray[b].U1;
                allArray[b].Id_Federation_2 = allArray[b].U2;
                delete allArray[b].U2;

        
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
                delete allArray[b].T1;
                delete allArray[b].T2;
                delete allArray[b].T3;
//                delete allArray[b].T;
//                delete allArray[b].TT;
                
                

                // convert 0 to 99999999999
                if (allArray[b]["Id_FinishTime"] == 0) {
                    allArray[b]["Id_FinishTime"] = 99999999999;
                }
            
                allArray[b]["Id_Numero_Full_2"] = allArray[b]["Id_Numero"] + '-2';
                allArray[b]["Id_Numero_Full"] = allArray[b]["Id_Numero"] + '-1';
                 
                 
                // phrase Id_Groupe         
                 
                if (allArray[b]["Id_Groupe"].includes('s1') || allArray[b]["Id_Image"] == '_Status6') {

                    allArray[b]["single"] = 1;

                } else if (allArray[b]["Id_Groupe"].includes('s2') || allArray[b]["Id_Image_2"] == '_Status6') {

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
    
    
                if (allArray[b]["Id_Groupe"].includes('b')) {                    
                    allArray[b]["oldBlue"] = 1;
                } else {
                    allArray[b]["oldBlue"] = 0;
                }
    
                    if (allArray[b]["Id_Groupe"].includes('d')) {                    
                    allArray[b]["Id_Image"] = '_Status10';
                }
    
                
                   
                
                if (allArray[b]["blue"] == 1 || allArray[b]["Id_Groupe"].includes('d') || allArray[b]["Id_Groupe"].includes('b') || allArray[b]["Id_Groupe"].includes('s') || allArray[b]["Id_Arrow"] == 12 || allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_FinishTime"] == 99999999999 || allArray[b]["single"] != 0) {
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
//                allArray[b]["Id_Image_1"] = "";                    
//                allArray[b]["Id_Image_3"] = "";                    
                allArray[b]["Id_Groupe_1"] = "";                    
                allArray[b]["Id_Groupe_2"] = "";                    
                allArray[b]["Id_Groupe_3"] = "";                    
                allArray[b]["blue_1"] = 0;                    
                allArray[b]["blue_2"] = 0;                    
                allArray[b]["blue_3"] = 0;                    
                allArray[b]["finishTimeTotal"] = 99999999999;
                allArray[b]["dnsfq"] = "";
                allArray[b]["stagesFinished"] = 0; // adding the stages finished^2, if finished 2 and 3 so this 13, easy for sorting
                allArray[b]["Id_Position_Categorie"] = 0;
                allArray[b]["Id_Position_Overall"] = 0;
                allArray[b]["leader"] = 0;

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
                    } else if (allArray[b]["Id_Arrow"] == 12) {
                        allArray[b]["dnsfq"] = "dns";
                    } else if (allArray[b]["Id_Arrow"] == 13) { // mst
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["Id_Arrow"] == 14) { // e2m
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["blue"] == 1) {
                        allArray[b]["dnsfq"] = "blue";
                    } else if (allArray[b]["finishTimeTotal"] == 99999999999) {
                        allArray[b]["dnsfq"] = ""; // ???
                    }
                
//                    allArray[b]["Id_Image"] = allArray[b]["Id_Image"] + allArray[b]["Id_Image_2"];

                
                
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
                        
                        allArray[b]["T21"] = allArray2[a]["T"]; // rider 1 time in mili
                        allArray[b]["T22"] = allArray2[a]["TT"]; // rider 2 time in mili

                        allArray[b]["Id_FinishTime_1"] = allArray2[a]["Id_FinishTime"];
                        allArray[b]["blue_1"] = allArray2[a]["blue"];
                        if (allArray2[a]["oldBlue"] == 1) {
                            allArray[b]["oldBlue"] = 2;
                        }
                        allArray[b]["Id_Arrow_1"] = allArray2[a]["Id_Arrow"];
                        allArray[b]["Id_Groupe_1"] = allArray2[a]["Id_Groupe"];
                        allArray[b]["Id_Image"] = allArray2[a]["Id_Image"];
                        allArray[b]["Id_Image_2"] = allArray2[a]["Id_Image_2"];
//                        allArray[b]["Id_Image_1"] = allArray2[a]["Id_Image"] + allArray2[a]["Id_Image_2"];
                        if (allArray[b]["single"] == 0) {
                            allArray[b]["single"] = allArray2[a]["single"];
                        }
                        if (allArray2[a]["out"] == 1) {
                            allArray[b]["out"] = 1;
                        }
                                
                        allArray[b]["leader"] = allArray2[a]["leader"];
                    }
                    if (allArray[b]["Id_Numero"] == allArray2[a]["Id_Numero"]) {
                        break;
                    }
                }  // END a
                        
                        if (allArray[b]["Id_FinishTime"] != 99999999999 && allArray[b]["Id_FinishTime_1"] != 99999999999) {
                            
                            allArray[b]["finishTimeTotal"] = allArray[b]["Id_FinishTime"] + allArray[b]["Id_FinishTime_1"];
                        } else {
                            allArray[b]["finishTimeTotal"] = 99999999999;
                        }
                    
                        if (allArray[b]["Id_FinishTime_1"] != 99999999999) {
                            
                            allArray[b]["stagesFinished"] += 4;
                        }

                        if (allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_Arrow_1"] == 10) {
                            allArray[b]["dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow_1"] == 11) {
                            allArray[b]["dnsfq"] = "dnf";
                        } else if (allArray[b]["Id_Arrow"] == 12 || allArray[b]["Id_Arrow_1"] == 12) {
                            allArray[b]["dnsfq"] = "dns";
                        } else if (allArray[b]["Id_Arrow"] == 13 || allArray[b]["Id_Arrow_1"] == 13) { // mst
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["Id_Arrow"] == 14 || allArray[b]["Id_Arrow_1"] == 14) { // e2m
                            allArray[b]["dnsfq"] = "blue";
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
                        
                        allArray[b]["T31"] = allArray3[a]["T"]; // rider 1 time in mili
                        allArray[b]["T32"] = allArray3[a]["TT"]; // rider 2 time in mili

                        allArray[b]["Id_FinishTime_2"] = allArray3[a]["Id_FinishTime"];
                        allArray[b]["blue_2"] = allArray3[a]["blue"];
                        if (allArray3[a]["oldBlue"] == 1) {
                            allArray[b]["oldBlue"] = 3;
                        }
                        allArray[b]["Id_Arrow_2"] = allArray3[a]["Id_Arrow"];
                        allArray[b]["Id_Groupe_2"] = allArray3[a]["Id_Groupe"];
                        allArray[b]["Id_Image"] = allArray3[a]["Id_Image"];
                        allArray[b]["Id_Image_2"] = allArray3[a]["Id_Image_2"];
//                        allArray[b]["Id_Image_2"] = allArray3[a]["Id_Image"] + allArray3[a]["Id_Image_2"];
                        if (allArray[b]["single"] == 0) {
                            allArray[b]["single"] = allArray3[a]["single"];
                        }
                        if (allArray3[a]["out"] == 1) {
                            allArray[b]["out"] = 1;
                        }
                        
                        allArray[b]["leader"] = allArray3[a]["leader"];
                    }
                    if (allArray[b]["Id_Numero"] == allArray3[a]["Id_Numero"]) {
                        break;
                    }
                    
                }  // END a
                        
                        if (allArray[b]["finishTimeTotal"] != 99999999999 && allArray[b]["Id_FinishTime_2"] != 99999999999) {
                            
                            allArray[b]["finishTimeTotal"] = allArray[b]["finishTimeTotal"] + allArray[b]["Id_FinishTime_2"];
                        } else {
                            allArray[b]["finishTimeTotal"] = 99999999999;
                        }
                    
                        if (allArray[b]["Id_FinishTime_2"] != 99999999999) {
                            
                            allArray[b]["stagesFinished"] += 9;
                        }
                    
                
                        if (allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_Arrow_1"] == 10 || allArray[b]["Id_Arrow_2"] == 10) {
                            allArray[b]["dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow_1"] == 11 || allArray[b]["Id_Arrow_2"] == 11) {
                            allArray[b]["dnsfq"] = "dnf";
                        } else if (allArray[b]["Id_Arrow"] == 12 || allArray[b]["Id_Arrow_1"] == 12 || allArray[b]["Id_Arrow_2"] == 12) {
                            allArray[b]["dnsfq"] = "dns";
                        } else if (allArray[b]["Id_Arrow"] == 13 || allArray[b]["Id_Arrow_1"] == 13 || allArray[b]["Id_Arrow_2"] == 13) { // mst
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["Id_Arrow"] == 14 || allArray[b]["Id_Arrow_1"] == 14 || allArray[b]["Id_Arrow_2"] == 14) { // e2m
                            allArray[b]["dnsfq"] = "blue";
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
                        
                        allArray[b]["T41"] = allArray4[a]["T"]; // rider 1 time in mili
                        allArray[b]["T42"] = allArray4[a]["TT"]; // rider 2 time in mili

                        allArray[b]["Id_FinishTime_3"] = allArray4[a]["Id_FinishTime"];
                        allArray[b]["blue_3"] = allArray4[a]["blue"];
                        if (allArray4[a]["oldBlue"] == 1) {
                            allArray[b]["oldBlue"] = 4;
                        }
                        allArray[b]["Id_Arrow_3"] = allArray4[a]["Id_Arrow"];
                        allArray[b]["Id_Groupe_3"] = allArray4[a]["Id_Groupe"];
                        allArray[b]["Id_Image"] = allArray4[a]["Id_Image"];
                        allArray[b]["Id_Image_2"] = allArray4[a]["Id_Image_2"];
//                        allArray[b]["Id_Image_3"] = allArray4[a]["Id_Image"] + allArray4[a]["Id_Image_2"];
                        if (allArray[b]["single"] == 0) {
                            allArray[b]["single"] = allArray4[a]["single"];
                        }
                        if (allArray4[a]["out"] == 1) {
                            allArray[b]["out"] = 1;
                        }
                
                        allArray[b]["leader"] = allArray4[a]["leader"];
                    }
                    if (allArray[b]["Id_Numero"] == allArray4[a]["Id_Numero"]) {
                        break;
                    }
                    
                }  // END a

                        
                        if (allArray[b]["finishTimeTotal"] != 99999999999 && allArray[b]["Id_FinishTime_3"] != 99999999999) {
                            
                            allArray[b]["finishTimeTotal"] = allArray[b]["finishTimeTotal"] + allArray[b]["Id_FinishTime_3"];
                        } else {
                            allArray[b]["finishTimeTotal"] = 99999999999;
                        }
                
                        if (allArray[b]["Id_FinishTime_3"] != 99999999999) {
                            
                            allArray[b]["stagesFinished"] += 16;
                        }
                
                        if (allArray[b]["Id_Arrow"] == 10 || allArray[b]["Id_Arrow_1"] == 10 || allArray[b]["Id_Arrow_2"] == 10 || allArray[b]["Id_Arrow_3"] == 10) {
                            allArray[b]["dnsfq"] = "dsq";
                        } else if (allArray[b]["Id_Arrow"] == 11 || allArray[b]["Id_Arrow_1"] == 11 || allArray[b]["Id_Arrow_2"] == 11 || allArray[b]["Id_Arrow_3"] == 11) {
                            allArray[b]["dnsfq"] = "dnf";
                        } else if (allArray[b]["Id_Arrow"] == 12 || allArray[b]["Id_Arrow_1"] == 12 || allArray[b]["Id_Arrow_2"] == 12 || allArray[b]["Id_Arrow_3"] == 12) {
                            allArray[b]["dnsfq"] = "dns";
                        } else if (allArray[b]["Id_Arrow"] == 13 || allArray[b]["Id_Arrow_1"] == 13 || allArray[b]["Id_Arrow_2"] == 13 || allArray[b]["Id_Arrow_3"] == 13) { // mst
                            allArray[b]["dnsfq"] = "blue";
                        } else if (allArray[b]["Id_Arrow"] == 14 || allArray[b]["Id_Arrow_1"] == 14 || allArray[b]["Id_Arrow_2"] == 14 || allArray[b]["Id_Arrow_3"] == 14) { // e2m
                            allArray[b]["dnsfq"] = "blue";
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
//            allArray.sort(function(a, b){return a.out - b.out || b.stagesFinished - a.stagesFinished || a.dnsfq.localeCompare(b.dnsfq) || a.finishTimeTotal - b.finishTimeTotal});
            
            allArray.sort((a, b) => a.out - b.out || a.dnsfq.localeCompare(b.dnsfq) || b.stagesFinished - a.stagesFinished || a.single - b.single || b.blue - a.blue || a.finishTimeTotal - b.finishTimeTotal);
            
                // reasign postion number
            for (l = 0; l < allArray.length; l++) {

                allArray[l]["Id_Position_Overall"] = l+1;
            }
            
            
            
            
//        } else if (useCategory == "yes") {
//            allArray.sort(function(a, b){return (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie.includes("Masters"))-(a.Id_Categorie.includes("Masters")) || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.out - b.out || b.stagesFinished - a.stagesFinished || a.dnsfq.localeCompare(b.dnsfq) || a.finishTimeTotal - b.finishTimeTotal});

            allArray.sort((a, b) => (b.Id_Categorie.includes("Men"))-(a.Id_Categorie.includes("Men")) || (b.Id_Categorie.includes("Women"))-(a.Id_Categorie.includes("Women")) || (b.Id_Categorie.includes("Mixed"))-(a.Id_Categorie.includes("Mixed")) || (b.Id_Categorie == "Masters")-(a.Id_Categorie == "Masters") || a.Id_Categorie.localeCompare(b.Id_Categorie) || a.out - b.out || a.dnsfq.localeCompare(b.dnsfq) || b.stagesFinished - a.stagesFinished || a.single - b.single || b.blue - a.blue || a.finishTimeTotal - b.finishTimeTotal);
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
                if (m == 1) {
                    allArray[l]["leader"] = 1;
                }
                 

            }     
                 
                 
                 
            if (useCategory == "no") {
                
//                allArray.sort(function(a, b){return a.out - b.out || b.stagesFinished - a.stagesFinished || a.dnsfq.localeCompare(b.dnsfq) || a.finishTimeTotal - b.finishTimeTotal});
                                
                allArray.sort((a, b) => a.out - b.out || a.dnsfq.localeCompare(b.dnsfq) || b.stagesFinished - a.stagesFinished || a.single - b.single || b.blue - a.blue || a.finishTimeTotal - b.finishTimeTotal);
            }                 

    
    // HEADER         
                            
                            
        headerText1 = '<tr class="rnkh_bkcolor">\n';


    // hard coded header for now
        if (cleanResults == 1) {
            headerText1 += '<th class="rnkh_font Id_Arrow">Status</th>\n';
            headerText1 += '<th class="rnkh_font Id_Position_Overall">Rank</th>\n';
            headerText1 += '<th class="rnkh_font Id_Position_Categorie">Category Rank</th>\n';
            headerText1 += '<th class="rnkh_font Id_Numero">Number</th>\n';
        } else {
            headerText1 += '<th class="rnkh_font Id_Position_Overall">Rank</th>\n';
            headerText1 += '<th class="rnkh_font Id_Position_Categorie">Category Rank</th>\n';
            headerText1 += '<th class="rnkh_font Id_Numero">No.</th>\n';
        }
       if (cleanResults == 1) {
//            headerText1 += '<th class="rnkh_font Id_Numero_Full">Rider 1 Number</th>\n';
            headerText1 += '<th class="rnkh_font Id_Nom">Name</th>\n';
            headerText1 += '<th class="rnkh_font Id_Nationalite">Nationality</th>\n';
            headerText1 += '<th class="rnkh_font uci">UCI</th>\n';
            headerText1 += '<th class="rnkh_font Id_Federation">UCI ID</th>';
            headerText1 += '<th class="rnkh_font Id_Perso1">Gender</th>';
//            headerText1 += '<th class="rnkh_font Id_Numero_Full_2">Rider 2 Number</th>\n';
//            headerText1 += '<th class="rnkh_font Id_Nom_2">Rider 2 Name</th>\n';
//            headerText1 += '<th class="rnkh_font Id_Nationalite_2">Nationality</th>\n';
//            headerText1 += '<th class="rnkh_font uci">UCI</th>\n';

            
       } else {
            headerText1 += '<th class="rnkh_font left Id_Nom">Riders</th>\n';
       }
            headerText1 += '<th class="rnkh_font left Id_Equipe">Team</th>\n';
            if (useCategory == "no") {
                headerText1 += '<th class="rnkh_font Id_Categorie">Category</th>\n';
            }
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
                finalText += '\n<div id="liveTable">\n<table class="' + tableClass + 'line_color">\n';
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
                        allArray[l]["finishTimeTotal"] = ms2TimeString(allArray[l]["finishTimeTotal"]); // can use convertMS
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

// BEGIN main    

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
            } else if (allArray[l]["Id_Categorie"] == 'Grand Masters') {
                catCol = 'purple';
            } else if (allArray[l]["Id_Categorie"] == 'Men'){
                catCol = 'yellow';
            } else {
                catCol = 'black';
            }



if (epictv == 0) {
    

            // add category name header and table header
            if (allArray[l]["Id_Position"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + headerText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0) { // add table end tag
                    finalText += '\n</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
                            
                finalText += '\n<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>\n' + headerText1 + '\n';                
            } else if (allArray[l]["Id_Position"] == 1 && useCategory == "no") {
//                finalText += '<tr><td colspan="99" class="title_font">Overall</td></tr>' + headerText1;
                    finalText += '\n<tr><td colspan="99" class="title_font">Overall</td></tr>\n' + headerText1 + '\n';
            }



            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="rnk_bkcolor OddRow">\n';
            } else {
                finalText += '<tr class="rnk_bkcolor EvenRow">\n';
            }
                       
            if (cleanResults == 0) {
                if (allArray[l]["dnsfq"] == "dsq") {
                    finalText += '<td colspan="2" title="Disqualified" class="rnk_font">DSQ</td>\n';
                } else if (allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td colspan="2" title="Did Not Finished" class="rnk_font">DNF</td>\n';
                } else if (allArray[l]["dnsfq"] == "dns") {
                    finalText += '<td colspan="2" title="Did Not Started" class="rnk_font">DNS</td>\n';
                } else if (allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td colspan="2" title="Blue Board Rider" class="rnk_font">BLUE</td>\n';
                } else if (allArray[l]["single"] == 1) {
                    finalText += '<td colspan="2" title="Individual Finisher" class="rnk_font">IF1</td>\n';
                } else if (allArray[l]["single"] == 2) {
                    finalText += '<td colspan="2" title="Individual Finisher" class="rnk_font">IF2</td>\n';
                } else if (allArray[l]["out"] == 0) {
                    finalText += '<td class="rnk_font ' + bigFont + '">' + allArray[l]["Id_Position_Overall"] + '</td>\n'; // add postion
                    finalText += '<td class="rnk_font ' + bigFont + ' ' + catCol + '">' + allArray[l]["Id_Position_Categorie"] + '</td>\n'; // add postion
                } else {
                    finalText += '<td colspan="2" class="rnk_font"></td>\n'; // add postion
                }
                
                // show all array key:value in the number title
                var keyValueLog = '';
                if (showLog == 1) {
                    for (var key in allArray[l]) {
                //      var value = allArray[l][key];
                        if ((key == "E1C" || key == "E2C" || key == "E3C" || key == "EC") && allArray[l][key] != 0) {
                            keyValueLog += `${key}: ${ms2TimeString(allArray[l][key])}  |  `;
                        } else {
                            keyValueLog += `${key}: ${allArray[l][key]}  |  `;
                        }
                    }
                }

                
                if (allArray[l]["blue"] == 1 || allArray[l]["blue_1"] == 1 || allArray[l]["blue_2"] == 1 || allArray[l]["blue_3"] == 1 || allArray[l]["oldBlue"] != 0) { // Blue Board Rider
                finalText += '<td title="' + keyValueLog + '" class="rnk_font blueCard ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else if (allArray[l]["leader"] == 1) { // Epic Leader
                    finalText += '<td title="' + keyValueLog + '" class="rnk_font ' + leaderCard + ' ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td title="' + keyValueLog + '" class="rnk_font highlight ' + bigFont + '">' + allArray[l]["Id_Numero"] + '</td>';
                }
                               
       //         finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>\n';
       

                finalText += '<td class="rnk_font left"><div class="FirstLine ' + single1 + '"><span class="number">' + allArray[l]["Id_Numero_Full"] + '</span><span class="name">' + uci1 + allArray[l]["Id_Nom"] + '</span>';// add the name
                if (typeof allArray[l]["Id_Nationalite"] != 'undefined') {
                    finalText += '<span title="' + allArray[l]["Id_Nationalite"] + '" class="Flag ' + single1 + ' ' + allArray[l]["Id_Nationalite"] + '"></span>'/* + leader*/; // add flag
                }
                finalText += '</div>';// add the name

                
                finalText += '<div class="SecoundLine ' + single2 + '"><span class="number">' + allArray[l]["Id_Numero_Full_2"] + '</span><span class="name">' + uci2 + allArray[l]["Id_Nom_2"] + '</span>';// add the name
                if (typeof allArray[l]["Id_Nationalite_2"] != 'undefined') {
                    finalText += '<span title="' + allArray[l]["Id_Nationalite_2"] + '" class="Flag ' + single2 + ' ' + allArray[l]["Id_Nationalite_2"] + '"></span>'/* + leader*/; // add flag
                }
                finalText += '</div></td>';// add the name
                
       
                finalText += '<td class="rnk_font left wrap">' + allArray[l]["Id_Equipe"] + '</td>\n';// add the Team
                
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>\n';// add the Category
                }
       
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
                
                if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add total time
                } else {
                    finalText += '<td class="rnk_font bold">' + allArray[l]["finishTimeTotal"] + '</td>\n'; // add total time
                }
                
                if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add diff
                } else {
                    finalText += '<td class="rnk_font">+' + allArray[l]["Id_Ecart1er"] + '</td>\n'; // add diff
                }
 
                finalText += '</tr>\n';
                
            } else { // cleanResults == 1
                
                // rider 1
                
                if (allArray[l]["dnsfq"] == "dsq") {
                    finalText += '<td title="Disqualified" class="rnk_font">DSQ</td>\n';
                } else if (allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td title="Did Not Finished" class="rnk_font">DNF</td>\n';
                } else if (allArray[l]["dnsfq"] == "dns") {
                    finalText += '<td title="Did Not Started" class="rnk_font">DNS</td>\n';
                } else if (allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td title="Blue Board Rider" class="rnk_font">BLUE</td>\n';
                } else if (allArray[l]["single"] == 1) {
                    finalText += '<td title="Individual Finisher" class="rnk_font">IF1</td>\n'; 
                } else if (allArray[l]["single"] == 2) {
                    finalText += '<td class="rnk_font"></td>\n'; 
                } else if (allArray[l]["finishTimeTotal"] != 99999999999 && allArray[l]["Id_Position_Categorie"] == 1) { // leader
                    
                    finalText += '<td class="rnk_font">Leader</td>\n';
                    
                } else if (allArray[l]["finishTimeTotal"] != 99999999999) { // finished
                    
                    finalText += '<td class="rnk_font">Finished</td>\n';
                    
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
                
/*         
                 if (allArray[l]["blue"] == 1 || allArray[l]["blue_1"] == 1 || allArray[l]["blue_2"] == 1 || allArray[l]["blue_3"] == 1) {
                finalText += '<td title="Blue Board Rider" class="rnk_font blueCard">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                }
*/                               
       //         finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>\n';
       
       
                    finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero_Full"] + '</td>\n';// add the full number
                        
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom"] + '</td>\n';// add the name
                    
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nationalite"] + '</td>\n';// add Id_Nationalite 
                        
                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }

                finalText += '<td class="rnk_font">' + allArray[l]["Id_Federation"] + '</td>'; // uci no.
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Perso1"] + '</td>'; // gender
        
/*                
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full_2"] + '</td>\n';// add the full number 2
                    
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom_2"] + '</td>\n';// add the name 2

                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nationalite_2"] + '</td>\n';// add Id_Nationalite 2
                    
                    
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
*/             
                finalText += '<td class="rnk_font wrap">' + allArray[l]["Id_Equipe"] + '</td>\n';// add the Team
                
                
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>\n';// add the Category
                }
       
//FIXME
                    if (allArray[l]["single"] != 2) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>\n'; // add time 1
                    } else if (allArray[l]["single"] == 2 && allArray[l]["T11"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T11"]) + '</td>\n'; // add time 1
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }
                
                if (stages >= 2) {
                    if (allArray[l]["single"] != 2) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_1"] + '</td>\n'; // add time 2
                    } else if (allArray[l]["single"] == 2 && allArray[l]["T21"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T21"]) + '</td>\n'; // add time 2
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n'; // add time 2
                    }
                }
                if (stages >= 3) {
                    if (allArray[l]["single"] != 2) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_2"] + '</td>\n'; // add time 3
                    } else if (allArray[l]["single"] == 2 && allArray[l]["T31"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T31"]) + '</td>\n'; // add time 3
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }
                }
                if (stages == 4) {
                    if (allArray[l]["single"] != 2) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_3"] + '</td>\n'; // add time 4
                    } else if (allArray[l]["single"] == 2 && allArray[l]["T41"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T41"]) + '</td>\n'; // add time 1
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }
                }
                
                if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["single"] == 2 || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add total time
                } else {
                    finalText += '<td class="rnk_font bold">' + allArray[l]["finishTimeTotal"] + '</td>\n'; // add total time
                }
                
                if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["single"] == 2 || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add diff
                } else {
                    finalText += '<td class="rnk_font">+' + allArray[l]["Id_Ecart1er"] + '</td>\n'; // add diff
                }
 
                finalText += '</tr>\n';

                
                
                
     // rider 2
               
                
            if (l % 2 == 0) { // start building competitor line
                finalText += '<tr class="rnk_bkcolor OddRow">\n';
            } else {
                finalText += '<tr class="rnk_bkcolor EvenRow">\n';
            }
                
                
                
                if (allArray[l]["dnsfq"] == "dsq") {
                    finalText += '<td title="Disqualified" class="rnk_font">DSQ</td>\n';
                } else if (allArray[l]["dnsfq"] == "dnf") {
                    finalText += '<td title="Did Not Finished" class="rnk_font">DNF</td>\n';
                } else if (allArray[l]["dnsfq"] == "dns") {
                    finalText += '<td title="Did Not Started" class="rnk_font">DNS</td>\n';
                } else if (allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td title="Blue Board Rider" class="rnk_font">BLUE</td>\n';
                } else if (allArray[l]["single"] == 2) {
                    finalText += '<td title="Individual Finisher" class="rnk_font">IF2</td>\n'; 
                } else if (allArray[l]["single"] == 1) {
                    finalText += '<td class="rnk_font"></td>\n'; 
                } else if (allArray[l]["finishTimeTotal"] != 99999999999 && allArray[l]["Id_Position_Categorie"] == 1) { // leader
                    
                    finalText += '<td class="rnk_font">Leader</td>\n';
                    
                } else if (allArray[l]["finishTimeTotal"] != 99999999999) { // finished
                    
                    finalText += '<td class="rnk_font">Finished</td>\n';
                    
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
                
/*         
                 if (allArray[l]["blue"] == 1 || allArray[l]["blue_1"] == 1 || allArray[l]["blue_2"] == 1 || allArray[l]["blue_3"] == 1) {
                finalText += '<td title="Blue Board Rider" class="rnk_font blueCard">' + allArray[l]["Id_Numero"] + '</td>';
                } else {
                finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>';
                }
*/                               
       //         finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero"] + '</td>\n';
       
/*       
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero_Full"] + '</td>\n';// add the full number
                        
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom"] + '</td>\n';// add the name
                    
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nationalite"] + '</td>\n';// add Id_Nationalite 
                        
                if (allArray[l]["uci"] == 1 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
*/        
                
                    finalText += '<td class="rnk_font highlight">' + allArray[l]["Id_Numero_Full_2"] + '</td>\n';// add the full number 2
                    
                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom_2"] + '</td>\n';// add the name 2

                    finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nationalite_2"] + '</td>\n';// add Id_Nationalite 2
                    
                    
                if (allArray[l]["uci"] == 2 || allArray[l]["uci"] == 3) {
                    finalText += '<td class="rnk_font">yes</td>'; // UCI
                } else {
                    finalText += '<td class="rnk_font">no</td>'; // UCI
                }
             
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Federation_2"] + '</td>'; // uci no.
                finalText += '<td class="rnk_font">' + allArray[l]["Id_Perso1_2"] + '</td>'; // gender

                finalText += '<td class="rnk_font wrap">' + allArray[l]["Id_Equipe"] + '</td>\n';// add the Team                
                
                if (useCategory == "no") {
                    finalText += '<td class="rnk_font">' + allArray[l]["Id_Categorie"] + '</td>\n';// add the Category
                }
       
//FIXME
                    if (allArray[l]["single"] != 1) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime"] + '</td>\n'; // add time 1
                    } else if (allArray[l]["single"] == 1 && allArray[l]["T12"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T12"]) + '</td>\n'; // add time 1
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }

                if (stages >= 2) {
                    if (allArray[l]["single"] != 1) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_1"] + '</td>\n'; // add time 2
                    } else if (allArray[l]["single"] == 1 && allArray[l]["T22"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T22"]) + '</td>\n'; // add time 2
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }
                }
                if (stages >= 3) {
                    if (allArray[l]["single"] != 1) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_2"] + '</td>\n'; // add time 3
                    } else if (allArray[l]["single"] == 1 && allArray[l]["T32"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T32"]) + '</td>\n'; // add time 3
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }
                }
                if (stages == 4) {
                    if (allArray[l]["single"] != 1) {
                        finalText += '<td class="rnk_font">' + allArray[l]["Id_FinishTime_3"] + '</td>\n'; // add time 4
                    } else if (allArray[l]["single"] == 1 && allArray[l]["T42"] != 0) {
                        finalText += '<td class="rnk_font">' + ms2TimeString(allArray[l]["T42"]) + '</td>\n'; // add time 4
                    } else {
                        finalText += '<td class="rnk_font">-</td>\n';
                    }
                }
                
                if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["single"] == 1 || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add total time
                } else {
                    finalText += '<td class="rnk_font bold">' + allArray[l]["finishTimeTotal"] + '</td>\n'; // add total time
                }
                
                if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["single"] == 1 || allArray[l]["dnsfq"] == "blue") {
                    finalText += '<td class="rnk_font">-</td>\n'; // add diff
                } else {
                    finalText += '<td class="rnk_font">+' + allArray[l]["Id_Ecart1er"] + '</td>\n'; // add diff
                }
 
                finalText += '</tr>\n';

                
            }
        
        
    } // END main     
    
    
// BEGIN TV
    
if (epictv == 1 && ((allArray[l]["Id_Position_Categorie"] <= rows && useCategory == "yes") || (allArray[l]["Id_Position_Overall"] <= rows && useCategory == "no")) && allArray[l]["finishTimeTotal"] != 99999999999) { // TV show only 'rows' competitors
        
    
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
                    TVheaderText1 += '<th class="rnkh_font Id_Numero">No.</th>';
                    TVheaderText1 += '<th class="rnkh_font finishTimeTotal">Time</th>'; // combined time

                  
        TVheaderText1 += '</tr>';
        
      //     console.log(TVheaderText1);

// END HEADER for tv
    
                if (useCategory == "no") {
                    var arrowC = "Men";
                } else {
                    var arrowC = allArray[l]["Id_Categorie"].replace(/\s/g, '');
                }
   
                var lll = 0;

            // add category name header and table header
            if (allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") {
//                finalText += '<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + TVheaderText1;
                
                if (allArray[l]["Id_Categorie"] != NewCategoryHeader && l > 0 /*&& catcat == 'None'*/) { // add table end tag
                    finalText += '<tr><td style="text-align: right; padding-right: 0;" colspan="99"><img style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></td></tr>';
                    finalText += '\n</table>\n';
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                } else if (l == 0) {
                    NewCategoryHeader = allArray[l]["Id_Categorie"];
                }
//                finalText += '<table class="' + tableClass + 'line_color">\n<tr><td colspan="99" class="title_font">'+allArray[l]["Id_Categorie"]+'</td></tr>' + TVheaderText1 + '\n';                
                            


                finalText += '\n<table class="' + tableClass + 'line_color">\n';
                
                
                if (showTvHeader == 1) {
                    finalText += '<tr><td colspan="99" style="width: 100%; height: 100% text-align:center; margin-buttom: 50px;" class="title_font"><img style="margin: 0; padding: 0; height: 120px; transform: rotate(90deg); " src="Images/arrow' + arrowC + '.svg"></td></tr>\n';

                    finalText += '<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/' + allArray[l]["Id_Categorie"].replace(" ", "").toLowerCase() + '.svg"></div><div class="subHeader">' + provisional + showStage + '</div></td></tr>\n';
                } else {
                    finalText += '<tr><td colspan="99" style="width: 100%; height: 100% text-align:center; padding-top: 500px;" class="title_font"></td>&nbsp;</tr>\n'; // just to fill
                }
                
                finalText += TVheaderText1 + '\n';

                lll = 1;
                
            } else if (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no") {
                
                
                if (showTvHeader == 1) {
                    finalText += '<tr><td colspan="99" style="width: 100%; height: 100% text-align:center; margin-buttom: 50px;" class="title_font"><img style="margin: 0; padding: 0; height: 120px; transform: rotate(90deg); " src="Images/arrow.svg"></td></tr>\n';

                    finalText += '<tr><td colspan="99" class="title_font"><div><img class="CategoryHeader" src="Images/gc.svg"></div><div class="subHeader">' + provisional + showStage + '</div></td></tr>\n';
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
                
                finalText += '<td class="rnk_font left">' + allArray[l]["Id_Nom"] + ' | ' + allArray[l]["Id_Nom_2"] + ' ' + leader + '</td>'; // add riders name
                
                finalText += '<td class="rnk_font"><span class="Flag ' + allArray[l]["Id_Nationalite"] + '"></span>' + ' ' + '<span class="Flag ' + allArray[l]["Id_Nationalite_2"] + '"></span></td>'; // add flags

                finalText += '<td class="rnk_font">' + allArray[l]["Id_Numero"] + '</td>'; // add number
                
                if ((allArray[l]["Id_Position_Categorie"] == 1 && useCategory == "yes") || (allArray[l]["Id_Position_Overall"] == 1 && useCategory == "no")) {
                    
                    
                    if (allArray[l]["finishTimeTotal"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["dnsfq"] == "blue") {
                        finalText += '<td class="rnk_font">-</td>\n'; // add total time
                    } else {
                        finalText += '<td class="rnk_font bold right">' + allArray[l]["finishTimeTotal"] + '</td>\n'; // add total time
                    }
                } else {
                    if (allArray[l]["Id_Ecart1er"] == 99999999999 || allArray[l]["dnsfq"] == "dsq" || allArray[l]["dnsfq"] == "dnf" || allArray[l]["dnsfq"] == "dns" || allArray[l]["dnsfq"] == "blue") {
                        finalText += '<td class="rnk_font">-</td>\n'; // add diff
                    } else {
                        finalText += '<td class="rnk_font right">+' + allArray[l]["Id_Ecart1er"] + '</td>\n'; // add diff
                    }
                }
                
        finalText += '</tr>\n';
    
    
} // END TV     



               
        }  // END for l      
         

         if (epictv == 1) {
            finalText += '<tr><td style="text-align: right; padding-right: 0;" colspan="99"><img  style="height: 40px;" class="CategoryHeader" src="Images/logo2_full_engB.svg"></td></tr>';
        }
         
        finalText += '\n</table>\n</div>\n';
        





if (showLog == 1) {                              
//    console.log(allArray);                
//const transformed = allArray.reduce((acc, {Id_Numero, ...x}) => { acc[Id_Numero] = x; return acc}, {})

const arrayToObject = (arr, keyField) => Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})));
  
const allArrayObject = arrayToObject(allArray, "Id_Numero")
//console.table(allArrayObject);
console.log(allArrayObject);

//console.table(allArray, ["Id_Numero", "Id_Position_Overall", "Id_Position_Categorie", "Id_FinishTime", "Id_FinishTime_1", "Id_FinishTime_2", "Id_FinishTime_3", "finishTimeTotal", "stagesFinished"]);
  //  console.log(finalText);

    
}                



//download(finalText, 'finalText.txt', 'text/plain')
                
//        console.log('allArray after:');
//        console.log(allArray);
          
//        console.log('allArray2:');
//        console.log(allArray2);


      
    tableClass = "";
            
    return finalText

    }
    
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        a.setAttribute("id", "download");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    };
    

    function ms2TimeString(mili){
        
        var z = ms2TimeStringSub(mili);
        
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
            h=a/36e5|0, // h=a/36e5%24|0, removed %24 so can be more then 24 hours
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
        
        if (precision == "tenth") {
            time = ((day*24) + hour) + ':' + (minute<10?0:'') + minute + ':' + (seconds<10?0:'') + seconds + '.' + millisecond/100;
        } else {
            time = ((day*24) + hour) + ':' + (minute<10?0:'') + minute + ':' + (seconds<10?0:'') + seconds + ':' + (millisecond<100?millisecond<10?'00':0:'') + millisecond;
        }
        
        return time
    }
    

    function alignTable() {
        
        if (cleanResults == 0 && epictv == 0) {
            
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
    
