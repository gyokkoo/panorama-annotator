<?php

// Warning: Do not use truncate in production! This file is intended to be used only for DEV purposes!
require_once "connect-database.php"; 
$connection = connectDatabase();

$truncateStatement = 'TRUNCATE TABLE `anotations-table`;';

$truncateResult = $connection->prepare($truncateStatement);

$truncateResult->execute();

echo json_encode(["success" => true, "message" => "Deleted all data."]);