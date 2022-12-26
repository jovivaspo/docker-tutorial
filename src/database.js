const mongoose = require("mongoose");

mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/miapp?authSource=admin`
);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Base de datos conectada");
});

module.exports = connection;
