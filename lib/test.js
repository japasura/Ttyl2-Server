var MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGO_URI;

// MongoClient.connect(url, async function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("Ttyl2");
//   var myobj = { name: "Ria", id: "001" };
//   var res = await dbo.collection("Entries").find({}).toArray();
//   console.log(res);
// });

async function main() {
  const client = new MongoClient(url);
  try {
    await client.connect()
    const db = client.db("Ttyl2")
    var res = await db.collection("Entries").findOne()
    console.log("Hi");
  } catch (e) {
    console.log(e)
  } finally {
    client.close()
  }
}