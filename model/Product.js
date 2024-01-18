const mongoose = require('mongoose');
const Review=require('../model/review');

const productSchema = new mongoose.Schema({
    name: {
        required: true,
        type: 'string',
        trim:true,
    },
    img: {
        type: 'string',
        required: true,
        trim:true
    },
    price:{
        type: 'number',
        required: true,
        trim: true,
        min:0
    },
    desc: {
        type: 'string',
        trim: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
         }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

//middleware that behind the scencs mongodb operation karwane par use hote hai and iske andar pre and post middleware hote hain which are 
// basically used over the schema and before the model is js class.

productSchema.post('findOneAndDelete',async function (product) {
    if (product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
})

let Product = mongoose.model('Product', productSchema);
module.exports = Product;
       