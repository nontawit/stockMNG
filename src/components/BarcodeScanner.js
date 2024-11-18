import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Container, Paper, Typography, Button } from '@mui/material';

const BarcodeScanner = () => {
  const [scanner, setScanner] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    initializeScanner();
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const initializeScanner = () => {
    const newScanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    newScanner.render(onScanSuccess, onScanError);
    setScanner(newScanner);
  };

  const onScanSuccess = (decodedText) => {
    const barcodeData = parseBarcodeData(decodedText);
    setScanResult(barcodeData);
    if (scanner) {
      scanner.clear();
    }
  };

  const onScanError = (error) => {
    console.warn(error);
  };

  const parseBarcodeData = (text) => {
    return {
      productId: text.slice(0, 7),
      date: text.slice(9, 17),
      additionalInfo: text.slice(17)
    };
  };

  const handleReset = () => {
    setScanResult(null);
    initializeScanner();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ color: 'primary.main', fontWeight: 'bold' }}
        >
          ระบบสแกนบาร์โค้ดสินค้า
        </Typography>

        {!scanResult && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 2,
              borderRadius: 2,
              backgroundColor: '#f5f5f5'
            }}
          >
            <div id="reader"></div>
          </Paper>
        )}

        {scanResult && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 2,
              borderRadius: 2,
              backgroundColor: '#fff'
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              ผลการสแกน:
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>รหัสสินค้า:</strong> {scanResult.productId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>วันที่:</strong> {scanResult.date}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>ข้อมูลเพิ่มเติม:</strong> {scanResult.additionalInfo}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleReset}
              fullWidth
              sx={{ mt: 2 }}
            >
              สแกนใหม่
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default BarcodeScanner;