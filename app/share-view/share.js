const serverEndpoint = "../../../server/"
const urlParams = new URLSearchParams(window.location.href);

const id = urlParams.get('id');

<<<<<<< HEAD
console.debug(`${id}`);
=======
console.log(`${id}`);
>>>>>>> c08dfb3... Add getAnotation by id functionality

if (!id) {
    throw new Error("Invalid url params, please use valid url!");
}

const getAnotationByIdEndpoint = serverEndpoint + `get-anotation.php?id=${encodeURIComponent(id)}`;
fetch((getAnotationByIdEndpoint), {
    method: 'GET'
})
    .then(response => response.json())
    .then(response => {
        console.debug(response);
        if (response.success === true && response.message) {
<<<<<<< HEAD
            initializePanoramaImage(response.result);
=======
            // Handle success
>>>>>>> c08dfb3... Add getAnotation by id functionality
        } else if (response.success === false && response.message) {
            // Handle error
        }
    });
<<<<<<< HEAD
=======

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
>>>>>>> c08dfb3... Add getAnotation by id functionality

function initializePanoramaImage(data) {
    const viewer = new PhotoSphereViewer.Viewer({
        panorama: data.panoramaImage,
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
                        id: data.id,
                        longitude: data.longitude,
                        latitude: data.latitude,
                        image: data.anotationImage,
                        width: 32,
                        height: 32,
                        anchor: 'bottom center',
                        tooltip: data.tooltip,
                    },
                    // NOTE: Other markers are shown on panorama in getAllAnotations() method
                ],
            }],
        ],
    });

    // Focus specific place
    viewer.animate({
        longitude: data.longitude,
        latitude: data.latitude,
        zoom: 60,
        speed: '-2rpm',
    }).then(() => {
        console.debug('Animation completed.');
    });
}
