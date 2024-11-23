import React from 'react';
import BarcodeScanner from '../components/BarcodeScanner';

const UpdateProduct = () => {
  const handleScan = (barcode) => {
    console.log('ค้นหาสินค้า:', barcode);
    // เรียก API เพื่อดึงข้อมูลสินค้า
  };

  return (
    <div>
      <BarcodeScanner onScan={handleScan} />
    </div>
  );
};

export default UpdateProduct;
