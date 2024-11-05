import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function StockDisplay() {
  const [plan, setPlan] = useState('Stock615');
  const [position, setPosition] = useState('01');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showMultipleModal, setShowMultipleModal] = useState(false);
  const [singleProduct, setSingleProduct] = useState({ position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' });
  const [multipleProducts, setMultipleProducts] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/${plan}/${position}`);
      setData(Object.entries(response.data).map(([key, value]) => ({ productID: key, ...value })));
    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSingleSubmit = async () => {
    try {
      await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/product', singleProduct);
      alert('Product added successfully.');
      fetchData();
      setShowSingleModal(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  const handleMultipleSubmit = async () => {
    try {
      const productsArray = JSON.parse(multipleProducts); // Expects JSON array input for multiple products
      await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/products', productsArray);
      alert('Products added successfully.');
      fetchData();
      setShowMultipleModal(false);
    } catch (error) {
      console.error('Error adding products:', error);
      alert('Failed to add products.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Stock Management</h2>
      <div className="mb-4">
        <label>รหัสแพลน</label>
        <select className="form-select" value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="Stock615">Stock615</option>
          <option value="Stock616">Stock616</option>
        </select>
      </div>
      <div className="mb-4">
        <label>ชั้น</label>
        <select className="form-select" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="01">01</option>
          <option value="02">02</option>
        </select>
      </div>
      <button className="btn btn-primary mb-4" onClick={fetchData}>ดูข้อมูล</button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {data.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>จำนวน</th>
              <th>ราคา(บาท)</th>
              <th>บันทึก</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.productID}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{parseFloat(item.price).toFixed(2)}</td>
                <td>{new Date(item.recorded._seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn btn-success me-2" onClick={() => setShowSingleModal(true)}>เพิ่มข้อมูล</button>
      <button className="btn btn-success" onClick={() => setShowMultipleModal(true)}>เพิ่มชุดข้อมูล</button>

      {/* Modal for Single Product */}
      <Modal show={showSingleModal} onHide={() => setShowSingleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Single Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
              <div key={field} className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={singleProduct[field]}
                  onChange={(e) => setSingleProduct({ ...singleProduct, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSingleModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSingleSubmit}>Add Product</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Multiple Products */}
      <Modal show={showMultipleModal} onHide={() => setShowMultipleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Multiple Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control mb-3"
            rows="5"
            placeholder='Enter products as JSON array, e.g., [{"position": "01", "productID": "500041", "codeNo": "002", "productName": "pd03", "price": 60, "quantity": 5}, ...]'
            value={multipleProducts}
            onChange={(e) => setMultipleProducts(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMultipleModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleMultipleSubmit}>Add Products</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StockDisplay;
