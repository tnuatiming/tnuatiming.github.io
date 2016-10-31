 <?php

if ($_POST['separator'] == "TAB") {
  $var_value= "\t";
}else{
  $var_value= $_POST['separator'];
}

$row = 1;
if (($handle = fopen($_FILES['file']['tmp_name'], "r")) !== FALSE) {

    echo "<table cellspacing=1 class=\"line_color\">\n";

    while (($data = fgetcsv($handle, 0, $var_value)) !== FALSE) {
        $num = count($data);
        if ($row == 1) {
            echo "\t<tr class=\"rnkh_bkcolor\">\n";
        }else{
            echo "\t<tr class=\"rnk_bkcolor\">\n";
        }

        for ($c=0; $c < $num; $c++) {
            //echo $data[$c] . "<br />\n";
            if(empty($data[$c])) {
               $value = "";
            }else{
               $value = $data[$c];
            }
            if ($row == 1) {
                echo "\t\t<th class=\"rnkh_font\">".$value."</th>\n";
            }else{
                echo "\t\t<td class=\"rnk_font\">".$value."</td>\n";
            }
        }

        if ($row == 1) {
            echo "\t</tr>\n";
        }else{
            echo "\t</tr>\n";
        }
        $row++;
    }

    echo "</table>\n";
    fclose($handle);
    unlink($_FILES["file"]["tmp_name"]);
}
?>
