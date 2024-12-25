import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Navbar from './components/Navbar';
import TaskSidebar from './components/TaskSidebar';
import Notifications from './components/Notifications';
import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Calendar from './pages/Calendar';
import TaskManager from './pages/TaskManager';
import Account from './pages/Account';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
};

function AppContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasksUpdated, setTasksUpdated] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTasksChange = useCallback(() => {
    setTasksUpdated(prev => !prev);
  }, []);

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {user && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleSidebar}
              sx={{ position: 'fixed', right: 20, top: 70, zIndex: 1000 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/SideBar" element={user ? <TaskSidebar /> : <Navigate to="/signin" />} />
        <Route path="/Notification" element={user ? <Notifications /> : <Navigate to="/signin" />} />
        <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><TaskManager onTasksChange={handleTasksChange} /></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
      </Routes>
      {user && <TaskSidebar open={sidebarOpen} onClose={toggleSidebar} key={tasksUpdated} />}
      {user && <Notifications />}
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

