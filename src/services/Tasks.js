const Task = require('../Models/Task');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllTasks = async (userId, pageNum, limitNum = 10) => {
  if (pageNum < 1 || !pageNum) {
    pageNum = 1;
  }
  const tasks = await Task.find({
    createdBy: userId,
  })
    .sort('createdAt')
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  if (tasks.length < 1) {
    throw new NotFoundError('No Tasks was found for this user');
  }
  return tasks;
};
const getTask = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`);
  }
  return task;
};

const createTask = async (body) => {
  if (!body || Object.keys(body).length === 0) {
    throw new BadRequestError('you should provide title and description');
  }
  if (body.title === '' || body.description === '') {
    throw new BadRequestError('title or description fields cannot be empty');
  }
  const task = await Task.create(body);
  return task;
};

const updateTask = async (taskId, userId, body) => {
  if (!body || Object.keys(body).length === 0) {
    throw new BadRequestError('you should provide title and description');
  }
  if (body.title === '' || body.description === '') {
    throw new BadRequestError('title or description fields cannot be empty');
  }
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`);
  }
  const updated = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    body,
    { new: true, runValidators: true }
  );
  return updated;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`);
  }
  return task;
};
module.exports = { getTask, createTask, updateTask, deleteTask, getAllTasks };