const express = require('express');
const router = express.Router();
const Review = require('../model/review');
const Product = require('../model/Product');
const {validateReview} = require("../middleware");


router.post('/products/:id/review', validateReview, async(req, res) => {
    try {
        let { rating, comment } = req.body;
        let { id } = req.params;
        console.log(req.body);
        const product = await Product.findById(id);
        const review = new Review({ rating, comment });
        product.reviews.push(review);  
        await review.save();
        await product.save();
        req.flash('success', 'Review saved successfully');
        res.redirect(`/products/${id}`);
    } catch (e) {
        console.log(e.message);
        
    }
})


module.exports = router;