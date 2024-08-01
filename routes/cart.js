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
router.get('/user/wishlist', isLoggedIn, async(req, res) => {
    let user = await User.findById(req.user._id).populate('wishlist');
    res.render('cart/wishlist', { user });
});


// route to remove item from cart

router.delete('/user/remove/:cartId', isLoggedIn, async (req, res) => {
    let userId = req.user._id;
    let cartId = req.params.cartId;
    let user = await User.findByIdAndUpdate(userId, { $pull: { cart: { _id: cartId } } });
    res.redirect('/user/cart');
});

// route to remove item from wishlist

router.delete('/user/removeWishlist/:cartId', isLoggedIn, async (req, res) => {
    let userId = req.user._id;
    let cartId = req.params.cartId;
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: { _id: cartId } } });
    res.redirect('/user/wishlist');
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
router.post('/user/:id/addwishlist', isLoggedIn, async function (req, res) {
    let { id } = req.params;
    let userId = req.user._id;
    let product = await Product.findById(id);
    let user = await User.findById(userId);
    user.wishlist.push(product);
    await user.save();
    res.redirect('/user/wishlist');
});

module.exports = router;