function getHtml(template) {
    return template.join("\n");
}

function listLocalPanoramas() {
    retrieveLocalPanoramaImageNames().then((imageNames) => {
        const dropdownItems = imageNames.map((imageName) => {
            return getHtml([
                `<button onclick="updateImage('${imageName}')">`,
                imageName,
                "</button>",
            ]);
        });

        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.innerHTML = getHtml(dropdownItems);

        document.getElementById("panorama-images").appendChild(dropdownWrapper);
    });
}