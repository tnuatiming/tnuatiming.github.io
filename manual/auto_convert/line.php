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
    if ($_POST['utf16le']) {
        $csv_file = mb_convert_encoding($csv_file, "UTF-8", "UTF-16LE");// enable utf-16le encoding
}
    $csv_file = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv_file);//delete empty lines with out deleting the last line
//    $csv_file = file_put_contents($_FILES['file']['tmp_name'], $csv_file);// recreate the uploaded file with the refoctoring

//prepar the data for the import to the array

    $textArray = explode("\n", str_replace("\r", '', trim($csv_file)));
//    $textArray = array_filter($textArray, 'trim'); // remove any extra \r characters left behind
}
//transpose from textareaname
$textArray22 = $textArray;


// import the data into the array

$tableArray = []; // init empty array

$count = count($textArray);  // row counter
for ($i = 0; $i < $count; $i++) {
    $data = preg_split( "/[\t,]/", $textArray[$i]); // split if delimeter is tab or ,
    $num = count($data);  // column counter
        if (($num > 1) && (stripos($textArray[$i], 'Start')) === FALSE && (stripos($textArray[$i], 'Grid')) === FALSE){ //clean 1 cell lines and Start and Grid lines
            for ($c=0; $c < $num; $c++) {
                $tableArray[$i][$c] = str_replace(".", "", $data[$c]); // insert cell data into multidimensional array after strip "."
                // $tableArray[$i][$c] = $data[$c];  // insert cell data into multidimensional array
                $tableArray[$i][$c] = str_ireplace("laps", "הקפות", $tableArray[$i][$c]);  // Case-insensitive
                $tableArray[$i][$c] = str_ireplace("lap", "הקפה", $tableArray[$i][$c]);
            }
        }
    }

  
    
    
$tableArray22 = []; // init empty array
$count22 = count($textArray22);  // row counter
for ($i = 0; $i < $count22; $i++) {
    $data22 = preg_split( "/[\t,]/", $textArray22[$i]); // split if delimeter is tab or , of secound line which shold have all the starters
       $num22 = count($data22);  // column counter
if ($i == 1) { 
            for ($c=1; $c < $num22; $c++) {
            $a = str_replace(".", "", $data22[$c]);
                $tableArray22[$c][0] = "$a" ; // insert cell data into multidimensional array after strip "."
}
 }
 }

   
   
   
 for ($i = 0; $i < $count22; $i++) {
    $data22 = preg_split( "/[\t,]/", $textArray22[$i]); // split if delimeter is tab or , of secound line which shold have all the starters
        $num22 = count($data22);  // column counter
if ($i > 0) {
            for ($c=1; $c < $num22; $c++) {
            for ($v=1; $v < $num22; $v++) {
            if ($tableArray22[$v][0] == $data22[$c]) {
                $tableArray22[$v][$i] = $c ; // insert cell data into multidimensional array after strip "."
                }
            }
            
}
 }
 }
  
      foreach($tableArray22 as $key=>$value) {
 for ($i = 1; $i < $count22; $i++) {
if (!array_key_exists($i, $value)) {
$tableArray22[$key][$i] = 'null';
}
   
   
}   
   }

    $tableArray22 = array_map(null, ...$tableArray22); // TRANSPOSE MAGIC: http://stackoverflow.com/questions/797251/transposing-multidimensional-arrays-in-php

  

   
$num22 = count($tableArray22);
foreach ($tableArray22 as $key=>$subarr) {
$count22 = count($subarr);

}
            for ($z=1; $z < $num22; $z++) {
//    print_r($xvalue);
   $ttt .= '['.$z.',';
 for ($y = 0; $y < $count22; $y++) {
$q = $count22 - 1;
if ($y == $q) {

    $ttt .= ($tableArray22[$z][$y]);
    } else {

    $ttt .= ($tableArray22[$z][$y].',');
  
    }
    }
    
    
 $f = $num22 - 1;
if ($z == $f) {
   
    $ttt .= ']'."\r\n";
} else {
    $ttt .= '],'."\r\n";

}
    
    }  
    
   echo($ttt); 
    
$tableArray = array_values($tableArray); // re index the array after deleting lines
$tableArray[0][0] = "מקום";

//transpose array and output html
if (!$_POST['donttranspose']) {
    $tableArray = array_map(null, ...$tableArray); // TRANSPOSE MAGIC: http://stackoverflow.com/questions/797251/transposing-multidimensional-arrays-in-php
}

// start the html output

$html = "";
$html .= '<table class="line_color no_num_color">'."\r\n";
$html .= '    <tr>'."\r\n";
$html .= '        <td  colspan="99" class="title_font">מהלך המירוץ</td>'."\r\n";
$html .= '    </tr>'."\r\n";

$countRow = count($tableArray);        // row counter
$countColumn = count($tableArray[0]);  // column counter

    for ($i = 0; $i < $countRow; $i++) {
            if ($i == 0) { // header row
                $html .= '    <tr class="rnkh_bkcolor">'."\r\n";
                for ($c=0; $c < $countColumn; $c++) {
                    $html .= '        <th class="rnkh_font">'.$tableArray[$i][$c].'</th>'."\r\n";                        
                }
            } else { // other rows
                $html .= '    <tr class="rnk_bkcolor">'."\r\n";
                for ($c=0; $c < $countColumn; $c++) {
                    $html .= '        <td class="rnk_font">'.$tableArray[$i][$c].'</td>'."\r\n";
                }
            }
    $html .= '    </tr>'."\r\n";
    }
$html .= '</table>'."\r\n";
if (!$_POST['dontshowraw']) {
    echo ($html);
    echo "<br><br><br>";
}
echo "<pre>";
echo htmlentities($html);
echo "</pre>";



//if ($_POST['utf16']) {
//    $handle1 = mb_convert_encoding($handle1, "UTF-8", "UTF-16LE");// enable utf-16le encoding
//}
//$delimiter = array("\t",",","|","\\","/",";");// all the options for delimiters
//$handle1 = str_replace($delimiter, $delimiter[0], $handle1);// convert delimiter to tab
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
//$handle1 = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv);//delete empty lines


//echo htmlspecialchars($html);
?>
