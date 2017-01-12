<?php
$csv_file = file_get_contents($_FILES['file']['tmp_name']);// get the uploaded file content
if ($_POST['radio']) {
    $csv_file = mb_convert_encoding($csv_file, "UTF-8", "UTF-16LE");// enable utf-16le encoding
}
$delimiter = array("\t",",","|","\\","/",";");// all the options for delimiters
$csv = str_replace($delimiter, $delimiter[0], $csv_file);// convert delimiter to tab
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
$csv = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv);//delete empty lines
$csv_file = file_put_contents($_FILES['file']['tmp_name'], $csv);// recreate the uploaded file with the refoctoring

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
                    if (strpos($data1[$c], 'Rank') !== false) {
                        $header .= '        <th class="rnkh_font">מקום</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Rnk') !== false) {
                        $header .= '        <th class="rnkh_font">מקום</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Num') !== false) {
                        $header .= '        <th class="rnkh_font">מספר</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Bib.') !== false) {
                        $header .= '        <th class="rnkh_font">מספר</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Driver\'s last name') !== false) {
                        $header .= '        <th class="rnkh_font">נהג</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Driver\'s first name') !== false) {
                        $header .= '        <th class="rnkh_font">נווט</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Last Name') !== false) {
                        $header .= '        <th class="rnkh_font">שם</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'First Name') !== false) {
                        $header .= '        <th class="rnkh_font">נווט</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Name') !== false) {
                        $header .= '        <th class="rnkh_font">שם</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Driver') !== false) {
                        $header .= '        <th class="rnkh_font">שם</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Laps') !== false) {
                        $header .= '        <th class="rnkh_font">הקפות</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'B.Lap') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה מהירה</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Time') !== false) {
                        $header .= '        <th class="rnkh_font">זמן</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Gap') !== false) {
                        $header .= '        <th class="rnkh_font">פער</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Penalty') !== false) {
                        $header .= '        <th class="rnkh_font">עונשין</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 1') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 1</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 2') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 2</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 3') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 3</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 4') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 4</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 5') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 5</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 6') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 6</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 7') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 7</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 8') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 8</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 9') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 9</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 10') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 10</th>'."\r\n";
                    }
                }
            }
        $row1++;
        } else {
            $noNeedLines = $row1; //use to skip the first lines up to and including the english header when building the html
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
                $data[0] = str_replace("Run", "הקפה", $data[0]);
                $data[0] = str_replace("Disqualified", "נפסל", $data[0]);
                $data[0] = str_replace("Do not finish", "לא סיים", $data[0]);
                $data[0] = str_replace("Did not start", "לא התחיל", $data[0]);
                $data[0] = str_replace("Best lap:", "הקפה מהירה:", $data[0]);
    //            $data[0] = str_replace("laps", "הקפות", $data[0]);
    //            $data[0] = str_replace("lap", "הקפה", $data[0]);
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
                    $html .= '        <td  colspan="99" class="comment_font">'.$data[0].'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                } else {    // category header
                    $html .= '    <tr>'."\r\n";
                    $html .= '        <td  colspan="99" class="title_font">'.$data[0].'</td>'."\r\n";
                    $html .= '    </tr>'."\r\n";
                    $html .= $header."\r\n";
                }
            } else { // row with more then 1 cell
                $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                for ($c=0; $c < $num; $c++) {
                    $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("1h", "01:", $data[$c]);
                    $data[$c] = str_replace("2h", "02:", $data[$c]);
                    $data[$c] = str_replace("3h", "03:", $data[$c]);
                    $data[$c] = str_replace("4h", "04:", $data[$c]);
                    $html .= '        <td class="rnk_font">'.$data[$c].'</td>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            }
        }
    $row++;
    
    
    }
    fclose($handle);
}
$html .= '</table>'."\r\n";
echo ($html);
//echo htmlspecialchars($html);
?>
