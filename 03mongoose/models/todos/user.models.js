// Step 1 import mongoose
import mongoose from "mongoose";

// Step 2 create a schema
const userSchema = new mongoose.Schema({
    // username: String,
    // email: String,
    // isActive: Boolean

    // more professional way

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    }

    // this line will add createdDate and updatedDate
}, {timestamps: true})

// Step 3 export this schema ( create a model)
export const User=mongoose.model("User",userSchema)

