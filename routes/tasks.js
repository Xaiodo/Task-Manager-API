const express = require('express');
const { Task } = require('../models/task');

const router = express.Router();

router.get('/:group', async (request, response) => {
  const filter = {};
  if (request.params.group) {
    filter.group = request.params.group;
  }

  const tasksList = await Task.find(filter);
  if (!tasksList) {
    response.status(500).json({ success: false });
  }
  response.send(tasksList);
});

router.post('/', async (req, res) => {
  const group = await req.body.group;
  if (!group) res.status(404).json({ message: 'Group can not be empty' });
  else {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      ownerId: req.body.ownerId,
      assignmentTo: req.body.assignmentTo,
      isDone: req.body.isDone,
      group: req.body.group,
    });
    const createdTask = await task.save();
    if (!createdTask) res.status(404).json({ message: 'Task can not be created' });
    else res.send(createdTask);
  }
});

router.put('/:id', async (request, response) => {
  const updatedTask = await Task.findByIdAndUpdate(
    request.params.id,
    {
      title: request.body.title,
      description: request.body.description,
      ownerId: request.body.ownerId,
      assignmentTo: request.body.assignmentTo,
      isDone: request.body.isDone,
      group: request.body.group,
    },
    { new: true },
  );
  if (!updatedTask) {
    response.status(500).json({ success: false, message: 'Task can not be updated' });
  } else response.status(200).json(updatedTask);
});

router.delete('/:id', async (request, response) => {
  try {
    const deletedTask = await Task.findByIdAndRemove(request.params.id);
    if (!deletedTask) {
      response.status(500).json({ success: false, message: 'Task can not be deleted' });
    }
    response.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    response.status(500).json({ success: false, message: 'Task can not be deleted' });
  }
});

module.exports = router;
