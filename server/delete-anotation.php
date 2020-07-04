<?php

$phpInput = json_decode(file_get_contents("php://input"), true);

$id = $phpInput["id"];

require_once "./src/Anotation.php";
$anotation = new Anotation();

$anotation->setId($id);

try {
    $anotation->deleteFromDb();
} catch (Exception $exception) {
    echo json_encode([
        'success' => false,
        'message' => $exception->getMessage(),
    ]);
    return;
}

echo json_encode(["success" => true, "message" => "Anotation was successfully removed."]);