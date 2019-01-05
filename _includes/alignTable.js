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
        var tds = tt[kk].querySelectorAll('th.rnkh_font');

            if (tds.length > 14) {
                tt[kk].classList.add("huge_table");
            } else if (tds.length > 10) {
                tt[kk].classList.add("big_table");
            }

        var ddd = 90 / (tds.length - 2); // 90% divided by number of columns - first 2 column

        tt[kk].querySelectorAll('td.rnk_font:nth-child(n+3)').forEach(function(element) { // all from column 3
            element.style.width = ddd + "%";
        });

        tt[kk].querySelectorAll('th.rnkh_font:nth-child(n+3)').forEach(function(element) { // all from column 3
            element.style.width = ddd + "%";
        });
 //       console.log(kk + " " + numCols)
    }
