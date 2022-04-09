const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

class Item {
    constructor(name, amount, totalPrice) {
        this.name = name;
        this.amount = amount;
        this.totalPrice = totalPrice * amount;
    }
}

class Person {
    constructor(name) {
        this.name = name;
        this.items = [];
    }
}

const hasNumber = /\d/;
var data = [];
var sameName = false;
var sameItemName = false;


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.render("person", {
        data: data
    });
});

app.post("/", function(req, res) {
    data.forEach(element => {
        if (element.name.toLowerCase() === req.body.persName.toLowerCase()) {
            sameName = true;
        }
    });

    if (req.body.persName != '' &&
        !hasNumber.test(req.body.persName) && !sameName) {
        const addPers = new Person(req.body.persName);
        data.push(addPers);
    }

    sameName = false;
    res.redirect('/');
});

app.get("/items", function(req, res) {
    res.render("items", {
        data: data
    });
});

app.post("/items", function(req, res) {
    data.forEach(pers => {
        if (pers.name === req.body.customerName) {
            pers.items.forEach(function(item) {
                if (item.name.toLowerCase() === req.body.itemName.toLowerCase()) {
                    sameItemName = true;
                    item.totalPrice = item.totalPrice / item.amount;
                    item.amount += parseInt(req.body.amount);
                    item.totalPrice = item.totalPrice * item.amount;
               
                };
            })
        }
    });
    if (req.body.itemName != '' &&
        !hasNumber.test(req.body.itemName) && !sameItemName) {
        const addItem = new Item(req.body.itemName, parseInt(req.body.amount), parseInt(req.body.itemPrice));
        data.forEach(function(pers) {
            if (pers.name === req.body.customerName) {
                pers.items.push(addItem);
            }
        });
    }

    sameItemName = false;
    res.redirect('/items');
});

app.get('/splitter', function(req, res) {
    let bill = 0;

    data.forEach(function(pers) {
        let total = 0;
        pers.items.forEach(function(item) {
            total += item.totalPrice;
        });
        pers.totalBill = total;
    });

    data.forEach(function(pers) {
        bill += pers.totalBill;
    });

    res.render('splitter', {
        data: data,
        bill: bill
    });
});

app.post("/splitter", function(req, res) {
    data = [];
    sameName = false;
    sameItemName = false;
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});