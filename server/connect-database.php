<?php

require  "./src/Database.php"; 

function connectDatabase()
{
    $database = new Database();
    $connection = $database->getConnection();

    return $connection;
}