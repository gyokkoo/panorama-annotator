<?php

$phpInput = json_decode(file_get_contents("php://input"), true);

$latitude = $phpInput["latitude"];
$longitude = $phpInput["longitude"];
$tooltip = $phpInput["tooltip"];

require_once "./src/Anotation.php";
$anotation = new Anotation(
    $latitude,
    $longitude,
    $tooltip
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