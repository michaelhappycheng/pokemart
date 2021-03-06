/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/



var Sequelize = require('sequelize');
var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Product = db.model('product');
var UserOrders = db.model('userOrders');
var OrderDetails = db.model('orderDetails')
var Review = db.model('review');
var Image = db.model('image');
var fs = require("fs")

var Promise = require('sequelize').Promise;

// OB/SB: consider folder (e.g. `seedData` with a bunch of json files in it)
var seedUsers = function () {

    var images = [];
    for (var i = 1; i < 152; i++) {
        console.log(__dirname)

        var b64str = fs.readFileSync(__dirname + '/public/images/'+ i +'.png').toString("base64");
        var image = new Buffer(b64str, 'base64');


        images.push(image);
    }

    var imgPromises = images.map(img => Image.create({data: img}));

    var users = [
    {
        email: 'testing@fsa.com',
        password: 'password'
    },
    {
        email: 'obama@gmail.com',
        password: 'potus'
    },
    {
        email: 'ross@gmail.com',
        password: 'pivot',
        isAdmin: true
    }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

   var products = require('./products.json').products;

   var creatingProducts = products.map(function (productObj) {
        return Product.create(productObj);
    });

   var reviews = [
    {
        content:'worst pokemon ever' ,
        title:'dont buy',
        rating: 2
    },
    {
        content:'best POKERMON ever',
        title:'I love it',
        rating: 4
   },{
        content:'never like grass type pokemon' ,
        title:'meh',
        rating: 3
    },
    {
        content:'the one no one ever picks',
        title:'no love',
        rating: 2
   }
   ];

    var creatingReviews = reviews.map(function (reviewObj, i) {
        return Review.create(reviewObj)
                .then(function(review) {
                    console.log(i)
                    return review.setAuthor((i%2) + 1)
                }).then(function(review) {
                    return review.setProduct(1);
                })
    });

   return Promise.all(creatingUsers)
            .then(function () {
                return Promise.all(creatingProducts)
            }).then (function() {
                return Promise.all(creatingReviews)
            }).then(function(){
                return Product.findById(1)
                .then(function(product){

                   return product.addToOrder(2,'1')
                })
                .catch(console.error);
            })


};

db.sync({ force: true })
.then(function () {
    return seedUsers();
})
.then(function () {

})
.then(function () {
    console.log(chalk.green('Seed successful!'));
    process.exit(0);
})
.catch(function (err) {
    console.error(err);
    process.exit(1);
});
