import React, { useState, useEffect } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

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
          const endDay = new Date(task.endDay);
          const endTime = task.endTime.split(':');
          endDay.setHours(parseInt(endTime[0]), parseInt(endTime[1]));
          return endDay.toDateString() === now.toDateString() && endDay > now && endDay - now <= 30 * 60 * 1000; // 30 minutes
        });

        if (endingTasks.length > 0) {
          const taskList = endingTasks.map(task =>
            `${task.title} (${format(new Date(task.endDay), 'MMM d')} ${task.endTime})`
          ).join(', ');
          setMessage(`Upcoming tasks near Deadlines: ${taskList}`);
          setOpen(true);
        }
      } catch (error) {
        console.error('Error checking tasks:', error);
      }
    };

    checkTasks();
    const interval = setInterval(checkTasks, 1 * 60 * 1000); // Check every 1 minutes

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

