//Third party import
import rateLimit from "express-rate-limit";

//Static imports
import { constants } from "../utils/constants.js";

export const limiter = rateLimit({
    windowMs: constants.timeRange, // 15 minutes
    max: constants.maxRequest, // Limit each IP to 100 requests per windowMs
    message: constants.rateLimitMessage,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});