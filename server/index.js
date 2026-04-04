const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // لازم دي تيجي قبل أي app.get
app.use(cors());
app.use(express.json());

// الصفحة الرئيسية للسيرفر
app.get('/', (req, res) => {
    res.send("Backend Server is Running Successfully! 🚀");
});

const dbURI = "mongodb+srv://admin:1234@cluster0.4wlheaj.mongodb.net/productDB?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log("❌ Conn Error:", err));

const productSchema = new mongoose.Schema({
    title: String, price: Number, taxes: Number, ads: Number, 
    discount: Number, total: Number, category: String
});

const Product = mongoose.model('Product', productSchema);

// 1. Get All
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) { res.status(500).json({error: err.message}); }
});

// 2. Create
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) { res.status(500).json({error: err.message}); }
});

// 3. Delete Single
app.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product Deleted" });
    } catch (err) { res.status(500).json({error: err.message}); }
});

// 4. Delete All
app.delete('/products', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ message: "All Products Deleted" });
    } catch (err) { res.status(500).json({error: err.message}); }
});

// 5. Update
app.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) { res.status(500).json({error: err.message}); }
});

module.exports = app;