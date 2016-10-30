 <?php
$csv = file_get_contents($_FILES['file']['tmp_name']);
$delimiter = array("\t",",","'","\"","|","\\","/",";");
$replace1 = str_replace($delimiter, $delimiter[1], $csv);// convert delimiter to ,
$replace = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $replace1);//delete empty lines
function convert($replace)
{
  $out = [];
  array_map(function($ln) use(&$out) {
      $ln    = htmlentities($ln);
      $out[] = count($out) == 0
        ? "\t<tr class=\"rnkh_bkcolor\">\n\t\t<th>".implode("</th>\n\t\t<th>",explode(",",$ln))."</th>\n\t</tr>\n"
        : "\t<tr class=\"rnk_bkcolor\">\n\t\t<td class=\"rnk_font\">".implode("</td>\n\t\t<td class=\"rnk_font\">",explode(",",$ln))."</td>\n\t</tr>\n";
    }, explode("\n",$replace));
  return "\n<table cellspacing=1 class=\"line_color\">\n".implode('',$out)."</table>\n";
}
 
echo convert($replace);
?>
