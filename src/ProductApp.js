import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Card, Form } from "react-bootstrap";

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ฟังก์ชันดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${collection}/${position}`);
      const sortedProducts = response.data.sort((a, b) => a.codeNo.localeCompare(b.codeNo));

      // แปลง timestamp ของ recorded และแสดงราคาเป็นทศนิยม 2 ตำแหน่ง
      const formattedProducts = sortedProducts.map((product) => ({
        ...product,
        price: product.price.toFixed(2),
        recorded: product.recorded?._seconds
          ? formatDateToThai(product.recorded._seconds, product.recorded._nanoseconds)
          : "N/A",
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // เมื่อผู้ใช้กดปุ่มแสดงข้อมูล
  const handleShowProducts = () => {
    fetchProducts();
  };

  // เปิด Modal ของสินค้าเมื่อคลิก Card
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // ฟังก์ชันแก้ไขจำนวนสินค้าและราคา
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${API_BASE_URL}/${collection}/${position}/${selectedProduct.id}`, {
        quantity: selectedProduct.quantity,
        price: selectedProduct.price,
      });
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // ฟังก์ชันลบสินค้า
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${collection}/${position}/${selectedProduct.id}`);
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
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
          <Button variant="primary" onClick={handleShowProducts}>
            Show Products
          </Button>
        </div>
      </div>

      {/* แสดงข้อมูลแบบ Card */}
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-3">
            <Card onClick={() => handleProductClick(product)} style={{ cursor: "pointer" }}>
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

      {/* Modal แก้ไขจำนวนสินค้าและราคา */}
      {selectedProduct && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedProduct.productName}</h5>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={selectedProduct.quantity}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
            <Button variant="primary" onClick={handleUpdateProduct}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default ProductApp;
