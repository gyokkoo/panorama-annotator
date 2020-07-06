const panoramaBucketName = 'fmi-panorama-images';

// **DO THIS**:
//   Replace this block of code with the sample code located at:
//   Cognito -- Manage Identity Pools -- [identity_pool_name] -- Sample Code -- JavaScript
//
// Initialize the Amazon Cognito credentials provider
// AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:ba6c245e-0631-4e88-a462-b9e10ed1326f',
    IdentityId: 'us-east-1:2cfcccbe-8a60-4251-ada0-85c7ba72f8ca'
}, {
    region: 'us-east-1'
});

// Create a new service object
var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: panoramaBucketName }
});

// A utility function to create HTML.
function getHtml(template) {
    return template.join('\n');
}

function setPanoramaImageDescriptionTag(viewer, key) {
    const params = {
        Bucket: panoramaBucketName,
        Key: key
    };
    s3.getObjectTagging(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
        } else {
            const description = data["TagSet"][0]["Value"];
            viewer.setOption("caption", description);
            return description;
        }
    });
}

function listPanoramas() {
    s3.listObjects({ Delimiter: '/' }, function(err, data) {
        if (err) {
            console.log(err);
            return alert('An error occured while listing panorama images: ' + err.message);
        } else {
            const images = data.Contents.map(function(content) {
                const panorama = content.Key;
                return getHtml([
                    `<button onclick="updateImage('${panorama}')">`,
                    panorama,
                    '</button>',
                ]);
            });

            const divElement = document.createElement('div');
            divElement.innerHTML = getHtml(images);

            document.getElementById('panorama-images').appendChild(divElement);
        }
    });
}