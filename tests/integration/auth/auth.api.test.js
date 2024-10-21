/* eslint-disable */
require('../../../config/configDb')
const mongoose = require('../../../config/configDb')
const server = require('../../../src/app')
const request = require('supertest')
const Task = require('../../../src/Models/Task')
const User = require('../../../src/Models/User')
const { StatusCodes } = require('http-status-codes');

afterAll(async () => {
    await mongoose.disconnect();
    server.close();
})

describe('Register API', () => {
    const registerEndpoint = '/api/v1/auth/register';
    const validUserData = {
        name: "mohy",
        email: "mohy@gmail.com",
        password: "secret"
    };

    beforeEach(async () => {
        await User.deleteMany({});
    })

    it('should return 201 status on successful registration', async () => {
        const res = await request(server)
            .post(registerEndpoint)
            .send(validUserData);

        expect(res.statusCode).toBe(201);
    });

    it('should return the registered user name', async () => {
        const res = await request(server)
            .post(registerEndpoint)
            .send(validUserData);

        expect(res.headers['content-type']).toContain("json");
        expect(res.body.user).toMatchObject({ name: validUserData.name });
    });

    it('should return 400 status for duplicate registration', async () => {
        await request(server).post(registerEndpoint).send(validUserData);
        const res = await request(server).post(registerEndpoint).send(validUserData);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('msg', expect.stringContaining('Duplicate value entered'));
    });

    describe('Validation Errors', () => {
        const errorMessages = {
            name: 'Name is required',
            email: 'Email is required',
            password: 'Password is required',
            invalidEmail: 'Please provide a valid email'
        };

        it('should return 400 status when name is missing', async () => {
            const { email, password } = validUserData;
            const res = await request(server).post(registerEndpoint).send({ email, password });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', errorMessages.name);
        });

        it('should return 400 status when email is missing', async () => {
            const { name, password } = validUserData;
            const res = await request(server).post(registerEndpoint).send({ name, password });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', errorMessages.email);
        });

        it('should return 400 status when password is missing', async () => {
            const { name, email } = validUserData;
            const res = await request(server).post(registerEndpoint).send({ name, email });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', errorMessages.password);
        });

        it('should return 400 status for invalid email format', async () => {
            const invalidEmailData = { name: "mohy", email: "invalidemail", password: "secret" };
            const res = await request(server).post(registerEndpoint).send(invalidEmailData);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', errorMessages.invalidEmail);
        });
    });
});


describe('Login API', () => {
    const registerEndpoint = '/api/v1/auth/register';
    const loginEndpoint = '/api/v1/auth/login';

    const validUserData = {
        name: "mohy",
        email: "mohy@gmail.com",
        password: "secret"
    };

    beforeAll(async () => {
        await request(server)
            .post(registerEndpoint)
            .send(validUserData);
    });

    it('should return a token and user name on successful login', async () => {
        const loginData = {
            email: validUserData.email,
            password: validUserData.password
        };

        const res = await request(server)
            .post(loginEndpoint)
            .send(loginData);

        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toEqual({ name: validUserData.name });
    });

    it('should return 400 status when email is missing', async () => {
        const res = await request(server)
            .post(loginEndpoint)
            .send({ password: validUserData.password });

        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('msg', 'Please provide email and password');
    });

    it('should return 400 status when password is missing', async () => {
        const res = await request(server)
            .post(loginEndpoint)
            .send({ email: validUserData.email });

        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('msg', 'Please provide email and password');
    });

    it('should return 401 status for non-existing user', async () => {
        const invalidUser = {
            email: 'nonexisting@gmail.com',
            password: 'secret'
        };

        const res = await request(server)
            .post(loginEndpoint)
            .send(invalidUser);

        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });

    it('should return 401 status for incorrect password', async () => {
        const invalidCredentials = {
            email: validUserData.email,
            password: 'wrongpassword'
        };

        const res = await request(server)
            .post(loginEndpoint)
            .send(invalidCredentials);

        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });
});
/* 

describe('Login API', () => {
    const registerEndpoint = '/api/v1/auth/register';
    const loginEndpoint = '/api/v1/auth/login';
    const validUserData = {
        name: "mohy",
        email: "mohy@gmail.com",
        password: "secret"
    };

    it('should return 200 status on successful registration', async () => {

         await request(server)
        .post('/api/v1/auth/login')
        .send(data)
    expect(res.statusCode).toBe(200);
            const res = await request(server)
            .post('/api/v1/auth/login')
            .send(data)
        expect(res.statusCode).toBe(200);
    });

    it('send json', async () => {
        const data = { name: "mohy", email: "mohy@gmail.com", password: "secret" }
        const res = await request(server)
            .post('/api/v1/auth/login')
            .send(data)
        expect(res.headers['content-type']).toEqual(expect.stringContaining("json"));
    });

    it('has user name', async () => {
        const data = { name: "mohy", email: "mohy@gmail.com", password: "secret" }
        const res = await request(server)
            .post('/api/v1/auth/login')
            .send(data)
        expect(res.body.user).toEqual({ name: "mohy" })
    });

    it('should send validation err', async () => {
        const data = [
            { name: "mohy", email: "mohy@gmail.com" },
            { name: "mohy" },
            { email: "mohy" },
            {}]

        for (const one of data) {
            const res = await request(server)
                .post('/api/v1/auth/login')
                .send(one)
            expect(res.statusCode).toBe(400);

        }
    });
}); */