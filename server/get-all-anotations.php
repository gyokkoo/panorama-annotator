<?php

require_once "./src/Anotation.php";

$anotation = new Anotation('', 0, 0, '', '', '');
$readStatement = $anotation->read();
$count = $readStatement->rowCount();

if ($count > 0) {
    $anotations = array();
    $anotations["result"] = array();

    while ($row = $readStatement->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $item = array(
            "id" => $id,
            "latitude" => $latitude,
            "longitude" => $longitude,
            "tooltip" => $tooltip,
            "panoramaImage" => $panoramaImage,
            "anotationImage" => $anotationImage
        );

        array_push($anotations["result"], $item);
    }

    http_response_code(200);

    echo json_encode(["success" => true, "message" => "Found anotations.", "result" => $anotations["result"]]);

    return;
}

http_response_code(404);
echo json_encode(["success" => false, "message" => "No anotations found."]);
