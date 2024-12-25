import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const WelcomePage = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to TaskLoad
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your personal task management solution
        </Typography>
        {user ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Hello, {user.username}!
            </Typography>
            <Button variant="contained" color="primary" component={RouterLink} to="/tasks" sx={{ mr: 2, mb: 2 }}>
              Manage Tasks
            </Button>
            <Button variant="outlined" color="primary" component={RouterLink} to="/calendar">
              View Calendar
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" component={RouterLink} to="/signin" sx={{ mr: 2, mb: 2 }}>
              Sign In
            </Button>
            <Button variant="outlined" color="primary" component={RouterLink} to="/signup">
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default WelcomePage;