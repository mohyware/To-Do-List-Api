/* eslint-disable */
const mongoose = require('../../config/configDb')
const server = require('../../src/app')
const request = require('supertest')

afterAll(async () => {
    await mongoose.disconnect();
    server.close();
})

jest.setTimeout(10000);


describe('Other APIS', () => {

    describe('Not Found', () => {
        it('Should return not fount 404', async () => {
            const res = await request(server)
                .post(`/api/v1/otherEndpoint`)
            expect(res.statusCode).toBe(404);
        })
    });
    describe('Swagger Docs', () => {
        it('should respond with 200 status code', async () => {
            const response = await request(server).get('/');
            expect(response.statusCode).toBe(200);
        });

        it('should return HTML content type', async () => {
            const response = await request(server).get('/');
            expect(response.headers['content-type']).toMatch(/html/);
        });
    });

});