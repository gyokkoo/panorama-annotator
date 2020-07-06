<?php

require_once "./src/Annotation.php";
$url = $_SERVER["REQUEST_URI"];
$url_components = parse_url($url); 
 
parse_str($url_components['query'], $params); 
      
$panoramaImage = $params['panoramaImage'];

$annotation = new Annotation();
$annotation->setPanoramaImage($panoramaImage);

$readStatement = $annotation->read();

$annotations = array();
$annotations["result"] = array();

while ($row = $readStatement->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $item = array(
        "id" => $id,
        "latitude" => $latitude,
        "longitude" => $longitude,
        "tooltip" => $tooltip,
        "panoramaImage" => $panoramaImage,
        "annotationImage" => $annotationImage,
        "html" => $html,
        "style" => $style,
        "content" => $content
    );

    array_push($annotations["result"], $item);
}

http_response_code(200);

echo json_encode(["success" => true, "message" => "Found annotations.", "result" => $annotations["result"]]);
