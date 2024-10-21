/* eslint-disable */
require('../../../config/configDb');
const taskService = require('../../../src/services/Tasks');
const Task = require('../../../src/Models/Task');
const mongoose = require('../../../config/configDb');
const User = require('../../../src/Models/User');

afterAll(async () => {
    await mongoose.disconnect();
});

jest.setTimeout(10000);


describe('Task Service', () => {
    const userData = {
        name: "mohy",
        email: "mohy@gmail.com",
        password: "secret"
    };
    let userId;

    beforeAll(async () => {
        await User.deleteMany({});
        const user = await User.create(userData);
        userId = user._id;
    });

    beforeEach(async () => {
        await Task.deleteMany({ createdBy: userId });
    });

    describe('create task', () => {
        it('should insert a task', async () => {
            const taskData = { title: "task1", description: "desc1", createdBy: userId };
            await taskService.createTask(taskData);

            const tasks = await Task.find({ createdBy: userId });
            expect(tasks.length).toBe(1);
            expect(tasks[0]).toMatchObject(taskData);
        });

        it('should throw an error if title and description are not provided', async () => {
            await expect(taskService.createTask())
                .rejects.toThrow('you should provide title and description');
        });

        it('should throw an error if title or description is empty', async () => {
            const invalidData = { title: "", description: "", createdBy: userId };
            await expect(taskService.createTask(invalidData))
                .rejects.toThrow('title or description fields cannot be empty');
        });
    });

    describe('read tasks', () => {
        it('should return all tasks for a user', async () => {
            const taskData1 = { title: "task1", description: "desc1", createdBy: userId };
            const taskData2 = { title: "task2", description: "desc2", createdBy: userId };
            await taskService.createTask(taskData1);
            await taskService.createTask(taskData2);

            const tasks = await taskService.getAllTasks(userId);
            expect(tasks.length).toBe(2);
            expect(tasks).toEqual(expect.arrayContaining([
                expect.objectContaining(taskData1),
                expect.objectContaining(taskData2)
            ]));
        });
        it('should throw an error if no tasks was found for this user', async () => {
            await expect(taskService.getAllTasks(userId))
                .rejects.toThrow('No Tasks was found for this user');
        });
    });

    describe('read task', () => {
        it('should return one tasks for a user', async () => {
            const taskData = { title: "task1", description: "desc1", createdBy: userId };
            await taskService.createTask(taskData);

            const tasks = await Task.find({ createdBy: userId });
            expect(tasks.length).toBe(1);
            expect(tasks[0]).toMatchObject(taskData);
        });
        it('should throw an error if no task with the provided ID is found', async () => {
            const randomId = new mongoose.Types.ObjectId();
            await expect(taskService.getTask(randomId, userId))
                .rejects.toThrow('No Task with id');
        });
    });

    describe('update task', () => {
        it('should update a task successfully', async () => {
            const taskData = { title: "task1", description: "desc1", createdBy: userId };
            const task = await taskService.createTask(taskData);

            const updatedData = { title: "updated task", description: "updated desc" };
            const updatedTask = await taskService.updateTask(task._id, userId, updatedData);

            expect(updatedTask).toMatchObject({ ...updatedData, createdBy: userId });
        });

        it('should throw an error if title or description is empty on update', async () => {
            const taskData = { title: "task1", description: "desc1", createdBy: userId };
            const task = await taskService.createTask(taskData);

            const emptyData = { title: "", description: "", createdBy: userId };
            await expect(taskService.updateTask(task._id, userId, emptyData))
                .rejects.toThrow('title or description fields cannot be empty');
        });

        it('should throw an error if no title or description is provided on update', async () => {
            const taskData = { title: "task1", description: "desc1", createdBy: userId };
            const task = await taskService.createTask(taskData);

            await expect(taskService.updateTask(task._id, userId, {}))
                .rejects.toThrow('you should provide title and description');
        });

        it('should throw an error if no task with the provided ID is found', async () => {
            const randomId = new mongoose.Types.ObjectId();
            const updateData = { title: "task", description: "desc" };

            await expect(taskService.updateTask(randomId, userId, updateData))
                .rejects.toThrow('No Task with id');
        });
    });

    describe('delete task', () => {
        it('should delete a task successfully', async () => {
            const taskData = { title: "task1", description: "desc1", createdBy: userId };
            const task = await taskService.createTask(taskData);

            await taskService.deleteTask(task._id, userId);

            const tasks = await Task.find({ createdBy: userId });
            expect(tasks.length).toBe(0);
        });

        it('should throw an error if no task with the provided ID is found', async () => {
            const randomId = new mongoose.Types.ObjectId();
            await expect(taskService.deleteTask(randomId, userId))
                .rejects.toThrow('No Task with id');
        });
    });
});
