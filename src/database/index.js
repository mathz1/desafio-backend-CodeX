const mongoose = require("mongoose");
const configuration = require('./config')
require('dotenv/config');

const config = process.env.NODE_ENV === 'test' ? configuration.db.test : configuration.db.develop;

mongoose.connect(config, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.Promise = global.Promise;

module.exports = mongoose;