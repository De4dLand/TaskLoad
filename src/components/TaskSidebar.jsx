import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
  useTheme,
  Checkbox,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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

const TaskSidebar = ({ open, onClose, onTasksChange = () => { } }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const theme = useTheme();

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
        if (a.completed === b.completed) {
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.completed ? 1 : -1;
      });
      setTasks(sortedTasks);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleMarkCompleted = async (taskId, completed) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      await fetchTasks();
      onTasksChange();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/tasks/${selectedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedTask)
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      await fetchTasks();
      onTasksChange();
      setIsUpdateDialogOpen(false);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 300, padding: '20px' }}>
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
                    cursor: 'pointer'
                  }}
                  onClick={() => handleTaskClick(task)}
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
                        {` — ${format(new Date(task.startDay), 'MMM d')} ${task.startTime}`}
                        {` — ${format(new Date(task.endDay), 'MMM d')} ${task.endTime}`}
                      </>
                    }
                  />
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => handleMarkCompleted(task._id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </div>
      <Dialog open={isUpdateDialogOpen} onClose={() => setIsUpdateDialogOpen(false)}>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={selectedTask?.title || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={selectedTask?.priority || ''}
                onChange={handleInputChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Start Day"
              name="startDay"
              type="date"
              value={selectedTask?.startDay?.split('T')[0] || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={selectedTask?.startTime || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Day"
              name="endDay"
              type="date"
              value={selectedTask?.endDay?.split('T')[0] || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              value={selectedTask?.endTime || ''}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={selectedTask?.duration || ''}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateTask} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default TaskSidebar;

