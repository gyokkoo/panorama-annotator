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

function editAnotation(id, tooltip) {
    const serverData = {
        id: id,
        longitude: '',
        latitude: '',
        panoramaImage: '',
        anotationImage: '',
        tooltip: tooltip
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

function getAllAnotations() {
    const panoramaImage = window.localStorage.getItem("panorama-image");
    return fetch(serverEndpoint + `get-all-anotations.php?panoramaImage=${panoramaImage}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(response => {
            if (response.success === true && response.result) {
                return JSON.stringify(response.result, null, 1);
            } else if (response.success === false && response.message) {
                displayMessage('alert-danger', response.message);
            }
        });
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

/**
 * Hides the container used for message visualisations.
 */
function hideMessage() {
    const messageContainer = document.getElementById('message-container');
    messageContainer.style.visibility = 'hidden';
}

/**
 * Display error message inside a container with id #message-container
 * @param messageClass Can be either alert-success or alert-error (Green or Red)
 * @param message The message to be displayed
 */
function displayMessage(messageClass, message) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.className = messageClass;
    messageContainer.style.visibility = 'visible';
    messageContainer.innerText = message;
}