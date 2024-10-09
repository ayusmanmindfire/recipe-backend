export const successResponse=(res,data,message,statusCode=200)=>{
    res.status(statusCode).json({success: true,message:message, data: data})
}
export const errorResponse=(res,message,statusCode=500)=>{
    res.status(statusCode).json({success: false,message:message})
}