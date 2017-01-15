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
<h3>Ranking - Convert CSV to HTML Table</h3><br/>
<form accept-charset="UTF-8" action="converted.php" method="post" enctype="multipart/form-data">
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="checkbox" name="utf16" value="utf16">file is UTF-16LE <br/><br/>
  <input type="checkbox" name="run" value="run">&quot;מקצה&quot; במקום &quot;הקפה&quot; <br/><br/>
  <input type="checkbox" name="changename" value="changename">&quot;נהג&quot; במקום &quot;שם&quot; <br/><br/>
  <input type="checkbox" name="deleterows" value="deleterows">אל תמחק את השורות הראשונות <br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
<br/><br/><br/>
<h3>Lap by Lap - Trnspose and Convert CSV to HTML Table</h3>
<p>clean the file so only the table remain (delete all the header lines), add מקום to the first cell (it is probably empty)</p>
<p>you can upload a file or paste the text in the box below</p>
<form accept-charset="UTF-8" action="transposeconverted.php" method="post" enctype="multipart/form-data"><br/>
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
<textarea class="form-control resizable processed" name="textareaname" rows="20" cols="50"  placeholder="paste CSV Data" wrap="off"></textarea>  
<input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
</body>
</html>
