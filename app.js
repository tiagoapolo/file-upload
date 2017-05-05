const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const bodyParser= require('body-parser')

app.set('port', process.env.PORT || 3000)
// default options
app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader('Access-Control-Allow-Headers', 'my-header,X-Requested-With,content-type,Authorization,cache-control')
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(fileUpload())
app.use(express.static(__dirname + "/public"))

const router = express.Router()

const error = ( err, res ) => {
  console.log( err )
  res.status(500).send('Error')
}

router.post('/upload', (req, res) => {

// Funcao sempre deve retornar algo
  // console.log(req.files)
  if (!req.files && !req.body.email) {
    res.send('No files were uploaded.')
    return false
  }

  if( (req.files.sampleFile.mimetype != 'application/pdf') && 
      (req.files.sampleFile.mimetype != 'image/png') && 
      (req.files.sampleFile.mimetype != 'image/jpeg') ){
    res.send('File format not accepted')
    return false
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const sampleFile = req.files.sampleFile
  const fileNameType = sampleFile.name
  const fileType = fileNameType.substring( fileNameType.indexOf('.'), fileNameType.length)
  const email = req.body.email

  sampleFile.name = email.substring( 0, email.indexOf('@') ) + 
                                    `- ${Date.now()}${fileType}`

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./public/' + sampleFile.name,  (err) => 
    ( err ) 
      ? error( err, res )
      : res.send('File uploaded!'))
  })

app.use( '/contax', router )

const server = app.listen( app.get( 'port' ), () => {
    console.log( 'Server running at port: ' + server.address().port )
 })
