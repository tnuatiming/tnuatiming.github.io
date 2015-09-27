 <?php include("/home/raz/public_html/password_protect.php"); ?>
 <html>
<head>
<title>Convert CSV to HTML Table</title>

</head>
<body>
<div  style="font-size: 1.2em; margin: 40px auto 0 auto; width:400px;">
<h3>Convert CSV to HTML Table</h3><br/>
<form action="converted.php" method="post" enctype="multipart/form-data">
  <input type="file" name="file" style="color:red; font-size: 1.2em;"/><br/><br/>

<b>Separator Character: </b><br/><br/><div style="padding-left:2em;" >
                        <input type="radio" name="separator" autocomplete="off" value="," />Comma ( , ) <br/>
                        <input type="radio" name="separator" autocomplete="off" checked='checked' value=";" />Semicolon ( ; ) <br/>
                        <input type="radio" name="separator" autocomplete="off" value="|" />Pipe ( | ) <br/>
                        <input type="radio" name="separator" autocomplete="off" value=":" />Colon ( : ) <br/>
                        <input type="radio" name="separator" autocomplete="off" value="#" />Octothorpe ( # ) <br/>
                        <input type="radio" name="separator" autocomplete="off" value="TAB" />TAB <br/>
</div>
<br/>
  <input type="submit" value="Convert" style="font-size: 1.2em;"/>
</form>
</div>
</body>
</html>
