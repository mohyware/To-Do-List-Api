const Task = require('../Models/Task');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllTasks = async (userId, pageNum, limitNum) => {
  const tasks = await Task.find({
    createdBy: userId,
  })
    .sort('createdAt')
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);
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
  if (!body.title || !body.description) {
    throw new BadRequestError('you should provide title and description');
  }
  if (body.title === '' || body.description === '') {
    throw new BadRequestError('title or description fields cannot be empty');
  }
  const task = await Task.create(body);
  return task;
};

const updateTask = async (taskId, userId, body) => {
  if (!body.title || !body.description) {
    throw new BadRequestError('you should provide title and description');
  }
  if (body.title === '' || body.description === '') {
    throw new BadRequestError('title or description fields cannot be empty');
  }
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    body,
    { new: true, runValidators: true }
  );
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`);
  }
  return task;
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