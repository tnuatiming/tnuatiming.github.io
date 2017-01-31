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

<?php function date_picker($name, $startyear=NULL, $endyear=NULL)
{
    if($startyear==NULL) $startyear = date("Y")-3;
    if($endyear==NULL) $endyear=date("Y")+10; 

    $months=array('','January','February','March','April','May','June','July','August', 'September','October','November','December');

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

    $category=array('','אול מאונטיין','אנדורו',"ג'ימקאנה",'מוטוקרוס','סופרבייק','סופרמוטו','ראלי','ראלי ספרינט','ראלי רייד','ריצה');

    // category dropdown
    $html="<select id=\"category\" name=\"category\">";

    for($i=0;$i<=10;$i++)
    {
        if ($i == 0) {
            $html.='<option selected value="'.$category[$i].'">'.$category[$i].'</option>';
        } else {
            $html.='<option value="'.$category[$i].'">'.$category[$i].'</option>';
        }
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
<h3>Ranking - Convert CSV to HTML Table</h3>
<button onclick="myFunction()">show front matter header option</button><br/><br/>
<form accept-charset="UTF-8" action="converted.php" method="post" enctype="multipart/form-data">
<div id="liqu" class="liqu">
  <label>event date: </label><?php  echo date_picker("registration") ?>
  <br/><br/>
  
  <label>category: </label><?php  echo category_picker("registration") ?>
  <p id="type"><select class='type' id='type' name='type'>
  <option value='ספיישל טסט'>ספיישל טסט</option>
  <option selected value='היירסקרמבל'>היירסקרמבל</option>
  <option value=''></option>
  </select></p>
  <br/><br/>
  
  <label>place: </label><textarea name="place" rows="1" cols="30"  placeholder="מקום" wrap="off"></textarea><br/><br/>  

  <label>round: </label><select id="round" name="round">
  <option value="" selected></option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
  <option value="9">9</option>
  <option value="10">10</option>
  </select>
  
  <textarea id="r" name="r" rows="1" cols="5" placeholder="r" wrap="off"></textarea>
  <br/><br/>  
 
  <label>season: </label><?php  echo year_picker("season") ?>
  <br/><br/>
  
  <input type="checkbox" name="noseason" value="noseason">do not display season 
  <br/>
  
  <p id="type1"></p>  
</div>
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>
  <input type="checkbox" name="utf16" value="utf16">file is UTF-16LE <br/><br/>
  <input type="checkbox" name="run" value="run">&quot;מקצה&quot; >>> &quot;הקפה&quot; <br/><br/>
  <input type="checkbox" name="changename" value="changename">&quot;נהג&quot; >>> &quot;שם&quot; <br/><br/>
  <input type="checkbox" name="deleterows" value="deleterows">do not delete the hedear lines<br/><br/>
  <input type="checkbox" name="dontshowraw" value="dontshowraw">do not show the finished table<br/><br/>
  <input type="checkbox" id="finishedpage" name="finishedpage" value="finishedpage">show as a web page<br/><br/>
  <input type="checkbox" id="presults" name="presults" value="presults">show previous results<br/><br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
<!--  <p id="demo"></p>-->
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
<a href='http://tnuatiming.com/manual/auto_convert/fileindex.php'>recreate the results index</a><br>
</div>
<!--<script>
    document.getElementById("category").onchange = function() {
        var cat1= document.getElementById("category").value;
        if (cat1=="אנדורו") {
            document.getElementById("type").innerHTML = "<select class='type' id='type' name='type'></option><option value='ספיישל טסט'>ספיישל טסט</option><option selected value='היירסקרמבל'>היירסקרמבל</option><option value=''></select>"
            ;
        } else {
            document.getElementById("type").innerHTML = "";
        }
    };
</script>-->
<script>
    document.getElementById("category").onchange = function() {
        var cat1= document.getElementById("category").value;
        var z = document.getElementById('type');
        if (cat1=="אנדורו") {
            z.style.display = 'inline';
        } else {
            z.style.display = 'none';
        }
    };
</script>
<script>

function myFunction() {
    var x = document.getElementById('liqu');
    if (x.style.display === 'block') {
        x.style.display = 'none';
        document.getElementById("type1").innerHTML = "<input type='checkbox' name='liquid' value='liquid'>create liquid header <br/>";
    } else {
        var cat1= document.getElementById("category").value;
        var z = document.getElementById('type');
        if (cat1=="אנדורו") {
            z.style.display = 'inline';
        } else {
            z.style.display = 'none';
        }
        x.style.display = 'block';
        document.getElementById("type1").innerHTML = "<input style='display: none;''type='checkbox' name='liquid' value='liquid' checked><br/>";
    }
}

</script>
<!--<script>
function myFunction() {
    document.getElementsByTagName("div")[1].setAttribute("class", "democlass");
            document.getElementById("type1").innerHTML = "<input type='checkbox' name='liquid' value='liquid' checked>create liquid header <br/><br/><br/>"
            ;
}
</script>-->

</body>
</html>
