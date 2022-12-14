const {isObjectEmpty, isValidDate} = require("./helper");
const {validateDates, validateEvents} = require("./validation")

//req: express.request
//res: express.response
const useAuth =(req, res) => {
  var token = req.header("Api-Key")
  if (token !== "hi"){
    res.status(401).send("Fuck off")
    return null
  } else {
    return 1
  }
}


module.exports.getDayData = async function (dbo, req, res) {
  const userId = useAuth(req, res)
  if (!userId){
    return
  }
  if (!validateDates(req, res)) {
    return
  }

  let start_date = req.body.start_date
  let end_date = req.body.end_date
  let query = {
    userId: userId,
    date: {
      $gte: start_date,
      $lte: end_date,
    }
  }
  let data = await dbo.collection("Entries").find(query).toArray()
  res.send(data)
}

module.exports.getEvents = async function (dbo, req, res,) {
  const userId = useAuth(req, res)
  if (!userId){
    return
  }
  var date = req.params["date"];
  if (!isValidDate(date)) {
    res.status(400).send("Invalid Date Format. Format is 'yyyy-mm-dd'!")
    return
  }

  var query = {date: date, userId: userId}
  var data = await dbo.collection("Entries").find(query).toArray();
  if (isObjectEmpty(data)) {
    res.send([])
  } else {
    res.send(data[0]["events"])
  }
};

module.exports.setEvents = async function (dbo, req, res) {
  const userId = useAuth(req, res)
  if (!userId){
    return
  }
  if (!validateEvents(req, res)) {
    return
  }

  var events = req.body
  var date = req.params["date"];
  if (!isValidDate(date)) {
    res.status(400).send("Invalid Date Format. Format is 'yyyy-mm-dd'!")
    return
  }

  var query = {date: date, userId: userId}
  var doc = await dbo.collection("Entries").find(query).toArray();
  if (!isObjectEmpty(doc)) {
    dbo.collection("Entries").updateOne(
        query, {
          $set: {
            events: events
          }
        }
    )
    res.send("Document for "+date+" Updated")
  } else {
    dbo.collection("Entries").insert({
      userId: userId,
      date: date,
      events: events
    })
    res.send("Document for "+date+" Created")
  }
};

module.exports.getAnalytics = async function (dbo, req, res) {
  const userId = useAuth(req, res)
  if (!userId){
    return
  }
  if (!validateDates(req, res)) {
    return
  }

  let start_date = req.body.start_date
  let end_date = req.body.end_date

  let query = {
    userId: userId,
    date: {
      $gte: start_date,
      $lte: end_date,
    }
  }
  let data = await dbo.collection("Entries").find(query).toArray()
  let allEvents = []
  for (const i in data) {
    allEvents.push(...data[i].events)
  }
  let analytics = {}
  for (const i in allEvents) {
    let event  = allEvents[i]
    let type = event.type
    let duration = event.end_time - event.start_time
    if (type in analytics) {
      analytics[type] += duration
    } else {
      analytics[type] = duration
    }
  }
  res.send({
    start_date: start_date,
    end_date: end_date,
    analytics: analytics,
  })
}
