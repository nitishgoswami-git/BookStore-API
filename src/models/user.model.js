import mongoose, { Schema }  from "mongoose";


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
        avatar: {
            type: {
                public_id: String,
                url: String //cloudinary url
            },
            required: true
        },
        password :{
            type: String,
            required: [true, "Password is required"]

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
    if(!this.isModified(password)) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
} )


//comparing password during login
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}



export const User = mongoose.model("User",userSchema)