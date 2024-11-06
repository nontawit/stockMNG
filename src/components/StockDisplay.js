import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const StockDisplay = () => {
  const [products, setProducts] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("01");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: "",
    codeNo: "",
    productName: "",
    price: 0,
    quantity: 0,
  });

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้า
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/${selectedPosition}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPosition]);

  // ฟังก์ชันเปิด Modal เพื่อแก้ไขสินค้า
  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่มบันทึกการแก้ไข
  const handleEditSubmit = async () => {
    try {
      const { id, codeNo, productName, price, quantity } = editProduct;

      // อัปเดตข้อมูลสินค้าผ่าน API
      await axios.put(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/${selectedPosition}/${id}`, {
        codeNo,
        productName,
        price,
        quantity
      });

      alert("Product updated successfully.");
      setShowEditModal(false);
      fetchData(); // โหลดข้อมูลใหม่หลังจากอัปเดตเสร็จสิ้น
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div>
      <h2>Stock Display</h2>
      <Form.Select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
        <option value="01">Position 01</option>
        <option value="02">Position 02</option>
        <option value="03">Position 03</option>
        {/* เพิ่มตำแหน่งอื่นๆ ตามต้องการ */}
      </Form.Select>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
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
              <td>{product.codeNo}</td>
              <td>{product.productName}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(product)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Editing Product */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Code No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code number"
                value={editProduct.codeNo}
                onChange={(e) => setEditProduct({ ...editProduct, codeNo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={editProduct.productName}
                onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={editProduct.quantity}
                onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditSubmit}>บันทึก</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StockDisplay;
