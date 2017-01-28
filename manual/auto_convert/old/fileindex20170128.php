<?php include("/home/raz/public_html/password_protect.php"); ?>
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
<head>
<title>All Results</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>
<style>
    html {text-align:right; font-family: "Noto Sans Hebrew", "Open Sans Hebrew", sans-serif;}
    h2 {color:gray;}
    a {color:blue;}
    li {color: #222;text-align: right;margin: 10px;text-shadow: 0px 2px 3px #FFF;list-style-type: none;font-size: 1.2em;}
    .index {text-align:right; float:right; margin: 40px 5% 40px 5%; min-width:35%;}
    p.rr {padding: 20px;font-size:2em;color:white;background:green;display: none;  position: absolute;left: 10px;top: 10px;}
    p.qq {padding: 20px;font-size:2em;color:white;background:red; position: absolute;left: 10px;top: 10px;}
</style>
</head>
<body>
<p class="qq">in progress</p>
<p class="rr">finished</p>
<?php
$finish = "none";
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
            $innerHtml=  $doc->saveHtml($node);
            $innerHtml= rtrim(substr($innerHtml,16), '</span>'); // get the inner html
        }
    }
    return $innerHtml;
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
$results = array ();
$category = array ();
$season = array ();
foreach ((rscandir('/home/raz/public_html/results'.'/')) as $itemc):
    if (($itemc != '/results/index.html') and ($itemc != '/results/index1.html')) { //skip index.html
        $results[] = explode("/", str_replace("/results/", "",$itemc));
    }
endforeach;

/* add value in multidimantinal array*/
foreach ($results as &$item):
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

/* Sort Multi-dimensional Array by DATE */
usort($results, function($a, $b) {
    return $a['4'] - $b['4'];
});
$results = array_values($results); // re index
$results = array_reverse($results);// reverse the array so newest result are first

/* create category and season arrays */
foreach ($results as $itemu):
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

//print_r($results);
/*
[0] => enduro
[1] => 2017
[2] => enduro2017r1.html
[3] => מרוץ 1 - אום זוקא
[4] => 20161231
[5] => /results/enduro/2017/enduro2017r1.html
[6] => אנדורו
*/

/* start making the index html TEXT 

echo ('<div class="index">');
echo ('<h1>sort by category</h1>');

foreach ($category as $item):
    echo ('<h2>'.$item.'</h2>');
    $www = '';
    foreach ($results as $resultsItem):
        if ($resultsItem[0] == $item) {
            foreach ($season as $categoryItem):
                if (($resultsItem[1] == $categoryItem) and ($resultsItem[0] == $item)) {
                    if ($www !== $categoryItem) {
                        echo ('<h2>'.$categoryItem.'</h2>');
                        $www = $categoryItem;
                    }
                        echo ('<a href=/results/'.$resultsItem[0].'/'.$resultsItem[1].'/'.$resultsItem[2].'>'.$resultsItem[2].'</a><br>');
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
//sort($results);

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
foreach ($season as $seasonItem):
    echo ('<div class="season"><h1>עונת '.$seasonItem.'</h1>');
    $html .= '<div class="season">'."\r\n".'<h1>עונת '.$seasonItem.'</h1>'."\r\n";
    $www = '';
    foreach ($category as $categoryItem):
        foreach ($results as $resultsItem):
                if (($resultsItem[6] == $categoryItem) and ($resultsItem[1] == $seasonItem)) {
                    if ($www !== $categoryItem) {
                        echo ('<h2>'.$resultsItem[6].'</h2><ul>');
                        $html .= '    <div class="sport">'."\r\n".'    <h2>'.$resultsItem[6].'</h2>'."\r\n".'        <ul>'."\r\n";                    
                        $www = $categoryItem;
                    }
                    echo ('<li><a href='.$resultsItem[5].'>'.$resultsItem[3].'</a></li>');
                    $html .= '            <li><a href='.$resultsItem[5].'>'.$resultsItem[3].'</a></li>'."\r\n";
                }
        endforeach;
        if ($www == $categoryItem) {
            echo ('</ul>');
            $html .= '        </ul>'."\r\n".'    </div>'."\r\n"; // close sport class
        }
    endforeach;
    echo ('</div>');
    $html .= '</div>'."\r\n"; // close season class
endforeach;

echo ('</div>');
$html .= '<p><span id="date">last updated: '.date("Y-m-d H:i:s").' UTC</span></p>'."\r\n"; // hidden time
$html .= (file_get_contents('foot.txt'));
$myfile = fopen("../../results/index1.html", "w") or die("Unable to open file!"); // make the file
fwrite($myfile, $html);
fclose($myfile);

/* as $results is sorted by latest result, this will show the 4 last results
echo "<ul>";
for ($row = 0; $row < 4; $row++) {
    echo ('<li><a href='.$results[$row][5].'>'.$results[$row][6].': עונת '.$results[$row][1].' '.$results[$row][3].'</a></li>');
}
echo "</ul>";
*/

<meta property="og:url" content="{{ site.url }}{{ page.url }}"/>
echo '<meta property="og:url" content="http://tnuatiming.com'.$results[$row][5].'"/>';

{% if page.tag %}<meta property="article:tag" content="{{ page.categories[1] }}"/>{% endif %}
echo '<meta property="article:tag" content="'.$results[$row][0].'"/>';

<meta property="og:description" content="{{ page.place }}"/>{% endif %}
echo '<meta property="og:description" content="'.$results[$row][3].'"/>';




$finish = "block";
$finish1 = "none";
?>

<style>
p.qq {display: <?php echo ($finish1) ?>;}
p.rr {display: <?php echo ($finish) ?>;}
</style>
</body>
</html>
