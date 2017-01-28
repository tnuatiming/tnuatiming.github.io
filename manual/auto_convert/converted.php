<?php
// liquid header

//$head .= ($_POST['registrationyear']."-".sprintf("%02d",$_POST['registrationmonth'])."-".sprintf("%02d",$_POST['registrationday']));
if ($_POST['liquid']) {
    $head .= ('---'."\r\n".'layout: post'."\r\n");
    $head .= ('tag: "'.($_POST['category']).'"'."\r\n");
    if ($_POST['category'] == "אנדורו") {
        $head .= ('type: "'.$_POST['type'].'"'."\r\n");
    }
    if ($_POST['place']) {
        $head .= ('place: "'.$_POST['place'].'"'."\r\n");
    }
    $head .= ('season: "'.$_POST['seasonyear'].'"'."\r\n");
    if ($_POST['noseason']) {
        $head .= ('noseason: "true"'."\r\n");
    }
    if ($_POST['round']) {
        $head .= ('round: "מרוץ '.$_POST['round'].'"'."\r\n");
    } else {
        $head .= ('round: ""'."\r\n");
    
    }
    switch ($_POST['category']) {
        case "אנדורו":
            $cat = "enduro";
            break;
        case "ראלי רייד":
            $cat = "baja";
            break;
        case "ראלי":
            $cat = "rally";
            break;
        case "ראלי ספרינט":
            $cat = "rallysprint";
            break;
        case "ריצה":
            $cat = "running";
            break;
        case "מוטוקרוס":
            $cat = "motocross";
            break;
        case 'ג\'ימקאנה':
            $cat = "gymkhana";
            break;
        case "סופרבייק":
            $cat = "superbike";
            break;
        case "אול מאונטיין":
            $cat = "allmountain";
            break;
        case "קרטינג":
            $cat = "karting";
            break;
        case "סופרמוטו":
            $cat = "supermoto";
            break;
        default:
            $cat = $_POST['category'];
    }
    $head .= ('categories: [results, '.$cat.']'."\r\n");

    $head .= ('---'."\r\n");
}

//the file name to save, FIX if no round
$localFileName = ('../../results/'.$cat.'/'.$_POST['seasonyear'].'/'.$cat.$_POST['seasonyear'].'r'.$_POST['round'].'.html');
$globalFileName = ('http://tnuatiming.com/results/'.$cat.'/'.$_POST['seasonyear'].'/'.$cat.$_POST['seasonyear'].'r'.$_POST['round'].'.html');
$date = ($_POST['registrationday']."-".$_POST['registrationmonth']."-".$_POST['registrationyear']);

if ($_POST['finishedpage']) {

    $html .= (file_get_contents('headP1.txt'));
    $html .= ('        <title>תנועה מדידת זמנים &middot; '.$_POST['category'].'&#58;'.($_POST['seasonyear'] ? ' עונת '.$_POST['seasonyear'] : '').' '.($_POST['round'] ? 'מרוץ '.$_POST['round'] : '').($_POST['place'] ? ' &ndash; '.$_POST['place'] : '').'</title>'."\r\n");
    $html .= ('        <meta property="og:url" content="'.$globalFileName.'"/>'."\r\n");
    $html .= ('        <meta property="article:tag" content="'.$_POST['category'].'"/>'."\r\n");
    $html .= ('        <meta property="og:description" content="תוצאות"/>'."\r\n");
    $html .= ('        <meta property="og:title" content="תנועה מדידת זמנים &middot; '.$_POST['category'].'&#58; '.($_POST['round'] ? 'מרוץ '.$_POST['round'] : '').($_POST['seasonyear'] ? ' עונת '.$_POST['seasonyear'] : '').($_POST['place'] ? ' &ndash; '.$_POST['place'] : '').'"/>'."\r\n");
    $html .= (file_get_contents('headP2.txt'));
    $html .= ('    <body id="race" class="'.$cat.'">'."\r\n");
    $html .= (file_get_contents('headP3.txt'));


    $html .= ('            <h2>'.$_POST['category'].'</h2>'."\r\n");
    $html .= ('            <h2>'.($_POST['round'] ? 'מרוץ '.$_POST['round'] : '').($_POST['seasonyear'] ? ' עונת '.$_POST['seasonyear'] : '').($_POST['place'] ? ' &ndash; '.$_POST['place'] : '').' &ndash; '.$date.'</h2>'."\r\n");

    
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
$csv_file = str_replace($delimiter, $delimiter[0], $csv_file);// convert delimiter to tab
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
$csv_file = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv_file);//delete empty lines
file_put_contents($_FILES['file']['tmp_name'], $csv_file);// recreate the uploaded file with the refoctoring

$csv_file = ($_FILES['file']['tmp_name']);// get the uploaded file

// header stack
$stop = 0;
$header .= '    <tr class="rnkh_bkcolor">'."\r\n"; // start creating the denamic header
$row1 = 0;
if (($handle1 = fopen($csv_file, "r")) !== FALSE) {
    while (($data1 = fgetcsv($handle1, 1000, "\t")) !== FALSE) {
        if ($stop == 0) {      //stop going trough the line when the header is detected
            $num = count($data1);
            if ($num != 1) {
                for ($c=0; $c < $num; $c++) {
                    if (stripos($data1[$c], 'Rank') !== false) {
                        $header .= '        <th class="rnkh_font">מקום</th>'."\r\n";
                        $stop = 1;
                    } elseif (stripos($data1[$c], 'Rnk') !== false) {
                        $header .= '        <th class="rnkh_font">מקום</th>'."\r\n";
                        $stop = 1;
                    } elseif (stripos($data1[$c], 'Pos.') !== false) {
                        $header .= '        <th class="rnkh_font">מקום</th>'."\r\n";
                        $stop = 1;
                    } elseif (stripos($data1[$c], 'Num') !== false) {
                        $header .= '        <th class="rnkh_font">מספר</th>'."\r\n";
                        $stop = 1;
                    } elseif (stripos($data1[$c], 'Bib.') !== false) {
                        $header .= '        <th class="rnkh_font">מספר</th>'."\r\n";
                        $stop = 1;
                    } elseif (stripos($data1[$c], 'Driver\'s last name') !== false) {
                        $header .= '        <th class="rnkh_font">'.$changeName.'</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Driver\'s first name') !== false) {
                        $header .= '        <th class="rnkh_font">נווט</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Last Name') !== false) {
                        $header .= '        <th class="rnkh_font">'.$changeName.'</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'First Name') !== false) {
                        $header .= '        <th class="rnkh_font">נווט</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Name') !== false) {
                        $header .= '        <th class="rnkh_font">'.$changeName.'</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Driver') !== false) {
                        $header .= '        <th class="rnkh_font">'.$changeName.'</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Laps') !== false) {
                        $header .= '        <th class="rnkh_font">הקפות</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'B.Lap') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה מהירה</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Lap') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Time') !== false) {
                        $header .= '        <th class="rnkh_font">זמן</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Gap') !== false) {
                        $header .= '        <th class="rnkh_font">פער</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Penalty') !== false) {
                        $header .= '        <th class="rnkh_font">עונשין</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Hour') !== false) {
                        $header .= '        <th class="rnkh_font">זמן כולל</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Seq') !== false) {
                        $header .= '        <th class="rnkh_font">סידורי</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 1') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 1</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 2') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 2</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 3') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 3</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 4') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 4</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 5') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 5</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 6') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 6</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 7') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 7</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 8') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 8</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 9') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 9</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 10') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 10</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 11') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 11</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 12') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 12</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 13') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 13</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 14') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 14</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 15') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 15</th>'."\r\n";
                    } elseif (stripos($data1[$c], 'Run 16') !== false) {
                        $header .= '        <th class="rnkh_font">'.$runType.' 16</th>'."\r\n";
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

// start building the html 
$row = 1;
$html .= '<table class="line_color">'."\r\n";
if (($handle = fopen($csv_file, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
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
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DSQ') !== false) {
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DNS') !== false) {
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'DNF') !== false) {
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    $html .= '        <td  colspan="99" class="subtitle_font">'.$data[0].'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } elseif (strpos($data[0], 'הקפה מהירה:') !== false) {
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
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
    $row++;
    }
    fclose($handle);
}
$html .= '</table>'."\r\n";
if ($_POST['finishedpage']) {
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
    echo htmlentities($head);
    echo htmlentities($html);
    echo "</pre>";
}
?>
