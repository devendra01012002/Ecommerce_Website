const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path = require('path');
const seeddb = require('./seed');
const User = require('./model/User');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy=require('passport-local');

const productRoute = require('./routes/product');
const reviewRoute = require('./routes/review');
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');


app.use(methodOverride('_method'))

let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        Expires:Date.now()+24*7*60*60*1000,
        maxAge: 24 * 7 * 60 * 60 * 1000
        
    }
}


app.engine('ejs', ejsMate);   
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session(configSession));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
            
mongoose.connect('mongodb://127.0.0.1:27017/encommerce_holidays')
    .then(() => {   
        console.log("db connection established")
    })    
    .catch((err) => {
        console.log("connection error: " + err);
    })

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



passport.use(new LocalStrategy(User.authenticate()));

// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// })

app.use(productRoute);  // to run at avery incomming request
app.use(reviewRoute);    
app.use(authRoute);
app.use(cartRoute);

// seeding database
// seeddb();


app.listen(8000, (req, res) => {
    console.log("connnection established at port 8000");
})    