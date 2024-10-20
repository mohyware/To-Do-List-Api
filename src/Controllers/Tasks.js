const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const taskService = require('../services/Tasks');
const getAllTasks = async (req, res) => {
  const {
    user: { userId },
    query: { page = 1, limit = 10 },
  } = req;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const tasks = await taskService.getAllTasks(userId, pageNum, limitNum);
  const total = tasks.length;
  if (total < 1) {
    throw new NotFoundError('No Tasks was found for this user');
  }

  res.status(StatusCodes.OK).json({
    tasks,
    page: pageNum,
    limit: limitNum,
    count: tasks.length,
    total
  });
};
const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  const task = await taskService.getTask(taskId, userId);
  res.status(StatusCodes.OK).json({ task });
};

const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const {
    body: { title, description },
    user: { userId },
  } = req;
  const task = await taskService.createTask({ title, description, createdBy: userId });
  res.status(StatusCodes.CREATED).json({ task });
};

const updateTask = async (req, res) => {
  const {
    body: { title, description, status },
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await taskService.updateTask(taskId, userId, { title, description, status });
  res.status(StatusCodes.OK).json({ task });
};

const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  await taskService.deleteTask(taskId, userId);
  res.status(StatusCodes.OK).json({ msg: 'Task Deleted successfully' });
};

module.exports = {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  getTask,
};
