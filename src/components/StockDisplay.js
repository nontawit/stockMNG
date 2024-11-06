import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function StockDisplay() {
  const [position, setPosition] = useState('');
  const [productID, setProductID] = useState('');
  const [codeNo, setCodeNo] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductID, setEditProductID] = useState('');

  const fetchProducts = async (position) => {
    try {
      const response = await axios.get(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/stock615/${position}`);
      setProducts(Object.entries(response.data).map(([id, data]) => ({ id, ...data })));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      const response = await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/product', {
        position,
        productID,
        codeNo,
        productName,
        price,
        quantity
      });
      alert(response.data);
      fetchProducts(position);
      clearForm();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const addMultipleProducts = async (productsList) => {
    try {
      const response = await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/products', productsList);
      alert(response.data);
      fetchProducts(position);
    } catch (error) {
      console.error('Error adding multiple products:', error);
    }
  };

  const editProduct = async () => {
    try {
      const response = await axios.put(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${editProductID}`, {
        codeNo,
        productName,
        price,
        quantity
      });
      alert(response.data);
      fetchProducts(position);
      setIsEditing(false);
      clearForm();
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const deleteProduct = async (productID) => {
    try {
      const response = await axios.delete(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${productID}`);
      alert(response.data);
      fetchProducts(position);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const clearForm = () => {
    setProductID('');
    setCodeNo('');
    setProductName('');
    setPrice('');
    setQuantity('');
  };

  useEffect(() => {
    if (position) {
      fetchProducts(position);
    }
  }, [position]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Stock Management System</h1>

      <div className="form-group mb-4">
        <label htmlFor="position">Position</label>
        <select className="form-control" id="position" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">Select Position</option>
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
        </select>
      </div>

      <div className="card p-4 mb-5">
        <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
        <form>
          <div className="form-group">
            <label>Product ID</label>
            <input type="text" className="form-control" value={productID} onChange={(e) => setProductID(e.target.value)} disabled={isEditing} />
          </div>
          <div className="form-group">
            <label>Code No</label>
            <input type="text" className="form-control" value={codeNo} onChange={(e) => setCodeNo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary mt-3" onClick={isEditing ? editProduct : addProduct}>
            {isEditing ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </div>

      <div className="table-responsive">
        <h2>Product List</h2>
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Product ID</th>
              <th>Code No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.productID}</td>
                <td>{product.codeNo}</td>
                <td>{product.productName}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="btn btn-warning btn-sm mr-2" onClick={() => { setIsEditing(true); setEditProductID(product.id); setCodeNo(product.codeNo); setProductName(product.productName); setPrice(product.price); setQuantity(product.quantity); }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => addMultipleProducts([
        { position: '01', productID: 'prod1', codeNo: '001', productName: 'Product 1', price: 100, quantity: 10 },
        { position: '01', productID: 'prod2', codeNo: '002', productName: 'Product 2', price: 150, quantity: 20 },
      ])}>
        Add Multiple Products
      </button>
    </div>
  );
}

export default StockDisplay;