import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = "https://full-stack-cruds.vercel.app";

function App() {
  const [product, setProduct] = useState({
    title: '', price: '', taxes: '', ads: '', discount: '', count: 1, category: ''
  });
  const [products, setProducts] = useState([]); 
  const [total, setTotal] = useState(0);
  const [mood, setMood] = useState('create');
  const [tmpId, setTmpId] = useState('');
  const [search, setSearch] = useState('');
  const [searchMood, setSearchMood] = useState('title');

  useEffect(() => { getProducts(); }, []);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) { console.error("Connection Error"); }
  };

  useEffect(() => {
    const { price, taxes, ads, discount } = product;
    if (price && price > 0) {
      const res = (+price + +taxes + +ads) - +discount;
      setTotal(res);
    } else { setTotal(''); }
  }, [product]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if (product.title !== '' && product.price !== '' && product.category !== '') {
      try {
        if (mood === 'create') {
          await axios.post(`${API_URL}/products`, { ...product, total });
        } else {
          await axios.put(`${API_URL}/products/${tmpId}`, { ...product, total });
          setMood('create');
        }
        setProduct({ title: '', price: '', taxes: '', ads: '', discount: '', count: 1, category: '' });
        getProducts();
      } catch (err) { alert("Server Error! Check Console."); }
    } else { alert("Please fill all fields!"); }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        getProducts();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const deleteAll = async () => {
    if (window.confirm("Delete ALL products?")) {
      try {
        await axios.delete(`${API_URL}/products`);
        getProducts();
      } catch (err) { alert("Delete all failed"); }
    }
  };

  const startUpdate = (item) => {
    setProduct({ ...item, count: 1 });
    setTmpId(item._id);
    setMood('update');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cruds">
      <div className="head">
        <h2>CRUDS</h2>
        <p>PRODUCT MANAGEMENT SYSTEM</p>
      </div>

      <div className="inputs">
        <input onChange={handleChange} value={product.title} id="title" type="text" placeholder="title" />
        <div className="price">
          <input onChange={handleChange} value={product.price} id="price" type="number" placeholder="price" />
          <input onChange={handleChange} value={product.taxes} id="taxes" type="number" placeholder="taxes" />
          <input onChange={handleChange} value={product.ads} id="ads" type="number" placeholder="ads" />
          <input onChange={handleChange} value={product.discount} id="discount" type="number" placeholder="discount" />
          <small id="total" style={{ background: total > 0 ? '#4a0416' : 'rgb(89, 8, 8)' }}>{total || ''}</small>
        </div>
        {mood === 'create' && <input onChange={handleChange} value={product.count} id="count" type="number" placeholder="count" />}
        <input onChange={handleChange} value={product.category} id="category" type="text" placeholder="category" />
        <button onClick={handleSubmit} id="submit">{mood === 'create' ? 'Create' : 'Update'}</button>
      </div>

      <div className="outputs">
        <div className="searchBlock">
          <input onChange={(e) => setSearch(e.target.value)} id="search" type="text" placeholder={`Search By ${searchMood}`} />
          <div className="btnSearch">
            <button onClick={() => setSearchMood('title')}>Search By Title</button>
            <button onClick={() => setSearchMood('category')}>Search By Category</button>
          </div>
        </div>

        {products.length > 0 && (
          <div id="deleteAll">
            <button onClick={deleteAll}>Delete All ({products.length})</button>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>id</th><th>title</th><th>price</th><th>taxes</th><th>ads</th>
              <th>discount</th><th>total</th><th>category</th><th>update</th><th>delete</th>
            </tr>
          </thead>
          <tbody>
            {products.filter(item => {
                 const val = item[searchMood] ? item[searchMood].toString().toLowerCase() : '';
                 return val.includes(search.toLowerCase());
              }).map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.taxes}</td>
                  <td>{item.ads}</td>
                  <td>{item.discount}</td>
                  <td>{item.total}</td>
                  <td>{item.category}</td>
                  <td><button className="update-btn" onClick={() => startUpdate(item)}>update</button></td>
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