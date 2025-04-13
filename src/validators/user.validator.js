import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { isValidObjectId } from "mongoose";


const verifyUser = asyncHandler(async(userId)=>{
    if(!userId){
        throw new ApiError(404, "userId not received")
    }
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"User Id is not valid")
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404,"User not Found")
    }
    return user

    
})

export {
    verifyUser
}