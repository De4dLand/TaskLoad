import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

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

  return (
    <Container maxWidth="sm">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Account Information
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          id="username"
          label="Username"
          name="username"
          value={user.username}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          name="email"
          value={user.email}
          InputProps={{
            readOnly: true,
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Account;