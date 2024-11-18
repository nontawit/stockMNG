import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle 
} from '@mui/material';
import BarcodeScanner from '../components/BarcodeScanner';
import { getCurrentThaiDate } from '../utils/dateUtils';

function AddProductForm() {
  const [productData, setProductData] = useState({
    productCode: '',
    shelfLevel: '',
    planCode: '',
    productName: '',
    price: '',
    quantity: '',
    recordDate: getCurrentThaiDate()
  });

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleScan = (barcode) => {
    setProductData(prev => ({
      ...prev,
      productCode: barcode
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setOpenConfirmDialog(true);
  };

  const confirmSubmit = () => {
    // TODO: Implement API call to save product
    console.log('Submitting product:', productData);
    setOpenConfirmDialog(false);
  };

  return (
    <form>
      <BarcodeScanner onDetected={handleScan} />
      
      <TextField
        name="productCode"
        label="รหัสสินค้า"
        value={productData.productCode}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {/* Similar TextField for other fields */}
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
      >
        บันทึกข้อมูล
      </Button>

      <Dialog open={openConfirmDialog}>
        <DialogTitle>ยืนยันข้อมูลสินค้า</DialogTitle>
        <DialogContent>
          {/* Display entered product details for confirmation */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>
            ยกเลิก
          </Button>
          <Button onClick={confirmSubmit} color="primary">
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}

export default AddProductForm;