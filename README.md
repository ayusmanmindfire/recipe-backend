# Recipe Backend

A simple and powerful backend API for managing recipes, built using Node.js and MongoDB.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JSON Web Token (JWT)

## Features
- **User Authentication and Authorization**: 
  - Users can securely sign up and log in using JWT tokens.
  - Authorization ensures that only authenticated users can create or modify recipes.

- **CRUD Operations for Recipes**:
  - Full support for creating, reading, updating, and deleting recipes.
  - Each recipe contains detailed information such as ingredients, cooking instructions, and more.
  
- **Search and Filter Recipes**:
  - Allows users to search recipes based on keywords, ingredients, and other filters.
  - Makes it easy to find specific types of recipes based on ingredients and title"

- **Ratings and Feedback Management**:
  - Users can rate recipes and leave feedback, helping others decide which recipes to try.
  - User can leave ratings once no duplication is allowed
  
## Prerequisites
Before running this project, make sure you have:
- Node.js installed (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ayusmanmindfire/recipe-backend.git
cd recipe-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/recipe-db
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
```
POST /api/users/register - Register a new user
POST /api/users/login    - Login user
GET /api/users/verify    - Decode user details from token
```

### Recipes
```
GET    /api/recipes                     - Get all recipes
POST   /api/recipes                     - Create a new recipe
GET    /api/recipes/:id                 - Get a specific recipe
PUT    /api/recipes/:id                 - Update a recipe
DELETE /api/recipes/:id                 - Delete a recipe
GET    /api/recipes/search?q=anything   - Search a recipe
```

### Ratings
```
POST    /api/ratings/:recipeID    - Add ratings for a specific recipe
GET    /api/ratings/:recipeID     - Get ratings for a specific recipe
```

### Api docs

```
GET /api/api-docs    - Get swagger api-docs
```

## Development

To run the project in development mode with nodemon and to run tests:
```bash
npm run dev
```

To run tests:
```bash
npm test
```