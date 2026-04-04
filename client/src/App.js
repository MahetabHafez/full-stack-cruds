import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = "https://full-stack-cruds.vercel.app"; 

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
    } catch (err) { console.error(err); }
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
        if (mood === 'create') {
          const countNumber = parseInt(product.count) || 1;
          for (let i = 0; i < countNumber; i++) {
            await axios.post(`${API_URL}/products`, { ...product, total });
          }
        } else {
          await axios.put(`${API_URL}/products/${tmpId}`, { ...product, total });
          setMood('create');
        }
        setProduct({ title: '', price: '', taxes: '', ads: '', discount: '', count: 1, category: '' });
        getProducts();
        alert("Done! ✅");
      } catch (err) {
        console.error(err);
        alert("Server Error!");
      }
    } else {
      alert("Please fill all fields!");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/products/${id}`); 
        getProducts(); 
      } catch (err) { alert("Delete failed!"); }
    }
  };

  const deleteAll = async () => {
    if (window.confirm("Delete ALL products?")) {
      try {
        await axios.delete(`${API_URL}/products`);
        getProducts(); 
      } catch (err) { alert("Delete All failed!"); }
    }
  };

  const updateProduct = (item) => {
    setProduct({ ...item, count: 1 });
    setTmpId(item._id);
    setMood('update');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(item => {
    if (searchMood === 'title') return item.title.toLowerCase().includes(search.toLowerCase());
    return item.category.toLowerCase().includes(search.toLowerCase());
  });

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
        <input onChange={(e) => setProduct({...product, count: e.target.value})} value={product.count} type="number" placeholder="count" />
        <input onChange={(e) => setProduct({...product, category: e.target.value})} value={product.category} type="text" placeholder="category" />
        <button onClick={handleSubmit} id="submit">{mood === 'create' ? 'Create' : 'Update'}</button>
      </div>
      <div className="outputs">
        <div className="searchBlock">
          <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder={`Search By ${searchMood}`} />
          <div className="btnSearch">
            <button onClick={() => setSearchMood('title')}>Search By Title</button>
            <button onClick={() => setSearchMood('category')}>Search By Category</button>
          </div>
        </div>
        {products.length > 0 && <button onClick={deleteAll} className="delete-all-btn">Delete All ({products.length})</button>}
        <table>
          <thead><tr><th>id</th><th>title</th><th>total</th><th>category</th><th>update</th><th>delete</th></tr></thead>
          <tbody>
            {filteredProducts.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td><td>{item.title}</td><td>{item.total}</td><td>{item.category}</td>
                <td><button onClick={() => updateProduct(item)}>update</button></td>
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