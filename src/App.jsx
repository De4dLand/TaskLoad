import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, IconButton, CircularProgress } from '@mui/material';
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
import TimeTracker from './components/TimeTracker';
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
  const { user, loading } = useAuth();

  if (loading) {
    return <CircularProgress />;
  }

  return user ? children : <Navigate to="/signin" />;
};

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user, tasksUpdated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTasksChange = useCallback(() => {
    setTasksUpdated(prev => !prev);
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

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
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar
                tasks={tasks}
                currentDate={new Date()}
                onPrevWeek={() => {/* Implement previous week logic */ }}
                onNextWeek={() => {/* Implement next week logic */ }}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TaskManager onTasksChange={handleTasksChange} />
              <TimeTracker tasks={tasks} />
            </PrivateRoute>
          }
        />
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

