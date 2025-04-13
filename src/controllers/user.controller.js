import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)

        const AccessToken = await user.generateAccessToken()
        const RefreshToken = await user.generateRefreshToken()

        user.refreshToken = RefreshToken
        await user.save({validateBeforeSave:false})
        
        return {AccessToken, RefreshToken}


    }catch(err){
        console.log(err)

        throw new ApiError(500,"Some went wrong while generating Refresh and Access Token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // 1. Extract user details from the request body
    // 2. Validate the user details
    // 3. Check if the email already exists in the database
    // 4. If it exists, throw an error
    // 5. Create a new user in the database
    // 6. Send a success response with the user details

    const { firstname, lastname, email, password, address = ""} = req.body ;

    // console.log(address)

    if (
        [firstname, lastname, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, "User already exists");
    }

    const createdUser = await User.create({
        firstname,
        lastname,
        email,
        password,
        address
    });

    if (!createdUser) {
        throw new ApiError(400, "Something went wrong while creating the user");
    }

    const newUser = await User.findById(createdUser._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(
            201,
            newUser,
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler ( async(req,res)=>{
    // 1. Extract email and password from the request body
    // 2. Validate the email and password
    // 3. Check if the user exists in the database
    // 4. If not, throw an error
    // 5. Check if the password is correct
    // 6. If not, throw an error
    // 7. Generate a JWT token
    // 8. Send a success response with the user details and token

    const {email, password} = req.body

    if(!(email||password)){
        throw new ApiError(400,"All Fields are Required")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(400,"User Not Found")
    }

    const isValid = await user.isPasswordCorrect(password)
    if(!isValid){
        throw new ApiError(400,"Password is Incorrect")
    }

    const { AccessToken , RefreshToken } = await generateAccessAndRefreshToken(user._id)

    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("AccessToken",AccessToken,options)
    .cookie("RefreshToken",RefreshToken,options)
    .json(
            new ApiResponse(200,
                {
                    user: LoggedInUser,AccessToken,RefreshToken
                },
                "User logged In Successfully"
            )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    // 1. Find the user by ID
    // 2. Clear the refresh token from the user document
    // 3. Clear cookies
    // 4. Send a success response

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.refreshToken = undefined;
    await user.save();

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(200)
        .clearCookie("RefreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );
});

const refreshAccessToken = asyncHandler(async (req,res)=>{
    // 1. Extract the refresh token from the request
    // 2. If the refresh token is not present, throw an error
    // 3. Verify the refresh token
    // 4. If the token is invalid, throw an error
    // 5. Find the user by ID
    // 6. If the user is not found, throw an error
    // 7. If the refresh token does not match, throw an error
    // 8. Generate a new access token and refresh token
    // 9. Send a success response with the new tokens

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

   try {
     const decodedToken  = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
     const user = await User.findById(decodedToken?._id)
 
     if (!user){
         throw new ApiError(401, "Invalid Refresh Token")
 
     }
 
     if (incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401, "Refresh is Expired or Used")
     }
     
     const options = {
         httpOnly:true,
         secure: true
     }
 
     const {newAccessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id)
     return res
     .status(200)
     .cookie("AccessToken",newAccessToken,options)
     .cookie("RefreshToken",newRefreshToken,options)
     .json(
         new ApiResponse(
             200,
             {
                 newAccessToken, RefreshToken: newRefreshToken
             },
             "Access Token Refreshed"
         )
     )
   } catch (error) {
    
    console.log(error)
    throw new ApiError(401, "Invalid RefreshToken")
   }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
}



