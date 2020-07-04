const serverEndpoint = "../server/";

function saveAnotationMarker(marker) {
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
        anotationImage: marker.image,
    };

    console.debug(serverData);

    fetch(serverEndpoint + "create-anotation.php", {
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

function removeAnotationMarker(marker) {
    console.debug(marker);

    const serverData = {
        id: marker.id
    }
    console.debug(serverData);

    fetch(serverEndpoint + "delete-anotation.php", {
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

function editAnotation(id, tooltip, html, css) {
    const serverData = {
        id: id,
        longitude: '',
        latitude: '',
        panoramaImage: '',
        anotationImage: '',
        tooltip: tooltip,
    };
    if (html) {
        serverData['html'] = html;
    }
    if (css) {
        serverData['style'] = css;
    }
    console.debug(serverData);

    fetch(serverEndpoint + "edit-anotation.php", {
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

async function getAllAnotations() {
    const panoramaImage = window.localStorage.getItem("panorama-image");
    const response = await fetch(serverEndpoint + `get-all-anotations.php?panoramaImage=${panoramaImage}`, {
        method: 'GET',
    });
    const responseData = await response.json();
    if (responseData.success === true && responseData.result) {
        return JSON.stringify(responseData.result, null, 1);
    }
    else if (responseData.success === false && responseData.message) {
        displayMessage('alert-danger', responseData.message);
    }
}

function generateFilename() {
    let result = 'panorama-anotation';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function deleteAllData() {
    fetch(serverEndpoint + "delete-all-data.php", {
        method: 'PUT',
    })
        .then(response => response.json())
        .then(response => {
            if (response.success === true && response.result) {
                displayMessage('alert-success', response.message);
            } else if (response.success === false && response.message) {
                displayMessage('salert-danger', response.message);
            }
        });
}