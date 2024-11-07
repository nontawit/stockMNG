import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Card, Form, Row, Col } from "react-bootstrap";
import { FaPlus } from 'react-icons/fa'; // ใช้ไอคอนบวก

const API_BASE_URL = "https://stock-api-nontawit-nawattanonapp.vercel.app/api";

// ฟังก์ชันแปลง timestamp เป็นวันที่แบบไทย
const formatDateToThai = (seconds, nanoseconds) => {
  const date = new Date(seconds * 1000 + nanoseconds / 1000000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = (date.getFullYear() + 543).toString(); // เพิ่ม 543 เพื่อแสดงปี พ.ศ.
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

function ProductApp() {
  const [collection, setCollection] = useState("Stock615");
  const [position, setPosition] = useState("01");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productForms, setProductForms] = useState([{}]); // เก็บข้อมูลฟอร์มสินค้า
  const [showAddFormModal, setShowAddFormModal] = useState(false); // โมดอลเพิ่มสินค้า

  // ฟังก์ชันดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${collection}/${position}`);
      const sortedProducts = response.data.sort((a, b) => a.codeNo.localeCompare(b.codeNo));

      const formattedProducts = sortedProducts.map((product) => ({
        ...product,
        price: parseFloat(product.price).toFixed(2),
        recorded: product.recorded?._seconds
          ? formatDateToThai(product.recorded._seconds, product.recorded._nanoseconds)
          : "N/A",
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ฟังก์ชันเพิ่มฟอร์มใหม่
  const handleAddForm = () => {
    setProductForms([...productForms, {}]);
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleFormChange = (index, e) => {
    const updatedForms = [...productForms];
    updatedForms[index] = {
      ...updatedForms[index],
      [e.target.name]: e.target.value,
    };
    setProductForms(updatedForms);
  };

  // ฟังก์ชันเพิ่มข้อมูลสินค้า
  const handleAddProducts = async () => {
    try {
      await Promise.all(productForms.map(async (product) => {
        if (product.productID && product.productName && product.price && product.quantity) {
          await axios.post(`${API_BASE_URL}/${collection}/${position}`, {
            codeNo: product.codeNo,
            productID: product.productID,
            productName: product.productName,
            position: position,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity),
          });
        }
      }));

      fetchProducts(); // รีเฟรชข้อมูลหลังการเพิ่มสินค้า
      setShowAddFormModal(false); // ปิดโมดอล
      setProductForms([{}]); // รีเซ็ตฟอร์ม
    } catch (error) {
      console.error("Error adding products:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Stock Management</h2>

      {/* ตัวเลือกแพลนและชั้น */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Form.Select value={collection} onChange={(e) => setCollection(e.target.value)}>
            <option value="Stock615">Stock615</option>
            <option value="Stock616">Stock616</option>
            <option value="Stock617">Stock617</option>
            <option value="Stock618">Stock618</option>
            <option value="Stock619">Stock619</option>
          </Form.Select>
        </div>
        <div className="col-md-4">
          <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
            {[...Array(9)].map((_, i) => (
              <option key={i} value={`0${i + 1}`}>{`0${i + 1}`}</option>
            ))}
          </Form.Select>
        </div>
        <div className="col-md-4">
          <Button variant="primary" onClick={fetchProducts}>
            Show Products
          </Button>
        </div>
      </div>

      {/* ปุ่มเพิ่มสินค้า */}
      <Button variant="success" onClick={() => setShowAddFormModal(true)} style={{ marginBottom: '20px' }}>
        <FaPlus /> Add Product
      </Button>

      {/* แสดงข้อมูลสินค้า */}
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-3">
            <Card style={{ cursor: "pointer" }}>
              <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>Quantity: {product.quantity}</Card.Text>
                <Card.Text>Price: ฿{product.price}</Card.Text>
                <Card.Text className="text-muted" style={{ fontSize: "0.8em" }}>
                  Recorded: {product.recorded}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal เพิ่มสินค้า */}
      <Modal show={showAddFormModal} onHide={() => setShowAddFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productForms.map((form, index) => (
            <div key={index} className="mb-3">
              <h5>Product {index + 1}</h5>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    name="codeNo"
                    placeholder="Code No"
                    value={form.codeNo || ''}
                    onChange={(e) => handleFormChange(index, e)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="productID"
                    placeholder="Product ID"
                    value={form.productID || ''}
                    onChange={(e) => handleFormChange(index, e)}
                  />
                </Col>
              </Row>
              <Form.Control
                type="text"
                name="productName"
                placeholder="Product Name"
                value={form.productName || ''}
                onChange={(e) => handleFormChange(index, e)}
              />
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price || ''}
                    onChange={(e) => handleFormChange(index, e)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity || ''}
                    onChange={(e) => handleFormChange(index, e)}
                  />
                </Col>
              </Row>
            </div>
          ))}
          <Button variant="link" onClick={handleAddForm}>
            Add Another Form
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddFormModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProducts}>
            Save Products
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductApp;
