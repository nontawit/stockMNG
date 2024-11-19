import React from 'react';
import { Box, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({ onResult, onClose }) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      const barcodeData = result.getText();
      const productCode = barcodeData.substring(0, 7);
      const shelf = "01";
      const planCode = barcodeData.substring(13, 16);
      
      onResult({
        productCode,
        shelf,
        planCode
      });
    },
  });

  return (
    <Box sx={{ position: 'relative' }}>
      <Button 
        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
        onClick={onClose}
      >
        <Close />
      </Button>
      <video ref={ref} style={{ width: '100%' }} />
    </Box>
  );
};