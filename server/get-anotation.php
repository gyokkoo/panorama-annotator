<?php

require_once "./src/Anotation.php";

$url = $_SERVER["REQUEST_URI"];
$url_components = parse_url($url); 
 
parse_str($url_components['query'], $params); 
      
$id = $params['id'];
<<<<<<< HEAD
=======
var_dump($id);
>>>>>>> c08dfb3... Add getAnotation by id functionality

$anotation = new Anotation(
    $id,
    0,
    0,
    '',
    '',
    ''
);

$getResult = $anotation->get();

if (!$getResult) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Could not find anotation!"]);
} else {
    http_response_code(200);
    $result = array(
<<<<<<< HEAD
        "id" => $getResult['id'],
        "latitude" => $getResult['latitude'],
        "longitude" => $getResult['longitude'],
        "tooltip" => $getResult['tooltip'],
        "panoramaImage" => $getResult['panoramaImage'],
        "anotationImage" => $getResult['anotationImage']
=======
        "id" =>  $getResult['id'],
        "latitude" => $getResult['latitude'],
        "longitude" => $getResult['longitude']
>>>>>>> c08dfb3... Add getAnotation by id functionality
    );
    echo json_encode(["success" => true, "message" => "Found anotation!", "result" => $result]);
}
