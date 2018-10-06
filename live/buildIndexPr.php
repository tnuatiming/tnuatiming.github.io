<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
<head>
<title>Upload Message</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>
</head>
<body>
<?php
#$msg = htmlspecialchars($_POST['results']);
$msg = ($_POST['results']);
date_default_timezone_set('Asia/Jerusalem');
$time = date("H:i");
$blink = "";    
$timeMsg = "";
$style = "";

function delete_all_between($beginning, $end, $string) {
    $beginningPos = strrpos($string, $beginning); # last occurrence
    $endPos = strrpos($string, $end); # last occurrence
#    $beginningPos = strpos($string, $beginning); # first occurrence
#    $endPos = strpos($string, $end); # first occurrence
    if ($beginningPos === false || $endPos === false) {
        return $string;
    }

    $textToDelete = substr($string, $beginningPos, ($endPos + strlen($end)) - $beginningPos);

    # return delete_all_between($beginning, $end, str_replace($textToDelete, '', $string)); // recursion to ensure all occurrences are replaced
    return str_replace($textToDelete, '', $string); 
}


if ($_POST['time']) {
    $timeMsg = '<span class="msgTime">'.$time.' - </span>';
}

if ($_POST['deleteAll']) {
    file_put_contents("uploadPr.txt", "");
} elseif ($_POST['deleteLast']) {
    $myfile = file_get_contents('uploadPr.txt');
    $html = delete_all_between('<div class="PreResult">', '</div>', $myfile);
        
    #  $html = preg_replace('/<table class="line_color">(.*?)</table>/i','',$myfile);
    #   $html = preg_replace('#<div class="PreResult">(.*?)</div>#', '',$myfile, 1);

    #   if(preg_match('#<div class="PreResult">(.*?)</div>#',$myfile ,$matches) == true){ // check any match found or not
    #       $html = str_replace($matches[0],'',$myfile);
    #  }//after printing execution will stops successfully.
    
    $myfile = fopen("uploadPr.txt", "w") or die("Unable to open file!"); // make the file
    fwrite($myfile, $html); // upload the file
    fclose($myfile);
    echo "last result deleted";
} elseif ($_POST['deleteAndUpload']) {
    $myfile = fopen("uploadPr.txt", "w") or die("Unable to open file!"); // make the file
    fwrite($myfile, $msg); // upload the file
    fclose($myfile);
    echo "delete all and upload: ".$msg;
} else {
    if (empty($msg)) {
    #  $html = '';
        echo "result empty";
    } else {
        $html = "\r\n".'<div class="PreResult">'."\r\n".$msg."\r\n".'</div>'."\r\n";
        echo "uploading previous result: ".$html;
    }

    $myfile1 = file_get_contents('uploadPr.txt');
    $myfile = fopen("uploadPr.txt", "a") or die("Unable to open file!"); // make the file

    if ((strpos($myfile1, 'PreResult') === false) and (strpos($myfile1, 'תוצאות קודמות') === false) and (!empty($msg))) {
        fwrite($myfile, "<h1>תוצאות קודמות:</h1>\r\n"); // upload the file
    }
    fwrite($myfile, $html); // upload the file
    fclose($myfile);
}
sleep(5);
// reload
echo '<script type="text/javascript">
           window.location = "https://tnuatiming.com/live/liveadmin.php"
      </script>';
?>
</body>
</html>
