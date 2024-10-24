//Third party import
import jwt from 'jsonwebtoken';

// Static imports
import UserController from '../controller/userController.js';
import UserModel from '../database/models/UserModel.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { registerUserSchema } from '../validation/userValidation.js';

// Mocking the UserModel
jest.mock('../database/models/UserModel.js');

// Mocking the utility functions
jest.mock('../utils/response.js', () => ({
    errorResponse: jest.fn(),
    successResponse: jest.fn(),
}));

// Mocking JWT
jest.mock('jsonwebtoken');

describe('UserController', () => {
    let userController;
    let req;
    let res;
    let next;

    beforeEach(() => {
        userController = new UserController();
        req = {
            params: {},
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            UserModel.create.mockResolvedValue(req.body);

            await userController.registerUser(req, res, next);

            expect(successResponse)
        });

        it('should return validation error if invalid data is provided', async () => {
            req.body = {
                username: '',
                email: 'invalid-email',
                password: 'short'
            };

            const mockValidation = { error: { message: 'Validation error' } };
            jest.spyOn(registerUserSchema, 'validate').mockReturnValue(mockValidation);

            await userController.registerUser(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Validation error', 400);
        });
    });

    describe('fetchAllUser', () => {
        it('should fetch all users', async () => {
            const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
            UserModel.find.mockResolvedValue(mockUsers);

            await userController.fetchAllUser(req, res, next);

            expect(successResponse).toHaveBeenCalledWith(res, mockUsers, 'All users fetched', 200);
        });
    });

    describe('fetchUserDetailsFromToken', () => {
        it('should fetch user details from the token', async () => {
            req.user = { username: 'testuser', email: 'test@example.com' };

            await userController.fetchUserDetailsFromToken(req, res, next);

            expect(successResponse).toHaveBeenCalledWith(res, req.user, 'User details from token fetched', 200);
        });
    });

    describe('loginUser', () => {
        it('should authenticate user and generate a token', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                username: 'testuser'
            };
            UserModel.findOne.mockResolvedValue(mockUser);

            const mockToken = 'mockToken';
            jwt.sign.mockReturnValue(mockToken);

            await userController.loginUser(req, res, next);

            expect(successResponse).toHaveBeenCalledWith(res, mockToken, 'Token generated', 200);
        });

        it('should return error if email or password is missing', async () => {
            req.body = { email: '' }; // Missing password

            await userController.loginUser(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Provide email and password', 400);
        });

        it('should return error if user is not found', async () => {
            req.body = {
                email: 'notfound@example.com',
                password: 'password123'
            };

            UserModel.findOne.mockResolvedValue(null);

            await userController.loginUser(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res, 'User not found', 404);
        });
    });
});
