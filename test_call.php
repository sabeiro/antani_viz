<?php
echo "ciccia\n";

echo 'Hello ' . htmlspecialchars($_POST["name"]) . '!' . "\n";

foreach ($_POST as $key => $value) {
    echo "<tr>";
    echo "<td>";
    echo $key;
    echo "</td>";
    echo "<td>";
    echo $value;
    echo "</td>";
    echo "</tr>";
}

/* $json = filter_input(INPUT_POST, 'json');
   $decoded_json = json_decode($json);
   $val1 = $decoded_json->val1;
   var_dump($decoded_json, $val1); */

?>
