import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import QrScanner from "react-qr-barcode-scanner";

const BarcodeScanner = ({ onDetected }) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScanning(false); // หยุดการสแกน
      onDetected(data.text); // ส่งข้อมูลบาร์โค้ดกลับไปยังฟอร์ม
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("ไม่สามารถเปิดกล้องได้ โปรดตรวจสอบการอนุญาต.");
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      {scanning ? (
        <>
          <QrScanner
            onUpdate={(err, result) => {
              if (result) handleScan(result);
              if (err) handleError(err);
            }}
            style={{ width: "100%", maxWidth: 400, margin: "auto" }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            variant="contained"
            color="error"
            onClick={() => setScanning(false)}
            sx={{ marginTop: 2 }}
          >
            ยกเลิก
          </Button>
        </>
      ) : (
        <p>กำลังโหลด...</p>
      )}
    </Box>
  );
};

export default BarcodeScanner;
