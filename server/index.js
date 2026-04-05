const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = "mongodb+srv://admin:1234@cluster0.4wlheaj.mongodb.net/productDB?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log("❌ Conn Error:", err));

const productSchema = new mongoose.Schema({
    title: String, price: Number, taxes: Number, ads: Number, 
    discount: Number, total: Number, category: String
});

const Product = mongoose.model('Product', productSchema);

app.get('/', (req, res) => {
    res.send("Backend Server is Running Successfully! 🚀");
});


app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) { res.status(500).json(err); }
});

app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) { res.status(500).json(err); }
});


app.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product Deleted" });
    } catch (err) { res.status(500).json(err); }
});


app.delete('/products', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ message: "All Products Deleted" });
    } catch (err) { res.status(500).json(err); }
});


module.exports = app; 

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}