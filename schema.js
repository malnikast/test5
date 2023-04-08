const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  todo: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});

module.exports = new mongoose.model("tbd", todoSchema);
