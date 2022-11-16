// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("Ttyl2");
//   var myobj = { name: "Ria", id: "001" };
//   var res = await dbo.collection("Entries").find({});
//   console.log(res);
// });

const dbo = require("./db_conn");

async function run() {
    dbo.connectToServer(() => {
        const dbConnect = dbo.getDb();

        dbConnect
            .collection("Entries")
            .find({})
            .limit(50)
            .toArray(function (err, result) {
                if (err) {
                    console.log("Error fetching listings!");
                } else {
                    console.log(result);
                }
            });
    });
}
run().catch(console.dir);