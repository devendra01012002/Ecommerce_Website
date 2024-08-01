const mongoose = require('mongoose');
const Review = require('../model/review');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: 0
    },
    originalprice: {
        type: Number,
        required: true,
        trim: true,
        min: 0
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['mobile', 'laptop', 'mens', 'womens', 'electronics', 'home', 'sports', 'fashion', 'beauty', 'automotive'] // add more categories as needed
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

productSchema.post('findOneAndDelete', async function (product) {
    if (product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});

let Product = mongoose.model('Product', productSchema);
module.exports = Product;
