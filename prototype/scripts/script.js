const viewer = new PhotoSphereViewer.Viewer({
    panorama: 'https://fmi-panorama-images.s3.amazonaws.com/01_panorama.jpg',
    container: 'photosphere',
    caption: 'Sample mountain panorama',
    loadingImg: 'https://photo-sphere-viewer.js.org/assets/photosphere-logo.gif',
    navbar: 'autorotate zoom download caption fullscreen',
    defaultLat: 0.3,
    mousewheel: false,
    touchmoveTwoFingers: true,
    plugins: [
        [PhotoSphereViewer.MarkersPlugin, {
            markers: [
                // NOTE: Markers are shown on panorama in getAllAnotations() method
            ],
        }],
    ],
});

const markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

viewer.once('ready', () => {
    deleteAllData();
});

// Event triggered on panorama image click.
viewer.on('click', (e, data) => {
    console.debug(`${data.rightclick ? 'right clicked' : 'clicked'} at longitude: ${data.longitude} latitude: ${data.latitude}`);

    if (!data.rightclick) {
        // Add red Pin annotation on left click.
        const marker = {
            id: '#' + Math.random(),
            longitude: data.longitude,
            latitude: data.latitude,
            image: 'https://photo-sphere-viewer.js.org/assets/pin-red.png',
            width: 32,
            height: 32,
            anchor: 'bottom center',
            tooltip: 'I was here',
            data: {
                generated: true
            }
        };

        markersPlugin.addMarker(marker);

        saveAnotationMarker(marker);
    }
});

markersPlugin.on('select-marker', function(e, marker, data) {
    if (marker.data && marker.data.generated) {
      if (data.dblclick) {
        markersPlugin.removeMarker(marker);
        removeAnotationMarker(marker);
      } 
    }
  });

// Trigger sample animation
viewer.animate({
    longitude: Math.PI / 2,
    latitude: '20deg',
    zoom: 50,
    speed: '-2rpm',
}).then(() => {
    console.debug('Animation completed.');

    // API specs: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API 
});

function saveAnotationMarker(marker) {
    const serverEndpoint = "../server/create-anotation.php";

    const serverData = {
        id: marker.id,
        longitude: marker.longitude,
        latitute: marker.latitude,
        tooltip: marker.tooltip,
    }
    console.debug(serverData);

    fetch(serverEndpoint, {
        method: 'POST',
        body: JSON.stringify(marker)
    })
        .then(response => response.json())
        .then(response => {
            console.debug(response);
            if (response.success === true && response.message) {
                // Handle success
            } else if (response.success === false && response.message) {
                // Handle error
            }
        });
}

function removeAnotationMarker(marker) {
    console.debug(marker);
    const serverEndpoint = "../server/delete-anotation.php";

    const serverData = {
        id: marker.id
    }
    console.debug(serverData);

    fetch(serverEndpoint, {
        method: 'POST',
        body: JSON.stringify(serverData)
    })
        .then(response => response.json())
        .then(response => {
            console.debug(response);
            if (response.success === true && response.message) {
                // Handle success
            } else if (response.success === false && response.message) {
                // Handle error
            }
        });
}

function getAllAnotations(markersPlugin) {
    const serverEndpoint = "../server/get-all-anotations.php";
    
    return fetch(serverEndpoint, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(response => {
            if (response.success === true && response.result) {
                return JSON.stringify(response.result, null, 1);
            } else if (response.success === false && response.message) {
                console.error(response.message);
            }
        });
    
}

function generateFilename() {
    let result           = 'panorama-anotation';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function deleteAllData(){
    const serverEndpoint = "../server/delete-all-data.php";
    fetch(serverEndpoint, {
        method: 'PUT',
    })
        .then(response => response.json())
        .then(response => {
            if (response.success === true && response.result) {
                console.debug('Deleted all data.');
            } else if (response.success === false && response.message) {
                console.error(response.message);
            }
        });
}