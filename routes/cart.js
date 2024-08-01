const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Product = require('../model/Product');
const User = require('../model/User');
const {isCartAdded} = require('../middleware');
const {isWishlistAdded} = require('../middleware');

// route to see the cart
router.get('/user/cart', isLoggedIn, async(req, res) => {
    let user = await User.findById(req.user._id).populate('cart');
    res.render('cart/cart', { user });
});



// actually adding the product to the cart
router.post('/user/:id/add', isLoggedIn, isCartAdded, async function (req, res) {
    let { id } = req.params;
    let userId = req.user._id;
    let product = await Product.findById(id);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
});
// route to remove item from cart

router.delete('/user/remove/:productId', isLoggedIn, async (req, res) => {
    let userId = req.user._id;
    let productId = req.params.productId;
    try {
        // Find the user and remove the product from the wishlist array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: productId } },
            { new: true }
        );
        req.flash('success', 'Product Removed From Cart');
        res.redirect('/user/cart');
    } catch (error) {
        res.status(500).json({ error: 'Error removing product from wishlist' });
    }
});

// to show the wishlist
router.get('/user/wishlist', isLoggedIn, async(req, res) => {
    let user = await User.findById(req.user._id).populate('wishlist');
    res.render('cart/wishlist', { user });
});

// to actually add the wishlist
router.post('/user/:id/addwishlist', isLoggedIn, isWishlistAdded, async function (req, res) {
    let { id } = req.params;
    let userId = req.user._id;
    let product = await Product.findById(id);
    let user = await User.findById(userId);
    user.wishlist.push(product);
    await user.save();
    res.redirect('/user/wishlist');
});

// route to remove item from wishlist

router.delete('/user/removeWishlist/:productId', isLoggedIn, async (req, res) => {
    let userId = req.user._id;
    let productId = req.params.productId;
    try {
        // Find the user and remove the product from the wishlist array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: productId } },
            { new: true }
        );
        req.flash('success', 'Product Removed From Wishlist');
        res.redirect('/user/wishlist');
    } catch (error) {
        res.status(500).json({ error: 'Error removing product from wishlist' });
    }
});
module.exports = router;