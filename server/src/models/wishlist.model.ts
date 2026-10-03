import mongoose from "mongoose";


// user , product -> id



// {user:'13' , product:'1' , }
// {user:'123' , product:'123' , } ,
// {user:'3' , product:'123' , } ,
// {user:'13' , product:'1' , }


const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:[true,'User is required']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required:[true,'Product is required']
    }
}, { timestamps: true })


// model
const WishList = mongoose.model('wishlist', wishlistSchema);
export default WishList