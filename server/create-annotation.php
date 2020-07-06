<?php
require_once "./src/Annotation.php";

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];
$latitude = $phpInput["latitude"];
$longitude = $phpInput["longitude"];
$tooltip = $phpInput["tooltip"];
$panoramaImage = $phpInput["panoramaImage"];

$annotation = new Annotation();

$annotation->setAttributes($id, $latitude, $longitude, $tooltip, $panoramaImage);

if (isset($phpInput["annotationImage"])) {
    $annotationImage = $phpInput["annotationImage"];
    $annotation->setAnnotationImage($annotationImage);
}
if (isset($phpInput["html"]) && isset($phpInput["style"])) {
    $html = $phpInput["html"];
    $style = $phpInput["style"];
    $annotation->setAnnotationHtml($html);
    $annotation->setAnnotationStyle($style);
}

if(isset($phpInput["content"])){
    $content = $phpInput["content"];
    $annotation->setContent($content);
}

try {
    $annotation->storeInDatabase();
} catch (Exception $exception) {
    echo json_encode([
        'success' => false,
        'message' => $exception->getMessage(),
    ]);
    return;
}

echo json_encode(["success" => true, "message" => "Annotation was successfully added."]);
