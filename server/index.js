const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = "mongodb+srv://admin:123@cluster0.4wlheaj.mongodb.net/productDB?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected"))
    .catch(err => console.log("❌ Conn Error:", err));

const productSchema = new mongoose.Schema({
    title: String, price: Number, taxes: Number, ads: Number, 
    discount: Number, total: Number, category: String
});

const Product = mongoose.model('Product', productSchema);

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) { res.status(500).json({error: err.message}); }
});

app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) { res.status(500).json({error: err.message}); }
});



module.exports = app;