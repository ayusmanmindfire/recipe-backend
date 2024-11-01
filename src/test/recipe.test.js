// Static imports
import RecipeController from '../controller/recipeController.js';
import RecipeModel from '../database/models/recipeModel.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { newRecipeSchema } from '../validation/recipeValidation.js';

// Mocking the RecipeModel
jest.mock('../database/models/recipeModel.js');

//Mock the utility functions
jest.mock('../utils/response.js', () => ({
    errorResponse: jest.fn(),
    successResponse: jest.fn(),
}));

describe('RecipeController', () => {
    let recipeController;
    let req;
    let res;
    let next;

    beforeEach(() => {
        recipeController = new RecipeController();
        req = {
            params: {},
            user: {},
            body: {},
            query:{},
            file:{
                mimetype: 'image/jpeg',
                filename: 'test-image.jpg'
            }
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

    describe('addNewRecipe', () => {
        it('should add a new recipe successfully', async () => {
            req.user.email = 'user@example.com';
            req.body = {
                title: 'Test Recipe',
                ingredients: ['ingredient1', 'ingredient2'],
                steps: 'Mix everything.',
            };
            req.file = { mimetype: 'image/jpeg', filename: 'test-image.jpg' };

            RecipeModel.create.mockResolvedValue(req.body); // Mock the creation of the recipe

            await recipeController.addNewRecipe(req, res, next);

            expect(successResponse).toHaveBeenCalledWith(res,expect.anything(), 'New recipe added',201);
        });

        it('should return error if no image is provided', async () => {
            req.user.email = 'user@example.com';
            req.body = {
                title: 'Test Recipe',
                ingredients: ['ingredient1', 'ingredient2'],
                steps: 'Mix everything.',
            };
            req.file = null; // No image

            await recipeController.addNewRecipe(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res,'Image file is missing',400);
        });

        it('should return error if validation fails', async () => {
            req.user.email = 'user@example.com';
            req.body = {
                title: '', // Invalid title
                ingredients: ['ingredient1', 'ingredient2'],
                steps: 'Mix everything.',
            };
            req.file = { mimetype: 'image/jpeg', filename: 'test-image.jpg' };

            // Mock validation to simulate error
            jest.spyOn(newRecipeSchema, 'validate').mockReturnValue({ error: { message: 'Invalid title' } });

            await recipeController.addNewRecipe(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res,'Invalid title',400);
        });
    });

    describe('getAllRecipe', () => {
        it('should fetch all recipes with pagination', async () => {
            // Set up query parameters
            req.query = {
                page: '1',
                limit: '2'
            };
            
            // Mock data
            const mockRecipes = [{ title: 'Recipe 1' }, { title: 'Recipe 2' }];
            const mockTotalRecipes = 2;
    
            // Set up mock chain for find().skip().limit()
            const mockChain = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockRecipes)
            };
            RecipeModel.find = jest.fn().mockReturnValue(mockChain);
            RecipeModel.countDocuments = jest.fn().mockResolvedValue(mockTotalRecipes);
    
            // Expected pagination object
            const expectedPagination = {
                totalRecipes: mockTotalRecipes,
                currentPage: 1,
                totalPages: 1,
                limit: 2
            };
    
            // Call the controller method
            await recipeController.getAllRecipe(req, res, next);
    
            // Verify the response
            expect(successResponse).toHaveBeenCalledWith(
                res,
                {
                    recipes: mockRecipes,
                    pagination: expectedPagination
                },
                'All recipes fetched',
                200
            );
        });
    
        it('should use default pagination values when not provided', async () => {
            // No query parameters (should use defaults)
            req.query = {};
            
            const mockRecipes = [{ title: 'Recipe 1' }, { title: 'Recipe 2' }];
            const mockTotalRecipes = 2;
    
            // Set up mock chain for find().skip().limit()
            const mockChain = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockRecipes)
            };
            RecipeModel.find = jest.fn().mockReturnValue(mockChain);
            RecipeModel.countDocuments = jest.fn().mockResolvedValue(mockTotalRecipes);
    
            // Expected pagination object with default values
            const expectedPagination = {
                totalRecipes: mockTotalRecipes,
                currentPage: 1,
                totalPages: 1,
                limit: 8
            };
    
            await recipeController.getAllRecipe(req, res, next);
    
            expect(successResponse).toHaveBeenCalledWith(
                res,
                {
                    recipes: mockRecipes,
                    pagination: expectedPagination
                },
                'All recipes fetched',
                200
            );
        });
    
        it('should handle errors properly', async () => {
            const error = new Error('Database error');
            
            // Set up mock chain that throws an error
            const mockChain = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockRejectedValue(error)
            };
            RecipeModel.find = jest.fn().mockReturnValue(mockChain);
    
            await recipeController.getAllRecipe(req, res, next);
    
            expect(next).toHaveBeenCalledWith(error);
            expect(successResponse).not.toHaveBeenCalled();
        });
    });
    

    describe('getDetailsOfARecipe', () => {
        it('should fetch recipe details by ID', async () => {
            req.params.id = '12345';
            const mockRecipe = { title: 'Recipe 1', ingredients: ['ingredient1'], steps: 'Mix.' };
            RecipeModel.findOne.mockResolvedValue(mockRecipe);

            await recipeController.getDetailsOfARecipe(req, res, next);

            expect(successResponse).toHaveBeenCalledWith(res,expect.anything(),'Details of a recipe fetched',200);
        });

        it('should return error if recipe not found', async () => {
            req.params.id = '12345';
            RecipeModel.findOne.mockResolvedValue(null);

            await recipeController.getDetailsOfARecipe(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res,'Recipe not found',404);
        });
    });

    describe('updateRecipe', () => {
        it('should update a recipe with successResponse', async () => {
            req.params.id = '12345';
            req.user.email = 'user@gmail.com';
            req.body = {
                title: 'Updated Recipe',
                ingredients: ['ingredient1', 'ingredient2'],
                steps: 'Updated steps.',
            };
            req.file = { mimetype: 'image/jpeg', filename: 'updated-image.jpg' };
    
            const existingRecipe = { _id: '12345', createdBy: 'user@gmail.com' };
            const updatedRecipe = { ...existingRecipe, ...req.body, image: 'updated-image.jpg' };
    
            RecipeModel.findOne.mockResolvedValue(existingRecipe);
            RecipeModel.findByIdAndUpdate.mockResolvedValue(updatedRecipe);
    
            await recipeController.updateRecipe(req, res, next);
    
            expect(successResponse)
        });

        it('should return error if user is not the creator', async () => {
            req.params.id = '12345';
            req.user.email = 'anotheruser@example.com';
            const existingRecipe = { createdBy: 'user@example.com' }; // Existing recipe created by another user
            RecipeModel.findOne.mockResolvedValue(existingRecipe);

            await recipeController.updateRecipe(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res,'Not authorized user to update the recipe',409);
        });

        it('should return error if recipe not found', async () => {
            req.params.id = '12345';
            req.user.email = 'user@example.com';
            req.body = {
                title: 'Updated Recipe',
                ingredients: ['ingredient1', 'ingredient2'],
                steps: 'Updated steps.',
            };
            req.file = { mimetype: 'image/jpeg', filename: 'updated-image.jpg' };

            RecipeModel.findOne.mockResolvedValue(null); // Recipe not found

            await recipeController.updateRecipe(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res,'Recipe not found',404);
        });
    });

    describe('deleteRecipe', () => {
        it('should delete a recipe successfully', async () => {
            req.params.id = '12345';
            req.user.email = 'user@example.com';

            const existingRecipe = { createdBy: 'user@example.com' };
            RecipeModel.findOne.mockResolvedValue(existingRecipe);
            RecipeModel.findByIdAndDelete.mockResolvedValue(existingRecipe);

            await recipeController.deleteRecipe(req, res, next);

            expect(successResponse).toHaveBeenCalledWith(res,null,'Recipe deleted successfully',200);
        });

        it('should return error if user is not the creator', async () => {
            req.params.id = '12345';
            req.user.email = 'anotheruser@example.com';
            const existingRecipe = { createdBy: 'user@example.com' };
            RecipeModel.findOne.mockResolvedValue(existingRecipe);

            await recipeController.deleteRecipe(req, res, next);

            expect(errorResponse).toHaveBeenCalledWith(res,'Not authorized user to delete the recipe',409);
        });

        it('should return error if recipe not found', async () => {
            req.params.id = '12345';
            req.user.email = 'user@example.com';

            RecipeModel.findOne.mockResolvedValue(null); // Recipe not found

            await recipeController.deleteRecipe(req, res, next);

            expect(errorResponse)
        });
    });

    describe('searchRecipes', () => {
        it('should fetch all recipes if no search query is provided', async () => {
            req.query.q = ''; // No search query

            const mockRecipes = [{ title: 'Recipe 1' }, { title: 'Recipe 2' }];
            RecipeModel.find.mockResolvedValue(mockRecipes);

            await recipeController.searchRecipes(req, res, next);

            expect(successResponse).toHaveBeenCalledWith(res,expect.anything(),'All recipes fetched',200);
        });

        it('should fetch recipes matching the search query', async () => {
            req.query.q = 'Test'; // Search query
            const mockRecipes = [{ title: 'Test Recipe 1' }, { title: 'Test Recipe 2' }];
            RecipeModel.find.mockResolvedValue(mockRecipes);

            await recipeController.searchRecipes(req, res, next);

            expect(successResponse)
        });
    });
});
