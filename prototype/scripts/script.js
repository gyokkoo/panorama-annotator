const viewer = new PhotoSphereViewer.Viewer({
    panorama: 'https://photo-sphere-viewer.js.org/assets/sphere.jpg',
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
        markersPlugin.addMarker({
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
        });
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
