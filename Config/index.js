const mongoose = require("mongoose");

// connection URI
const mongoURI = "mongodb+srv://admin:admin@cluster0-egdam.mongodb.net/test?retryWrites=true&w=majority";
// remove deprecation warning of collection.ensureIndex
// mongoose.set('useCreateIndex', true);
// connect to mongodb
mongoose.connect(mongoURI)

module.exports = mongoose;