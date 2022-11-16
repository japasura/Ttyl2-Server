const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const connectionString = process.env.MONGO_URI;

const client = new MongoClient(connectionString, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("Ttyl2");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
