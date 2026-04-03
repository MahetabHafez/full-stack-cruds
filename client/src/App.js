import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = "https://full-stack-cruds-copv.vercel.app"; 

function App() {
  const [product, setProduct] = useState({ title: '', price: '', taxes: '', ads: '', discount: '', count: 1, category: '' });
  const [products, setProducts] = useState([]); 
  const [total, setTotal] = useState(0);
  const [mood, setMood] = useState('create');
  const [tmpId, setTmpId] = useState('');
  const [search, setSearch] = useState('');
  const [searchMood, setSearchMood] = useState('title');

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { getProducts(); }, []);

  useEffect(() => {
    const { price, taxes, ads, discount } = product;
    if (price && price > 0) {
      setTotal((+price + +taxes + +ads) - +discount);
    } else { setTotal(''); }
  }, [product]);

  const handleSubmit = async () => {
    if (product.title && product.price && product.category) {
      try {
        await axios.post(`${API_URL}/products`, { ...product, total });
        setProduct({ title: '', price: '', taxes: '', ads: '', discount: '', count: 1, category: '' });
        getProducts();
      } catch (err) { 
        alert("Error: " + (err.response?.data?.message || err.message));
        console.log(err);
      }
    } else { alert("Fill all fields!"); }
  };

const deleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
        try {
           
            await axios.delete(`${API_URL}/products/${id}`); 
            getProducts(); 
        } catch (err) {
            console.error("Delete Error:", err);
            alert("Delete failed!");
        }
    }
};



  const deleteAll = async () => {
    if (window.confirm("Are you sure you want to delete ALL products?")) {
        try {
            await axios.delete(`${API_URL}/products`);
            getProducts(); 
        } catch (err) {
            alert("Error: Delete All failed!");
        }
    }
};

  return (
    <div className="cruds">
      <div className="head"><h2>CRUDS</h2><p>PRODUCT MANAGEMENT SYSTEM</p></div>
      <div className="inputs">
        <input onChange={(e) => setProduct({...product, title: e.target.value})} value={product.title} type="text" placeholder="title" />
        <div className="price">
          <input onChange={(e) => setProduct({...product, price: e.target.value})} value={product.price} type="number" placeholder="price" />
          <input onChange={(e) => setProduct({...product, taxes: e.target.value})} value={product.taxes} type="number" placeholder="taxes" />
          <input onChange={(e) => setProduct({...product, ads: e.target.value})} value={product.ads} type="number" placeholder="ads" />
          <input onChange={(e) => setProduct({...product, discount: e.target.value})} value={product.discount} type="number" placeholder="discount" />
          <small id="total">{total || '0'}</small>
        </div>
        <input onChange={(e) => setProduct({...product, category: e.target.value})} value={product.category} type="text" placeholder="category" />
        <button onClick={handleSubmit} id="submit">Create</button>
      </div>
      <div className="outputs">
        {products.length > 0 && <button onClick={deleteAll} style={{background:'#500018', color:'#fff', marginBottom:'10px'}}>Delete All ({products.length})</button>}
        <table>
          <thead><tr><th>id</th><th>title</th><th>total</th><th>category</th><th>delete</th></tr></thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td><td>{item.title}</td><td>{item.total}</td><td>{item.category}</td>
                <td><button className="delete-btn" onClick={() => deleteProduct(item._id)}>delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;