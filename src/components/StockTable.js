import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';

const StockTable = () => {
  const [plan, setPlan] = useState("Stock615");
  const [position, setPosition] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!plan || !position) {
      setError("กรุณาเลือก Plan และ Position ก่อนแสดงข้อมูล");
      return;
    }
    setError(null);
    try {
      // ใช้ URL แบบเต็มในการเรียก API
      const response = await axios.get(`https://stock-api-nontawit-nawattanonapp.vercel.app/api/${plan}/${position}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("ไม่สามารถดึงข้อมูลได้");
    }
  };
  

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Stock Management</h2>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="planSelect">
            <Form.Label>Plan:</Form.Label>
            <Form.Control as="select" value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="Stock615">Stock615</option>
              <option value="Stock616">Stock616</option>
              <option value="Stock617">Stock617</option>
              {/* เพิ่ม Plan อื่น ๆ ได้ที่นี่ */}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="positionInput">
            <Form.Label>Position:</Form.Label>
            <Form.Control
              type="text"
              placeholder="เช่น 01"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="primary" onClick={fetchData} disabled={loading}>
            {loading ? "กำลังโหลด..." : "แสดงข้อมูล"}
          </Button>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {data.length > 0 ? (
        <Table striped bordered hover responsive="md" className="mt-3">
          <thead>
            <tr>
              <th>Code No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Recorded</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.codeNo}</td>
                <td>{item.productName}</td>
                <td>{parseFloat(item.price).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>{item.recorded}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        !loading && <Alert variant="info">ไม่มีข้อมูลที่จะแสดง</Alert>
      )}
    </Container>
  );
};

export default StockTable;
