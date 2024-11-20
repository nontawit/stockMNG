import React, { useEffect } from "react";
import Quagga from "quagga";

const BarcodeScanner = ({ onDetected }) => {
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment", // ใช้กล้องหลัง
          },
        },
        decoder: {
          readers: ["ean_reader"], // สำหรับอ่านบาร์โค้ดแบบ EAN
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data) => {
      const code = data.codeResult.code;
      if (code) {
        onDetected(code); // ส่งค่า productID กลับ
        Quagga.stop();
      }
    });

    return () => {
      Quagga.stop();
    };
  }, [onDetected]);

  return <div id="interactive" style={{ width: "100%", height: "100%" }} />;
};

export default BarcodeScanner;
