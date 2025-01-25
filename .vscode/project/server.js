// setup
const express = require('express');                       // import express
const path = require('path');                             // install path
const options = {root: path.join(__dirname, '/public')};  // set options root
const app = express();                                    // initialise app
const port = 3000;                                        // set port
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');                // bodyparser for forms
const routes = require('./routes/routing');               // set routing path
const { v4: uuidv4 } = require("uuid");                   // random strings
const session = require('express-session')                // sessions for remembering
const FileStore = require('session-file-store')(session); // session file store

// dot environment variables
//require('dotenv').config({path:'C:/Users/elect/OneDrive/Documents/.vscode/project/.env'})

app.engine('html', require('ejs').renderFile);            // allow html file rendering
app.use(express.static(path.join(__dirname, 'public')))   // set static files
app.set('view engine', 'html');                           // as ejs
app.set('views', path.join(__dirname, 'public'));         // idk probably important
app.use(express.json())

// Sessions
app.use(session({
  genid: (req) => {
    return uuidv4()
  },
  store: new FileStore({path: path.join(__dirname, 'sessions')}),
  resave: false,
  //secret: process.env.SESSIONS_SECRET,
  secret: "keyboard cat",
  saveUninitialized: true,
  cookie: { maxAge: 3600000,secure: false, httpOnly: true }
}))

app.use(bodyParser.urlencoded({extended: true}));         // use bodyparser
const db = require('./databases/postgres.js')             // database stuff

// get and post routing
app.get(['/', '/login', '/signup', '/reviews', '/tos', '/home', '/reviewpage/:bookid', '/profile', '/usertags', '/userlists', '/userratings'], routes)
app.post(['/', '/login', '/signup', '/reviews', '/home', '/addbook', '/reviewpage/:bookid', '/ratebook', '/submittier', '/addwish', '/addliked', '/adddisliked', '/submitlists', '/submitstars', '/submittldr', '/votetldr', '/analysebook'], routes)

// send db information
app.get('/allusernames', (req, res) => {
    const query = 'SELECT username FROM users;';
  
    db.query(query, (error, result) => {
      if (error) {
        console.error('Error occurred:', error);
        res.status(500).send('An error occurred while retrieving data from the database.');
      } else {
        const results = result.rows;
        res.json(results);
      }
    });
});

app.get('/alltags', (req, res) => {
  const query = 'SELECT id, name FROM tags;';

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const results = result.rows;
      res.json(results);
    }
  });
});

app.get('/allbooks', (req, res) => {
  const query = 'SELECT id, isbn, title, tags, stars, teaser, author, minage FROM books;';

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const results = result.rows;
      res.json(results);
    }
  });
});

app.get('/allreviews', (req, res) => {

  const query = 'SELECT id, username, date, title, stars, body, book FROM reviews;';

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const results = result.rows;
      res.json(results);
    }
  });
});


app.get('/allauthors', (req, res) => {
  const query = 'SELECT author FROM books;';

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const results = result.rows;
      res.json(results);
    }
  });
});

app.get('/alltldrs', (req, res) => {
  const query = 'SELECT * FROM tldrbites;';

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const results = result.rows;
      res.json(results);
    }
  });
});

app.get('/allsnas', (req, res) => {
  const query = 'SELECT * FROM sna;';

  db.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const results = result.rows;
      res.json(results);
    }
  });
});

// listen to port
app.listen(port, () => {
    console.log("Backend is listening on port 3000");
})

