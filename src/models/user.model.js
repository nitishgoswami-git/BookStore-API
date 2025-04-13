import mongoose, { Schema }  from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            required : true,
            unique: true,
            lowercase: true,
            trim : true,
            index : true
        },
        lastname:{
            type: String,
            required : true,
            unique: true,
            lowercase: true,
            trim : true,
            index : true
        },
        email: {
            type: String,
            required : true,
            unique: true,
            lowercase: true,
            trim : true,
        },
        password :{
            type: String,
            required: [true, "Password is required"]

        },
        address : {
            type: String,
        }, 
        role:{
            type:String,
            enum : ['admin','user'],
            default : 'user'
        },
        refreshToken : {
            type: String
        }

    },
    {
        timestamps: true
    }
);

//hashing user password before saving using hooks
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
} )


//comparing password during login
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
    {
        _id : this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema)