<?php

require_once "./src/Anotation.php";

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];
$latitude = $phpInput["latitude"];
$longitude = $phpInput["longitude"];
$tooltip = $phpInput["tooltip"];
$panoramaImage = $phpInput["panoramaImage"];

if (isset($phpInput["anotationImage"])) {
    $anotationImage = $phpInput["anotationImage"];
}

$anotation = new Anotation();
$anotation->setAttributes($id, $latitude, $longitude, $tooltip, $panoramaImage, $anotationImage);
if (isset($phpInput["html"]) && isset($phpInput["style"])) {
    $html = $phpInput["html"];
    $style = $phpInput["style"];
    $anotation->setHtmlAnotationAttributes($html, $style);
}

if ($anotation->edit()) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Anotation was successfully edited."]);
} else {
    http_response_code(503);
    echo json_encode(["success" => false, "message" => "Unable to edit anotation."]);
}
