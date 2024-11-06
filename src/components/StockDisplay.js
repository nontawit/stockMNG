import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const StockDisplay = () => {
  const [products, setProducts] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("01");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    position: "",
    productID: "",
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
    setEditProduct({
      position: selectedPosition,
      productID: product.id,
      codeNo: product.codeNo,
      productName: product.productName,
      price: product.price,
      quantity: product.quantity,
    });
    setShowEditModal(true);
  };

  // ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้คลิกปุ่มบันทึกการแก้ไข
  const handleEditSubmit = async () => {
    try {
      const { position, productID, codeNo, productName, price, quantity } = editProduct;

      // ส่งข้อมูลไปที่ API เพื่ออัปเดตสินค้า
      await axios.put(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/product/${position}/${productID}`, {
        codeNo,
        productName,
        price,
        quantity
      });

      alert("Product updated successfully.");
      fetchData(); // โหลดข้อมูลใหม่หลังจากอัปเดต
      setShowEditModal(false); // ปิด Modal
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
        {/* Add more positions as needed */}
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
            {["codeNo", "productName", "price", "quantity"].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field === "price" ? "ราคา (บาท)" : field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === "price" || field === "quantity" ? "number" : "text"}
                  placeholder={`Enter ${field === "price" ? "ราคา" : field}`}
                  value={editProduct[field]}
                  onChange={(e) => setEditProduct({ ...editProduct, [field]: e.target.value })}
                />
              </Form.Group>
            ))}
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
