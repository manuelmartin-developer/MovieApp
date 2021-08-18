const mongoose = require('../utils/db');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./users_model");
db.role = require("./role_model");

db.ROLES = ["user", "admin"];

module.exports = db;