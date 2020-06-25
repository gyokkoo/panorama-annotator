function exportAnotations() {
    getAllAnotations().then(result => {
        console.debug(result);
        let exportElement = document.createElement('a');
        exportElement.setAttribute('href', `data:application/json;charset=utf-8, `
            + encodeURIComponent(result));
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
        markersPlugin.addMarker({
            id: marker.id,
            latitude: marker.latitude,
            longitude: marker.longitude,
            tooltip: marker.tooltip,
            width: 32,
            height: 32,
            anchor: 'bottom center',
            image: 'https://photo-sphere-viewer.js.org/assets/pin-red.png',
            data: {
                generated: true
            }
        })
    });
}

function importAnotations() {
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

    fReader.onload = function (data) {
        console.debug(data);
        const fileResult = JSON.parse(data.target.result);
        addMarkers(fileResult);
        const formatted = JSON.stringify(fileResult, null, 2);
        document.getElementById('import-result').value = formatted;
    }
    
    fReader.readAsText(files.item(0));
}