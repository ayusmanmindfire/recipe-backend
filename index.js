import express from "express"
import 'dotenv/config'
import dbConnect from "./src/database/dbConnect.js";
import userRouter from "./src/routers/userRouter.js"
import recipeRouter from "./src/routers/recipeRouter.js"
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express()
const port = process.env.PORT||3001
app.use(express.json());

dbConnect();
app.use('/user',userRouter);
app.use('/recipes',recipeRouter);

app.use(errorHandler)
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})