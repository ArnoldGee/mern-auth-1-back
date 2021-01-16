const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {type: String, required: true},
  userId: {type: String, required: true},
})

module.exports = Todo = mongoose.model("todo", TodoSchema)