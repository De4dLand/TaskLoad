import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  FlagOutlined as LowPriority,
  Flag as MediumPriority,
  FlagRounded as HighPriority
} from '@mui/icons-material';
import { getPriorityColor } from '../utils/priorityColors';
import { format } from 'date-fns';

const priorityIcons = {
  Low: <LowPriority />,
  Medium: <MediumPriority />,
  High: <HighPriority />
};

const TaskSidebar = ({ open, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

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

    fetchTasks();
  }, []);

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
            {tasks.map((task) => {
              const priorityColor = getPriorityColor(task.priority, theme);
              return (
                <ListItem
                  key={task._id}
                  sx={{
                    backgroundColor: priorityColor.background,
                    borderLeft: `4px solid ${priorityColor.border}`,
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon sx={{ color: priorityColor.border }}>
                    {priorityIcons[task.priority]}
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {task.priority}
                        </Typography>
                        {` — ${format(new Date(task.startDay), 'MMM dd')} ${task.startTime}`}
                      </>
                    }
                    primaryTypographyProps={{ color: priorityColor.text }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </div>
    </Drawer>
  );
};

export default TaskSidebar;

