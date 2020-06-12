<?php

class Database
{
    private $connection;

    public function __construct()
    {
        $dbhost = 'localhost';
        $dbname = 'panorama-anotations';
        $username = 'root';
        $password = ''; // No password for simplicity.

        $this->connection = new PDO("mysql:host=$dbhost;dbname=$dbname", $username, $password,
            [
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
    }

    public function getConnection()
    {
        return $this->connection;
    }
}