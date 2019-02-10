<?php include("/home/raz/public_html/password_protect.php"); ?>
<!DOCTYPE html>
<html class="no-js" lang="he" xml:lang="he">
<head>
<title>Convert CSV to HTML Table</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta charset="UTF-8"/>
<style>
.convert {float:left;font-size: 1.2em; margin: 40px 5% 0 5%;width: 35%; min-width:400px;}
input, label, textarea {margin:0 5px 0 0;vertical-align: middle;
}
p#type {display: none;}
textarea#r {display: inline;margin:0 0 0 15px;}
.liqu {display: none;}
.democlass {display: block;}
select#round {}
</style>


</head>
<body>

<div  class="convert">
<h3>Lap by Lap - Trnspose and Convert CSV to HTML Table</h3>
<p>you can upload a file or paste the csv table in the box below</p>
<form accept-charset="UTF-8" action="line.php" method="post" enctype="multipart/form-data"><br/>
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="checkbox" name="utf16le" value="utf16le">file is UTF-16LE <br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
<div  class="convert">
<a href='http://tnuatiming.com/manual/auto_convert/fileindex.php'>recreate the results index</a><br>
</div>

</body>
</html>
