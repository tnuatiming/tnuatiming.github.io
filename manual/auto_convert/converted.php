<?php
$categoryTranslate = array("אנדורו"=>"enduro", "ראלי רייד"=>"baja", "ראלי"=>"rally", "ראלי ספרינט"=>"rallysprint", "ריצה"=>"running", "מוטוקרוס"=>"motocross", "ג'ימקאנה"=>"gymkhana", "סופרבייק"=>"superbike", "אול מאונטיין"=>"allmountain", "קרטינג"=>"karting", "טרקטורונים"=>"atv", "סופרמוטו"=>"supermoto");

// liquid header

//$liquidHead .= ($_POST['registrationyear']."-".sprintf("%02d",$_POST['registrationmonth'])."-".sprintf("%02d",$_POST['registrationday'])); //add leading zero

$liquidHead .= ('---'."\r\n".'layout: post'."\r\n");
$liquidHead .= ('tag: "'.($_POST['category']).'"'."\r\n");
if ($_POST['category'] == "אנדורו") {
    $liquidHead .= ('type: "'.$_POST['type'].'"'."\r\n");
}
if ($_POST['place']) {
    $liquidHead .= ('place: "'.$_POST['place'].'"'."\r\n");
}
$liquidHead .= ('season: "'.$_POST['seasonyear'].'"'."\r\n");
if ($_POST['noseason']) {
    $liquidHead .= ('noseason: "true"'."\r\n");
}
if ($_POST['round']) {
    $liquidHead .= ('round: "מרוץ '.$_POST['round'].'"'."\r\n");
} else {
    $liquidHead .= ('round: ""'."\r\n");

}
// $englishCategory gets the category in english
foreach($categoryTranslate as $z => $z_value) {
    if (($_POST['category']) == $z) {
        $englishCategory = $z_value;
        break;
    } else {
        $englishCategory = $_POST['category'];
    }
}

$liquidHead .= ('categories: [results, '.$englishCategory.']'."\r\n");
$liquidHead .= ('---'."\r\n");

//the file name to save
$localFileName = ('/results/'.$englishCategory.'/'.$_POST['seasonyear'].'/'.$englishCategory.$_POST['seasonyear'].'r'.($_POST['r'] ? $_POST['r'] : $_POST['round']).'.html');

$globalFileName = ('http://tnuatiming.com/results/'.$englishCategory.'/'.$_POST['seasonyear'].'/'.$englishCategory.$_POST['seasonyear'].'r'.($_POST['r'] ? $_POST['r'] : $_POST['round']).'.html');

$date = ($_POST['registrationday']."-".$_POST['registrationmonth']."-".$_POST['registrationyear']);

if ($_POST['finishedpage']) {
    $html .= (file_get_contents('headP1.txt'));
    $html .= ('        <title>תנועה מדידת זמנים &middot; '.$_POST['category'].'&#58;'.($_POST['seasonyear'] ? ' עונת '.$_POST['seasonyear'] : '').' '.($_POST['round'] ? 'מרוץ '.$_POST['round'] : '').($_POST['place'] ? ' &ndash; '.$_POST['place'] : '').'</title>'."\r\n");
    $html .= ('        <meta property="og:url" content="'.$globalFileName.'"/>'."\r\n");
    $html .= ('        <meta property="article:tag" content="'.$_POST['category'].'"/>'."\r\n");
    $html .= ('        <meta property="og:description" content="תוצאות"/>'."\r\n");
    $html .= ('        <meta property="og:title" content="תנועה מדידת זמנים &middot; '.$_POST['category'].'&#58; '.($_POST['round'] ? 'מרוץ '.$_POST['round'] : '').($_POST['seasonyear'] ? ' עונת '.$_POST['seasonyear'] : '').($_POST['place'] ? ' &ndash; '.$_POST['place'] : '').'"/>'."\r\n");
    $html .= (file_get_contents('headP2.txt'));
    $html .= ('    <body id="race" class="'.$englishCategory.'">'."\r\n");
    $html .= (file_get_contents('headP3.txt'));
    $html .= ('            <h2>'.$_POST['category'].(($_POST['category'] == "אנדורו") ? ' &ndash; '.$_POST['type'] : '').'</h2>'."\r\n");
    $html .= ('            <h2>'.($_POST['round'] ? 'מרוץ '.$_POST['round'].' ' : '').(!$_POST['noseason'] ? 'עונת '.$_POST['seasonyear'].' &ndash; ' : '').($_POST['place'] ? $_POST['place'] : '').' &ndash; '.$date.'</h2>'."\r\n");
    
}

$csv_file = file_get_contents($_FILES['file']['tmp_name']);// get the uploaded file content
if ($_POST['utf16']) {
    $csv_file = mb_convert_encoding($csv_file, "UTF-8", "UTF-16LE");// enable utf-16le encoding
}
if ($_POST['run']) {
    $runType = "מקצה";// use מקצה for "Run"
} else {
    $runType = "הקפה";// use הקפה for "Run"
}
if ($_POST['changename']) {
    $changeName = "נהג";// use נהג for "Run"
} else {
    $changeName = "שם";// use שם for "Run"
}
$delimiter = array("\t",",","|","\\","/",";");// all the options for delimiters
if ($_POST['elite']) { // for elite we do not want the convert delimiters as they used for other things
} else {
    $csv_file = str_replace($delimiter, $delimiter[0], $csv_file);// convert delimiter to tab
}
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
$csv_file = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv_file);//delete empty lines
file_put_contents($_FILES['file']['tmp_name'], $csv_file);// recreate the uploaded file with the refoctoring

$csv_file = ($_FILES['file']['tmp_name']);// get the uploaded file

// header stack
if ($_POST['elite']) {  //create header for elite v3
    $stop = 0;
    $blap = ""; // start creating the best lap lines variable
    $header .= '    <tr class="rnkh_bkcolor">'."\r\n"; // start creating the denamic header
    $row1 = 1;
    if (($handle1 = fopen($csv_file, "r")) !== FALSE) {
        while (($data1 = fgetcsv($handle1, 1000, "\t")) !== FALSE) {
                $num = count($data1);
                if (($stop == 0) && ($num > 3)) { // header line probably more then 3 colmuns and stop going trough the line when the header is detected
                    $bigTable = $num;
                    for ($c=0; $c < $num; $c++) {
                        $header .= '        <th class="rnkh_font">'.$data1[$c].'</th>'."\r\n";
                        $stop = 1;
                        $hrow = $row1;
                    }
                } else {
                if ($_POST['nobestlap']) {

  // copy best lap lines to new variable to insert in the second pass
//        $totalBlab = 0; // how many best laps lines we have
                    if (($num < 3) && (strpos($data1[0], 'הקפה מהירה') !== false)) { // best lap less then 3 colmuns
                            $data1[0] = str_replace(",", "", $data1[0]);
                            $data1[0] = str_replace("No.", "", $data1[0]); // deleting the elite 3 no. from the best lap line
                            $data1[0] = preg_replace("~ קטגוריה \'(.*?)\' ~", "", $data1[0]); // fixing the elite 3 best lap line when displaying per category
                            $data1[0] = str_replace("מספר", "", $data1[0]);
                            $data1[0] = str_replace(" :", ":", $data1[0]);
//                            $totalBlab++;
//                            $blap .= $data1[0]."\r\n";

// rearrange the best lap line so it is connsistend with vola and check how long the name cell is
                            $blaparray = explode(" ", $data1[0]); 
                            if ($blaparray[8]) {
                                $blap .= ($blaparray[0]." ".$blaparray[1]." ".$blaparray[3]." ".$blaparray[4]." ".$blaparray[5]." ".$blaparray[6]." ".$blaparray[7]." ".$blaparray[8]." - ".$blaparray[2]."\r\n"); 
                            } elseif ($blaparray[7]) {
                                $blap .= ($blaparray[0]." ".$blaparray[1]." ".$blaparray[3]." ".$blaparray[4]." ".$blaparray[5]." ".$blaparray[6]." ".$blaparray[7]." - ".$blaparray[2]."\r\n"); 
//                            print_r($blaparray);
                            } elseif ($blaparray[6]) {
                                $blap .= ($blaparray[0]." ".$blaparray[1]." ".$blaparray[3]." ".$blaparray[4]." ".$blaparray[5]." ".$blaparray[6]." - ".$blaparray[2]."\r\n"); 
                            } else {
                                $blap .= ($blaparray[0]." ".$blaparray[1]." ".$blaparray[3]." ".$blaparray[4]." ".$blaparray[5]." - ".$blaparray[2]."\r\n"); 
                            }
                    }
        
        //echo "total lines: $totalBlab"; 
        //echo "<br><br>";

        //$lineNum = 0;
        //$lines = split("\r\n", $blap);
        //foreach ($lines as $line) {
        //    $lineNum++;
        //    echo "line: $lineNum $line<br>"; 
        //}   

        //echo "<br><br>";
        //$kw = explode("\r\n", $blap); // moved down so it will run just once when we finish the first pass
        //for($i=0;$i<count($kw);$i++){
        //    echo "$kw[$i]<br>";
        //}    

        //echo "<br><br>";    
        //echo "$kw[1]<br>";
                
        //    echo "<br><br>";    
        //echo "$kw[0]<br>";
            
        //print_r($kw);
        
                    }
                }
            $row1++;
        }
        fclose($handle1);
    }
    $header .= '    </tr>'; // finishing the dynamic header
    $kw = explode("\r\n", $blap); // convert the best lap list into array

    if ($_POST['deleterows']) {
    $noNeedLines = 0; //do not skip the first lines up to and including the english header when building the html
    } else {
    $noNeedLines = $hrow; //use to skip the first lines up to and including the english header when building the html
    }


} else {//create header for vola
    $stop = 0;
    $header .= '    <tr class="rnkh_bkcolor">'."\r\n"; // start creating the denamic header
    $row1 = 0;
    if (($handle1 = fopen($csv_file, "r")) !== FALSE) {
        while (($data1 = fgetcsv($handle1, 1000, "\t")) !== FALSE) {
            if ($stop == 0) {      //stop going trough the line when the header is detected
                $num = count($data1);
//                if ($num != 1) {
                if ($num > 1) {
                    $bigTable = $num;
                    for ($c=0; $c < $num; $c++) {
                    
                        $headerItem = array("Rank"=>"מקום", "Rnk"=>"מקום", "Pos."=>"מקום", "Num"=>"מספר", "Bib."=>"מספר", "Driver's last name"=>$changeName, "Driver's first name"=>"נווט", "Last Name"=>$changeName, "First Name"=>"נווט", "Name"=>$changeName, "Driver"=>$changeName, "Laps"=>"הקפות", "B.Lap"=>"הקפה מהירה", "Lap"=>"הקפה", "Time"=>"זמן", "Gap"=>"פער", "Penalty"=>"עונשין", "Category"=>"קטגוריה", "Hour"=>"זמן כולל", "Seq"=>"סידורי", "Points"=>"נקודות", "Run 1"=>"$runType 1", "Run 2"=>"$runType 2", "Run 3"=>"$runType 3", "Run 4"=>"$runType 4", "Run 5"=>"$runType 5", "Run 6"=>"$runType 6", "Run 7"=>"$runType 7", "Run 8"=>"$runType 8", "Run 9"=>"$runType 9", "Run 10"=>"$runType 10", "Run 11"=>"$runType 11", "Run 12"=>"$runType 12");

                        foreach($headerItem as $x => $x_value) {
                            if (stripos($data1[$c], $x) !== false) {
                                $header .= '        <th class="rnkh_font">'.$x_value.'</th>'."\r\n";
                                $stop = 1;
                                break; 
                            } 
                        }
                    
                    }
                }
            $row1++;
            } else {
                if ($_POST['deleterows']) {
                $noNeedLines = 0; //do not skip the first lines up to and including the english header when building the html
                } else {
                $noNeedLines = $row1; //use to skip the first lines up to and including the english header when building the html
                }
            }
        }
        fclose($handle1);
    }
    $header .= '    </tr>'; // finishing the denamic header
}
// start building the html 
$row = 1;
$blapinsert = 0;
$categoryheader = -1;

if ($bigTable > 10) { // check if table has more then 10 colmuns and mark the class
    $html .= '<table class="line_color big_table">'."\r\n";
} else {
    $html .= '<table class="line_color">'."\r\n";
}

if (($handle = fopen($csv_file, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
if ($_POST['elite']) { // elite v3
//    if ($row !== $noNeedLines) { // skip the first lines we do not need
    if ($row > $noNeedLines) { // skip the first lines we do not need
    //        echo "data: $data[0]";
    //        echo "    <tr class=\"rnk_bkcolor\">\n";
            $num = count($data);
            if ($num == 1) { // row with 1 cell
                $data[0] = str_ireplace("Run", $runType, $data[0]);
                $data[0] = str_ireplace("Disqualified", "נפסל", $data[0]);
                $data[0] = str_ireplace("Do not finish", "לא סיים", $data[0]);
                $data[0] = str_ireplace("Did not start", "לא התחיל", $data[0]);
                $data[0] = str_ireplace("Best lap:", "הקפה מהירה:", $data[0]);
//                $data[0] = str_replace(",", "", $data[0]);
//                $data[0] = str_replace("No.", "", $data[0]); // deleting the elite 3 no. from the best lap line
//                $data[0] = preg_replace("~ קטגוריה \'(.*?)\' ~", "", $data[0]); // fixing the elite 3 best lap line when displaying per category
//                $data[0] = str_replace("מספר", "", $data[0]);
                $data[0] = str_ireplace("הקפה מהירה :", "הקפה מהירה:", $data[0]);
                $data[0] = str_replace("קטגוריה : ", "", $data[0]); // deleting the elite 3 category from the category header
    //            $data[0] = str_ireplace("laps", "הקפות", $data[0]);
    //            $data[0] = str_ireplace("lap", "הקפה", $data[0]);
                if (strpos($data[0], 'DISQ') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DSQ - נפסל</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DSQ') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DSQ - נפסל</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DNS') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DNS - לא התחיל</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DNF') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DNF - לא סיים</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'הקפה מהירה') !== false) {
//                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="comment_font">'.trim($data[0]).'</td>'."\r\n";
//                    $html .= '    </tr>'."\r\n";
                } else {    // category header

// inserting best lap BEFORE next category header
                    if ($_POST['nobestlap']) { 
                        if ($categoryheader > (-1)) {
                            $html .= '    <tr>'."\r\n";
                            $html .= '        <td  colspan="99" class="comment_font">'.trim($kw[$categoryheader]).'</td>'."\r\n";
                            $html .= '    </tr>'."\r\n";
                        }
                    }
// end inserting best lap BEFORE next category header
                               
                    $html .= '    <tr>'."\r\n";
                    $html .= '        <td  colspan="99" class="title_font">'.trim($data[0]).'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                    $categoryheader++;

// inserting best lap after category header
//                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="comment_font">'.trim($kw[$blapinsert]).'</td>'."\r\n";
//                    $html .= '    </tr>'."\r\n";
//                    $blapinsert++;
// end inserting best lap after category header

                    $html .= $header."\r\n";
                }
            } else { // row with more then 1 cell
                if (!in_array("START",$data)) {  // row with "START" in it will not br processed and apectly deleted
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    for ($c=0; $c < $num; $c++) {
                        $data[$c] = str_replace("1 הקפות", "1 הקפה", $data[$c]);
                        $data[$c] = str_ireplace("laps", "הקפות", $data[$c]);
                        $data[$c] = str_ireplace("lap", "הקפה", $data[$c]);
                        $data[$c] = str_ireplace("START", "זינוק", $data[$c]);
                        $data[$c] = str_ireplace("FINISH", "סיום", $data[$c]);
                        $data[$c] = str_replace("*", "", $data[$c]);
                        $data[$c] = str_replace("1h", "01:", $data[$c]);
                        $data[$c] = str_replace("2h", "02:", $data[$c]);
                        $data[$c] = str_replace("3h", "03:", $data[$c]);
                        $data[$c] = str_replace("4h", "04:", $data[$c]);
                        $data[$c] = str_replace("5h", "05:", $data[$c]);
                        if (strpos($data[$c], '(C)') !== false) {
                            $data[$c] = str_replace("(C)", " P ", $data[$c]);
                            $html .= '        <td class="rnk_font penalty">'.trim($data[$c]).'</td>'."\r\n";
                        } else {
                            $html .= '        <td class="rnk_font">'.trim($data[$c]).'</td>'."\r\n";
                        }
                    }
                    $html .= '    </tr>'."\r\n";
                }
            }
        }
} else { // vola
    if ($row > $noNeedLines) { // skip the first lines we do not need
    //        echo "data: $data[0]";
    //        echo "    <tr class=\"rnk_bkcolor\">\n";
            $num = count($data);
            if ($num == 1) { // row with 1 cell
                $data[0] = str_ireplace("Run", $runType, $data[0]);
                $data[0] = str_ireplace("Disqualified", "נפסל", $data[0]);
                $data[0] = str_ireplace("Do not finish", "לא סיים", $data[0]);
                $data[0] = str_ireplace("Did not start", "לא התחיל", $data[0]);
                $data[0] = str_ireplace("Best lap:", "הקפה מהירה:", $data[0]);
    //            $data[0] = str_ireplace("laps", "הקפות", $data[0]);
    //            $data[0] = str_ireplace("lap", "הקפה", $data[0]);
                if (strpos($data[0], 'DISQ') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DSQ - נפסל</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DSQ') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DSQ - נפסל</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DNS') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DNS - לא התחיל</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DNF') !== false) {
                    $html .= '    <tr>'."\r\n";
//                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">DNF - לא סיים</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'הקפה מהירה') !== false) {
                    $html .= '    <tr>'."\r\n";
                    $html .= '        <td  colspan="99" class="comment_font">'.trim($data[0]).'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } else {    // category header
                    $html .= '    <tr>'."\r\n";
                    $html .= '        <td  colspan="99" class="title_font">'.trim($data[0]).'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                    $html .= $header."\r\n";
                }
            } else { // row with more then 1 cell
                if (!in_array("START",$data)) {  // row with "START" in it will not br processed and apectly deleted
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    for ($c=0; $c < $num; $c++) {
                        $data[$c] = str_ireplace("laps", "הקפות", $data[$c]);
                        $data[$c] = str_ireplace("lap", "הקפה", $data[$c]);
                        $data[$c] = str_ireplace("START", "זינוק", $data[$c]);
                        $data[$c] = str_ireplace("FINISH", "סיום", $data[$c]);
                        $data[$c] = str_replace("*", "", $data[$c]);
                        $data[$c] = str_replace("1h", "01:", $data[$c]);
                        $data[$c] = str_replace("2h", "02:", $data[$c]);
                        $data[$c] = str_replace("3h", "03:", $data[$c]);
                        $data[$c] = str_replace("4h", "04:", $data[$c]);
                        $data[$c] = str_replace("5h", "05:", $data[$c]);
                        $html .= '        <td class="rnk_font">'.trim($data[$c]).'</td>'."\r\n";
                    }
                    $html .= '    </tr>'."\r\n";
                }
            }
        }

}
        $row++;
    }
    fclose($handle);
}

// last best lap line
if ($_POST['nobestlap']) { 
    $html .= '    <tr>'."\r\n";
    $html .= '        <td  colspan="99" class="comment_font">'.trim($kw[$categoryheader]).'</td>'."\r\n";
    $html .= '    </tr>'."\r\n";
}
// end last best lap line

$html .= '</table>'."\r\n";


//this to get more result of the same category and year, used at fileindex.php as well

function rscandir($base='', &$data=array()) {

    $array = array_diff(scandir($base), array('.', '..')); // remove . and .. from the array 
    foreach($array as $value) : // loop through the array at the level of the supplied $base 
        if (is_dir($base.$value)) : // if this is a directory 
        //     $data[] = $base.$value.'/'; // add it to the $data array 
            $data = rscandir($base.$value.'/', $data); // then make a recursive call with the current $value as the $base supplying the $data array to carry into the recursion           
        elseif (is_file($base.$value)) : // else if the current $value is a file 
            $data[] = str_replace("/home/raz/public_html", "",$base.$value); // just add the current $value to the $data array     
        endif;
    endforeach;
    return $data; // return the $data array
}

$results = array ();

foreach ((rscandir('/home/raz/public_html/results'.'/')) as $itemc):
    if (($itemc != '/results/index.html') and ($itemc != '/results/index1.html')) { //skip index.html
        $results[] = explode("/", str_replace("/results/", "",$itemc));
    }
endforeach;

// add value in multidimantinal array
foreach ($results as &$item):
//   if($item[2]==rallysprint2016r1.html){
//      array_push($item, "2022-12-4"); // or just $item[] = "2022-12-4";
//    }
    $iurl = ('/results/'.$item[0].'/'.$item[1].'/'.$item[2]);
//    array_push($item, (get_data($iurl,"name"))); // add inner html span name value
//    array_push($item, (get_data($iurl,"rund"))); // add inner html span round value
//    array_push($item, (get_data($iurl,"date"))); // add inner html span date value

    $data = file_get_contents("../..".$iurl);// get the uploaded file content
    $data = mb_convert_encoding($data, 'HTML-ENTITIES', 'UTF-8');
    $doc = new DOMDocument();
    $doc->loadHTML($data);
    foreach ($doc->getElementsByTagName('span') as $node) {
        if (strpos(($doc->saveHtml($node)), "name") !== false) {
            $innerHtml=  $doc->saveHtml($node);
            $innerHtml= rtrim(substr($innerHtml,16), '</span>'); // get the inner html
            array_push($item, $innerHtml);
        } 
        if (strpos(($doc->saveHtml($node)), "rund") !== false) {
            $innerHtml=  $doc->saveHtml($node);
            $innerHtml= rtrim(substr($innerHtml,16), '</span>'); // get the inner html
            array_push($item, $innerHtml);
        } 
        if (strpos(($doc->saveHtml($node)), "date") !== false) {
            $innerHtml=  $doc->saveHtml($node);
            $innerHtml= rtrim(substr($innerHtml,16), '</span>'); // get the inner html
            array_push($item, $innerHtml);
        }
    }
    
    array_push($item, $iurl); // add internal address value

    $noTranslation = 0;
    foreach($categoryTranslate as $z => $z_value) { // add english category
        if (($item[0]) == $z) {
            array_push($item,$z_value);
            $noTranslation = 1;
            break;
        } 
    }
    if ($noTranslation == 0) { // if no translation to english,push the hebrew category
        array_push($item,$item[0]);
    }

endforeach;

// Sort Multi-dimensional Array by DATE 
usort($results, function($a, $b) {
    return $a['5'] - $b['5'];
});
$results = array_values($results); // re index
$results = array_reverse($results);// reverse the array so newest result are first
$p = 0;
//print_r($results);
/*
[0] => enduro
[1] => 2017
[2] => enduro2017r1.html
[3] => אום זוקא
[4] => מרוץ 1
[5] => 20161231
[6] => /results/enduro/2017/enduro2017r1.html
[7] => אנדורו
*/
// create the previous results list
foreach ($results as $itemu):
    if (($itemu[0] == $englishCategory) && ($itemu[1] == $_POST['seasonyear']) && ($localFileName !== $itemu[6])) {
        if ($p == 0) {
            $pRaces = '<div class="erlier_races">'."\r\n".'    <h2>תוצאות נוספות בעונת '.$_POST['seasonyear'].':</h2>'."\r\n".'    <ul>'."\r\n";
        }
        $p += 1;
        $butifyDate = (str_split($itemu[5],2));        
        $pRaces .= '        <li><a href='.$itemu[6].'>'.($itemu[4] ? $itemu[4].' - ' : '').$itemu[3].' - '.ltrim($butifyDate[3],'0').'-'.ltrim($butifyDate[2],'0').'-'.$butifyDate[0].$butifyDate[1].'</a></li>'."\r\n";
    }
endforeach;
if ($p > 0) {
    $pRaces .= '    </ul>'."\r\n".'</div>'."\r\n";
}

if ($_POST['finishedpage']) {
    if ($_POST['presults']) {
        $html .= $pRaces;
    }
    $html .= '<p><span id="name">'.$_POST['place'].'</span></p>'."\r\n";
    $html .= '<p><span id="rund">'.($_POST['round'] ? 'מרוץ '.$_POST['round'] : '').'</span></p>'."\r\n";
    $html .= '<p><span id="date">'.$_POST['registrationyear'].sprintf("%02d",$_POST['registrationmonth']).sprintf("%02d",$_POST['registrationday']).'</span></p>'."\r\n";
    $html .= (file_get_contents('foot.txt'));
    echo ($html);
}
//echo ($html);
//echo htmlentities($html);
//echo nl2br(htmlentities($html));
//echo htmlspecialchars($html);
if (!$_POST['finishedpage']) {
    if (!$_POST['dontshowraw']) {
        echo ($html);
        echo "<br><br><br>";
    }
    echo "<pre>";
    if ($_POST['liquid']) {
        echo htmlentities($liquidHead);
    }
    echo htmlentities($html);
    echo "</pre>";
}

?>
