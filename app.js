var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var bodyParser= require('body-parser');

app.set('port', process.env.PORT || 8080);
// default options
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(fileUpload());
app.use(express.static(__dirname + "/public"))

var router = express.Router();


router.post('/upload', function(req, res) {

  var now = Date.now();
  var sampleFile;
  var email;


  // console.log(req.files);
  if (!req.files && !req.body.email) {
    res.send('No files were uploaded.');
    return;
  }


  if((req.files.sampleFile.mimetype != 'application/pdf') && (req.files.sampleFile.mimetype != 'image/png') && (req.files.sampleFile.mimetype != 'image/jpeg')){
    res.send('File format not accepted');
    return;
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  var fileNameType = sampleFile.name;
  var fileType = fileNameType.substring(fileNameType.indexOf('.'),fileNameType.length);
  email = req.body.email;

  sampleFile.name = email.substring(0,email.indexOf('@')) + '-' + now + fileType;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./public/' + sampleFile.name, function(err) {
      if (err) {
        console.log(err);
        res.status(500).send('Error');
      }
      else {
        res.send('File uploaded!');
      }
    });
  });

app.use('/contax', router);

var server = app.listen(app.get('port'), function () {
                console.log('Server running at port: ' + server.address().port);
             });
