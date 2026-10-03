import mongoose from "mongoose";

// user -> user id
// items -> [{product -> id , quantity:number },{product -> id , quantity:number }]

const cartSchema = new mongoose.Schema(
  {
    // user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    // items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "product is required"],
            },
            quantity: {
                type: Number,
                required: [true, 'quantity is required'],
                min:[1,'quantity cannot be less than 1']
          }
      },
        ],
    
    total_amount:Number
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
export default Cart;