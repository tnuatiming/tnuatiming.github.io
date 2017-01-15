<?php
// http://stackoverflow.com/questions/3483216/parse-form-textarea-by-comma-or-new-line
// http://stackoverflow.com/questions/3702400/get-each-line-from-textarea
// http://stackoverflow.com/questions/2694271/return-empty-string-from-preg-split
// http://stackoverflow.com/questions/797251/transposing-multidimensional-arrays-in-php
// http://www.becsv.com/csv-transpose.php
// http://convertcsv.com/transpose-csv.htm
// http://stackoverflow.com/questions/709669/how-do-i-remove-blank-lines-from-text-in-php


//transpose from file

if (($_FILES['file']['tmp_name']) == True) {   // file is true, phrasing a file name
    $csv_file = file_get_contents($_FILES['file']['tmp_name']);// get the uploaded file content
    $csv_file = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv_file);//delete empty lines with out deleting the last line
    $csv_file = file_put_contents($_FILES['file']['tmp_name'], $csv_file);// recreate the uploaded file with the refoctoring

    $handle1 = trim(file_get_contents($_FILES['file']['tmp_name']));

//prepar the data for the import to the array
    $handle1 = trim(file_get_contents($_FILES['file']['tmp_name']));
    $textAr = explode("\n", $handle1);
    $textAr = array_filter($textAr, 'trim'); // remove any extra \r characters left behind
    $tableArray = array();

// import the data into the array

    $count = count($textAr);  // row counter
        for ($i = 0; $i < $count; $i++) {
            $data = preg_split( "/[\t,]/", $textAr[$i]); // split if delimeter is tab or ,
            $num = count($data);  // column counter
                if (($num > 1) && (stripos($textAr[$i], 'Start')) === FALSE && (stripos($textAr[$i], 'Grid')) === FALSE){
                    for ($c=0; $c < $num; $c++) {
                        $tableArray[$i][$c] = $data[$c];  // insert cell data into multidimensional array
                    }
            }
        }

// start the html output

    $html = ("");
    $html .= '<table class="line_color no_num_color">'."\r\n";
    $html .= '    <tr>'."\r\n";
    $html .= '        <td  colspan="99" class="title_font">מהלך המירוץ</td>'."\r\n";
    $html .= '    </tr>'."\r\n";

//transpose array and output html
    if ($_POST['donttranspose']) {
        $tableArray = array_map(null, ...$tableArray); // TRANSPOSE MAGIC: http://stackoverflow.com/questions/797251/transposing-multidimensional-arrays-in-php
    }
    $tableArray = array_map(null, ...$tableArray); // TRANSPOSE MAGIC: http://stackoverflow.com/questions/797251/transposing-multidimensional-arrays-in-php
    $countRow = count($tableArray);        // row counter
    $countColumn = count($tableArray[0]);  // column counter

        for ($i = 0; $i < $countRow; $i++) {
                if ($i == 0) { // header row
                    $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                    for ($c=0; $c < $countColumn; $c++) {
                        $tableArray[$i][$c] = str_ireplace("laps", "הקפות", $tableArray[$i][$c]);  // Case-insensitive
                        $tableArray[$i][$c] = str_ireplace("lap", "הקפה", $tableArray[$i][$c]);
                        $tableArray[$i][$c] = str_replace(".", "", $tableArray[$i][$c]);
                        $html .= '        <th class="rnkh_font">'.$tableArray[$i][$c].'</th>'."\r\n";
                    }
                    $html .= '    </tr>'."\r\n";
                } else { // other rows
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    for ($c=0; $c < $countColumn; $c++) {
                        $tableArray[$i][$c] = str_ireplace("laps", "הקפות", $tableArray[$i][$c]);
                        $tableArray[$i][$c] = str_ireplace("lap", "הקפה", $tableArray[$i][$c]);
                        $tableArray[$i][$c] = str_replace(".", "", $tableArray[$i][$c]);
                        $html .= '        <td class="rnk_font">'.$tableArray[$i][$c].'</td>'."\r\n";
                    }
                    $html .= '    </tr>'."\r\n";
                }
        }
    $html .= '</table>'."\r\n";
    echo ($html);
}

//transpose from textareaname

if (($_POST['textareaname']) == True) {   // textareaname is true, phrasing a textareaname
    $handle2 = trim($_POST['textareaname']);

// import the data into the array

    $textAr = explode("\r\n", $handle2);
    $textAr = array_filter($textAr, 'trim'); // remove any extra \r characters left behind

    $tableArray = array();

    // import the data into the array

    $count = count($textAr);   // row counter
        for ($i = 0; $i < $count; $i++) {
            $data = preg_split( "/[\t,]/", $textAr[$i]);  // split if delimeter is tab or ,
            $num = count($data); // column counter
                for ($c=0; $c < $num; $c++) {
                    $tableArray[$i][$c] = $data[$c];  // insert cell data into multidimensional array
                }
        }

// start the html output

    $html = ("");
    $html .= '<table class="line_color no_num_color">'."\r\n";
    $html .= '    <tr>'."\r\n";
    $html .= '        <td  colspan="99" class="title_font">מהלך המירוץ</td>'."\r\n";
    $html .= '    </tr>'."\r\n";

//transpose array and output html

    if (!$_POST['donttranspose']) {
        $tableArray = array_map(null, ...$tableArray); // TRANSPOSE MAGIC: http://stackoverflow.com/questions/797251/transposing-multidimensional-arrays-in-php
    }
    $countRow = count($tableArray);        // row counter
    $countColumn = count($tableArray[0]);  // column counter

        for ($i = 0; $i < $countRow; $i++) {
                if ($i == 0) { // header rows
                    $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                    for ($c=0; $c < $countColumn; $c++) {
                        $tableArray[$i][$c] = str_ireplace("laps", "הקפות", $tableArray[$i][$c]);
                        $tableArray[$i][$c] = str_ireplace("lap", "הקפה", $tableArray[$i][$c]);
                        $tableArray[$i][$c] = str_replace(".", "", $tableArray[$i][$c]);
                        $html .= '        <th class="rnkh_font">'.$tableArray[$i][$c].'</th>'."\r\n";
                    }
                    $html .= '    </tr>'."\r\n";
                } else { // other rows
                    $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                    for ($c=0; $c < $countColumn; $c++) {
                        $tableArray[$i][$c] = str_ireplace("laps", "הקפות", $tableArray[$i][$c]);
                        $tableArray[$i][$c] = str_ireplace("lap", "הקפה", $tableArray[$i][$c]);
                        $tableArray[$i][$c] = str_replace(".", "", $tableArray[$i][$c]);
                        $html .= '        <td class="rnk_font">'.$tableArray[$i][$c].'</td>'."\r\n";
                    }
                    $html .= '    </tr>'."\r\n";
                }
        }
    $html .= '</table>'."\r\n";
    echo ($html);
}


//if ($_POST['utf16']) {
//    $handle1 = mb_convert_encoding($handle1, "UTF-8", "UTF-16LE");// enable utf-16le encoding
//}
//$delimiter = array("\t",",","|","\\","/",";");// all the options for delimiters
//$handle1 = str_replace($delimiter, $delimiter[0], $handle1);// convert delimiter to tab
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
//$handle1 = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv);//delete empty lines


//echo htmlspecialchars($html);
?>
