<?php
$mysqli = mysqli_connect("localhost","crismon1","crismon1","crismon1");

$query = "CALL buscarClientes();";
$result = mysqli_query($mysqli, $query);

while ($row = mysqli_fetch_row($result)) {
    var_dump($row);
}

?>