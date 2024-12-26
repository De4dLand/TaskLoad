import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ width: '200px' }}>

        </Box>

        <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
          <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            TaskLoad
          </RouterLink>
        </Typography>

        <Box sx={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
          {user ? (
            <>
              {user && (
                <NotificationCenter />
              )}
              <Button color="inherit" component={RouterLink} to="/account">
                Account
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/signin">
                Sign In
              </Button>
              <Button color="inherit" component={RouterLink} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

