//Native imports
import fs from 'fs';
import path from 'path';

//Third party imports
import express from "express"
import 'dotenv/config'
import cors from "cors";
import swaggerUi from 'swagger-ui-express';

//Static imports
import dbConnect from "./src/database/dbConnect.js";
import userRouter from "./src/routers/userRouter.js"
import recipeRouter from "./src/routers/recipeRouter.js";
import ratingRouter from "./src/routers/ratingRouter.js"
import { errorHandler } from "./src/middleware/errorHandler.js";
import { limiter } from "./src/middleware/rateLimiterConfig.js";
import { cspConfigMiddleware } from './src/middleware/cspConfig.js';

const app = express()
const port = process.env.PORT||3001
app.use(express.json());

//Configure csp header
app.use(cspConfigMiddleware)

//Api hit rate limiter
app.use(limiter);

//Integrate CORS policy
app.use(cors({
  origin:"*"
}));

app.use(express.static('./src/uploads'));

// Load OpenAPI specification
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join('openapi.json'))
);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

dbConnect();
app.use('/user',userRouter);
app.use('/recipes',recipeRouter);
app.use('/ratings',ratingRouter);

//Global error handler
app.use(errorHandler)
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})