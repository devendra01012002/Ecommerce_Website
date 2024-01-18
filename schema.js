//schema for your server side validation

const joi = require('joi');

// Step 1 - initialize with required conditions

const productSchema = joi.object({
    name: joi.string().required(),
    img: joi.string().required(),
    price:joi.string().min(0).required(),
})

const reviewSchema = joi.object({
    rating: joi.string().min(0).max(5).required(),
    comment:joi.string().required()
})
module.exports = { productSchema, reviewSchema }