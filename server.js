var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var PORT = 3000;

// opens a connection to the test database
mongoose.connect('mongodb://localhost/mongo_express');

// schema relates to a model
// schema name - whatever the model name with capital schema after it
// i.e. model name is drawing, schema name is drawingSchema
var drawingSchema = mongoose.Schema({name: String});
// instansiates
// creates a single model, colleciton makes it plural automatically
var Drawing = mongoose.model('Drawing', drawingSchema);

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

// hello world!
app.route('/')
  .get(function(req, res) {
    res.send('Hello World!');
  })
  .post(function(req, res) {
    res.send('This is the .post page for /');
  });

// route for .get and .post for /drawings
app.route('/drawings')
  .get(function(req, res) {
    res.send('This is the .get page for /drawings');
  })
  .post(function(req, res) {
    var newDrawing = new Drawing({name: req.body.name});
    newDrawing.save();
    res.send('Drawing saved!');
  });

app.route('/drawings/:id')
  .get(function(req, res) {
    Drawing.findOne({ _id: req.params.id })
    .then(function(result) {
      res.send(result);
    });
  })
  .put(function(req, res) {
    Drawing.update({ _id: req.params.id },
      { $set: { name: req.body.name } })
    .then(function(result) {
      res.json(result);
    });
  });

// notifies if connection is successful or if a connection error occurs
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected');
  app.listen(PORT, function() {
    console.log('listening on port', PORT);
  });
});