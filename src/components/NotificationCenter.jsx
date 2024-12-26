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
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isToday } from 'date-fns';

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
        const endDay = new Date(task.endDay);
        return (now.getDate() < endDay.getDate() || now.getDate() === endDay.getDate()) && !task.completed;
      }).map(task => {
        const endTime = new Date(task.endDay);
        endTime.setHours(parseInt(task.endTime.split(':')[0]), parseInt(task.endTime.split(':')[1]));
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

  const handleRemoveNotification = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: true })
      });
      setNotifications(notifications.filter(notification => notification._id !== taskId));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
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
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {notification.priority}
                      </Typography>
                      {` - Ends at ${notification.endTime}`}
                      <br />
                      {`Remaining time: ${notification.remainingTime}`}
                    </>
                  }
                />
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveNotification(notification._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationCenter;

