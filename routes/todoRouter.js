const router = require('express').Router();
const Todo = require('../models/todoModel');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const {title} = req.body;

    // check if the request actually contains a title
    if (!title) {
      return res.status(400).json({msg: 'No title provided for the todo'});
    }

    const newTodo = new Todo({title, userId: req.userId});
    const savedTodo = await newTodo.save();
    res.status(200).json(savedTodo);
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const todos = await Todo.find({userId: req.userId});
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(400).json({msg: 'No todo found with id ' + req.params.id});
    }
    res.status(200).json(deletedTodo);
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});

module.exports = router;
