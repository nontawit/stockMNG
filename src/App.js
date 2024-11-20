import React, { useState } from "react";
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AddProductForm from "./components/AddProductForm";
import UpdateProductForm from "./components/UpdateProductForm";

function App() {
  const [open, setOpen] = useState(false); // สถานะเปิด-ปิดของป็อปอัพ
  const [currentForm, setCurrentForm] = useState(null); // ฟอร์มที่ต้องการแสดง (add หรือ update)

  // ฟังก์ชันเปิดป็อปอัพ
  const handleOpen = (formType) => {
    setCurrentForm(formType);
    setOpen(true);
  };

  // ฟังก์ชันปิดป็อปอัพ
  const handleClose = () => {
    setOpen(false);
    setCurrentForm(null);
  };

  return (
    <Box sx={{ textAlign: "center", marginTop: 4 }}>
      <h1>ระบบจัดการข้อมูลสินค้า</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen("add")}
        sx={{ marginRight: 2 }}
      >
        เพิ่มสินค้า
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleOpen("update")}
      >
        อัปเดตสินค้า
      </Button>

      {/* Dialog สำหรับแสดงฟอร์ม */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentForm === "add" ? "เพิ่มสินค้า" : "อัปเดตสินค้า"}
        </DialogTitle>
        <DialogContent>
          {currentForm === "add" && <AddProductForm />}
          {currentForm === "update" && <UpdateProductForm />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
