// find the laps tables
    var btn = document.querySelectorAll('.no_num_color');
    for (let k = 0; k < btn.length; k++) {
            // find the td in laps table and itreare them
        btn[k].querySelectorAll('td.rnk_font:not(:first-child)').forEach(e => e.addEventListener("mouseover", function() {
                // get the value of the cell we mouseover
            var compareText = e.innerHTML;
                // itreate all td in this table and compare
            var divs = btn[k].querySelectorAll('td.rnk_font:not(:first-child)');
            for (i = 0; i < divs.length; ++i) {
                var text = divs[i].innerHTML;
                // Compare this with initial text and add matching class if it matches
                if (compareText === text && text != "") {
                    divs[i].classList.add("matching");
                    
                }
            }
        }));
                    
        btn[k].querySelectorAll('td.rnk_font:not(:first-child)').forEach(e => e.addEventListener("click", function() {
            // get the value of the cell we mouseover
            var compareText = e.innerHTML;
                // itreate all td in this table and compare
            var divs = btn[k].querySelectorAll('td.rnk_font:not(:first-child)');
            for (i = 0; i < divs.length; ++i) {
            
                var text = divs[i].innerHTML;
                // Compare this with initial text and add matching class if it matches
                if (compareText === text && text != "") {
/*                    switch(k%3) {
                        case 0:
                            var lineColor = 'LightSkyBlue';
                            break;
                        case 1:
                            var lineColor = 'PaleGreen';
                            break;
                        case 2:
                            var lineColor = 'LightSalmon';
                            break;
                        default:
                            var lineColor = 'Lavender';
                    }
*/                
                switch(Number(text)%9) {
                    case 0:
                        var lineColor = 'Beige';
                        break;
                    case 1:
                        var lineColor = 'SkyBlue';
                        break;
                    case 2:
                        var lineColor = 'Plum';
                        break;
                    case 3:
                        var lineColor = 'LightSalmon';
                        break;
                    case 4:
                        var lineColor = 'PaleGreen';
                        break;
                    case 5:
                        var lineColor = 'DarkKhaki';
                        break;
                    case 6:
                        var lineColor = 'IndianRed';
                        break;
                    case 7:
                        var lineColor = 'LemonChiffon';
                        break;
                    case 8:
                        var lineColor = 'MediumAquamarine';
                        break;
                    case 9:
                        var lineColor = 'Lavender';
                        break;
                    default:
                        var lineColor = 'Wheat';
                }

                    divs[i].style.backgroundColor = divs[i].style.backgroundColor === lineColor.toLowerCase() ? '' : lineColor.toLowerCase();
                } else {
                    divs[i].style.backgroundColor = '';
                }
            }
        }));

        // on click mark number in diffrent color or delete        
/*           btn[k].querySelectorAll('td.rnk_font:not(:first-child)').forEach(e => e.addEventListener("click", function() {
            // get the value of the cell we mouseover
            var compareText = e.innerHTML;
                // itreate all td in this table and compare
            var divs = btn[k].querySelectorAll('td.rnk_font:not(:first-child)');
            for (i = 0; i < divs.length; ++i) {
            
                var text = divs[i].innerHTML;
                // Compare this with initial text and add matching class if it matches
                if (compareText === text && text != "") {
                switch(Number((text)%9)) {
                    case 0:
                        var lineColor = 'Beige';
                        break;
                    case 1:
                        var lineColor = 'SkyBlue';
                        break;
                    case 2:
                        var lineColor = 'Plum';
                        break;
                    case 3:
                        var lineColor = 'PaleGreen';
                        break;
                    case 4:
                        var lineColor = 'PapayaWhip';
                        break;
                    case 5:
                        var lineColor = 'DarkKhaki';
                        break;
                    case 6:
                        var lineColor = 'IndianRed';
                        break;
                    case 7:
                        var lineColor = 'LemonChiffon';
                        break;
                    case 8:
                        var lineColor = 'MediumAquamarine';
                        break;
                    case 9:
                        var lineColor = 'Lavender';
                        break;
                    default:
                        var lineColor = 'Wheat';
                }

                    divs[i].style.backgroundColor = divs[i].style.backgroundColor === lineColor.toLowerCase() ? '' : lineColor.toLowerCase();

                }
            }
        }));
*/         

    }
                // clear all matching on mouseout
    document.querySelectorAll('.no_num_color td.rnk_font:not(:first-child)').forEach(e => e.addEventListener("mouseout", function() {
    
        var divs = document.querySelectorAll('.no_num_color td.rnk_font:not(:first-child)');
        for (j = 0; j < divs.length; ++j) {
    
                divs[j].classList.remove("matching");
        }
    }));
   
 
