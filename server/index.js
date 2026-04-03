const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = "mongodb+srv://admin:1234@cluster0.4wlheaj.mongodb.net/productDB?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log(err));

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    taxes: Number,
    ads: Number,
    discount: Number,
    total: Number,
    category: String
});

const Product = mongoose.model('Product', productSchema);

app.get('/', (req, res) => {
    res.send("Server is running...");
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) { res.status(500).json(err); }
});

app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json(newProduct);
    } catch (err) { res.status(500).json(err); }
});

app.put('/products/:id', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json(err); }
});

app.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json(err); }
});

app.delete('/products', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.json({ message: "All Deleted" });
    } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;