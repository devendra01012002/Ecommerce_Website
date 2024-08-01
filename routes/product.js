const express = require('express');
const Product = require('../model/Product');
const router = express.Router(); // mini instance or server used bacause app routes a global instance we cannot use it in other files
const Review = require('../model/review');
const { validateProduct, isLoggedIn, isSeller, isProductAuthor}  = require('../middleware');


router.get('/products', isLoggedIn, async (req, res) => {
    const perPage = 8; // Number of products per page
    const page = parseInt(req.query.page) || 1; // Current page number

    try {
        // Fetch the products with pagination
        let products = await Product.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage);

        // Count the total number of products
        const count = await Product.countDocuments();

        // Render the page with the products and pagination data
        res.render('products/index', {
            products,
            current: page,
            pages: Math.ceil(count / perPage) // Total number of pages
        });
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});


//route to get the product of a particular category

router.get('/products/category', async (req, res) => {
    try {
        let { category } = req.query;
        let products = await Product.find({ category });
        res.render('products/category', { products });
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});




// to open form for add the product
router.get('/products/new',isLoggedIn,(req, res)=> {
  
    try {
          res.render('products/new');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });w
    }
})

// to actually add the product
router.post('/products',validateProduct,isLoggedIn ,isSeller, async (req, res) => {
    try {
        let { name, img, price, desc,category,brand,originalprice} = req.body;
        await Product.create({ name, img, price, desc, author:req.user._id, category, brand, originalprice});
        req.flash('success', 'Added Product Successfully');
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})

// to show a particular product

router.get('/products/:id',isLoggedIn, async(req, res) => {
    
    try {
        let { id } = req.params;
        let foundProduct = await Product.findById(id).populate('reviews');
        res.render('products/show', { foundProduct ,msg:req.flash('success')})
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})

router.get('/products/:id/edit', isLoggedIn,isSeller,async (req, res) => {
    
    try {
        let { id } = req.params;
        let foundProduct = await Product.findById(id);
        res.render('products/edit', { foundProduct });
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})

// to actually edit a particular product in db

router.patch('/products/:id',validateProduct,isLoggedIn,isSeller,async (req, res) => {
   
    try {
        let { id } = req.params;

        let { name, img, price, desc, category, brand, originalprice } = req.body;
        await Product.findByIdAndUpdate(id, { name, img, price, desc });
        req.flash('success', 'Edit Product Successfully');
        res.redirect(`/products/${id}`);
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})  

router.delete('/products/:id',isLoggedIn,isSeller,isProductAuthor, async(req, res) => {
   
    try {
        let { id } = req.params;
        // let foundProduct = await Product.findById(id);
        // if (foundProduct.author !== req.user._id) {
        //     req.flash('error', 'you have not authorized to do so');
        //     res.redirect(`/products/${id}`);
        // }
        const product = await Product.findById(id);
        // for (let id of product.reviews) {
        //     await Review.findByIdAndDelete(id);
        // }
        await Product.findByIdAndDelete(id);
        req.flash('success', 'Delete Product Successfully');
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})


module.exports = router;
