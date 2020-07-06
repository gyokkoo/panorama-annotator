<?php

require_once "./src/Anotation.php";

$phpInput = json_decode(file_get_contents("php://input"), true);

$panoramaImage = $phpInput["panoramaImage"];

$anotation = new Anotation();

$anotation->setPanoramaImage($panoramaImage);

try {
    $operationSuccess = $anotation->deleteAllPanoramaAnnotations();
    echo json_encode([
        "success" => $operationSuccess,
        "message" => $operationSuccess ?
            "All annotations for this panorama were successfully removed." :
            "Delete all panorama operation failed!"
    ]);
} catch (Exception $exception) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => $exception->getMessage(),
    ]);
    return;
}