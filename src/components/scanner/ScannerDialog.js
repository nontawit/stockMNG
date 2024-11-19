import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { BarcodeScanner } from './BarcodeScanner';

export const ScannerDialog = ({ open, onClose, onResult }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>สแกนบาร์โค้ด</DialogTitle>
      <DialogContent>
        <BarcodeScanner 
          onResult={onResult}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};