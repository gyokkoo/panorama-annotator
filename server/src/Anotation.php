<?php

class Anotation
{
    private $id;
    private $latitude;
    private $longitude;
    private $tooltip;
    private $panoramaImage;
    private $anotationImage;

    public function __construct($id, $latitude, $longitude, $tooltip, $panoramaImage, $anotationImage)
    {
        $this->id = $id;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->tooltip = $tooltip;
        $this->panoramaImage = $panoramaImage;
        $this->anotationImage = $anotationImage;
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
            "INSERT INTO `anotations-table` (id, latitude, longitude, tooltip, panoramaImage, anotationImage)
                       VALUES (:id, :latitude, :longitude, :tooltip, :panoramaImage, :anotationImage)"
        );

        $insertResult = $insertStatement->execute([
            "id" => $this->id,
            "latitude" => $this->latitude,
            "longitude" => $this->longitude,
            "tooltip" => $this->tooltip,
            "panoramaImage" => $this->panoramaImage,
            "anotationImage" => $this->anotationImage,
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

    public function deleteFromDb(): void
    {
        require_once "./src/Database.php";

        $database = new Database();
        $connection = $database->getConnection();

        $deleteStatement = "DELETE FROM `anotations-table`  WHERE id = '$this->id'";

        $deleteResult = $connection->prepare($deleteStatement);
        $deleteResult->execute();
    }

    public function edit(): bool
    {
        require_once "./src/Database.php";

        $database = new Database();
        $connection = $database->getConnection();

        $editStatement = "UPDATE
                       `anotations-table`
                    SET
                        tooltip = :tooltip
                    WHERE
                        id = :id";
        $editResult = $connection->prepare($editStatement);

        // Sanitize
        $this->tooltip = htmlspecialchars(strip_tags($this->tooltip));

        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind new values
        $editResult->bindParam(':tooltip', $this->tooltip);
        $editResult->bindParam(':id', $this->id);

        if ($editResult->execute()) {
            return true;
        }
        return false;
    }
}
