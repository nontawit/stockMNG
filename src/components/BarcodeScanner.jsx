import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const BarcodeScanner = ({ onScan }) => {
  const [data, setData] = useState(null);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">สแกนบาร์โค้ด</h2>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text);
            onScan(result.text);
          } else {
            setData('ไม่พบข้อมูล');
          }
        }}
      />
      <p className="mt-4">ผลลัพธ์: {data}</p>
    </div>
  );
};

export default BarcodeScanner;
