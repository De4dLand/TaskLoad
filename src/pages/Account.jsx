import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import notificationSound from '../assets/notification-sound.mp3';
const Account = () => {
  const { user, logout, error } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate('/auth');
    return null;
  }
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  const handleTestAlarm = () => {
    const audio = new Audio(notificationSound);
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };
  return (
    <Container maxWidth="sm">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Thông Tin Tài Khoản
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          id="username"
          label="Tên Tài Khoản"
          name="username"
          value={user.username}
        />
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          name="email"
          value={user.email}
        />
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleTestAlarm}
          >
            Thử Chuông Thông Báo
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleLogout}
          >
            Đăng Xuất
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Account;