const mongoose = require('mongoose');
const Product = require('./model/Product');



const products = [
    {
        name: 'iphone 14 pro',
        img:'https://images.unsplash.com/photo-1697898706719-bce6e007c817?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price: 140000,
        desc:"very costly",
    },
    {
        name: 'MacBook 2',
        img: 'https://images.unsplash.com/photo-1552939262-125eef3f2ddb?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price: 220000,
        desc: "aukat ke bahar",
    },
    {
        name: 'ipod',
        img: 'https://images.unsplash.com/photo-1581825874621-9ccf3f1aa273?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        price: 1400,
        desc: "awesome Product",
    }
]
async function  seeddb() {
    await Product.insertMany(products)
    .then((products) => {
        console.log("data seeded successfully");
    })
        .catch((err) => {
            console.log("error: " + err);
    })
}

module.exports = seeddb;