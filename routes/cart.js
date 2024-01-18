const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Product = require('../model/Product');
const User = require('../model/User');

// route to see the cart
router.get('/user/cart', isLoggedIn, async(req, res) => {
    let user = await User.findById(req.user._id).populate('cart');
    res.render('cart/cart', { user });
});


// actually adding the product to the cart
router.post('/user/:id/add', isLoggedIn, async function (req, res) {
    let { id } = req.params;
    let userId = req.user._id;
    let product = await Product.findById(id);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
});

module.exports = router;