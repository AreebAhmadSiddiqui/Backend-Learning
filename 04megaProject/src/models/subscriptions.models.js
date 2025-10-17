import mongoose ,{Schema} from 'mongoose'

// Iski kahani samjho
// ek banda aya user1 aur wo subscribe kiya channel1 ko
// to aisa structure bana {subscriber: user1, channel: channe1} aise hi bahut sare documents banenge ( hame jab bhi koi count karna hoga (subscriber ka ya fir maine kis kis ko subscribe kiya) to ham ye documents ko count kar lenge)
// Isse ham wo array of subcribers banane se bach jaenge
// ( array wali approach ek user ke multiple subscribers ho sakte hai (array of subscriber))
// Lekin khud socho millions of subscriber bhi to hote hai to db operations costly honge
// Doosra ye bhi agar mujhe ye pata lagana ho ki maine kis kis channel ko subscriber kar rkha hai to band baj jaegi search karte karte

const subscriptionSchema = new Schema({
    subscriber:{ // one who is subscribing 
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: { // the one whom user is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const Subscription = mongoose.model('Subscription',subscriptionSchema)