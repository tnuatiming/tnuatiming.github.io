<?php include("/home/raz/public_html/password_protect.php"); ?>
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
<head>
<title>All Results</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>
<style>
h2 {color:gray;}
a {color:blue;}
.index {float:left; margin: 40px 5% 0 5%; min-width:35%;}
</style>
</head>
<body>

<?php

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

 
$data2 = array ();
$category = array ();
$season = array ();
foreach ((rscandir('/home/raz/public_html/results'.'/')) as $item):
if ($item != '/results/index.html') { //skip index.html
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
                        echo ('<h3>'.$itemx.'</h3>');
                        $www = $itemx;
                    }
                        echo ('<a href=/results/'.$item1[0].'/'.$item1[1].'/'.$item1[2].'>'.$item1[2].'</a><br>');
                }
            endforeach;
        }
    endforeach;
endforeach;
echo ('</div>');
$html .= '<?php include("/home/raz/public_html/password_protect.php"); ?>'."\r\n".'<!DOCTYPE html>'."\r\n".'<html class="no-js" lang="he" xml:lang="he">'."\r\n".'<head>'."\r\n".'<title>All Results</title>'."\r\n".'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'."\r\n".'<meta charset="UTF-8"/>'."\r\n".'<style>h2 {color:gray;}a {color:blue;}.index {float:left; margin: 40px 5% 0 5%; min-width:35%;}</style>'."\r\n".'</head>'."\r\n";
$html .= '<body><html>'."\r\n";
echo ('<div class="index">');
$html .= '<div class="index">'."\r\n";
echo ('<h1>sort by year</h1>');
$html .= '<h1>sort by year</h1>'."\r\n";

arsort($season);
//rsort($category);
//print_r($category);
//sort($data2);

foreach ($season as $item):
    echo ('<h2>עונת '.$item.'</h2>');
$html .= '<h2>עונת '.$item.'</h2>'."\r\n";
    $www = '';
    foreach ($data2 as $item1):
        if ($item1[1] == $item) {
            foreach ($category as $itemx):
                if (($item1[0] == $itemx) and ($item1[1] == $item)) {
                    if ($www !== $itemx) {
                        switch ($itemx) {
                            case "enduro":
                                echo ('<h3>אנדורו</h3>');
                                $html .= '<h3>אנדורו</h3>'."\r\n";
                                break;
                            case "baja":
                                echo ('<h3>ראלי רייד</h3>');
                                $html .= '<h3>ראלי רייד</h3>'."\r\n";
                                break;
                            case "rally":
                                echo ('<h3>ראלי</h3>');
                                $html .= '<h3>ראלי</h3>'."\r\n";
                                break;
                            case "rallysprint":
                                echo ('<h3>ראלי ספרינט</h3>');
                                $html .= '<h3>ראלי ספרינט</h3>'."\r\n";
                                break;
                            case "running":
                                echo ('<h3>ריצה</h3>');
                                $html .= '<h3>ריצה</h3>'."\r\n";
                                break;
                            case "motocross":
                                echo ('<h3>מוטוקרוס</h3>');
                                $html .= '<h3>מוטוקרוס</h3>'."\r\n";
                                break;
                            case "gymkhana":
                                echo ("<h3>ג'ימקאנה</h3>");
                                $html .= "<h3>ג'ימקאנה</h3>"."\r\n";
                                break;
                            case "superbike":
                                echo ('<h3>סופרבייק</h3>');
                                $html .= '<h3>סופרבייק</h3>'."\r\n";
                                break;
                            case "allmountain":
                                echo ('<h3>אול מאונטיין</h3>');
                                $html .= '<h3>אול מאונטיין</h3>'."\r\n";
                                break;
                            case "karting":
                                echo ('<h3>קרטינג</h3>');
                                $html .= '<h3>קרטינג</h3>'."\r\n";
                                break;
                            case "supermoto":
                                echo ('<h3>סופרמוטו</h3>');
                                $html .= '<h3>סופרמוטו</h3>'."\r\n";
                                break;
                            default:
                            echo ('<h3>'.$itemx.'</h3>');
                                $html .= '<h3>'.$itemx.'</h3>'."\r\n";
                        }
//                        echo ('<h3>'.$itemx.'</h3>');
                        $www = $itemx;
                    }
                        echo ('<a href=/results/'.$item1[0].'/'.$item1[1].'/'.$item1[2].'>'.$item1[2].'</a><br>');
                        $html .= '<a href=/results/'.$item1[0].'/'.$item1[1].'/'.$item1[2].'>'.$item1[2].'</a><br>'."\r\n";
                }
            endforeach;
        }
    endforeach;
endforeach;
echo ('</div>');
$html .= '</div>'."\r\n";
$html .= '</body></html>'."\r\n";
$myfile = fopen("index1.html", "w") or die("Unable to open file!");
fwrite($myfile, $html);
fclose($myfile);

?>

</body>
</html>
