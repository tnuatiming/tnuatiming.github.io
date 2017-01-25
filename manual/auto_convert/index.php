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

<?php function date_picker($name, $startyear=NULL, $endyear=NULL)
{
    if($startyear==NULL) $startyear = date("Y")-3;
    if($endyear==NULL) $endyear=date("Y")+10; 

    $months=array('','January','February','March','April','May',
    'June','July','August', 'September','October','November','December');

    // Month dropdown
    $html="<select name=\"".$name."month\">";

    for($i=1;$i<=12;$i++)
    {
        if ($i == date("m")) {
            $html.="<option value='$i' selected>$months[$i]</option>";
        } else {
            $html.="<option value='$i'>$months[$i]</option>";
        }
    }
    $html.="</select> ";
   
    // Day dropdown
    $html.="<select name=\"".$name."day\">";
    for($i=1;$i<=31;$i++)
    {
        if ($i == date("d")) {
            $html.="<option value='$i' selected>$i</option>";
        } else {
            $html.="<option value='$i'>$i</option>";
        }
    }
    $html.="</select> ";

    // Year dropdown
    $html.="<select name=\"".$name."year\">";

    for($i=$startyear;$i<=$endyear;$i++)
    {      
        if ($i == date("Y")) {
            $html.="<option value='$i' selected>$i</option>";
        } else {
            $html.="<option value='$i'>$i</option>";
        }
    }
    $html.="</select> ";

    return $html;
}

function category_picker($name)
{

    $category=array('אול מאונטיין','אנדורו',"ג'ימקאנה",'מוטוקרוס','סופרבייק','סופרמוטו','ראלי','ראלי ספרינט','ראלי רייד','ריצה');

    // category dropdown
    $html="<select name=\"category\">";

    for($i=1;$i<=10;$i++)
    {
        $html.="<option value=".$category[$i].">".$category[$i]."</option>";
    }
    $html.="</select> ";
   
    return $html;
}

function year_picker($name, $startyear=NULL, $endyear=NULL)
{
    if($startyear==NULL) $startyear = date("Y")-3;
    if($endyear==NULL) $endyear=date("Y")+10; 

     // Year dropdown
    $html.="<select name=\"".$name."year\">";

    for($i=$startyear;$i<=$endyear;$i++)
    {      
        if ($i == date("Y")) {
            $html.="<option value='$i' selected>$i</option>";
        } else {
            $html.="<option value='$i'>$i</option>";
        }
    }
    $html.="</select> ";

    return $html;
}
?>

</head>
<body>
<div  class="convert">
<h3>Ranking - Convert CSV to HTML Table</h3><br/>
<form accept-charset="UTF-8" action="converted.php" method="post" enctype="multipart/form-data">
<?php  echo date_picker("registration") ?><br/><br/>
<?php  echo category_picker("registration") ?><br/><br/>
  <select class="type" name="type">
    <option value="" selected></option>
    <option value="ספיישל טסט">ספיישל טסט</option>
    <option value="היירסקרמבל">היירסקרמבל</option>
  </select><br/><br/>
  <textarea name="place" rows="1" cols="40"  placeholder="מקום" wrap="off"></textarea><br/><br/>  
  <textarea name="round" rows="1" cols="10"  placeholder="מרוץ מספר" wrap="off"></textarea><br/><br/>  
<?php  echo year_picker("season") ?><br/><br/>
  <input type="checkbox" name="liquid" value="liquid">do not create liquid header <br/><br/><br/>
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="checkbox" name="utf16" value="utf16">file is UTF-16LE <br/><br/>
  <input type="checkbox" name="run" value="run">&quot;מקצה&quot; >>> &quot;הקפה&quot; <br/><br/>
  <input type="checkbox" name="changename" value="changename">&quot;נהג&quot; >>> &quot;שם&quot; <br/><br/>
  <input type="checkbox" name="deleterows" value="deleterows">do not delete the hedear lines<br/><br/>
  <input type="checkbox" name="dontshowraw" value="dontshowraw">do not show the finished raw table<br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
<div  class="convert">
<h3>Lap by Lap - Trnspose and Convert CSV to HTML Table</h3>
<p>you can upload a file or paste the csv table in the box below</p>
<form accept-charset="UTF-8" action="transposeconverted.php" method="post" enctype="multipart/form-data"><br/>
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="checkbox" name="utf16le" value="utf16le">file is UTF-16LE <br/><br/>
  <textarea name="textareaname" rows="20" cols="50"  placeholder="paste CSV table" wrap="off"></textarea><br/><br/>  
  <input type="checkbox" name="donttranspose" value="donttranspose">do not transpose <br/><br/>
  <input type="checkbox" name="dontshowraw" value="dontshowraw">do not show the finished raw table<br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
<div  class="convert">
<a href='http://tnuatiming.com/manual/auto_convert/fileindex.php'>recreat the results index</a><br>
</div>
</body>
</html>
