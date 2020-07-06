<?php

require_once "./src/Annotation.php";

$url = $_SERVER["REQUEST_URI"];
$url_components = parse_url($url);

parse_str($url_components['query'], $params);

$id = $params['id'];

$annotation = new Annotation();
$annotation->setId($id);
$getResult = $annotation->readAnnotation();

if ($getResult == null) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Could not find annotation!"]);
} else {
    http_response_code(200);
    $result = array(
        "id" => $getResult['id'],
        "latitude" => $getResult['latitude'],
        "longitude" => $getResult['longitude'],
        "tooltip" => $getResult['tooltip'],
        "panoramaImage" => $getResult['panoramaImage'],
        "annotationImage" => $getResult['annotationImage'],
        "html" => $getResult['html'],
        "style" => $getResult['style'],
        "content" => $getResult['content']
    );
    echo json_encode(["success" => true, "message" => "Found annotation!", "result" => $result]);
}
