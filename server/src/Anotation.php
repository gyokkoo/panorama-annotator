<?php

require "connect-database.php";

class Annotation
{
    private $connection;
    private $id;
    private $latitude;
    private $longitude;
    private $tooltip;
    private $panoramaImage;
    private $annotationImage; // Optional
    private $html; // Optional
    private $style; // Optional
    private $content; // Optional

    public function setDbConnection()
    {
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

    public function setContent($content)
    {
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

    public function setAnnotationImage($annotationImage)
    {
        $this->annotationImage = $annotationImage;
    }

    public function setTooltip($tooltip)
    {
        $this->tooltip = $tooltip;
    }

    public function setAnnotationHtml($html)
    {
        $this->html = $html;
    }

    public function setAnnotationStyle($style)
    {
        $this->style = $style;
    }

    public function storeInDatabase(): void
    {
        $this->validateAttributes();
        $insertStatement = $this->connection->prepare(
            "INSERT INTO `annotations-table` (id, latitude, longitude, tooltip, panoramaImage, annotationImage, html, style, content)
                       VALUES (:id, :latitude, :longitude, :tooltip, :panoramaImage, :annotationImage, :html, :style, :content)"
        );

        $insertResult = $insertStatement->execute([
            "id" => $this->id,
            "latitude" => $this->latitude,
            "longitude" => $this->longitude,
            "tooltip" => $this->tooltip,
            "panoramaImage" => $this->panoramaImage,
            "annotationImage" => $this->annotationImage,
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

    public function readAnnotation()
    {
        $getStatement = "SELECT * FROM `annotations-table` WHERE id = :id  LIMIT 0,1";
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
        $this->annotationImage = $row['annotationImage'];
        $this->html = $row['html'];
        $this->style = $row['style'];
        $this->content = $row['content'];

        return $row;
    }

    public function read()
    {
        $readStatement = "SELECT * FROM `annotations-table` WHERE panoramaImage = :panoramaImage";
        $readResult = $this->connection->prepare($readStatement);

        // Sanitize
        $this->panoramaImage = htmlspecialchars(strip_tags($this->panoramaImage));
        $readResult->bindParam(':panoramaImage', $this->panoramaImage);

        $readResult->execute();

        return $readResult;
    }

    public function deleteFromDb(): void
    {
        $deleteStatement = "DELETE FROM `annotations-table`  WHERE id = :id";
        $deleteResult = $this->connection->prepare($deleteStatement);

        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $deleteResult->bindParam(':id', $this->id);

        $deleteResult->execute();
    }

    public function deleteAllPanoramaAnnotations(): bool
    {
        if (!isset($this->panoramaImage)) {
            throw new Exception("Cannot delete! Panorama image should be specified.");
        }

        $deleteStatement = "DELETE FROM `annotations-table`  WHERE panoramaImage = :panoramaImage";
        $deleteResult = $this->connection->prepare($deleteStatement);

        $deleteResult->bindParam(':panoramaImage', $this->panoramaImage);

        if ($deleteResult->execute()) {
            return true;
        }
        return false;
    }

    public function editAnnotationProperty(): bool
    {
        if (!isset($this->id)) {
            throw new Exception("Edit operation failed! Annotation ID is not provided!");
        }

        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        if (isset($this->tooltip)) {
            $editStatement = "UPDATE
                `annotations-table`
            SET
                tooltip = :tooltip
            WHERE
                id = :id";
            $editResult = $this->connection->prepare($editStatement);
            $editResult->bindParam(':id', $this->id);
            $editResult->bindParam(':tooltip', $this->tooltip);
        } else if (isset($this->html)) {
            $editStatement = "UPDATE
                `annotations-table`
            SET
                html = :html
            WHERE
                id = :id";

            $editResult = $this->connection->prepare($editStatement);
            $editResult->bindParam(':id', $this->id);
            $editResult->bindParam(':html', $this->html);
        } else if (isset($this->style)) {
            $editStatement = "UPDATE
                `annotations-table`
            SET
                style = :style
            WHERE
                id = :id";

            $editResult = $this->connection->prepare($editStatement);
            $editResult->bindParam(':id', $this->id);
            $editResult->bindParam(':style', $this->style);
        }

        if ($editResult->execute()) {
            return true;
        }
        return false;
    }
}
