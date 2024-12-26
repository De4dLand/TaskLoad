import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TableSortLabel,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { format, differenceInMinutes } from 'date-fns';

const TaskCenter = () => {
  const [tasks, setTasks] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState('asc');

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
      setTasks(data.map(task => ({ ...task, favorite: false })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleComplete = async (id, completed) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });
      setTasks(tasks.map(task =>
        task._id === id ? { ...task, completed } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleFavorite = (id) => {
    setTasks(tasks.map(task =>
      task._id === id ? { ...task, favorite: !task.favorite } : task
    ));
  };

  const calculateRemainingTime = (task) => {
    const now = new Date();
    const endTime = new Date(`${task.endDay}T${task.endTime}`);
    const remainingMinutes = differenceInMinutes(endTime, now);

    if (remainingMinutes < 0) {
      return 'Overdue';
    }

    const days = Math.floor(remainingMinutes / 1440);
    const hours = Math.floor((remainingMinutes % 1440) / 60);

    if (days < 1) {
      return `${hours} hours left`;
    }

    return `${days} days`;
  };

  const sortedTasks = tasks.sort((a, b) => {
    if (a.favorite !== b.favorite) {
      return a.favorite ? -1 : 1;
    }

    let comparison = 0;
    if (orderBy === 'remainingTime') {
      const aTime = new Date(`${a.endDay}T${a.endTime}`).getTime();
      const bTime = new Date(`${b.endDay}T${b.endTime}`).getTime();
      comparison = aTime - bTime;
    } else {
      comparison = a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Task Center
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Favorite</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'duration'}
                  direction={orderBy === 'duration' ? order : 'asc'}
                  onClick={() => handleSort('duration')}
                >
                  Duration (min)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'remainingTime'}
                  direction={orderBy === 'remainingTime' ? order : 'asc'}
                  onClick={() => handleSort('remainingTime')}
                >
                  Remaining Time
                </TableSortLabel>
              </TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>
                  <IconButton onClick={() => handleFavorite(task._id)}>
                    {task.favorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.duration}</TableCell>
                <TableCell>{calculateRemainingTime(task)}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => handleComplete(task._id, e.target.checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TaskCenter;

