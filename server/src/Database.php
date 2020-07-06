<?php

require "./config.php";
class Database
{
    private $connection;

    public function __construct()
    {
        $dbhost = Config::$DB_HOST;
        $dbname = Config::$DB_NAME;
        $username = Config::$DB_USER;
        $password = Config::$DB_PASS; // No password for simplicity.

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