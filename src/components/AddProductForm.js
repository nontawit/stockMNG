import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import BarcodeScanner from "./BarcodeScanner";
import dayjs from "dayjs";

const AddProductForm = () => {
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState({
    productID: "",
    stock: "",
    shelf: "",
    productName: "",
    price: "",
    quantity: "",
    timestamp: dayjs().format("DD/MM/YYYY HH:mm"),
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
    console.log("Submitted Data:", formData);
  };

  return (
    <Grid container spacing={2}>
      {scanning ? (
        <Grid item xs={12}>
          <BarcodeScanner onDetected={handleBarcodeDetected} />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => setScanning(true)}
            fullWidth
            color="primary"
          >
            สแกนบาร์โค้ด
          </Button>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          label="Product ID"
          value={formData.productID}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Shelf"
          name="shelf"
          value={formData.shelf}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Timestamp"
          value={formData.timestamp}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          บันทึกสินค้า
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddProductForm;
