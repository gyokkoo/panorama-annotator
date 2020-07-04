hideDropdown();
hideImportArea();

const cachedImage = window.localStorage.getItem("panorama-image");
const viewer = new PhotoSphereViewer.Viewer({
    panorama: cachedImage ? cachedImage : "https://fmi-panorama-images.s3.amazonaws.com/01_panorama.jpg",
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
                // NOTE: Other markers are shown on panorama in getAllAnotations() method
            ],
        }],
    ],
});

const markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

function updateImage(panoramaImageName) {
    console.log(panoramaImageName);
    const panoramaImgEndpoint = 'https://fmi-panorama-images.s3.amazonaws.com/' + panoramaImageName;
    viewer.setPanorama(panoramaImgEndpoint);
    window.localStorage.setItem("panorama-image", panoramaImgEndpoint);

    getAllAnotations().then(markersData => {
        markersPlugin.clearMarkers();
        if (markersData) {
            addMarkers(JSON.parse(markersData));
        }
    });
}

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

function getShareableView(id) {
    const url = `${window.location.href}/share-view/share.html?&id=${id}`

    return `
        <form onsubmit="changeTooltip(event)">
            <div id="pin-id">${id}</div>
            <label for="pin-tooltip">Change tooltip text</label>
            <input type="text" id="pin-tooltip" name="pin-tooltip">
            <input type="submit">
            </div>
        </form>
        <h2>Share PIN copying this URL:</h2>
        <a href="${url}" target="_blank" id="get-shareable-url">${url}</a>   
        <canvas id="qrCode"></canvas>

        <h2>Convert to HTML annotation:</h2>
        <form onsubmit="changeHtmlAnnotation(event)">
            <label for="pin-html">Change HTML:</label>
            <textarea rows="6" cols="30" id="pin-html" name="pin-html">
            </textarea> <br/>
            <label for="pin-css">Change CSS:</label><br />
            <textarea rows="5" cols="30" id="pin-css" name="pin-css">
            </textarea> <br/>
            <input type="submit">
        </form>
    `
}

viewer.once('ready', () => {
    getAllAnotations().then(markersData => {
        if (markersData) {
            addMarkers(JSON.parse(markersData));
        }
    });
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
            tooltip: 'Generated pin, right click to make it shareable',
            data: {
                removeable: true
            }
        };

        markersPlugin.addMarker(marker);

        saveAnotationMarker(marker);
    }
});

markersPlugin.on('select-marker', function (e, marker, data) {
    if (marker.data) {
        if (data.dblclick && marker.data.removeable) {
            markersPlugin.removeMarker(marker);
            removeAnotationMarker(marker);
        } else if (data.rightclick) {
            if (marker.data.htmlAnnotation) {
                markersPlugin.updateMarker({
                    id: marker.id,
                    content: getShareableView(marker.id, marker.config.longitude, marker.config.latitude, window.localStorage.getItem("panorama-image")),
                });
            } else {
                markersPlugin.updateMarker({
                    id: marker.id,
                    image: 'https://photo-sphere-viewer.js.org/assets/pin-blue.png',
                    tooltip: 'Shareable anotation. <b>Click me!</b>',
                    content: getShareableView(marker.id, marker.config.longitude, marker.config.latitude, window.localStorage.getItem("panorama-image")),
                    data: {
                        removeable: false,
                    }
                });
            }

        }
    }
    setTimeout(() => {
        const url = document.getElementById("get-shareable-url");
        if (url) {
            generateQr(url.innerHTML);
        }
    }, 0);
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

function changeTooltip(event) {
    event.preventDefault();
    const pinId = document.getElementById("pin-id").innerHTML;
    const tooltip = document.getElementById("pin-tooltip").value;
    if (!pinId || !tooltip) {
        console.error("Could not find pinId or pin tooltip!");
    }
    editAnotation(pinId, tooltip);
    markersPlugin.updateMarker({
        id: pinId,
        tooltip: tooltip
    });
    setTimeout(() => {
        const url = document.getElementById("get-shareable-url");
        if (url) {
            generateQr(url.innerHTML);
        }
    }, 0);
}

function changeHtmlAnnotation(event) {
    event.preventDefault();
    const pinId = document.getElementById("pin-id").innerHTML;
    const htmlData = document.getElementById("pin-html").value.trim();
    const cssData = document.getElementById("pin-css").value.trim();

    const cssObject = {};
    if (cssData) {
        const cssStyles = cssData.split(",");
        if (cssStyles.length === 0) {
            console.error("Css should be comma separated!");
        }
        cssStyles.forEach(style => {
            const cssKey = style.split(':')[0].trim();
            const cssValue = style.split(':')[1].trim();
            cssObject[cssKey] = cssValue;
        });
    }
    console.log(cssObject);

    if (!pinId) {
        console.error("Could not find pinId!");
    }

    const currentMarker = markersPlugin.getCurrentMarker();
    const latitude = currentMarker.config.latitude;
    const longitude = currentMarker.config.longitude;
    const newTooltip = "HTML annotation"
    markersPlugin.removeMarker(pinId);
    markersPlugin.addMarker({
        id: pinId,
        latitude: latitude,
        longitude: longitude,
        tooltip: newTooltip,
        anchor: 'bottom center',
        html: htmlData,
        style: cssObject,
        data: {
            htmlAnnotation: true,
            removeable: false,
        }
    });

    editAnotation(pinId, newTooltip, htmlData, JSON.stringify(cssObject));
}

function showDropdown(event) {
    event.stopPropagation();
    const panoramaDropdown = document.getElementById('panorama-images');
    panoramaDropdown.style.display = 'block';
}

function hideDropdown() {
    const panoramaDropdown = document.getElementById('panorama-images');
    panoramaDropdown.style.display = 'none';
}

// Close the dropdown menu if the user clicks outside of it.
window.onclick = () => {
    hideDropdown();
}

function hideImportArea() {
    document.getElementById('import-area').style.display = 'none';
}

function showImportArea() {
    document.getElementById('import-area').style.display = 'block';
}

// Initially hide close button
document.getElementById('message-close-btn').style.visibility = 'hidden';

/**
 * Hides the container used for message visualisations.
 */
function hideMessage() {
    const messageContainer = document.getElementById('message-container');
    messageContainer.style.visibility = 'hidden';

    // Hide close button
    document.getElementById('message-close-btn').style.visibility = 'hidden';
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

    // Show close button
    document.getElementById('message-close-btn').style.visibility = 'visible';
}