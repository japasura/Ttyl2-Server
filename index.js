const { getDayData, addEvent, setEvents, getAnalytics} = require('./lib/controllers');

const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGO_URI;

const MongoClient = require("mongodb").MongoClient;
const express = require('express');
const bodyParser = require('body-parser')
const logger = require('morgan');
const cors = require('cors');


//Mongo DB Connect part
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("Ttyl2");
//----------------------------

    const app = express()
    const port = 3000
    app.use(logger("dev"))

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cors())

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
