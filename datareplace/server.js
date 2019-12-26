const express = require('express')
let request = require('request');
const bodyParser = require('body-parser');
const app = express()
app.use(express.static('public'));
app.set('view engine', 'ejs')
const contr = require('./controller')


app.get('/', function (req, res) {
    res.render('home', {message: null, error: null});
   })
   
   app.listen(3000, function () {
     console.log('Example app listening on port 3000!')
   })


   app.use(bodyParser.urlencoded({ extended: true }));

   app.post('/', function (req, res) {
       let sourcepath = req.body.sourcepath;
       let destinationpath = req.body.destpath;
       console.log(sourcepath);
       console.log(destinationpath);
       contr.filewalker(sourcepath, destinationpath);
      res.render('home', {message: "Successfully converted", error: null});
       
     })  