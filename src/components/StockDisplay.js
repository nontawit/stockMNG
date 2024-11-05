import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Card, Row, Col, Table, Spinner } from 'react-bootstrap';

function StockDisplay() {
  const [plan, setPlan] = useState('Stock615');
  const [position, setPosition] = useState('01');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showMultipleModal, setShowMultipleModal] = useState(false);
  const [singleProduct, setSingleProduct] = useState({ position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' });
  const [multipleProducts, setMultipleProducts] = useState([{ position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' }]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/${plan}/${position}`);
      const sortedData = Object.entries(response.data)
        .map(([key, value]) => ({ productID: key, ...value }))
        .sort((a, b) => a.codeNo.localeCompare(b.codeNo));
      setData(sortedData);
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
      await axios.post('https://stock-api-nontawit-nawattanonapp.vercel.app/api/products', multipleProducts);
      alert('Products added successfully.');
      fetchData();
      setShowMultipleModal(false);
    } catch (error) {
      console.error('Error adding products:', error);
      alert('Failed to add products.');
    }
  };

  const handleAddProductField = () => {
    setMultipleProducts([...multipleProducts, { position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' }]);
  };

  const handleMultipleProductChange = (index, field, value) => {
    const updatedProducts = multipleProducts.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setMultipleProducts(updatedProducts);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Stock Management</h2>
      
      <Card className="mb-4 p-4 shadow-sm">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Plan</Form.Label>
            <Form.Select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="Stock615">Stock615</option>
              <option value="Stock616">Stock616</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Position</Form.Label>
            <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="01">01</option>
              <option value="02">02</option>
            </Form.Select>
          </Col>
        </Row>
        <Button className="w-100 mt-2" onClick={fetchData} variant="primary">ดูข้อมูล</Button>
      </Card>

      {loading && <Spinner animation="border" />}
      {error && <p className="text-danger">{error}</p>}

      {data.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>จำนวน</th>
              <th>ราคา (บาท)</th>
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
        </Table>
      )}

      <div className="d-flex justify-content-between mt-4">
        <Button className="btn btn-success" onClick={() => setShowSingleModal(true)}>เพิ่มข้อมูล</Button>
        <Button className="btn btn-info" onClick={() => setShowMultipleModal(true)}>เพิ่มชุดข้อมูล</Button>
      </div>

      {/* Modal for Single Product */}
      <Modal show={showSingleModal} onHide={() => setShowSingleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Single Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={singleProduct[field]}
                  onChange={(e) => setSingleProduct({ ...singleProduct, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
          </Form>
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
          {multipleProducts.map((product, index) => (
            <Card key={index} className="p-3 mb-3 shadow-sm">
              {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
                <Form.Group key={field} className="mb-2">
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    type="text"
                    value={product[field]}
                    onChange={(e) => handleMultipleProductChange(index, field, e.target.value)}
                  />
                </Form.Group>
              ))}
            </Card>
          ))}
          <Button variant="outline-success" onClick={handleAddProductField}>+ เพิ่มสินค้า</Button>
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
