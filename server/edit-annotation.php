<?php

require_once "./src/Annotation.php";

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];
$latitude = $phpInput["latitude"];
$longitude = $phpInput["longitude"];
$panoramaImage = $phpInput["panoramaImage"];

$annotation = new Annotation();
$annotation->setId($id);

if (isset($phpInput["tooltip"])) {
    $tooltip = $phpInput["tooltip"];
    $annotation->setTooltip($tooltip);
} else if (isset($phpInput["html"])) {
    $html = $phpInput["html"];
    $annotation->setAnnotationHtml($html);
} else if (isset($phpInput["style"])) {
    $style = $phpInput["style"];
    $annotation->setAnnotationStyle($style);
}

try {
    $annotation->editAnnotationProperty();
    echo json_encode(["success" => true, "message" => "Annotation was successfully edited."]);
} catch (Exception $exception) {
    http_response_code(503);
    echo json_encode([
        "success" => false,
        "message" => $exception->getMessage(),
    ]);
}
