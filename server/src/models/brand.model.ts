import mongoose  from "mongoose";

const brandSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, 'name is required' ],
        unique: [true, 'brand already exists with given name'],
        trim:true,
    },
    description: {
        type:String,
        trim:true,

    },
    image: {
        type: {
            path:String,
            public_id:String
        },
        required: [true, 'image is required'],
    }
}, {
    timestamps:true
})

const Brand = mongoose.model('brand', brandSchema)
export default Brand;