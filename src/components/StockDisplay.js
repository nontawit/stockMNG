import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Col, Row, Table, Container } from 'react-bootstrap';

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
        .sort((a, b) => a.codeNo.localeCompare(b.codeNo)); // เรียงข้อมูลตาม codeNo
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

  const handleMultipleChange = (index, field, value) => {
    const updatedProducts = multipleProducts.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    setMultipleProducts(updatedProducts);
  };

  const addProductRow = () => {
    setMultipleProducts([...multipleProducts, { position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' }]);
  };

  const removeProductRow = (index) => {
    setMultipleProducts(multipleProducts.filter((_, i) => i !== index));
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Stock Management</h2>
      <Row className="mb-3">
        <Col md={6} sm={12}>
          <Form.Group>
            <Form.Label>Plan Code</Form.Label>
            <Form.Select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="Stock615">Stock615</option>
              <option value="Stock616">Stock616</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6} sm={12}>
          <Form.Group>
            <Form.Label>Position</Form.Label>
            <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="01">01</option>
              <option value="02">02</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" className="w-100 mb-4" onClick={fetchData}>View Data</Button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {data.length > 0 && (
        <Table responsive striped bordered hover className="text-center">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price (Baht)</th>
              <th>Recorded</th>
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

      <Row className="mt-4">
        <Col>
          <Button variant="success" className="w-100" onClick={() => setShowSingleModal(true)}>
            Add Single Product
          </Button>
        </Col>
        <Col>
          <Button variant="success" className="w-100" onClick={() => setShowMultipleModal(true)}>
            Add Multiple Products
          </Button>
        </Col>
      </Row>

      {/* Modal for Multiple Products */}
      <Modal show={showMultipleModal} onHide={() => setShowMultipleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Multiple Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {multipleProducts.map((product, index) => (
            <div key={index} className="border p-3 mb-3">
              <Row className="g-3">
                {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
                  <Col sm={6} key={field}>
                    <Form.Group controlId={`${field}-${index}`}>
                      <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={`Enter ${field}`}
                        value={product[field]}
                        onChange={(e) => handleMultipleChange(index, field, e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                ))}
              </Row>
              <Button variant="danger" className="mt-3" onClick={() => removeProductRow(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addProductRow}>Add Another Product</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMultipleModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleMultipleSubmit}>Add Products</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default StockDisplay;
