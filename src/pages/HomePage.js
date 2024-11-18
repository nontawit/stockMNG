import React from 'react';
import { Container, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        ระบบจัดการสินค้า
      </Typography>
      <Stack spacing={3}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/add-product')}
        >
          เพิ่มสินค้า
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          onClick={() => navigate('/update-stock')}
        >
          อัพเดทสต๊อกสินค้า
        </Button>
      </Stack>
    </Container>
  );
}

export default HomePage;