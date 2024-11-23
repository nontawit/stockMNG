import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <ul className="flex justify-around">
        <li><Link to="/">หน้าหลัก</Link></li>
        <li><Link to="/add-product">เพิ่มข้อมูลสินค้า</Link></li>
        <li><Link to="/update-product">อัปเดตข้อมูลสินค้า</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
