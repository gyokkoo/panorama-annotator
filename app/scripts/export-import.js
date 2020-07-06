function exportAnnotations() {
    getAllAnnotations().then(result => {
        console.debug(result);
        let exportElement = document.createElement('a');
        exportElement.setAttribute('href', `data:application/json;charset=utf-8, ` +
            encodeURIComponent(result));
        exportElement.setAttribute('download', generateFilename() + '.json');

        document.body.appendChild(exportElement);

        exportElement.click();

        document.body.removeChild(exportElement);
    });
}

function addMarkers(data) {
    if (!data) {
        console.error('No markers available.');
        return;
    }
    data.forEach((marker) => {
        const markerToAdd = {
            id: marker.id,
            latitude: marker.latitude,
            longitude: marker.longitude,
            tooltip: marker.tooltip,
            width: 32,
            height: 32,
            anchor: 'bottom center',
            content: marker.content,
        }

        // Note: Sphere does not support both html and image properties.
        if (marker['html']) {
            markerToAdd['html'] = marker['html'];
            markerToAdd['style'] = marker['style'] ? JSON.parse(marker['style']) : '';
            markerToAdd['data'] = {
                removeable: false,
                htmlAnnotation: true,
            }
        } else if (marker['annotationImage']) {
            markerToAdd['image'] = marker['annotationImage']
            markerToAdd['data'] = {
                removeable: true,
                htmlAnnotation: false,
            }
        }

        markersPlugin.addMarker(markerToAdd)
    });
}

function importAnnotations() {
    const result = document.getElementById('import-result').value.trim();
    if (result.length !== 0) {
        addMarkers(JSON.parse(result));
        return;
    }

    const files = document.getElementById('import-files').files;
    console.debug(files);
    if (files.length <= 0) {
        return false;
    }

    const fReader = new FileReader();

    fReader.onload = function(data) {
        console.debug(data);
        const fileResult = JSON.parse(data.target.result);
        addMarkers(fileResult);
        const formatted = JSON.stringify(fileResult, null, 2);
        document.getElementById('import-result').value = formatted;
    }

    fReader.readAsText(files.item(0));
}

function openDeleteConfirmation() {
    if (window.confirm("Do you really want to delete all annotations for this panorama?")) {
        const panoramaImage = window.localStorage.getItem("panorama-image");
        deleteAllAnnotations(panoramaImage);
    }
}