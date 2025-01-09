const express = require('express');
const session = require('express-session');
const { connectToDb, getDb } = require('./db');
const allRoutes = require('./routes/allRoutes');
const cors = require('cors');

// Init app & middleware

const app = express();

app.use(session({
    secret: 'dsds5s5e4w',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}));

app.use(
    cors({
      origin: 'http://localhost:5173', // Replace with your front-end's URL
      credentials: true // Allow cookies and headers
    })
  );

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Db Connection
var db;
connectToDb((err) => {
    if(!err){
        app.listen(3000, () => {
            console.log('Listening on post 3000.');
        });
        db = getDb();
        app.use(allRoutes(db));
    }
});

app.use(express.json());
app.use(express.urlencoded( { extended: true } )); // To be able to read request object through req.body

module.exports = { app, getDb };


