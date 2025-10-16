import mongoose ,{Schema} from 'mongoose'


const subscriptionSchema = new Schema({
    subscriber:{ // on who is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: { // the one whom user is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const Subscription = mongoose.model('Subscription',subscriptionSchema)