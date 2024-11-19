import React, { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  Grid
} from '@mui/material';
import { Add, Update } from '@mui/icons-material';
import { AddProductForm } from './components/forms/AddProductForm';
import { UpdateStockForm } from './components/forms/UpdateStockForm';
import { ScannerDialog } from './components/scanner/ScannerDialog';

const App = () => {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [updateStockOpen, setUpdateStockOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  const handleScanComplete = (result) => {
    setScannedData(result);
    setScannerOpen(false);
    if (scannerMode === 'add') {
      setAddProductOpen(true);
    } else {
      setUpdateStockOpen(true);
    }
  };

  const handleScanStart = (mode) => {
    setScannerMode(mode);
    setScannerOpen(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          ระบบจัดการสต๊อกสินค้า
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleScanStart('add')}
                sx={{ mb: 2 }}
              >
                เพิ่มสินค้า
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<Update />}
                onClick={() => handleScanStart('update')}
              >
                อัพเดทสต๊อกสินค้า
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <ScannerDialog 
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResult={handleScanComplete}
      />

      <AddProductForm
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        scannedData={scannedData}
      />
      
      <UpdateStockForm
        open={updateStockOpen}
        onClose={() => setUpdateStockOpen(false)}
        scannedData={scannedData}
      />
    </Container>
  );
};

export default App;