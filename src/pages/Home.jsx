import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to TaskMaster
        </Typography>
        {user ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Hello, {user.username}! What would you like to do today?
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" color="primary" component={RouterLink} to="/calendar">
                View Calendar
              </Button>
              <Button variant="contained" color="secondary" component={RouterLink} to="/tasks">
                Manage Tasks
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" gutterBottom>
              Please log in or register to start managing your tasks.
            </Typography>
            <Button variant="contained" color="primary" component={RouterLink} to="/auth" sx={{ mt: 2 }}>
              Login/Register
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;

