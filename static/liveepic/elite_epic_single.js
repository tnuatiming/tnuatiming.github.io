
    var url = 'p3.html';
    var target = 'result';

    var TimerLoad;
    var Rafraichir = 60000; // every 60 seconds

    var P1;
    


    
    var tableClass = "fadeIn ";

    async function Load() {
        
                    
        var loop;
        if (TimerLoad) clearTimeout(TimerLoad);


        if (self.fetch) {

            try {
                const response = await fetch(url, {cache: "no-store"});
                if (response.ok) {
                    P1 = await response.text();
                    document.getElementById(target).innerHTML = P1;
                    alignTable();
                }
            }
            catch (err) {
                console.log('results fetch failed', err);
            }

        } else {
            var xhr;
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    P1 = xhr.responseText;
                    document.getElementById(target).innerHTML = P1;
                    alignTable();
                }
            };
            
            xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
            xhr.send(null);
            
        }


        loop = function() {
            Load();
        };

        TimerLoad = setTimeout(loop, Rafraichir);
        Rafraichir = 60000; // every 60 seconds

    }

        

    function alignTable() {
        
            
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

