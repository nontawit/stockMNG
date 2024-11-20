import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import BarcodeScanner from "./BarcodeScanner";

const UpdateProductForm = () => {
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState({
    productID: "",
    stock: "100",
    shelf: "A1",
    productName: "Product Example",
    price: "50",
    quantity: "",
    timestamp: "20/11/2024 10:00",
  });

  const handleBarcodeDetected = (code) => {
    setFormData((prev) => ({ ...prev, productID: code }));
    setScanning(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Updated Data:", formData);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", textAlign: "left" }}>
      {scanning ? (
        <BarcodeScanner onDetected={handleBarcodeDetected} />
      ) : (
        <Button variant="contained" onClick={() => setScanning(true)} fullWidth>
          สแกนบาร์โค้ด
        </Button>
      )}
      <TextField
        label="Product ID"
        value={formData.productID}
        InputProps={{ readOnly: true }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Stock"
        value={formData.stock}
        InputProps={{ readOnly: true }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Shelf"
        value={formData.shelf}
        InputProps={{ readOnly: true }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Product Name"
        value={formData.productName}
        InputProps={{ readOnly: true }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Price"
        value={formData.price}
        InputProps={{ readOnly: true }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Quantity"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        อัปเดตสินค้า
      </Button>
    </Box>
  );
};

export default UpdateProductForm;
