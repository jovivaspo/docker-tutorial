const { Schema, model } = require("mongoose");

const Animal = new Schema({
  type: String,
  state: String,
});

module.exports = model("Animal", Animal);
