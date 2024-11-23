import React from 'react';
import ProductForm from '../components/ProductForm';
import BarcodeScanner from '../components/BarcodeScanner';

const AddProduct = () => {
  const handleScan = (barcode) => {
    console.log('สแกนบาร์โค้ด:', barcode);
  };

  const handleSubmit = (formData) => {
    console.log('เพิ่มสินค้า:', formData);
  };

  return (
    <div>
      <BarcodeScanner onScan={handleScan} />
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;
