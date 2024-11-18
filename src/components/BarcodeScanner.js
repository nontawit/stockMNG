import React, { useRef, useState } from 'react';
import { Button } from '@mui/material';
import Quagga from 'quagga';

function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current
        },
        decoder: {
          readers: ["ean_reader"]
        }
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
        setIsScanning(true);
      }
    );

    Quagga.onDetected((result) => {
      onDetected(result.codeResult.code);
      stopScanning();
    });
  };

  const stopScanning = () => {
    Quagga.stop();
    setIsScanning(false);
  };

  return (
    <div>
      {!isScanning ? (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={startScanning}
        >
          สแกนบาร์โค้ด
        </Button>
      ) : (
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={stopScanning}
        >
          หยุดสแกน
        </Button>
      )}
      <div ref={scannerRef} />
    </div>
  );
}

export default BarcodeScanner;