<?php include("/home/raz/public_html/password_protect.php"); ?>
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
<head>
<title>Convert CSV to HTML Table</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>
<style>
.convert {float:left;font-size: 1.2em; margin: 40px 5% 0 5%;width: 35%; min-width:400px;}

</style>
</head>
<body>
<div  class="convert">
<h3>Ranking - Convert CSV to HTML Table</h3><br/>
<form accept-charset="UTF-8" action="converted.php" method="post" enctype="multipart/form-data">
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="checkbox" name="utf16" value="utf16">file is UTF-16LE <br/><br/>
  <input type="checkbox" name="run" value="run">&quot;מקצה&quot; במקום &quot;הקפה&quot; <br/><br/>
  <input type="checkbox" name="changename" value="changename">&quot;נהג&quot; במקום &quot;שם&quot; <br/><br/>
  <input type="checkbox" name="deleterows" value="deleterows">אל תמחק את השורות הראשונות <br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
<div  class="convert">
<h3>Lap by Lap - Trnspose and Convert CSV to HTML Table</h3>
<p>clean the file so only the table remain (delete all the header lines), add "מקום" to the first cell (it is probably empty), make sure delimiter is TAB or ","</p>
<p>you can upload a file or paste the csv table in the box below</p>
<form accept-charset="UTF-8" action="transposeconverted.php" method="post" enctype="multipart/form-data"><br/>
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
<textarea name="textareaname" rows="20" cols="50"  placeholder="paste CSV table" wrap="off"></textarea><br/><br/>  
  <input type="checkbox" name="utf16le" value="utf16le">file is UTF-16LE <br/><br/>
  <input type="checkbox" name="donttranspose" value="donttranspose">do not
  transpose <br/><br/>
<input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
</body>
</html>
