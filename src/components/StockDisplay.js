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
      const productsArray = JSON.parse(multipleProducts);
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

      {/* Modal for Single Product */}
      <Modal show={showSingleModal} onHide={() => setShowSingleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Single Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
              <Form.Group className="mb-3" controlId={field} key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Enter ${field}`}
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
          <Form.Group controlId="multipleProducts">
            <Form.Label>Enter Products JSON Array</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder='e.g., [{"position": "01", "productID": "500041", "codeNo": "002", "productName": "pd03", "price": 60, "quantity": 5}, ...]'
              value={multipleProducts}
              onChange={(e) => setMultipleProducts(e.target.value)}
            />
          </Form.Group>
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
