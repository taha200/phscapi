const mongoose = require("mongoose");

// connection URI
const mongoURI = "mongodb://<user>:<password>@ds133533.mlab.com:33533/databaseName";
// remove deprecation warning of collection.ensureIndex
mongoose.set('useCreateIndex', true);
// connect to mongodb
mongoose.connect(mongoURI, {useNewUrlParser: true})

module.exports = mongoose;