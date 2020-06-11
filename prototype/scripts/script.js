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
                // TODO: Fetch available annotations and add them here.
            ],
        }],
    ],
});

const markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

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

    console.debug(`TODO: Save annotation with ${data.longitude} and ${data.latitude} coordinates in a database.`);
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
        longitude: marker.longitude,
        latitute: marker.latitude,
        tooltip: marker.tooltip,
    }
    console.log(serverData);

    fetch(serverEndpoint, {
        method: 'POST',
        body: JSON.stringify(marker)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response.success === true && response.message) {
                // Handle success
            } else if (response.success === false && response.message) {
                // Handle error
            }
        });
}