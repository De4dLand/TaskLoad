import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Paper, Typography, Grid, Box, Button } from '@mui/material';

const Calendar = ({ tasks, currentDate, onPrevWeek, onNextWeek }) => {
  // Generate time slots from 8:00 to 16:30 in 30-minute intervals
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  // Generate weekdays (Sunday to Thursday)
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 5 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      name: format(date, 'EEEE'),
      date: date,
    };
  });

  // Helper function to get task position and span
  const getTaskPosition = (task) => {
    const startTime = new Date(task.startDate);
    const endTime = new Date(task.endDate);

    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    const startIndex = (startHour) * 2 + (startMinutes >= 30 ? 1 : 0);
    const endIndex = (endHour) * 2 + (endMinutes >= 30 ? 1 : 0);
    const span = endIndex - startIndex + 1;

    return { startIndex, span };
  };

  // Helper function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#2196f3';
    }
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={onPrevWeek} variant="outlined">
          Previous Week
        </Button>
        <Typography variant="h6">
          {format(weekStart, 'MMMM d, yyyy')} - {format(addDays(weekStart, 4), 'MMMM d, yyyy')}
        </Typography>
        <Button onClick={onNextWeek} variant="outlined">
          Next Week
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="subtitle1" sx={{ p: 1, fontWeight: 'bold' }}>Time</Typography>
        </Grid>
        {weekDays.map((day, index) => (
          <Grid item xs={2} key={index}>
            <Typography variant="subtitle1" sx={{ p: 1, fontWeight: 'bold', textAlign: 'center' }}>
              {day.name}
              <br />
              <Typography variant="caption">{format(day.date, 'MMM d')}</Typography>
            </Typography>
          </Grid>
        ))}
      </Grid>

      {timeSlots.map((time, timeIndex) => (
        <Grid container key={timeIndex}>
          <Grid item xs={2}>
            <Typography variant="body2" sx={{ p: 1 }}>{time}</Typography>
          </Grid>
          {weekDays.map((day, dayIndex) => (
            <Grid item xs={2} key={`${timeIndex}-${dayIndex}`} sx={{ position: 'relative', height: '40px', borderTop: '1px solid #e0e0e0' }}>
              {tasks.map((task, taskIndex) => {
                const taskDate = new Date(task.startDate);
                if (taskDate.toDateString() === day.date.toDateString()) {
                  const { startIndex, span } = getTaskPosition(task);

                  if (startIndex === timeIndex) {
                    return (
                      <Box
                        key={taskIndex}
                        sx={{
                          position: 'absolute',
                          left: '2px',
                          right: '2px',
                          top: '2px',
                          height: `${span * 40 - 4}px`,
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          padding: '2px',
                          fontSize: '0.75rem',
                          overflow: 'hidden',
                          zIndex: 10,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {task.title}
                        </Typography>
                      </Box>
                    );
                  }
                }
                return null;
              })}
            </Grid>
          ))}
        </Grid>
      ))}
    </Paper>
  );
};

export default Calendar;

