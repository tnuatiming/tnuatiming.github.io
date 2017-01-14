<?php include("/home/raz/public_html/password_protect.php"); ?>
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
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
  <input type="checkbox" name="utf16" value="utf16">file is UTF-16LE <br/><br/>
  <input type="checkbox" name="run" value="run">&quot;מקצה&quot; (במקום &quot;הקפה&quot;) <br/><br/>
  <input type="checkbox" name="changename" value="changename">&quot;נהג&quot; (במקום &quot;שם&quot;) <br/><br/>
  <input type="checkbox" name="deleterows" value="deleterows">אל תמחק את השורות הראשונות <br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
<br/><br/><br/>
<h3>Lap by Lap - Convert CSV to HTML Table after trnspose</h3>
<p>clean the file so only the table remain (delete all the header lines), add מקום to the first cell (it is probably empty), you can use this sites to do the transpose:</p>
<a href="http://convertcsv.com/transpose-csv.htm">http://convertcsv.com/transpose-csv.htm</a>
<a href="http://www.becsv.com/csv-transpose.php">http://www.becsv.com/csv-transpose.php</a>
<form accept-charset="UTF-8" action="transposeconverted.php" method="post" enctype="multipart/form-data"><br/>
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="checkbox" name="utf16" value="utf16">file is UTF-16LE <br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
</body>
</html>
