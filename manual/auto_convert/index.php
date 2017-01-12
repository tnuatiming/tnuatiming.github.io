<?php include("/home/raz/public_html/password_protect.php"); ?>
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he" dir="rtl">
<head>
<title>Convert CSV to HTML Table</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>

</head>
<body>
<div  style="font-size: 1.2em; margin: 40px auto 0 auto; width:400px;">
<h3>Convert CSV to HTML Table</h3><br/>
<form accept-charset="UTF-8" action="converted.php" method="post" enctype="multipart/form-data">
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="radio" name="radio" value="utf16">file is utf-16le <br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
</body>
</html>
