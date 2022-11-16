const {isObjectEmpty} = require("./helper");

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

module.exports.getDayData = async function (dbo, req, res,) {
  const userId = useAuth(req, res)
  if (!userId){
    return
  }
  var date = req.params["date"];
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

  var events = req.body
  var date = req.params["date"];
  // console.log(events)
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
