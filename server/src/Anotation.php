<?php

class Anotation
{
    private $id;
    private $latitude;
    private $longitude;
    private $tooltip;

    public function __construct($id, $latitude, $longitude, $tooltip)
    {
        $this->id = $id;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->tooltip = $tooltip;
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
            "INSERT INTO `anotations-table` (id, latitude, longitude, tooltip)
                       VALUES (:id, :latitude, :longitude, :tooltip)"
        );

        $insertResult = $insertStatement->execute([
            "id" => $this->id,
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

    public function deleteFromDb(): void {
        require_once "./src/Database.php";

        $database = new Database();
        $connection = $database->getConnection();

        $deleteStatement = "DELETE FROM `anotations-table`  WHERE id = '$this->id'";

        $deleteResult = $connection->prepare($deleteStatement);
        $deleteResult->execute();
    } 
}