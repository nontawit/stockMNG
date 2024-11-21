import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const AddProductForm = () => {
  const [barcode, setBarcode] = useState(""); // เก็บผลลัพธ์บาร์โค้ด
  const [error, setError] = useState(""); // เก็บข้อผิดพลาด
  const [isScanning, setIsScanning] = useState(false); // สถานะการสแกน
  const [cameraError, setCameraError] = useState(""); // เก็บสถานะกล้อง
  
  useEffect(() => {
    let codeReader;
    if (isScanning) {
      codeReader = new BrowserMultiFormatReader();
      codeReader
        .decodeFromVideoDevice(null, "video", (result, error) => {
          if (result) {
            setBarcode(result.text); // เก็บค่าบาร์โค้ด
            setError(""); // ล้างข้อผิดพลาด
            stopScan(codeReader); // หยุดการสแกน
          }
          if (error) {
            console.error(error);
            setError("ไม่สามารถสแกนบาร์โค้ดได้");
          }
        })
        .catch((err) => {
          console.error(err);
          setCameraError("ไม่สามารถเปิดกล้องได้ โปรดตรวจสอบการอนุญาต");
        });
    }

    return () => {
      if (codeReader) {
        stopScan(codeReader);
      }
    };
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
  };

  const stopScan = (codeReader) => {
    setIsScanning(false);
    if (codeReader) {
      codeReader.reset();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>เพิ่มสินค้า</h2>

      {/* ปุ่มเริ่มการสแกน */}
      <button
        onClick={startScan}
        style={{ margin: "10px 0", padding: "10px 20px", cursor: "pointer" }}
      >
        สแกนบาร์โค้ด
      </button>

      {/* กล้องแสดงผล */}
      {isScanning && (
        <div style={{ margin: "20px 0" }}>
          <video id="video" width="100%" style={{ border: "1px solid #ddd" }} />
        </div>
      )}

      {/* ข้อมูลผลลัพธ์ */}
      {barcode && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          บาร์โค้ดที่สแกนได้: {barcode}
        </p>
      )}

      {/* แสดงข้อผิดพลาด */}
      {(error || cameraError) && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {cameraError || error}
        </p>
      )}

      {/* ปุ่มหยุดการสแกน */}
      {isScanning && (
        <button
          onClick={() => setIsScanning(false)}
          style={{
            margin: "10px 0",
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "red",
            color: "white",
          }}
        >
          หยุดสแกน
        </button>
      )}
    </div>
  );
};

export default AddProductForm;
