// Step 1 import mongoose
import mongoose from "mongoose";

// Step 2 create a schema
const todoSchema = new mongoose.Schema({
    // more professional way

    title: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubTodo'
        }
    ]// Array of subtodos

    // this line will add createdAt and updatedAt
}, {timestamps: true})

// Step 3 export this schema ( create a model)
export const Todo=mongoose.model("Todo",todoSchema)

