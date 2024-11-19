import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';

export const UpdateStockForm = ({ open, onClose, scannedData }) => {
  const [quantity, setQuantity] = useState('');
  const mockProductData = {
    ...scannedData,
    name: "แชมพูชินติลแดง 180 มล.",
    price: "55.00",
    quantity: "10",
    date: new Date().toLocaleString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  const handleUpdate = () => {
    console.log('Updating stock:', { ...mockProductData, quantity });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>อัพเดทสต๊อกสินค้า</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="รหัสสินค้า"
                value={mockProductData.productCode}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ชั้นของสินค้า"
                value={mockProductData.shelf}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="รหัสแพลนสินค้า"
                value={mockProductData.planCode}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ชื่อสินค้า"
                value={mockProductData.name}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ราคาสินค้า"
                value={mockProductData.price}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="จำนวนสินค้า"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="วันที่บันทึก"
                value={mockProductData.date}
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button onClick={handleUpdate} variant="contained">อัพเดท</Button>
      </DialogActions>
    </Dialog>
  );
};