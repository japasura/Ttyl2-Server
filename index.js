const { getEvents, addEvent, setEvents, getAnalytics, getDayData} = require('./lib/controllers');

const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGO_URI;

const MongoClient = require("mongodb").MongoClient;
const express = require('express');
const bodyParser = require('body-parser')
const logger = require('morgan');
const cors = require('cors');
const {addToken, createUser, login} = require("./lib/auth");


//Mongo DB Connect part
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("Ttyl2");
//---------------------------
    const app = express()
    const port = 80
    app.use(logger("dev"))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cors())

    app.get('/', (req, res) => res.send('Hello World!'))

    app.get('/dayData', function (req, res){
        getDayData(dbo, req, res)
    })

    app.get('/dayData/:date/events', function(req, res) {
        getEvents(dbo, req, res)
    })
    app.post('/dayData/:date/events', function(req, res) {
        setEvents(dbo, req, res)
    })

    app.get('/analytics', function (req, res) {
        getAnalytics(dbo, req, res)
    })

    app.get('/token', function (req, res) {
        const token = addToken()
        res.status(200).send(JSON.stringify({token: token}))
    })

    app.post("/user", (req, res) => {
        createUser(req, res, dbo)
    })

    app.post("/login", (req, res) => {
        login(req, res, dbo)
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

});
