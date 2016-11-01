<?php
$csv_file = file_get_contents($_FILES['file']['tmp_name']);// get the uploaded file
$delimiter = array("\t",",","|","\\","/",";");// all the options for delimiters
$csv = str_replace($delimiter, $delimiter[1], $csv_file);// convert delimiter to ,
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
$csv = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv);//delete empty lines
function convert($csv)
{
  $out = [];
  array_map(function($ln) use(&$out) {
      $ln    = htmlentities($ln);
      $out[] = count($out) == 0
        ? "\t<tr class=\"rnkh_bkcolor\">\n\t\t<th class=\"rnkh_font\">".implode("</th>\n\t\t<th class=\"rnkh_font\">",explode(",",$ln))."</th>\n\t</tr>\n"
        : "\t<tr class=\"rnk_bkcolor\">\n\t\t<td class=\"rnk_font\">".implode("</td>\n\t\t<td class=\"rnk_font\">",explode(",",$ln))."</td>\n\t</tr>\n";
    }, explode("\n",$csv));
  return "\n<table cellspacing=1 class=\"line_color\">\n".implode('',$out)."</table>\n";
}
// replace tabs with 4 spaces
$html = convert($csv);
$html = str_replace("\t", "    ", $html);

// display the converted result as source code
echo "<html><body><pre><code>";
echo htmlentities($html);
echo "</code></pre></body></html>";
//echo convert($csv);

?>
