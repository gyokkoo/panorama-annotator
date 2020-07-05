<?php
require_once "./src/Anotation.php";

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];
$latitude = $phpInput["latitude"];
$longitude = $phpInput["longitude"];
$tooltip = $phpInput["tooltip"];
$panoramaImage = $phpInput["panoramaImage"];

$anotation = new Anotation();

$anotation->setAttributes($id, $latitude, $longitude, $tooltip, $panoramaImage);

if (isset($phpInput["anotationImage"])) {
    $anotationImage = $phpInput["anotationImage"];
    $anotation->setAnotationImage($anotationImage);
}
if (isset($phpInput["html"]) && isset($phpInput["style"])) {
    $html = $phpInput["html"];
    $style = $phpInput["style"];
    $anotation->setAnotationHtml($html);
    $anotation->setAnotationStyle($style);
}

if(isset($phpInput["content"])){
    $content = $phpInput["content"];
    $anotation->setContent($content);
}

try {
    $anotation->storeInDatabase();
} catch (Exception $exception) {
    echo json_encode([
        'success' => false,
        'message' => $exception->getMessage(),
    ]);
    return;
}

echo json_encode(["success" => true, "message" => "Anotation was successfully added."]);
