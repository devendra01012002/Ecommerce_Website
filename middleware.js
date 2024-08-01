
const { productSchema, reviewSchema } = require('./schema');
const Product = require('./model/Product');

const validateProduct = ( req, res, next ) => {
    let { name, img, price } = req.body;
    const { error } = productSchema.validate({ name, img, price });
    if (error) {
        console.log(error.message);
        return res.render('error',{err: error.message});
    }
    next();
}

const validateReview = ( req, res, next ) => {
    let { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment });
    if (error) {
        console.log(error.message);
        return res.render('error',{ err: error.message});
    }
    next();
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'please login first');
        return res.redirect('/login');
    }
    next();
}
const isSeller = (req, res, next) => {
    if (!req.user.role) {
        req.flash('error', 'You donot have the permissions to do that');
        return res.redirect('/products');
    }
    else if (req.user.role !== 'seller') {
        req.flash('error', 'You donot have the permissions to do that');
        return res.redirect('/products');
    }
    next();
}
const isProductAuthor = async (req, res, next) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    
    if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/products');
    }

    if (!product.author || !product.author.equals(req.user._id)) {
        req.flash('error', 'You are not the authorised User');
        return res.redirect('/products');
    }
    next();
}
const isCartAdded = async (req, res, next) => {
    let { id } = req.params;
    let cart = req.user.cart;
    if (cart.includes(id)) {
        req.flash('error', 'Product already added to cart');
        return res.redirect(`/products/${id}`);
    }
    next();
}
const isWishlistAdded = async (req, res, next) => {
    let { id } = req.params;
    let wishlist = req.user.wishlist;
    if (wishlist.includes(id)) {
        req.flash('error', 'Product already added to wishlist');
        return res.redirect(`/products/${id}`);
    }
    next();
}


module.exports = { validateProduct, validateReview, isLoggedIn ,isSeller,isProductAuthor,
    isWishlistAdded,isCartAdded};

















