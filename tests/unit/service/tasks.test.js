
/* eslint-disable */
const Task = require('../../../src/Models/Task');
const taskService = require('../../../src/services/Tasks');
const { BadRequestError, NotFoundError } = require('../../../src/errors');
jest.mock('../../../src/Models/Task');

describe('Task Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTask Service', () => {
        createTask = taskService.createTask;

        const validTaskData = {
            title: 'Test Task',
            description: 'Test Description',
            createdBy: 'user123'
        };

        describe('Successful Creation', () => {
            it('should successfully create a task with valid data', async () => {

                const mockCreatedTask = {
                    _id: 'task123',
                    ...validTaskData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                Task.create.mockResolvedValue(mockCreatedTask);


                const result = await createTask(validTaskData);


                expect(Task.create).toHaveBeenCalledWith(validTaskData);
                expect(Task.create).toHaveBeenCalledTimes(1);
                expect(result).toEqual(mockCreatedTask);
            });

            it('should create task with additional fields', async () => {

                const taskWithExtra = {
                    ...validTaskData,
                    priority: 'high',
                    dueDate: new Date()
                };

                const mockCreatedTask = {
                    _id: 'task123',
                    ...taskWithExtra,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                Task.create.mockResolvedValue(mockCreatedTask);


                const result = await createTask(taskWithExtra);


                expect(Task.create).toHaveBeenCalledWith(taskWithExtra);
                expect(result).toEqual(mockCreatedTask);
            });
        });

        describe('Validation Errors', () => {
            it('should throw BadRequestError for empty body', async () => {

                await expect(createTask({}))
                    .rejects
                    .toThrow(BadRequestError);

                expect(Task.create).not.toHaveBeenCalled();
            });

            it('should throw BadRequestError for null body', async () => {

                await expect(createTask(null))
                    .rejects
                    .toThrow(BadRequestError);

                expect(Task.create).not.toHaveBeenCalled();
            });

            it('should throw BadRequestError for undefined body', async () => {

                await expect(createTask(undefined))
                    .rejects
                    .toThrow(BadRequestError);

                expect(Task.create).not.toHaveBeenCalled();
            });

            it('should throw BadRequestError for empty title', async () => {

                const invalidData = {
                    ...validTaskData,
                    title: ''
                };


                await expect(createTask(invalidData))
                    .rejects
                    .toThrow(BadRequestError);

                expect(Task.create).not.toHaveBeenCalled();
            });

            it('should throw BadRequestError for empty description', async () => {

                const invalidData = {
                    ...validTaskData,
                    description: ''
                };


                await expect(createTask(invalidData))
                    .rejects
                    .toThrow(BadRequestError);

                expect(Task.create).not.toHaveBeenCalled();
            });
        });

        describe('Database Errors', () => {
            it('should handle database connection error', async () => {

                const dbError = new Error('Database connection failed');
                Task.create.mockRejectedValue(dbError);


                await expect(createTask(validTaskData))
                    .rejects
                    .toThrow('Database connection failed');
            });

            it('should handle validation error from database', async () => {

                const validationError = new Error('Validation failed');
                validationError.name = 'ValidationError';
                Task.create.mockRejectedValue(validationError);


                await expect(createTask(validTaskData))
                    .rejects
                    .toThrow('Validation failed');
            });

            it('should handle duplicate key error', async () => {

                const duplicateError = new Error('Duplicate key error');
                duplicateError.code = 11000;
                Task.create.mockRejectedValue(duplicateError);


                await expect(createTask(validTaskData))
                    .rejects
                    .toThrow('Duplicate key error');
            });
        });

        describe('Edge Cases', () => {
            it('should handle very long title and description', async () => {

                const longData = {
                    title: 'a'.repeat(1000),
                    description: 'b'.repeat(5000),
                    createdBy: 'user123'
                };

                const mockCreatedTask = {
                    _id: 'task123',
                    ...longData
                };

                Task.create.mockResolvedValue(mockCreatedTask);


                const result = await createTask(longData);


                expect(result).toEqual(mockCreatedTask);
            });

            it('should handle special characters in title and description', async () => {

                const specialCharsData = {
                    title: '!@#$%^&*()',
                    description: '🎉📝🎯✨',
                    createdBy: 'user123'
                };

                const mockCreatedTask = {
                    _id: 'task123',
                    ...specialCharsData
                };

                Task.create.mockResolvedValue(mockCreatedTask);


                const result = await createTask(specialCharsData);


                expect(result).toEqual(mockCreatedTask);
            });
        });

        describe('Input Sanitization', () => {
            it('should handle whitespace in title and description', async () => {

                const whitespaceData = {
                    title: '  Test Title  ',
                    description: '  Test Description  ',
                    createdBy: 'user123'
                };

                const mockCreatedTask = {
                    _id: 'task123',
                    ...whitespaceData
                };

                Task.create.mockResolvedValue(mockCreatedTask);


                const result = await createTask(whitespaceData);


                expect(Task.create).toHaveBeenCalledWith(whitespaceData);
                expect(result).toEqual(mockCreatedTask);
            });

            it('should handle HTML in title and description', async () => {

                const htmlData = {
                    title: '<h1>Test Title</h1>',
                    description: '<p>Test Description</p>',
                    createdBy: 'user123'
                };

                const mockCreatedTask = {
                    _id: 'task123',
                    ...htmlData
                };

                Task.create.mockResolvedValue(mockCreatedTask);


                const result = await createTask(htmlData);


                expect(Task.create).toHaveBeenCalledWith(htmlData);
                expect(result).toEqual(mockCreatedTask);
            });
        });
    });

    describe('updateTask Service', () => {
        const updateTask = taskService.updateTask

        const mockUserId = 'user123';
        const mockTaskId = 'task123';
        const validTaskData = {
            title: 'Updated Task',
            description: 'Updated Description'
        };


        describe('Successful Updates', () => {
            it('should successfully update a task', async () => {

                const mockTask = {
                    _id: mockTaskId,
                    createdBy: mockUserId,
                    ...validTaskData
                };

                Task.findOne.mockResolvedValue(mockTask);
                Task.findOneAndUpdate.mockResolvedValue(mockTask);


                const result = await updateTask(mockTaskId, mockUserId, validTaskData);


                expect(Task.findOne).toHaveBeenCalledWith({
                    _id: mockTaskId,
                    createdBy: mockUserId
                });
                expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
                    { _id: mockTaskId, createdBy: mockUserId },
                    validTaskData,
                    { new: true, runValidators: true }
                );
                expect(result).toEqual(mockTask);
            });

            it('should update with partial data', async () => {

                const partialUpdate = { title: 'Only Title Update' };
                const mockTask = {
                    _id: mockTaskId,
                    createdBy: mockUserId,
                    title: 'Only Title Update',
                    description: 'Original Description'
                };

                Task.findOne.mockResolvedValue(mockTask);
                Task.findOneAndUpdate.mockResolvedValue(mockTask);


                const result = await updateTask(mockTaskId, mockUserId, partialUpdate);


                expect(result.title).toBe(partialUpdate.title);
            });
        });

        describe('Validation Errors', () => {
            it('should throw BadRequestError for empty body', async () => {

                await expect(updateTask(mockTaskId, mockUserId, {}))
                    .rejects
                    .toThrow(BadRequestError);

                expect(Task.findOne).not.toHaveBeenCalled();
                expect(Task.findOneAndUpdate).not.toHaveBeenCalled();
            });

            it('should throw BadRequestError for empty title', async () => {

                const invalidData = {
                    title: '',
                    description: 'Valid Description'
                };


                await expect(updateTask(mockTaskId, mockUserId, invalidData))
                    .rejects
                    .toThrow(BadRequestError);
            });

            it('should throw BadRequestError for empty description', async () => {

                const invalidData = {
                    title: 'Valid Title',
                    description: ''
                };


                await expect(updateTask(mockTaskId, mockUserId, invalidData))
                    .rejects
                    .toThrow(BadRequestError);
            });
        });

        describe('Not Found Scenarios', () => {
            it('should throw NotFoundError when task does not exist', async () => {

                Task.findOne.mockResolvedValue(null);


                await expect(updateTask(mockTaskId, mockUserId, validTaskData))
                    .rejects
                    .toThrow(NotFoundError);

                expect(Task.findOneAndUpdate).not.toHaveBeenCalled();
            });

            it('should throw NotFoundError when task belongs to different user', async () => {

                Task.findOne.mockResolvedValue(null);


                await expect(updateTask(mockTaskId, 'different-user-id', validTaskData))
                    .rejects
                    .toThrow(NotFoundError);
            });
        });

        describe('Database Errors', () => {
            it('should handle findOne database error', async () => {

                const dbError = new Error('Database connection failed');
                Task.findOne.mockRejectedValue(dbError);


                await expect(updateTask(mockTaskId, mockUserId, validTaskData))
                    .rejects
                    .toThrow('Database connection failed');
            });

            it('should handle findOneAndUpdate database error', async () => {

                const mockTask = {
                    _id: mockTaskId,
                    createdBy: mockUserId
                };
                const dbError = new Error('Update failed');

                Task.findOne.mockResolvedValue(mockTask);
                Task.findOneAndUpdate.mockRejectedValue(dbError);


                await expect(updateTask(mockTaskId, mockUserId, validTaskData))
                    .rejects
                    .toThrow('Update failed');
            });
        });

        describe('Edge Cases', () => {
            it('should handle null body', async () => {

                await expect(updateTask(mockTaskId, mockUserId, null))
                    .rejects
                    .toThrow(BadRequestError);
            });

            it('should handle undefined body', async () => {

                await expect(updateTask(mockTaskId, mockUserId, undefined))
                    .rejects
                    .toThrow(BadRequestError);
            });
        });

        describe('Mock Verification', () => {
            it('should not call findOneAndUpdate if findOne fails', async () => {

                Task.findOne.mockRejectedValue(new Error('Find failed'));


                try {
                    await updateTask(mockTaskId, mockUserId, validTaskData);
                } catch (error) {

                    expect(Task.findOneAndUpdate).not.toHaveBeenCalled();
                }
            });
        });
    });

    describe('getTask Service', () => {
        const getTask = taskService.getTask;

        const mockTask = {
            _id: 'task123',
            createdBy: 'user123',
            title: 'Test Task'
        };


        beforeEach(() => {
            Task.findOne = jest.fn();
        });

        it('should return task when found', async () => {

            Task.findOne.mockResolvedValue(mockTask);
            const taskId = 'task123';
            const userId = 'user123';


            const result = await getTask(taskId, userId);


            expect(result).toEqual(mockTask);
            expect(Task.findOne).toHaveBeenCalledWith({
                _id: taskId,
                createdBy: userId
            });
        });

        it('should throw NotFoundError when task is not found', async () => {

            Task.findOne.mockResolvedValue(null);
            const taskId = 'nonexistent';
            const userId = 'user123';


            await expect(getTask(taskId, userId))
                .rejects
                .toThrow(new NotFoundError(`No Task with id ${taskId}`));

            expect(Task.findOne).toHaveBeenCalledWith({
                _id: taskId,
                createdBy: userId
            });
        });

        it('should throw error when database query fails', async () => {

            const dbError = new Error('Database connection failed');
            Task.findOne.mockRejectedValue(dbError);
            const taskId = 'task123';
            const userId = 'user123';


            await expect(getTask(taskId, userId))
                .rejects
                .toThrow(dbError);

            expect(Task.findOne).toHaveBeenCalledWith({
                _id: taskId,
                createdBy: userId
            });
        });
    });

    describe('getAllTasks Service', () => {
        const getAllTasks = taskService.getAllTasks;

        const mockTasks = [
            { _id: 'task1', createdBy: 'user123', title: 'Task 1', createdAt: new Date('2024-01-01') },
            { _id: 'task2', createdBy: 'user123', title: 'Task 2', createdAt: new Date('2024-01-02') },
            { _id: 'task3', createdBy: 'user123', title: 'Task 3', createdAt: new Date('2024-01-03') }
        ];


        beforeEach(() => {
            Task.find = jest.fn(() => ({
                sort: jest.fn(() => ({
                    skip: jest.fn(() => ({
                        limit: jest.fn()
                    }))
                }))
            }));
        });

        it('should return tasks with default pagination', async () => {

            const userId = 'user123';
            const mockChain = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockTasks)
            };
            Task.find = jest.fn().mockReturnValue(mockChain);


            const result = await getAllTasks(userId);


            expect(result).toEqual(mockTasks);
            expect(Task.find).toHaveBeenCalledWith({ createdBy: userId });
            expect(mockChain.sort).toHaveBeenCalledWith('createdAt');
            expect(mockChain.skip).toHaveBeenCalledWith(0);
            expect(mockChain.limit).toHaveBeenCalledWith(10);
        });

        it('should return tasks with custom pagination', async () => {

            const userId = 'user123';
            const pageNum = 2;
            const limitNum = 5;
            const mockChain = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockTasks)
            };
            Task.find = jest.fn().mockReturnValue(mockChain);


            const result = await getAllTasks(userId, pageNum, limitNum);


            expect(result).toEqual(mockTasks);
            expect(Task.find).toHaveBeenCalledWith({ createdBy: userId });
            expect(mockChain.sort).toHaveBeenCalledWith('createdAt');
            expect(mockChain.skip).toHaveBeenCalledWith(5);
            expect(mockChain.limit).toHaveBeenCalledWith(5);
        });

        it('should throw NotFoundError when no tasks are found', async () => {

            const userId = 'user123';
            const mockChain = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            };
            Task.find = jest.fn().mockReturnValue(mockChain);


            await expect(getAllTasks(userId))
                .rejects
                .toThrow(new NotFoundError('No Tasks was found for this user'));
        });

        it('should throw error when database query fails', async () => {

            const userId = 'user123';
            const dbError = new Error('Database connection failed');
            const mockChain = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockRejectedValue(dbError)
            };
            Task.find = jest.fn().mockReturnValue(mockChain);


            await expect(getAllTasks(userId))
                .rejects
                .toThrow(dbError);
        });

        it('should handle invalid page number by using defaults', async () => {

            const userId = 'user123';
            const invalidPageNum = -1;
            const mockChain = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockTasks)
            };
            Task.find = jest.fn().mockReturnValue(mockChain);


            const result = await getAllTasks(userId, invalidPageNum);


            expect(result).toEqual(mockTasks);
            expect(mockChain.skip).toHaveBeenCalledWith(0);
            expect(mockChain.limit).toHaveBeenCalledWith(10);
        });
    });

    describe('deleteTask', () => {
        const deleteTask = taskService.deleteTask;
        const taskId = '12345';
        const userId = 'user123';

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should delete the task if it exists', async () => {
            const task = { _id: taskId, createdBy: userId };

            Task.findOneAndDelete.mockResolvedValue(task);

            const result = await deleteTask(taskId, userId);

            expect(Task.findOneAndDelete).toHaveBeenCalledWith({
                _id: taskId,
                createdBy: userId,
            });
            expect(result).toEqual(task);
        });

        it('should throw NotFoundError if task does not exist', async () => {
            Task.findOneAndDelete.mockResolvedValue(null);

            await expect(deleteTask(taskId, userId)).rejects.toThrow(
                new NotFoundError(`No Task with id ${taskId}`)
            );

            expect(Task.findOneAndDelete).toHaveBeenCalledWith({
                _id: taskId,
                createdBy: userId,
            });
        });
    });

});