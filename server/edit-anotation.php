<?php

require_once "./src/Anotation.php";

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];
$latitude = $phpInput["latitude"];
$longitude = $phpInput["longitude"];
$panoramaImage = $phpInput["panoramaImage"];

$anotation = new Anotation();
$anotation->setId($id);

if (isset($phpInput["tooltip"])) {
    $tooltip = $phpInput["tooltip"];
    $anotation->setTooltip($tooltip);
} else if (isset($phpInput["html"])) {
    $html = $phpInput["html"];
    $anotation->setAnotationHtml($html);
} else if (isset($phpInput["style"])) {
    $style = $phpInput["style"];
    $anotation->setAnotationStyle($style);
}

try {
    $anotation->editAnnotationProperty();
    echo json_encode(["success" => true, "message" => "Anotation was successfully edited."]);
} catch (Exception $exception) {
    http_response_code(503);
    echo json_encode([
        "success" => false,
        "message" => $exception->getMessage(),
    ]);
}
