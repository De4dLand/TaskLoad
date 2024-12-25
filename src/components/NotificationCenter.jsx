import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
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
      const tasks = await response.json();

      const now = new Date();
      const upcomingTasks = tasks.filter(task => {
        const endTime = new Date(task.endDate);
        return endTime > now;
      }).map(task => {
        const endTime = new Date(task.endDate);
        const remainingTime = endTime - now;
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        return {
          ...task,
          remainingTime: `${hours}h ${minutes}m`
        };
      });

      setNotifications(upcomingTasks);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            width: 300,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {notifications.map((notification) => (
              <ListItem key={notification._id}>
                <ListItemText
                  primary={notification.title}
                  secondary={`Remaining time: ${notification.remainingTime}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationCenter;

