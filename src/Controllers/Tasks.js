const Task = require('../Models/Task')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllTasks = async (req, res) => {
  const {
    user: { userId },
    query: { page = 1, limit = 10 },
  } = req
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const total = await Task.countDocuments();

  const tasks = await Task.find({
    createdBy: userId,
  })
    .sort('createdAt')
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  if (tasks.length < 1) {
    throw new NotFoundError(`No Tasks was found for this user`)
  }

  res.status(StatusCodes.OK).json({
    tasks,
    page: pageNum,
    limit: limitNum,
    count: tasks.length,
    total
  });
}
const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req

  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
  })
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`)
  }
  res.status(StatusCodes.OK).json({ task })
}

const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId
  const task = await Task.create(req.body)
  res.status(StatusCodes.CREATED).json({ task })
}

const updateTask = async (req, res) => {
  const {
    body: { title, description },
    user: { userId },
    params: { id: taskId },
  } = req

  if (title === '' || description === '') {
    throw new BadRequestError('title or description fields cannot be empty')
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`)
  }
  res.status(StatusCodes.OK).json({ task })
}

const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req

  const task = await Task.findOneAndDelete({
    _id: taskId,
    createdBy: userId,
  })
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`)
  }
  res.status(StatusCodes.OK).json({ msg: "Task Deleted successfully" })
}

module.exports = {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  getTask,
}
