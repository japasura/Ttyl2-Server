const {isValidDate, isObjectEmpty, getType} = require("./helper");
const e = require("express");

module.exports.validateDates = (req, res) => {
    let start_date = req.body.start_date
    let end_date = req.body.end_date
    if (start_date===undefined || end_date===undefined) {
        res.status(400).send("Request need a 'start_date' and 'end_date' (in body).")
        return false
    }
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
        res.status(400).send("Invalid Date Format. Format is 'yyyy-mm-dd'!")
        return false
    }
    return true
}

module.exports.validateEvents = (req, res) => {
    let events = req.body
    if (isObjectEmpty(events)) {
        return true //delete all events case
    }

    for (const i in events) {
        let event = events[i]
        console.log(getType(event))
        if (getType(event)!="Object") {
            res.status(400).send({
               "error": "Request format is array of events: [event1, event2, event3...]. Event format is {start_time: UnixTimeSeconds(int), end_time: UnixTimeSeconds(int), type: string}.",
               "body_sent": events,
               "event_with_error": event,
            })
            return false
        }
        if (!("start_time" in event && "end_time" in event && "type" in event)) {
            res.status(400).send({
                "error": "Request format is array of events: [event1, event2, event3...]. Event format is {start_time: UnixTimeSeconds(int), end_time: UnixTimeSeconds(int), type: string}.",
                "body_sent": events,
                "event_with_error": event,
            })
            return false
        }
    }

    return true
}