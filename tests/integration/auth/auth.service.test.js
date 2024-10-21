/* eslint-disable */
require('../../../config/configDb');
const authService = require('../../../src/services/auth');
const User = require('../../../src/Models/User')
const mongoose = require('../../../config/configDb')




afterAll(async () => {
    await mongoose.disconnect();
});

describe('User Service', () => {
    const validUserData = {
        name: "mohy",
        email: "mohy@gmail.com",
        password: "secret"
    };

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('createUser', () => {
        // Clean up the database before each test
        it('should create a user successfully', async () => {
            await authService.createUser(validUserData);

            const allUsers = await User.find({});
            expect(allUsers.length).toBe(1);
            expect(allUsers[0]).toMatchObject(validUserData);
        });
    });

    describe('getUserByEmail', () => {
        it('should retrieve a user by email', async () => {
            await authService.createUser(validUserData);

            const user = await authService.getUser(validUserData.email);
            expect(user).toMatchObject(validUserData);
        });

        it('should return null if user does not exist', async () => {
            const user = await authService.getUser('nonexistent@gmail.com');
            expect(user).toBeNull();
        });
    });

});
