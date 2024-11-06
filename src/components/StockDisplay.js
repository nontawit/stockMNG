import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Card, Row, Col, Table, Spinner, Container } from 'react-bootstrap';

function StockDisplay() {
  const [plan, setPlan] = useState('Stock615');
  const [position, setPosition] = useState('01');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showMultipleModal, setShowMultipleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({ position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' });

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
      setSingleProduct({ position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' });
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
      setMultipleProducts([{ position: '', productID: '', codeNo: '', productName: '', price: '', quantity: '' }]);
    } catch (error) {
      console.error('Error adding products:', error);
      alert('Failed to add products.');
    }
  };

  const handleEditSubmit = async () => {
    try {
      const { position, productID, codeNo, productName, price, quantity } = editProduct;
      await axios.put(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${productID}`, { codeNo, productName, price, quantity });
      alert('Product updated successfully.');
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
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

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const removeProductRow = (index) => {
    setMultipleProducts(multipleProducts.filter((_, i) => i !== index));
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Stock Management</h2>
      
      <Card className="mb-4 p-4 shadow-sm">
        <Row className="mb-3">
          <Col md={6} sm={12} className="mb-3">
            <Form.Group>
              <Form.Label>รหัสแพลน</Form.Label>
              <Form.Select value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="Stock615">Stock615</option>
                <option value="Stock616">Stock616</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6} sm={12} className="mb-3">
            <Form.Group>
              <Form.Label>ชั้น</Form.Label>
              <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
                <option value="01">01</option>
                <option value="02">02</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button className="w-100 mt-2" onClick={fetchData} variant="primary">ดูข้อมูล</Button>
      </Card>

      {loading && <div className="text-center my-4"><Spinner animation="border" /></div>}
      {error && <p className="text-danger text-center">{error}</p>}

      {data.length > 0 && (
        <Table striped bordered hover responsive className="mt-4 text-center">
          <thead className="table-dark">
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>จำนวน</th>
              <th>ราคา (บาท)</th>
              <th>บันทึก</th>
              <th>Actions</th>
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
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEditClick(item)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Row className="mt-4 justify-content-center">
        <Col xs={12} sm={6} md={3} className="mb-2">
          <Button className="w-100" variant="success" onClick={() => setShowSingleModal(true)}>เพิ่มข้อมูล</Button>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-2">
          <Button className="w-100" variant="info" onClick={() => setShowMultipleModal(true)}>เพิ่มชุดข้อมูล</Button>
        </Col>
      </Row>

      {/* Modal for Single Product */}
      <Modal show={showSingleModal} onHide={() => setShowSingleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มข้อมูลสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field === 'price' ? 'ราคา (บาท)' : field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
                  placeholder={`Enter ${field === 'price' ? 'ราคา' : field}`}
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
      <Modal show={showMultipleModal} onHide={() => setShowMultipleModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มชุดข้อมูลสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {multipleProducts.map((product, index) => (
            <Card key={index} className="p-3 mb-3 shadow-sm">
              <Row className="mb-2">
                {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
                  <Col sm={6} key={field}>
                    <Form.Group className="mb-2" controlId={`${field}-${index}`}>
                      <Form.Label>{field === 'price' ? 'ราคา (บาท)' : field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                      <Form.Control
                        type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
                        placeholder={`Enter ${field === 'price' ? 'ราคา' : field}`}
                        value={product[field]}
                        onChange={(e) => handleMultipleProductChange(index, field, e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                ))}
              </Row>
              <Button variant="danger" size="sm" onClick={() => removeProductRow(index)}>Remove</Button>
            </Card>
          ))}
          <Button variant="outline-success" onClick={handleAddProductField}>+ เพิ่มสินค้า</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMultipleModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleMultipleSubmit}>Add Products</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Editing Product */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['position', 'productID', 'codeNo', 'productName', 'price', 'quantity'].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field === 'price' ? 'ราคา (บาท)' : field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
                  placeholder={`Enter ${field === 'price' ? 'ราคา' : field}`}
                  value={editProduct[field]}
                  onChange={(e) => setEditProduct({ ...editProduct, [field]: e.target.value })}
                  disabled={field === 'position' || field === 'productID'} // Disable editing position and productID
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default StockDisplay;
