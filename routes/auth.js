const express = require('express');
const User = require('../model/User');
const router = express.Router();
const passport=require('passport');

router.get('/', (req, res) => {
    res.render('lending');
})

router.get('/register', function (req, res) {
    res.render('auth/signup');
})
router.post('/register', async (req, res) => {
   try {
       let { username, email, password , role } = req.body;
       let newuser = new User({ username, email ,role });
       let nayabanda = await User.register(newuser, password);
       console.log(nayabanda);
       // res.redirect('/login');// ye sahi nhi hai kyoki usse firse credentials bharne pdenge signup se sidhe home page pe jaane ke lie hm niche wala kam karenge 
       req.login(nayabanda, function (err) {
           if (err) {
               return next(err);
           };
           req.flash('success', `WELCOME ${nayabanda.username} you are successfully registered`)
           res.redirect('/products');
       })
   } catch (e) {
       req.flash('error', e.message);
       return res.redirect('/register');
   }
})
router.get('/login', (req, res) => {
    res.render('auth/login');
})
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureMessage:true
    }),
    (req, res) => {
        req.flash('success', 'welcome back');
        res.redirect('/products');
    });
router.post('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success','Successfully logged out')
        res.redirect('/login');
    })
});
module.exports = router;