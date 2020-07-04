<?php

require_once "connect-database.php"; 
$connection = connectDatabase();

$truncateStatement = 'TRUNCATE TABLE `anotations-table`;';

$truncateResult = $connection->prepare($truncateStatement);

$truncateResult->execute();

echo json_encode(["success" => true, "message" => "Deleted all data."]);