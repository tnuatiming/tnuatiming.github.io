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
function get_data($url) {
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
        if (strpos(($doc->saveHtml($node)), 'date') !== false) {
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
foreach ((rscandir('/home/raz/public_html/results'.'/')) as $item):
    if (($item != '/results/index.html') and ($item != '/results/index1.html')) { //skip index.html
        $data2[] = explode("/", str_replace("/results/", "",$item));
    }
endforeach;

//print_r($data2);
arsort($data2);

foreach ($data2 as $item):
    array_push($category, $item[0]);
    array_push($season, $item[1]);
endforeach;
$category = array_unique($category); // delete duplicate
asort($category);
$category = array_values($category); // re index

$season = array_unique($season);
asort($season);
$season = array_values($season); 

//print_r($category);
//print_r($season);

/* start making the index html TEXT */

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

/* start making the index html FILE */
$html .= (file_get_contents('head.txt'));
echo ('<h1>sort by year</h1>');
//$html .= '<h1>תוצאות קודמות</h1>'."\r\n";

arsort($season);
//rsort($category);
//print_r($category);
//sort($data2);

foreach ($season as $item):
    echo ('<div class="season"><h1>עונת '.$item.'</h1>');
    $html .= '<div class="season">'."\r\n".'<h1>עונת '.$item.'</h1>'."\r\n";
    $www = '';
    foreach ($category as $itemx):
        foreach ($data2 as $item1):
                if (($item1[0] == $itemx) and ($item1[1] == $item)) {
                    if ($www !== $itemx) {
                        switch ($itemx) {
                            case "enduro":
                                echo ('<h2>אנדורו</h2><ul>');
                                $html .= '<div class="sport"><h2>אנדורו</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "baja":
                                echo ('<h2>ראלי רייד</h2><ul>');
                                $html .= '<div class="sport"><h2>ראלי רייד</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "rally":
                                echo ('<h2>ראלי</h2><ul>');
                                $html .= '<div class="sport"><h2>ראלי</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "rallysprint":
                                echo ('<h2>ראלי ספרינט</h2><ul>');
                                $html .= '<div class="sport"><h2>ראלי ספרינט</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "running":
                                echo ('<h2>ריצה</h2><ul>');
                                $html .= '<div class="sport"><h2>ריצה</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "motocross":
                                echo ('<h2>מוטוקרוס</h2><ul>');
                                $html .= '<div class="sport"><h2>מוטוקרוס</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "gymkhana":
                                echo ("<h2>ג'ימקאנה</h2><ul>");
                                $html .= '<div class="sport"><h2>ג\'ימקאנה</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "superbike":
                                echo ('<h2>סופרבייק</h2><ul>');
                                $html .= '<div class="sport"><h2>סופרבייק</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "allmountain":
                                echo ('<h2>אול מאונטיין</h2><ul>');
                                $html .= '<div class="sport"><h2>אול מאונטיין</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "karting":
                                echo ('<h2>קרטינג</h2><ul>');
                                $html .= '<div class="sport"><h2>קרטינג</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            case "supermoto":
                                echo ('<h2>סופרמוטו</h2><ul>');
                                $html .= '<div class="sport"><h2>סופרמוטו</h2>'."\r\n".'<ul>'."\r\n";
                                break;
                            default:
                                echo ('<h2>'.$itemx.'</h2><ul>');
                                $html .= '<div class="sport"><h2>'.$itemx.'</h2>'."\r\n".'<ul>'."\r\n";
                        }
//                        echo ('<h2>'.$itemx.'</h2>');
                        $www = $itemx;
                    }
                        $ur = ('/results/'.$item1[0].'/'.$item1[1].'/'.$item1[2]);
//                        $ul =('http://tnuatiming.com'.$ur);
                        echo ('<li><a href='.$ur.'>'.(get_data($ur)).'</a></li>');
                        $html .= '<li><a href=/results/'.$item1[0].'/'.$item1[1].'/'.$item1[2].'>'.(get_data($ur)).'</a></li>'."\r\n";
//                        $html .= '<a href=/results/'.$item1[0].'/'.$item1[1].'/'.$item1[2].'>'.$item1[2].'</a><br>'."\r\n";
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

?>

</body>
</html>
