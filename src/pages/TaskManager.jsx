import React from 'react';
import { Container, Typography } from '@mui/material';
import TaskManagerComponent from '../components/TaskManager';

const TaskManager = ({ onTasksChange }) => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Task Manager
      </Typography>
      <TaskManagerComponent onTasksChange={onTasksChange} />
    </Container>
  );
};

export default TaskManager;

