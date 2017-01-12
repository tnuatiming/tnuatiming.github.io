<?php
$csv_file = file_get_contents($_FILES['file']['tmp_name']);// get the uploaded file
if ($_POST['radio']) {
    $csv_file = mb_convert_encoding($csv_file, "UTF-8", "UTF-16LE");
}
$delimiter = array("\t",",","|","\\","/",";");// all the options for delimiters
$csv = str_replace($delimiter, $delimiter[0], $csv_file);// convert delimiter to ,
//$csv = preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $csv);//delete empty lines(doesn't delete the last line)
$csv = preg_replace('/^[\r\n]+|[\r\n]+$/m', '', $csv);//delete empty lines
$csv_file = file_put_contents($_FILES['file']['tmp_name'], $csv);// put the uploaded file

$csv_file = ($_FILES['file']['tmp_name']);// get the uploaded file


$stop = 0;
$header .= '    <tr class="rnkh_bkcolor">'."\r\n";
$row = 1;
if (($handle1 = fopen($csv_file, "r")) !== FALSE) {
    while (($data1 = fgetcsv($handle1, 1000, "\t")) !== FALSE) {
        if ($stop == 0) {
            $num = count($data1);
            if ($num != 1) {
                $row++;
                for ($c=0; $c < $num; $c++) {
                    if (strpos($data1[$c], 'Rank') !== false) {
                        $header .= '        <th class="rnkh_font">מקום</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Rnk') !== false) {
                        $header .= '        <th class="rnkh_font">מקום</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Num') !== false) {
                        $header .= '        <th class="rnkh_font">מספר</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Bib.') !== false) {
                        $header .= '        <th class="rnkh_font">מספר</th>'."\r\n";
                        $stop = 1;
                    } elseif (strpos($data1[$c], 'Driver\'s last name') !== false) {
                        $header .= '        <th class="rnkh_font">נהג</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Driver\'s first name') !== false) {
                        $header .= '        <th class="rnkh_font">נווט</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Last Name') !== false) {
                        $header .= '        <th class="rnkh_font">שם</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'First Name') !== false) {
                        $header .= '        <th class="rnkh_font">נווט</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Name') !== false) {
                        $header .= '        <th class="rnkh_font">שם</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Driver') !== false) {
                        $header .= '        <th class="rnkh_font">שם</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Laps') !== false) {
                        $header .= '        <th class="rnkh_font">הקפות</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'B.Lap') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה מהירה</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Time') !== false) {
                        $header .= '        <th class="rnkh_font">זמן</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Gap') !== false) {
                        $header .= '        <th class="rnkh_font">פער</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Penalty') !== false) {
                        $header .= '        <th class="rnkh_font">עונשין</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 1') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 1</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 2') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 2</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 3') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 3</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 4') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 4</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 5') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 5</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 6') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 6</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 7') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 7</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 8') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 8</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 9') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 9</th>'."\r\n";
                    } elseif (strpos($data1[$c], 'Run 10') !== false) {
                        $header .= '        <th class="rnkh_font">הקפה 10</th>'."\r\n";
                    }
                }
            }
        }
//        echo "    </tr>\n";
    }
    fclose($handle1);
}
$header .= '    </tr>'."\r\n";









$row = 1;
echo "<table class=\"line_color\">\n";
if (($handle = fopen($csv_file, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
//        echo "data: $data[0]";
//        echo "    <tr class=\"rnk_bkcolor\">\n";
        $num = count($data);
        if ($num == 1) {
            $data[0] = str_replace("Run", "הקפה", $data[0]);
            $data[0] = str_replace("Disqualified", "נפסל", $data[0]);
            $data[0] = str_replace("Do not finish", "לא סיים", $data[0]);
            $data[0] = str_replace("Did not start", "לא התחיל", $data[0]);
            $data[0] = str_replace("Best lap:", "הקפה מהירה:", $data[0]);
            $data[0] = str_replace("laps", "הקפות", $data[0]);
            $data[0] = str_replace("lap", "הקפה", $data[0]);
            if (strpos($data[0], 'DISQ') !== false) {
                echo "    <tr class=\"rnk_bkcolor\">\n";
                echo "        <td  colspan=\"99\" class=\"subtitle_font\">$data[0]</td>\n";
                echo "    </tr>\n";
            } elseif (strpos($data[0], 'DSQ') !== false) {
                echo "    <tr class=\"rnk_bkcolor\">\n";
                echo "        <td  colspan=\"99\" class=\"subtitle_font\">$data[0]</td>\n";
                echo "    </tr>\n";
            } elseif (strpos($data[0], 'DNS') !== false) {
                echo "    <tr class=\"rnk_bkcolor\">\n";
                echo "        <td  colspan=\"99\" class=\"subtitle_font\">$data[0]</td>\n";
                echo "    </tr>\n";
            } elseif (strpos($data[0], 'DNF') !== false) {
                echo "    <tr class=\"rnk_bkcolor\">\n";
                echo "        <td  colspan=\"99\" class=\"subtitle_font\">$data[0]</td>\n";
                echo "    </tr>\n";
            } elseif (strpos($data[0], 'הקפה מהירה:') !== false) {
                echo "    <tr class=\"rnk_bkcolor\">\n";
                echo "        <td  colspan=\"99\" class=\"comment_font\">$data[0]</td>\n";
                echo "    </tr>\n";
            } else {
                echo "    <tr>\n";
                echo "        <td  colspan=\"99\" class=\"title_font\">$data[0]</td>\n";
                echo "    </tr>\n";
                echo "$header";
            }
        } else {
            $row++;
            echo "    <tr class=\"rnk_bkcolor\">\n";
            for ($c=0; $c < $num; $c++) {
                $data[$c] = str_replace("laps", "הקפות", $data[$c]);
                $data[$c] = str_replace("Laps", "הקפות", $data[$c]);
                $data[$c] = str_replace("lap", "הקפה", $data[$c]);
                $data[$c] = str_replace("Lap", "הקפה", $data[$c]);
                $data[$c] = str_replace("1h", "01:", $data[$c]);
                $data[$c] = str_replace("2h", "02:", $data[$c]);
                $data[$c] = str_replace("3h", "03:", $data[$c]);
                $data[$c] = str_replace("4h", "04:", $data[$c]);
                echo "        <td class=\"rnk_font\">$data[$c]</td>\n";
            }
            echo "    </tr>\n";
            }
//        echo "    </tr>\n";
    }
    fclose($handle);
}
echo "</table>\n";

?>
