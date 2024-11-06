import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  // ฟังก์ชันดึงข้อมูลสินค้าตามตำแหน่ง
  const fetchProducts = async (position) => {
    try {
      const response = await axios.get(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/stock615/${position}`);
      setProducts(Object.entries(response.data).map(([id, data]) => ({ id, ...data })));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ฟังก์ชันเพิ่มสินค้าหนึ่งรายการ
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
      fetchProducts(position); // รีเฟรชข้อมูลหลังจากเพิ่มสินค้า
      clearForm(); // เคลียร์ฟอร์ม
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // ฟังก์ชันเพิ่มสินค้าหลายรายการ
  const addMultipleProducts = async (productsList) => {
    try {
      const response = await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/products', productsList);
      alert(response.data);
      fetchProducts(position); // รีเฟรชข้อมูลหลังจากเพิ่มสินค้า
    } catch (error) {
      console.error('Error adding multiple products:', error);
    }
  };

  // ฟังก์ชันแก้ไขข้อมูลสินค้า
  const editProduct = async () => {
    try {
      const response = await axios.put(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${editProductID}`, {
        codeNo,
        productName,
        price,
        quantity
      });
      alert(response.data);
      fetchProducts(position); // รีเฟรชข้อมูลหลังจากแก้ไขสินค้า
      setIsEditing(false); // ปิดโหมดแก้ไข
      clearForm(); // เคลียร์ฟอร์ม
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  // ฟังก์ชันลบสินค้า
  const deleteProduct = async (productID) => {
    try {
      const response = await axios.delete(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${productID}`);
      alert(response.data);
      fetchProducts(position); // รีเฟรชข้อมูลหลังจากลบสินค้า
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // ฟังก์ชันเคลียร์ฟอร์ม
  const clearForm = () => {
    setProductID('');
    setCodeNo('');
    setProductName('');
    setPrice('');
    setQuantity('');
  };

  useEffect(() => {
    if (position) {
      fetchProducts(position); // ดึงข้อมูลเมื่อ position ถูกตั้งค่า
    }
  }, [position]);

  return (
    <div className="App">
      <h1>Stock Management System</h1>

      {/* เลือกตำแหน่ง (position) */}
      <div>
        <label htmlFor="position">Position: </label>
        <select id="position" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">Select Position</option>
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
          {/* เพิ่มตำแหน่งตามต้องการ */}
        </select>
      </div>

      {/* ฟอร์มสำหรับเพิ่ม/แก้ไขสินค้า */}
      <div>
        <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
        <label>Product ID:</label>
        <input type="text" value={productID} onChange={(e) => setProductID(e.target.value)} disabled={isEditing} />
        <label>Code No:</label>
        <input type="text" value={codeNo} onChange={(e) => setCodeNo(e.target.value)} />
        <label>Product Name:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <label>Quantity:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

        <button onClick={isEditing ? editProduct : addProduct}>
          {isEditing ? 'Save Changes' : 'Add Product'}
        </button>
      </div>

      {/* แสดงข้อมูลสินค้าจาก API */}
      <div>
        <h2>Product List</h2>
        <table>
          <thead>
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
                  <button onClick={() => { setIsEditing(true); setEditProductID(product.id); setCodeNo(product.codeNo); setProductName(product.productName); setPrice(product.price); setQuantity(product.quantity); }}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่มสำหรับเพิ่มสินค้าหลายรายการ */}
      <button onClick={() => addMultipleProducts([
        { position: '01', productID: 'prod1', codeNo: '001', productName: 'Product 1', price: 100, quantity: 10 },
        { position: '01', productID: 'prod2', codeNo: '002', productName: 'Product 2', price: 150, quantity: 20 },
        // เพิ่มรายการตามต้องการ
      ])}>
        Add Multiple Products
      </button>
    </div>
  );
}

export default StockDisplay;