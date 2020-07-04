<?php

require "connect-database.php";

class Anotation
{
    private $connection;
    private $id;
    private $latitude;
    private $longitude;
    private $tooltip;
    private $panoramaImage;
    private $anotationImage; // Optional
    private $html; // Optional
    private $style; // Optional
    private $content; // Optional

    public function setDbConnection(){
        $this->connection = connectDatabase();
    }

    public function __construct()
    {
        $this->setDbConnection();
    }
    
    public function setId($id)
    {
        $this->id = $id;
    }

    public function setPanoramaImage($panoramaImage)
    {
        $this->panoramaImage = $panoramaImage;
    }

    public function setContent($content){
        $this->content = $content;
    }

    public function setAttributes($id, $latitude, $longitude, $tooltip, $panoramaImage)
    {
        $this->setId($id);
        $this->setPanoramaImage($panoramaImage);
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->tooltip = $tooltip;
    }

    public function validateAttributes(): void
    {
        if (!isset($this->id) || !isset($this->latitude) || !isset($this->longitude) || !isset($this->tooltip) || !isset($this->panoramaImage)) {
            throw new Exception('Attributes validation failed. Please check if id,latitude,longitude,tooltip and panoramaImage values are present.');
        }
    }

    public function setAnotationImage($anotationImage)
    {
        $this->anotationImage = $anotationImage;
    }

    public function setHtmlAnotationAttributes($html, $style)
    {
        $this->html = $html;
        $this->style = $style;
    }

    public function storeInDatabase(): void
    {
        $this->validateAttributes();
        $insertStatement = $this->connection->prepare(
            "INSERT INTO `anotations-table` (id, latitude, longitude, tooltip, panoramaImage, anotationImage, html, style, content)
                       VALUES (:id, :latitude, :longitude, :tooltip, :panoramaImage, :anotationImage, :html, :style, :content)"
        );

        $insertResult = $insertStatement->execute([
            "id" => $this->id,
            "latitude" => $this->latitude,
            "longitude" => $this->longitude,
            "tooltip" => $this->tooltip,
            "panoramaImage" => $this->panoramaImage,
            "anotationImage" => $this->anotationImage,
            "html" => $this->html,
            "style" => $this->style,
            "content" => $this->content
        ]);

        if (!$insertResult) {
            $errorInfo = $insertStatement->errorInfo();

            if ($errorInfo[1] === 1062) {
                $errorMessage = "Primary key field is already taken";
            } else {
                $errorMessage = "Server error, try again later or contact development team";
            }
            throw new Exception($errorMessage);
        }
    }

    public function readAnotation()
    {
        $getStatement = "SELECT * FROM `anotations-table` WHERE id = :id  LIMIT 0,1";
        $getResult = $this->connection->prepare($getStatement);

        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $getResult->bindParam(':id', $this->id);
        $getResult->execute();

        $row = $getResult->fetch(PDO::FETCH_ASSOC);
        $this->id = $row['id'];
        $this->latitude = $row['latitude'];
        $this->longitude = $row['longitude'];
        $this->tooltip = $row['tooltip'];
        $this->panoramaImage = $row['panoramaImage'];
        $this->anotationImage = $row['anotationImage'];
        $this->html = $row['html'];
        $this->style = $row['style'];
        $this->content = $row['content'];

        return $row;
    }

    public function read()
    {
        $readStatement = "SELECT * FROM `anotations-table` WHERE panoramaImage = :panoramaImage";
        $readResult = $this->connection->prepare($readStatement);

        // Sanitize
        $this->panoramaImage = htmlspecialchars(strip_tags($this->panoramaImage));
        $readResult->bindParam(':panoramaImage', $this->panoramaImage);

        $readResult->execute();

        return $readResult;
    }

    public function deleteFromDb(): void
    {
        $deleteStatement = "DELETE FROM `anotations-table`  WHERE id = :id";
        $deleteResult = $this->connection->prepare($deleteStatement);

        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $deleteResult->bindParam(':id', $this->id);

        $deleteResult->execute();
    }

    public function edit(): bool
    {
        $editStatement = "UPDATE
                       `anotations-table`
                    SET
                        tooltip = :tooltip
                    WHERE
                        id = :id";
        $editResult = $this->connection->prepare($editStatement);

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
