import React, { useState } from 'react';

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    quantity: 0,
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        name="productCode"
        placeholder="รหัสสินค้า"
        className="input-field w-full"
        value={formData.productCode}
        onChange={handleChange}
      />
      <input
        type="text"
        name="productName"
        placeholder="ชื่อสินค้า"
        className="input-field w-full"
        value={formData.productName}
        onChange={handleChange}
      />
      <input
        type="number"
        name="quantity"
        placeholder="จำนวน"
        className="input-field w-full"
        value={formData.quantity}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="ราคา"
        className="input-field w-full"
        value={formData.price}
        onChange={handleChange}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">บันทึก</button>
    </form>
  );
};

export default ProductForm;
