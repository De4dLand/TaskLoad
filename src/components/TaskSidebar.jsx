import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  FlagOutlined as LowPriority,
  Flag as MediumPriority,
  FlagRounded as HighPriority
} from '@mui/icons-material';

const priorityIcons = {
  Low: <LowPriority color="success" />,
  Medium: <MediumPriority color="warning" />,
  High: <HighPriority color="error" />
};

const TaskSidebar = ({ open, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);
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
      // Sort tasks by priority (High > Medium > Low)
      const sortedTasks = data.sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      setTasks(sortedTasks);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 250, padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Tasks by Priority
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List>
            {tasks.map((task) => (
              <ListItem key={task._id}>
                <ListItemIcon>
                  {priorityIcons[task.priority]}
                </ListItemIcon>
                <ListItemText
                  primary={task.title}
                  secondary={`Priority: ${task.priority}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Drawer>
  );
};

export default TaskSidebar;

