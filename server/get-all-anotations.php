<?php

require_once "./src/Anotation.php";
$url = $_SERVER["REQUEST_URI"];
$url_components = parse_url($url); 
 
parse_str($url_components['query'], $params); 
      
$panoramaImage = $params['panoramaImage'];

$anotation = new Anotation();
$anotation->setPanoramaImage($panoramaImage);

$readStatement = $anotation->read();

$anotations = array();
$anotations["result"] = array();

while ($row = $readStatement->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $item = array(
        "id" => $id,
        "latitude" => $latitude,
        "longitude" => $longitude,
        "tooltip" => $tooltip,
        "panoramaImage" => $panoramaImage,
        "anotationImage" => $anotationImage,
        "html" => $html,
        "style" => $style,
        "content" => $content
    );

    array_push($anotations["result"], $item);
}

http_response_code(200);

echo json_encode(["success" => true, "message" => "Found anotations.", "result" => $anotations["result"]]);
