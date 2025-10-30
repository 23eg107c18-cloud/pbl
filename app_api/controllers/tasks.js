const mongoose = require('mongoose');
const Task = mongoose.model('Task');

const sendError = (res, status, message, err=null) => {
  console.error(message, err||'');
  return res.status(status).json({ message, error: err ? err.message || err : undefined });
};

const tasksList = async (req, res) => {
  try {
    const userId = req.session && req.session.userId;
    if (!userId) return sendError(res, 401, 'Authentication required');
    const docs = await Task.find({ owner: userId }).sort({ nextRun: 1 }).lean();
    return res.status(200).json(docs);
  } catch (err) { return sendError(res, 500, 'Error fetching tasks', err); }
};

const tasksCreate = async (req, res) => {
  try {
    const userId = req.session && req.session.userId;
    if (!userId) return sendError(res, 401, 'Authentication required');
    const data = {
      owner: userId,
      title: req.body.title,
      description: req.body.description,
      nextRun: req.body.nextRun ? new Date(req.body.nextRun) : null,
      interval: req.body.interval || null,
      meta: req.body.meta || {}
    };
    const created = await Task.create(data);
    return res.status(201).json(created);
  } catch (err) { return sendError(res, 400, 'Error creating task', err); }
};

const tasksReadOne = async (req, res) => {
  try {
    const id = req.params.taskid;
    if (!mongoose.isValidObjectId(id)) return sendError(res, 400, 'Invalid task id');
  const userId = req.session && req.session.userId;
  if (!userId) return sendError(res, 401, 'Authentication required');
  const doc = await Task.findOne({ _id: id, owner: userId }).lean();
  if (!doc) return sendError(res, 404, 'Task not found or not owned by user');
    return res.status(200).json(doc);
  } catch (err) { return sendError(res, 500, 'Error fetching task', err); }
};

const tasksUpdateOne = async (req, res) => {
  try {
    const id = req.params.taskid;
    if (!mongoose.isValidObjectId(id)) return sendError(res, 400, 'Invalid task id');
    const userId = req.session && req.session.userId;
    if (!userId) return sendError(res, 401, 'Authentication required');
    const update = {
      title: req.body.title,
      description: req.body.description,
      nextRun: req.body.nextRun ? new Date(req.body.nextRun) : null,
      interval: req.body.interval || null,
      meta: req.body.meta || {}
    };
    const updated = await Task.findOneAndUpdate({ _id: id, owner: userId }, update, { new: true, runValidators: true });
    if (!updated) return sendError(res, 404, 'Task not found or not owned by user');
    return res.status(200).json(updated);
  } catch (err) { return sendError(res, 400, 'Error updating task', err); }
};

const tasksDeleteOne = async (req, res) => {
  try {
    const id = req.params.taskid;
    if (!mongoose.isValidObjectId(id)) return sendError(res, 400, 'Invalid task id');
  const userId = req.session && req.session.userId;
  if (!userId) return sendError(res, 401, 'Authentication required');
  const deleted = await Task.findOneAndDelete({ _id: id, owner: userId });
  if (!deleted) return sendError(res, 404, 'Task not found or not owned by user');
    return res.status(204).json({ message: 'Task deleted' });
  } catch (err) { return sendError(res, 500, 'Error deleting task', err); }
};

module.exports = {
  tasksList,
  tasksCreate,
  tasksReadOne,
  tasksUpdateOne,
  tasksDeleteOne
};
