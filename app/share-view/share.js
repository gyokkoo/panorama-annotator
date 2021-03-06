const serverEndpoint = "../../server/"
const urlParams = new URLSearchParams(window.location.href);

const id = urlParams.get('id');

console.debug(`${id}`);

if (!id) {
    throw new Error("Invalid url params, please use valid url!");
}

const getAnnotationByIdEndpoint = serverEndpoint + `get-annotation.php?id=${encodeURIComponent(id)}`;
fetch((getAnnotationByIdEndpoint), {
        method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
        console.debug(response);
        if (response.success === true && response.message) {
            initializePanoramaImage(response.result);
        } else if (response.success === false && response.message) {
            // Handle error
        }
    });

function initializePanoramaImage(data) {
    const markerToAdd = {
        id: data.id,
        longitude: data.longitude,
        latitude: data.latitude,
        width: 32,
        height: 32,
        anchor: 'bottom center',
        tooltip: data.tooltip,
    };

    if (data.html) {
        markerToAdd['html'] = data.html;
        markerToAdd['style'] = data.style ? JSON.parse(data.style) : '';
    } else if (data.annotationImage) {
        markerToAdd['image'] = data.annotationImage;
    }

    const viewer = new PhotoSphereViewer.Viewer({
        panorama: data.panoramaImage,
        container: 'photosphere',
        caption: '',
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/photosphere-logo.gif',
        navbar: 'autorotate zoom download caption fullscreen',
        defaultLat: 0.3,
        mousewheel: true,
        touchmoveTwoFingers: true,
        plugins: [
            [PhotoSphereViewer.MarkersPlugin, {
                markers: [markerToAdd],
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