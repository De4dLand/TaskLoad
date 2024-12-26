import React, { useState, useEffect } from 'react';
import { Snackbar, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format, addMinutes } from 'date-fns';
import notificationSound from '../assets/notification-sound.mp3';

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const audio = new Audio(notificationSound);

  useEffect(() => {
    const checkTasks = async () => {
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
        const soon = addMinutes(now, 30); // 30 minutes from now

        const startingTasks = tasks.filter(task => {
          const startTime = new Date(`${task.startDay}T${task.startTime}`);
          return startTime > now && startTime <= soon;
        });

        const endingTasks = tasks.filter(task => {
          const endTime = new Date(`${task.endDay}T${task.endTime}`);
          return endTime > now && endTime <= soon;
        });

        if (startingTasks.length > 0) {
          const task = startingTasks[0];
          setNotification({
            type: 'start',
            message: `${task.title} (Starts at ${task.startTime})`
          });
          audio.play()
          setOpen(true);
        } else if (endingTasks.length > 0) {
          const task = endingTasks[0];
          setNotification({
            type: 'end',
            message: `${task.title} (Ends at ${task.endTime})`
          });
          audio.play()
          setOpen(true);
        }
      } catch (error) {
        console.error('Error checking tasks:', error);
      }
    };

    checkTasks();
    const interval = setInterval(checkTasks, 1 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <Box
        sx={{
          backgroundColor: notification.type === 'start' ? 'success.main' : 'warning.main',
          color: 'white',
          padding: 2,
          borderRadius: 1
        }}
      >
        <Typography variant="subtitle1" component="div">
          {notification.type === 'start' ? 'Some task about to begin:' : 'A task is about to End:'}
        </Typography>
        <Typography variant="body2">
          {notification.message}
        </Typography>
      </Box>
    </Snackbar>
  );
};

export default Notifications;

