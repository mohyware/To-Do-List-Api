/* eslint-disable */
require('../../../config/configDb');
const mongoose = require('../../../config/configDb');
const server = require('../../../src/app');
const request = require('supertest');
const Task = require('../../../src/Models/Task');
const User = require('../../../src/Models/User');

beforeEach(async () => {
    await Task.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    server.close();
});
jest.setTimeout(10000);

describe('Tasks API', () => {
    const tasksEndpoint = '/api/v1/tasks';
    const registerEndpoint = '/api/v1/auth/register';
    const UserData = {
        name: "mohy",
        email: "mohy@gmail.com",
        password: "secret"
    };
    let userId;
    let token;

    beforeAll(async () => {
        await User.deleteMany({});
        const res = await request(server)
            .post(registerEndpoint)
            .send(UserData);
        token = res.body.token;
        const userName = res.body.user.name;
        const user = await User.findOne({ name: userName });
        userId = user._id;
    });

    beforeEach(async () => {
        await Task.deleteMany({ createdBy: userId });
    });

    describe('Unauthenticated Access (without token)', () => {
        it('should return 401 status since no token sent - POST', async () => {
            const res = await request(server)
                .post(tasksEndpoint)
                .send();
            expect(res.status).toBe(401);
        });

        it('should return 401 status since no token sent - GET', async () => {
            const res = await request(server)
                .get(tasksEndpoint)
                .send();
            expect(res.status).toBe(401);
        });

        it('should return 401 status since no token sent - PATCH', async () => {
            const randomId = new mongoose.Types.ObjectId();
            const res = await request(server)
                .patch(`${tasksEndpoint}/${randomId}`)
                .send();
            expect(res.status).toBe(401);
        });

        it('should return 401 status since no token sent - DELETE', async () => {
            const randomId = new mongoose.Types.ObjectId();
            const res = await request(server)
                .delete(`${tasksEndpoint}/${randomId}`)
                .send();
            expect(res.status).toBe(401);
        });
    });

    describe('POST /tasks', () => {
        it('should create a new task and return 201 status', async () => {
            const data = { title: "task1", description: "desc1" };
            const res = await request(server)
                .post(tasksEndpoint)
                .send(data)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(201);
            expect(res.body.task).toHaveProperty('_id');
            expect(res.body.task.title).toBe(data.title);
        });

        it('should return 400 status since no data sent', async () => {
            const res = await request(server)
                .post(tasksEndpoint)
                .send()
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
        });
    });

    describe('GET /tasks', () => {
        it('should return all tasks (200) for the user', async () => {
            const task1 = { title: "task1", description: "desc1", createdBy: userId };
            const task2 = { title: 'task2', description: 'desc2', createdBy: userId };
            await Task.insertMany([task1, task2]);
            const res = await request(server)
                .get(tasksEndpoint)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 when no tasks exist for this user', async () => {
            const res = await request(server)
                .get(tasksEndpoint)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('GET /task', () => {
        it('should return task by id for the user with a 200 status', async () => {
            const data = { title: "task1", description: "desc1", createdBy: userId };
            const task = await Task.create(data);
            const res = await request(server)
                .get(`${tasksEndpoint}/${task._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 when task does not exist for this user', async () => {
            const randomId = new mongoose.Types.ObjectId();
            const res = await request(server)
                .get(`${tasksEndpoint}/${randomId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /task', () => {
        it('should return updated task by id for the user with a 200 status', async () => {
            const data = { title: "task1", description: "desc1", createdBy: userId };
            const task = await Task.create(data);
            const newData = { title: "newTask1", description: "newDesc1", createdBy: userId };
            const res = await request(server)
                .patch(`${tasksEndpoint}/${task._id}`)
                .send(newData)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 when attempting to update a non-existent task', async () => {
            const randomId = new mongoose.Types.ObjectId();
            const newData = { title: "newTask1", description: "newDesc1", createdBy: userId };
            const res = await request(server)
                .patch(`${tasksEndpoint}/${randomId}`)
                .send(newData)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /task', () => {
        it('should delete task by id for the user with a 200 status', async () => {
            const data = { title: "task1", description: "desc1", createdBy: userId };
            const task = await Task.create(data);
            const res = await request(server)
                .delete(`${tasksEndpoint}/${task._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 when attempting to delete a non-existent task', async () => {
            const randomId = new mongoose.Types.ObjectId();
            const res = await request(server)
                .delete(`${tasksEndpoint}/${randomId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });
});
