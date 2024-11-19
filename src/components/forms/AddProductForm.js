import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography
} from '@mui/material';

export const AddProductForm = ({ open, onClose, scannedData }) => {
  const [formData, setFormData] = useState({
    productCode: scannedData?.productCode || '',
    shelf: scannedData?.shelf || '',
    planCode: scannedData?.planCode || '',
    name: '',
    price: '',
    quantity: '',
    date: new Date().toLocaleString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleSubmit = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirm = () => {
    console.log('Saving product:', formData);
    setConfirmDialogOpen(false);
    onClose();
  };

  // แยก confirm dialog เป็น component ย่อย
  const ConfirmDialog = () => (
    <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
      <DialogTitle>ยืนยันการบันทึกข้อมูล</DialogTitle>
      <DialogContent>
        <Typography>กรุณาตรวจสอบข้อมูลให้ถูกต้อง</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>รหัสสินค้า: {formData.productCode}</Typography>
          <Typography>ชั้นของสินค้า: {formData.shelf}</Typography>
          <Typography>รหัสแพลนสินค้า: {formData.planCode}</Typography>
          <Typography>ชื่อสินค้า: {formData.name}</Typography>
          <Typography>ราคาสินค้า: {formData.price}฿</Typography>
          <Typography>จำนวนสินค้า: {formData.quantity}</Typography>
          <Typography>วันที่บันทึก: {formData.date}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialogOpen(false)}>ยกเลิก</Button>
        <Button onClick={handleConfirm} variant="contained">ยืนยัน</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="รหัสสินค้า"
                  value={formData.productCode}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="ชั้นของสินค้า"
                  value={formData.shelf}
                  onChange={(e) => setFormData({...formData, shelf: e.target.value})}
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="รหัสแพลนสินค้า"
                  value={formData.planCode}
                  onChange={(e) => setFormData({...formData, planCode: e.target.value})}
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ชื่อสินค้า"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="ราคาสินค้า"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="จำนวนสินค้า"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="วันที่บันทึก"
                  value={formData.date}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained">บันทึก</Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog />
    </>
  );
};