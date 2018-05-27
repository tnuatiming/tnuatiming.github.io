<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
<head>
<title>Upload Message</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>
</head>
<body>
<?php
$msg = htmlspecialchars($_POST['message']);
date_default_timezone_set('Asia/Jerusalem');
$time = date("H:i");
 

if (empty($msg)) {
    $html = '&nbsp;';
    echo "message cleared";
} else {
    $html = '<p><span class="msgTime" style="font-weight: 700;">'.$time.'</span> - <span class="msgInfo">'.$msg.'</span></p>';
    echo "uploading message: ".$html;
}

$myfile = fopen("uploadMsg.txt", "w") or die("Unable to open file!"); // make the file

fwrite($myfile, $html); // upload the file
fclose($myfile);
sleep(5);
// reload
echo '<script type="text/javascript">
           window.location = "https://tnuatiming.com/live/msg.html"
      </script>';
?>
</body>
</html>
