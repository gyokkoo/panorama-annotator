<?php

require_once "./src/Annotation.php";

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];

$annotation = new Annotation();

$annotation->setId($id);

try {
    $annotation->deleteFromDb();
} catch (Exception $exception) {
    echo json_encode([
        'success' => false,
        'message' => $exception->getMessage(),
    ]);
    return;
}

echo json_encode(["success" => true, "message" => "Annotation was successfully removed."]);