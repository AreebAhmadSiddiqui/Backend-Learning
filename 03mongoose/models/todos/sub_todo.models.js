// Step 1 import mongoose
import mongoose from "mongoose";

// Step 2 create a schema
const subTodoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    isComplete:{
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

    // this line will add createdDate and updatedDate
}, {timestamps: true})

// Step 3 export this schema ( create a model)
export const SubTodo=mongoose.model("SubTodo",subTodoSchema)

