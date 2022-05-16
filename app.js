// Initialising express and body-parser dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB');

// Initialise port
const port = 3000;
const encKey = process.env.SOME_32BYTE_BASE64_STRING;
const sigKey = process.env.SOME_64BYTE_BASE64_STRING;

const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});

usersSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', usersSchema);

const secretsSchema = new mongoose.Schema({
  content: String
});
const Secret = new mongoose.model('Secret', secretsSchema);

app.get('/', function(req,res){
  res.render('home');
});

app.get('/login', function(req,res){
  res.render('login');
});

app.get('/register', function(req,res){
  res.render('register');
});

app.get('/submit', function(req, res){
  res.render('submit');
});

app.get('/logout', function(req,res){
  res.render('home');
});

app.post('/register', function(req, res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  User.findOne({email: req.body.username}, function(err, result){
    if(result === null) {user.save();res.render('login');}
    else res.send('User already exists! Please <a href="login">log in!</a>');
  });
});

app.post('/login', function(req, res){
  User.findOne({email: req.body.username}, function(err, result){
    if(err) res.send(err);
    else {
      if(result !== null && result.password == req.body.password) res.render('secrets');
      else res.send('Wrong credentials! Please <a href="login">try again</a>!')
    }
  });
});

app.post('/submit', function(req, res){

});


app.listen(port, function() {
  console.log('Server is up and listening!');
});
