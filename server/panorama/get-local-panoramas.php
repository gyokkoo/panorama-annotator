<?php

// Search $path directory for image files.
$path = '../static/panoramas';
$files = scandir($path);

// Remove . and .. from the returned array from scandir.
$files = array_diff(scandir($path), array('.', '..'));
    
if (count($files) == 0) {
    echo json_encode([
        "success" => false, 
        "message" => "Could not find local panoramas.", 
        "result" => []
    ]);
} else {
    echo json_encode([
        "success" => true, 
        "message" => "Loaded panoramas from the server.", 
        "result" => array_values($files)
    ]);
}
    