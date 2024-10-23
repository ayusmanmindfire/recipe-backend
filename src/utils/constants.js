//Storing valid mime-types for file extensions that can be uploaded
export const validMimeTypes=['image/png','image/jpg','image/jpeg'];

export const constants={
    //Configurations for rate limiting
    rateLimitMessage:"Too many requests from this IP, please try again after 15 minutes",
    maxRequest:1000,
    timeRange: 15 * 60 * 100
}