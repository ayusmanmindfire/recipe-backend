// Static imports
import RatingController from '../controller/ratingController.js';
import RatingModel from '../database/models/ratingModel.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { addRatingSchema } from '../validation/ratingValidation.js';

// Mock the RatingModel
jest.mock('../database/models/ratingModel.js');

//Mock the utility functions
jest.mock('../utils/response.js', () => ({
    errorResponse: jest.fn(),
    successResponse: jest.fn(),
}));

describe('RatingController', () => {
    let controller;
    let req;
    let res;
    let next;

    //Set up before each test
    beforeEach(() => {
        controller = new RatingController();
        req = {
            params: {},
            user: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    // Clear mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test suite for the addRating method
    describe('addRating', () => {

        // Test case for successfully adding a rating
        it('should add a rating and respond with success', async () => {
            req.params.recipeID = 'recipeId123';
            req.user.email = 'user@example.com';
            req.body.rating = 5;
            req.body.feedback = 'Great recipe!';

            RatingModel.findOne.mockResolvedValue(null); // Simulate no existing rating
            RatingModel.create.mockResolvedValue({ recipeID: req.params.recipeID, rating: req.body.rating, feedback: req.body.feedback, createdBy: req.user.email });

            await controller.addRating(req, res, next);

            expect(RatingModel.findOne).toHaveBeenCalledWith({ recipeID: req.params.recipeID, createdBy: req.user.email });
            expect(RatingModel.create).toHaveBeenCalledWith({
                recipeID: req.params.recipeID,
                rating: req.body.rating,
                feedback: req.body.feedback,
                createdBy: req.user.email,
            });
            expect(successResponse).toHaveBeenCalledWith(res, expect.anything(), 'Rating added to the recipe', 201);
        });

        // Test case for when the rating already exists
        it('should return an error if the rating already exists', async () => {
            req.params.recipeID = 'recipeId123';
            req.user.email = 'user@example.com';
            req.body.rating = 5;
            req.body.feedback = 'Great recipe!';

            RatingModel.findOne.mockResolvedValue({}); // Simulate an existing rating

            await controller.addRating(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res, "User already gave ratings for this recipe", 400);
        });

        // Test case for validation failure
        it('should return an error if validation fails', async () => {
            req.params.recipeID = 'recipeId123';
            req.user.email = 'user@example.com';
            req.body.rating = null; // Invalid input for testing validation

            // Mock the validation error
            jest.spyOn(addRatingSchema, 'validate').mockReturnValue({ error: { message: 'Invalid rating' } });

            await controller.addRating(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res, 'Invalid rating', 400);
        });
    });

    // Test suite for the fetchRatingsByRecipeID method
    describe('fetchRatingsByRecipeID', () => {

        // Test case for successfully fetching ratings
        it('should fetch ratings for a specific recipe', async () => {
            req.params.recipeID = 'recipeId123';
            const mockRatings = [{ rating: 5, feedback: 'Great recipe!', createdBy: 'user@example.com' }];

            RatingModel.find.mockResolvedValue(mockRatings); // Mock the ratings returned by the database

            await controller.fetchRatingsByRecipeID(req, res, next);

            expect(RatingModel.find).toHaveBeenCalledWith({ recipeID: req.params.recipeID });
            expect(successResponse).toHaveBeenCalledWith(res, mockRatings, 'Ratings for specific recipe fetched', 200);
        });

        // Test case for handling errors while fetching ratings
        it('should handle errors while fetching ratings', async () => {
            req.params.recipeID = 'recipeId123';
            const errorMessage = 'Database error';

            RatingModel.find.mockRejectedValue(new Error(errorMessage)); // Simulate database error

            await controller.fetchRatingsByRecipeID(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error)); // Pass the error to the next middleware
        });


    });
});
