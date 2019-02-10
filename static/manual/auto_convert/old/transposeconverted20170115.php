<?php
$csv_file = file_get_contents($_FILES['file']['tmp_name']);// get the uploaded file content
if ($_POST['utf16']) {
    $csv_file = mb_convert_encoding($csv_file, "UTF-8", "UTF-16LE");// enable utf-16le encoding
}
$delimiter = array("\t",",","|","\\","/",";");// all the options for delimiters
$csv = str_replace($delimiter, $delimiter[0], $csv_file);// convert delimiter to tab
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
$csv = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv);//delete empty lines
$csv_file = file_put_contents($_FILES['file']['tmp_name'], $csv);// recreate the uploaded file with the refoctoring

$csv_file = ($_FILES['file']['tmp_name']);// get the uploaded file



    // start building the html 
$row = 1;
$html .= '<table class="line_color no_num_color">'."\r\n";
$html .= '    <tr>'."\r\n";
$html .= '        <td  colspan="99" class="title_font">מהלך המירוץ</td>'."\r\n";
$html .= '    </tr>'."\r\n";


$row = 1;
if (($handle = fopen($csv_file, "r")) !== FALSE) {
echo ($handle);
    while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
    //        echo "data: $data[0]";
    //        echo "    <tr class=\"rnk_bkcolor\">\n";
            $num = count($data);
            if ($row == 1) { // row with 1 cell
                $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                for ($c=0; $c < $num; $c++) {
                    $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                    $html .= '        <th class="rnkh_font">'.$data[$c].'</th>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            } else { // row with more then 1 cell
                $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                for ($c=0; $c < $num; $c++) {
                    $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                    $html .= '        <td class="rnk_font">'.$data[$c].'</td>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            }
    $row++;
    
    
    }
    fclose($handle);
}

//transpose from textareaname

$handle1 = trim($_POST['textareaname']);
$textAr = explode("\r\n", $handle1);
$textAr = array_filter($textAr, 'trim'); // remove any extra \r characters left behind

$array = array();

$row = 1;
$count = count($textAr);
    for ($i = 0; $i < $count; $i++) {
            $data = preg_split( "/,/", $textAr[$i]);
            $num = count($data);
            if ($row == 1) { // row with 1 cell
                $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                for ($c=0; $c < $num; $c++) {
                    $array[$i][$c] = $data[$c];
                    $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                    $html .= '        <th class="rnkh_font">'.$data[$c].'</th>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            } else { // row with more then 1 cell
                $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                for ($c=0; $c < $num; $c++) {
                    $array[$i][$c] = $data[$c];
                    $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                    $html .= '        <td class="rnk_font">'.$data[$c].'</td>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            }
    $row++;
    
    
    }
$html .= '</table>'."\r\n";
//echo ($html);


$html = ("");
$html .= '<table class="line_color no_num_color">'."\r\n";
$html .= '    <tr>'."\r\n";
$html .= '        <td  colspan="99" class="title_font">מהלך המירוץ</td>'."\r\n";
$html .= '    </tr>'."\r\n";

//transpose table
$array = array_map(null, ...$array);
$count1 = count($array);
$count2 = count($array[0]);

    for ($i = 0; $i < $count1; $i++) {
            if ($i == 0) { 
                $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                for ($c=0; $c < $count2; $c++) {
                    $array[$i][$c] = str_replace("laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace(".", "", $array[$i][$c]);
                    $html .= '        <th class="rnkh_font">'.$array[$i][$c].'</th>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            } else { // row with more then 1 cell
                $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                for ($c=0; $c < $count2; $c++) {
                    $array[$i][$c] = str_replace("laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace(".", "", $array[$i][$c]);
                    $html .= '        <td class="rnk_font">'.$array[$i][$c].'</td>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            }
   
    
    }


$html .= '</table>'."\r\n";
echo ($html);

//transpose from file
$handle1 = trim(file_get_contents($_FILES['file']['tmp_name']));
$textAr = explode("\n", $handle1);
$textAr = array_filter($textAr, 'trim'); // remove any extra \r characters left behind
$array = array();

$row = 1;
$count = count($textAr);
    for ($i = 0; $i < $count; $i++) {
            $data = preg_split( "/\t/", $textAr[$i]);
            $num = count($data);
            if ($row == 1) { // row with 1 cell
                $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                for ($c=0; $c < $num; $c++) {
                    $array[$i][$c] = $data[$c];
                    $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                    $html .= '        <th class="rnkh_font">'.$data[$c].'</th>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            } else { // row with more then 1 cell
                $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                for ($c=0; $c < $num; $c++) {
                    $array[$i][$c] = $data[$c];
                    $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                    $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                    $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                    $html .= '        <td class="rnk_font">'.$data[$c].'</td>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            }
    $row++;
    
    
    }
$html .= '</table>'."\r\n";
//echo ($html);


$html = ("");
$html .= '<table class="line_color no_num_color">'."\r\n";
$html .= '    <tr>'."\r\n";
$html .= '        <td  colspan="99" class="title_font">מהלך המירוץ</td>'."\r\n";
$html .= '    </tr>'."\r\n";

//transpose table
$array = array_map(null, ...$array);
$count1 = count($array);
$count2 = count($array[0]);

    for ($i = 0; $i < $count1; $i++) {
            if ($i == 0) { 
                $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                for ($c=0; $c < $count2; $c++) {
                    $array[$i][$c] = str_replace("laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace(".", "", $array[$i][$c]);
                    $html .= '        <th class="rnkh_font">'.$array[$i][$c].'</th>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            } else { // row with more then 1 cell
                $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                for ($c=0; $c < $count2; $c++) {
                    $array[$i][$c] = str_replace("laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Laps", "הקפות", $array[$i][$c]);
                    $array[$i][$c] = str_replace("lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace("Lap", "הקפה", $array[$i][$c]);
                    $array[$i][$c] = str_replace(".", "", $array[$i][$c]);
                    $html .= '        <td class="rnk_font">'.$array[$i][$c].'</td>'."\r\n";
                }
                $html .= '    </tr>'."\r\n";
            }
   
    
    }


$html .= '</table>'."\r\n";
echo ($html);

//echo htmlspecialchars($html);
?>
