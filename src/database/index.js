const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/codex", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;