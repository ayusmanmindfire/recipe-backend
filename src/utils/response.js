// Function to send a successful JSON response
export const successResponse=(res,data,message,statusCode=200)=>{
    res.status(statusCode).json({success: true,message:message, data: data})
}

// Function to send an error JSON response
export const errorResponse=(res,message,statusCode=500)=>{
    res.status(statusCode).json({success: false,message:message})
}