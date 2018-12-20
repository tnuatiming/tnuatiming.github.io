    // aligning table colmuns according to number of colmuns
    var tt = document.querySelectorAll('.line_color');
    for (let kk = 0; kk < tt.length; kk++) {
        var numCols = 0;
        for (let ii = 0;ii<tt[kk].rows.length;ii++) {//loop through HTMLTableRowElement
            row = tt[kk].rows[ii];
            
            if (numCols < row.cells.length) {
                numCols = row.cells.length;
            }
            row = null;
        }
        tt[kk].querySelectorAll('td.rnk_font:nth-child(n+3)').forEach(function(element) { // start with column 3
            var ddd = 90 / (numCols - 2); // 90% divided by number of columns - first 2
            element.style.width = ddd + "%";
        });
        tt[kk].querySelectorAll('th.rnkh_font:nth-child(n+3)').forEach(function(element) { // start with column 3
            var ddd = 90 / (numCols - 2); // 90% divided by number of columns - first 2
            element.style.width = ddd + "%";
        });
 //       console.log(kk + " " + numCols)
        
    }
 

 
