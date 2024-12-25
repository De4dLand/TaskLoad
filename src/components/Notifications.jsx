import React, { useState, useEffect } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

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
        const endingTasks = tasks.filter(task => {
          const endTime = new Date(task.endDate);
          return endTime.toDateString() === now.toDateString() && endTime > now && endTime - now <= 30 * 60 * 1000; // 30 minutes
        });

        if (endingTasks.length > 0) {
          setMessage(`You have ${endingTasks.length} task(s) ending in the next 30 minutes!`);
          setOpen(true);
        }
        else {
          setMessage(`You have ${endingTasks.length} task(s) met the deadline!`);

        }
      } catch (error) {
        console.error('Error checking tasks:', error);
      }
    };

    checkTasks();
    const interval = setInterval(checkTasks, 3 * 60 * 1000); // Check every 3 minutes

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
      message={message}
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
    />
  );
};

export default Notifications;

