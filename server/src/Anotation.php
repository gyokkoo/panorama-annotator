<?php

class Anotation
{
    private $latitude;
    private $lastName;
    private $tooltip;

    public function __construct($latitude, $longitude, $tooltip)
    {
        if(!$latitude || !$longitude || !$tooltip) {
            $this->latitude = 0;
            $this->longitude = 0;
            $this->tooltip = '';
        } else {
            $this->latitude = $latitude;
            $this->longitude = $longitude;
            $this->tooltip = $tooltip;
        }
       
    }

    public function validate(): void
    {
        // Central place for validation - Modify based on client`s requirements.
        // TODO: Add validations
    }

    public function storeInDatabase(): void
    {
        require_once "./src/Database.php";

        $database = new Database();
        $connection = $database->getConnection();

        $insertStatement = $connection->prepare(
            "INSERT INTO `anotations-table` (latitude, longitude, tooltip)
                       VALUES (:latitude, :longitude, :tooltip)"
        );

        $insertResult = $insertStatement->execute([
            "latitude" => $this->latitude,
            "longitude" => $this->longitude,
            "tooltip" => $this->tooltip,
        ]);

        if (!$insertResult) {
            $errorInfo = $insertStatement->errorInfo();

            if ($errorInfo[1] === 1062) {
                $errorMessage = "Primary key field is already taken";
            } else {
                $errorMessage = "Server error, try again later or contact development team";
            }

            var_dump($errorInfo);
            throw new Exception($errorMessage);
        }
    }

    public function read()
    {
        require_once "./src/Database.php";

        $database = new Database();
        $connection = $database->getConnection();

        $readStatement = "SELECT * FROM `anotations-table`";
        $readResult = $connection->prepare($readStatement);
      
        $readResult->execute();
      
        return $readResult;
    }
}