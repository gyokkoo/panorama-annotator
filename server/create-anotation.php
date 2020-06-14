<?php

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];
$latitude = $phpInput["latitude"];
$longitude = $phpInput["longitude"];
$tooltip = $phpInput["tooltip"];
$panoramaImage = $phpInput["panoramaImage"];
$anotationImage = $phpInput["anotationImage"];

require_once "./src/Anotation.php";
$anotation = new Anotation(
    $id,
    $latitude,
    $longitude,
    $tooltip,
    $panoramaImage,
    $anotationImage
);

try {
    $anotation->validate();
    $anotation->storeInDatabase();
} catch (Exception $exception) {
    echo json_encode([
        'success' => false,
        'message' => $exception->getMessage(),
    ]);
    return;
}

echo json_encode(["success" => true, "message" => "Anotation was successfully added."]);