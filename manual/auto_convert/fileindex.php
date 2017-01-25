<?php include("/home/raz/public_html/password_protect.php"); ?>
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
<head>
<title>All Results</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>
<style>h2 {color:gray;}a {color:blue;}li {color: #222;text-align: right;margin: 10px;text-shadow: 0px 2px 3px #FFF;list-style-type: none;font-size: 1.2em;} html {text-align:right; font-family: "Noto Sans Hebrew", "Open Sans Hebrew", sans-serif;}.index {text-align:right; float:right; margin: 40px 5% 40px 5%; min-width:35%;}
</style>
</head>
<body>

<?php
/* gets the date from a URL */
function get_data($url,$clas) {
//   $ch = curl_init();
//    $timeout = 5;
//    curl_setopt($ch, CURLOPT_URL, $url);
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
//    $data = curl_exec($ch);
//    curl_close($ch);

    $data = file_get_contents("../..".$url);// get the uploaded file content
    $data = mb_convert_encoding($data, 'HTML-ENTITIES', 'UTF-8');
    $doc = new DOMDocument();
    $doc->loadHTML($data);
    foreach ($doc->getElementsByTagName('span') as $node) {
        if (strpos(($doc->saveHtml($node)), $clas) !== false) {
            $xxx=  $doc->saveHtml($node);
            $xxx= rtrim(substr($xxx,16), '</span>'); // get the inner html
        }
    }
    return $xxx;
}
//$returned_content = get_data('http://tnuatiming.com/results/enduro/2016/enduro2016r5.html');
//echo ($returned_content);

/* scan a folder to get the files */

function rscandir($base='', &$data=array()) {

    $array = array_diff(scandir($base), array('.', '..')); # remove ' and .. from the array */
    foreach($array as $value) : /* loop through the array at the level of the supplied $base */
        if (is_dir($base.$value)) : /* if this is a directory */
        //     $data[] = $base.$value.'/'; /* add it to the $data array */
            $data = rscandir($base.$value.'/', $data); /* then make a recursive call with the 
            current $value as the $base supplying the $data array to carry into the recursion */            
        elseif (is_file($base.$value)) : /* else if the current $value is a file */
            $data[] = str_replace("/home/raz/public_html", "",$base.$value); /* just add the current $value to the $data array */            
        endif;
    endforeach;
    return $data; // return the $data array
}
//$oldClass = '';
//echo '<pre>'; var_export(rscandir('/home/raz/public_html/results'.'/')); echo '</pre>';
//foreach((rscandir('/home/raz/public_html/results'.'/')) as $v) :
//if ($v != '/results/index.html') {
//    $getClass = (explode("/",str_replace("/results/", "",$v))[0]);
//    if ($getClass !== $oldClass){
//        echo ('<h2>'.$getClass.'</h2>');
//        $oldClass = $getClass;
//    }
//    $getFileName = (explode("/",str_replace("/results/", "",$v))[2]);
//
//    echo '<a href='.$v.' class="'.$getClass.'">'.$getFileName.'</a><br>';
//}
//endforeach;

// make attays of categorys and seasons
$data2 = array ();
$category = array ();
$season = array ();
foreach ((rscandir('/home/raz/public_html/results'.'/')) as $itemc):
    if (($itemc != '/results/index.html') and ($itemc != '/results/index1.html')) { //skip index.html
        $data2[] = explode("/", str_replace("/results/", "",$itemc));
    }
endforeach;

/* add value in multidimantinal array*/
foreach ($data2 as &$item):
//   if($item[2]==rallysprint2016r1.html){
//      array_push($item, "2022-12-4"); // or just $item[] = "2022-12-4";
//    }
    $iurl = ('/results/'.$item[0].'/'.$item[1].'/'.$item[2]);
    array_push($item, (get_data($iurl,"name"))); // add inner html span name value
    array_push($item, (get_data($iurl,"date"))); // add inner html span date value
    array_push($item, $iurl); // add internal address value

    switch ($item[0]) {
        case "enduro":
            array_push($item,"אנדורו");
            break;
        case "baja":
            array_push($item,"ראלי רייד");
            break;
        case "rally":
            array_push($item,"ראלי");
            break;
        case "rallysprint":
            array_push($item,"ראלי ספרינט");
            break;
        case "running":
            array_push($item,"ריצה");
            break;
        case "motocross":
            array_push($item,"מוטוקרוס");
            break;
        case "gymkhana":
            array_push($item,'ג\'ימקאנה');
            break;
        case "superbike":
            array_push($item,"סופרבייק");
            break;
        case "allmountain":
            array_push($item,"אול מאונטיין");
            break;
        case "karting":
            array_push($item,"קרטינג");
            break;
        case "supermoto":
            array_push($item,"סופרמוטו");
            break;
        default:
            array_push($item,$item[0]);
    }
  
endforeach;

/* Sort Multi-dimensional Array by DATE*/
usort($data2, function($a, $b) {
    return $a['4'] - $b['4'];
});
$data2 = array_values($data2); // re index
$data2 = array_reverse($data2);// reverse the array so newest result is first

foreach ($data2 as $itemu):
    array_push($category, $itemu[6]);
    array_push($season, $itemu[1]);
endforeach;

$category = array_unique($category); // delete duplicate
asort($category);
$category = array_values($category); // re index

$season = array_unique($season);
asort($season);
$season = array_values($season); 

//print_r($category);
//print_r($season);

//print_r($data2);

/* start making the index html TEXT 

echo ('<div class="index">');
echo ('<h1>sort by category</h1>');

foreach ($category as $item):
    echo ('<h2>'.$item.'</h2>');
    $www = '';
    foreach ($data2 as $item1):
        if ($item1[0] == $item) {
            foreach ($season as $itemx):
                if (($item1[1] == $itemx) and ($item1[0] == $item)) {
                    if ($www !== $itemx) {
                        echo ('<h2>'.$itemx.'</h2>');
                        $www = $itemx;
                    }
                        echo ('<a href=/results/'.$item1[0].'/'.$item1[1].'/'.$item1[2].'>'.$item1[2].'</a><br>');
                }
            endforeach;
        }
    endforeach;
endforeach;
echo ('</div>');
*/
/* start making the index html FILE */
$html .= (file_get_contents('head.txt'));
echo ('<h1>sort by year</h1>');
//$html .= '<h1>תוצאות קודמות</h1>'."\r\n";

arsort($season);
//rsort($category);
//print_r($category);
//sort($data2);


/* make new manual array for category sorted by HEBREW name, use $category if need auto sort
$category1 = array ();
$category1[0] = "allmountain";
$category1[1] = "enduro";
$category1[2] = "gymkhana";
$category1[3] = "motocross";
$category1[4] = "superbike";
$category1[5] = "supermoto";
$category1[6] = "karting";
$category1[7] = "rally";
$category1[8] = "rallysprint";
$category1[9] = "baja";
$category1[10] = "running";
*/
foreach ($season as $items):
    echo ('<div class="season"><h1>עונת '.$items.'</h1>');
    $html .= '<div class="season">'."\r\n".'<h1>עונת '.$items.'</h1>'."\r\n";
    $www = '';
    foreach ($category as $itemx):
        foreach ($data2 as $item1):
                if (($item1[6] == $itemx) and ($item1[1] == $items)) {
                    if ($www !== $itemx) {
                            echo ('<h2>'.$item1[6].'</h2><ul>');
                            $html .= '<div class="sport"><h2>'.$item1[6].'</h2>'."\r\n".'<ul>'."\r\n";

                    
                    $www = $itemx;
                    }
                        echo ('<li><a href='.$item1[5].'>'.$item1[3].'</a></li>');
                        $html .= '<li><a href='.$item1[5].'>'.$item1[3].'</a></li>'."\r\n";
                }
            endforeach;
                    if ($www == $itemx) {
    echo ('</ul>');
    $html .= '</ul>'."\r\n".'</div>'."\r\n";
}
            endforeach;
echo ('</div>');
endforeach;

echo ('</div>');
$html .= (file_get_contents('foot.txt'));
$myfile = fopen("../../results/index1.html", "w") or die("Unable to open file!"); // make the file
fwrite($myfile, $html);
fclose($myfile);

/* as $data2 is sorted by latest result, this will show the 4 last results
echo "<ul>";
for ($row = 0; $row < 4; $row++) {
    echo ('<li><a href='.$data2[$row][5].'>'.$data2[$row][3].'</a></li>');
}
echo "</ul>";
*/
?>

</body>
</html>
