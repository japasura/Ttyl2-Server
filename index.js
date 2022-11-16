const { getDayData, addEvent, setEvents, getAnalytics} = require('./lib/controllers');

const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGO_URI;

var MongoClient = require("mongodb").MongoClient
const express = require('express');
const bodyParser = require('body-parser')
var logger = require('morgan');

//Mongo DB Connect part
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Ttyl2");
//----------------------------

    const app = express()
    const port = 3000
    app.use(logger("dev"))

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

    app.get('/', (req, res) => res.send('Hello World!'))
    app.get('/dayData/:date/events', function(req, res) {
        getDayData(dbo, req, res)
    })
    app.post('/dayData/:date/events', function(req, res) {
        setEvents(dbo, req, res)
    })
    app.get('/analytics', function (req, res) {
        getAnalytics(dbo, req, res)
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

});
