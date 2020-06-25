const albumBucketName = 'fmi-panorama-images';

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
  params: {Bucket: albumBucketName}
});

// A utility function to create HTML.
function getHtml(template) {
  return template.join('\n');
}


//
// Functions
//
// var params = {
//     Bucket: albumBucketName , 
//     Key: "01_panorama.jpg"
//    };
//    s3.getObjectTagging(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else     console.log(data);           // successful response
//      /*
//      data = {
//       TagSet: [
//          {
//         Key: "Key4", 
//         Value: "Value4"
//        }, 
//          {
//         Key: "Key3", 
//         Value: "Value3"
//        }
//       ], 
//       VersionId: "null"
//      }
//      */
//    });

// List the photo albums that exist in the bucket.
function listAlbums() {
  s3.listObjects({Delimiter: '/'}, function(err, data) {
    console.log(data);
    if (err) {
        console.log(err);
      return alert('There was an error listing your albums: ' + err.message);
    } else {
        // console.log(data.Content);
      var images = data.Contents.map(function(content) {
        var panorama = content.Key;
        return getHtml([
          '<li>',
            `<button style="margin:5px;" onclick="updateImage('${panorama}')">`,
              panorama,
            '</button>',
          '</li>'
        ]);
      });
      var message = images.length ?
        getHtml([
          '<p>Click on a panorama image name to view it.</p>',
        ]) :
        '<p>No panorama images found.';
      var htmlTemplate = [
        '<h2>Panoramas</h2>',
        message,
        '<ul>',
          getHtml(images),
        '</ul>',
      ]
      document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
    }
  });
}


