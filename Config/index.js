const mongoose = require("mongoose");

// connection URI
const mongoURI = "mongodb://taha:taha123@ds361998.mlab.com:61998/phscwellness";
// remove deprecation warning of collection.ensureIndex
// mongoose.set('useCreateIndex', true);
// connect to mongodb
mongoose.connect(mongoURI)

module.exports = mongoose;