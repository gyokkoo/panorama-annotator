<?php

require_once "./src/Database.php"; 
$database = new Database();
$connection = $database->getConnection();

$truncateStatement = 'TRUNCATE TABLE `anotations-table`;';

$truncateResult = $connection->prepare($truncateStatement);

$truncateResult->execute();

echo json_encode(["success" => true, "message" => "Deleted all data."]);