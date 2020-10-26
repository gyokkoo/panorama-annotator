const serverEndpoint = "../server/";

function saveAnnotationMarker(marker) {
    const panoramaImage = viewer.config.panorama;
    if (!panoramaImage) {
        console.error("Could not find the panorama image in the view.config.panorama!");
    }

    const serverData = {
        id: marker.id,
        longitude: marker.longitude,
        latitude: marker.latitude,
        tooltip: marker.tooltip,
        panoramaImage: panoramaImage,
        annotationImage: marker.image,
    };

    console.debug(serverData);

    fetch(serverEndpoint + "create-annotation.php", {
            method: 'POST',
            body: JSON.stringify(serverData)
        })
        .then(response => response.json())
        .then(response => {
            console.debug(response);
            if (response.success === true && response.message) {
                displayMessage('alert-success', response.message);
            } else if (response.success === false && response.message) {
                displayMessage('alert-danger', response.message);
            }
        });
}

function removeAnnotationMarker(marker) {
    console.debug(marker);

    const serverData = {
        id: marker.id
    }
    console.debug(serverData);

    fetch(serverEndpoint + "delete-annotation.php", {
            method: 'POST',
            body: JSON.stringify(serverData)
        })
        .then(response => response.json())
        .then(response => {
            console.debug(response);
            if (response.success === true && response.message) {
                displayMessage('alert-success', response.message);
            } else if (response.success === false && response.message) {
                displayMessage('alert-danger', response.message);
            }
        });
}

function editAnnotation(id, tooltip, html, css) {
    const serverData = {
        id: id,
        longitude: '',
        latitude: '',
        panoramaImage: '',
        annotationImage: '',
    };
    if (tooltip) {
        serverData['tooltip'] = tooltip;
    } else if (html) {
        serverData['html'] = html;
    } else if (css) {
        serverData['style'] = css;
    }

    console.debug(serverData);

    fetch(serverEndpoint + "edit-annotation.php", {
            method: 'PUT',
            body: JSON.stringify(serverData)
        })
        .then(response => response.json())
        .then(response => {
            console.debug(response);
            if (response.success === true && response.message) {
                displayMessage('alert-success', response.message);
            } else if (response.success === false && response.message) {
                displayMessage('alert-danger', response.message);
            }
        });
}

async function getAllAnnotations() {
    const panoramaImage = window.localStorage.getItem("panorama-image");
    const response = await fetch(serverEndpoint + `get-all-annotations.php?panoramaImage=${panoramaImage}`, {
        method: 'GET',
    });
    const responseData = await response.json();
    if (responseData.success === true && responseData.result) {
        return JSON.stringify(responseData.result, null, 1);
    } else if (responseData.success === false && responseData.message) {
        displayMessage('alert-danger', responseData.message);
    }
}

function generateFilename() {
    let result = 'panorama-annotation';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function deleteAllAnnotations(panoramaImage) {
    fetch(serverEndpoint + "delete-all-annotations.php", {
            method: 'PUT',
            body: JSON.stringify({
                panoramaImage: panoramaImage
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.success === true && response.message) {
                displayMessage('alert-success', response.message);
                location.reload();
            } else if (response.success === false && response.message) {
                displayMessage('alert-danger', response.message);
            }
        });
}

function retrieveLocalPanoramaImageNames() {
    return fetch(serverEndpoint + "panorama/get-local-panoramas.php", {
            method: "GET",
        })
        .then(response => response.json())
        .then(response => {
            if (response.success === true && response.message) {
                displayMessage("alert-success", response.message);
                return response.result;
            } else if (response.success === false && response.message) {
                displayMessage("alert-danger", response.message);
                return [];
            }
        });
}

// Note: Do not use in production. This is intended to be used only for DEV purpose.
function deleteAllData() {
    fetch(serverEndpoint + "delete-all-data.php", {
            method: 'PUT',
        })
        .then(response => response.json())
        .then(response => {
            if (response.success === true && response.result) {
                displayMessage('alert-success', response.message);
            } else if (response.success === false && response.message) {
                displayMessage('alert-danger', response.message);
            }
        });
}