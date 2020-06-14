const urlParams = new URLSearchParams(window.location.href);

const x = urlParams.get('x');
const y = urlParams.get('y');
const img = urlParams.get('img');

console.log(`${x} -  ${y}  - ${img}`);

if (!x || !y || !img) {
    throw new Error("Invalid url params, please use valid url!");
}

const viewer = new PhotoSphereViewer.Viewer({
    panorama: img,
    container: 'photosphere',
    caption: 'Sample mountain panorama',
    loadingImg: 'https://photo-sphere-viewer.js.org/assets/photosphere-logo.gif',
    navbar: 'autorotate zoom download caption fullscreen',
    defaultLat: 0.3,
    mousewheel: true,
    touchmoveTwoFingers: true,
    plugins: [
        [PhotoSphereViewer.MarkersPlugin, {
            markers: [
                {
                    // image marker that opens the panel when clicked
                    id: "#" + Math.random(),
                    longitude: x,
                    latitude: y,
                    image: 'https://photo-sphere-viewer.js.org/assets/pin-blue.png',
                    width: 32,
                    height: 32,
                    anchor: 'bottom center',
                    tooltip: 'Sample toolip texts',
                },
                // NOTE: Other markers are shown on panorama in getAllAnotations() method
            ],
        }],
    ],
});

// Focus specific place
viewer.animate({
    longitude: x,
    latitude: y,
    zoom: 60,
    speed: '-2rpm',
}).then(() => {
    console.debug('Animation completed.');
});