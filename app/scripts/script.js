const viewer = new PhotoSphereViewer.Viewer({
    panorama: 'https://fmi-panorama-images.s3.amazonaws.com/02_panorama_small.jpg',
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
                {
                    // image marker that opens the panel when clicked
                    id: 'image',
                    longitude: 0.32,
                    latitude: 0.11,
                    image: 'https://photo-sphere-viewer.js.org/assets/pin-blue.png',
                    width: 32,
                    height: 32,
                    anchor: 'bottom center',
                    tooltip: 'Shareable anotation. <b>Click me!</b>',
                    content: getShareableView(0.32, 0.11, "https://fmi-panorama-images.s3.amazonaws.com/02_panorama_small.jpg"),
                },
                // NOTE: Other markers are shown on panorama in getAllAnotations() method
            ],
        }],
    ],
});

function generateQr(url) {
    if (!url) {
        console.error('URL is undefined. QR code cannot be generated from undefined.');
        return;
    }
    const qrCodeCanvas = document.getElementById('qrCode');
    if (!qrCodeCanvas) {
        console.error('QR code canvas has not been found.');
        return;
    }
    const qrCode = new QRious({
        element: qrCodeCanvas,
        value: url,
        size: 250,
        background: 'white',
        foreground: 'black'
    });
}

function getShareableView(longitude, latitude, image) {
    const url = `${window.location.href}/share-view/share.html?&x=${longitude}&y=${latitude}&img=${image}`

    return `
        <h1>Share PIN copying this URL:</h1>
        <a href="${url}" target="_blank" id="get-shareable-url">${url}</a>   
        <canvas id="qrCode"></canvas>
    `
}

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

markersPlugin.on('select-marker', function (e, marker, data) {
    if (marker.data && marker.data.generated) {
        if (data.dblclick) {
            markersPlugin.removeMarker(marker);
            removeAnotationMarker(marker);
        }
    }
    if (!data.rightclick) {
        setTimeout(() => {
            const url = document.getElementById("get-shareable-url").innerHTML;
            generateQr(url);
        }, 0);
    }
});

// Focus specific place
viewer.animate({
    longitude: 0.22,
    latitude: 0.51,
    zoom: 60,
    speed: '-2rpm',
}).then(() => {
    console.debug('Animation completed.');

    // API specs: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API 
});
