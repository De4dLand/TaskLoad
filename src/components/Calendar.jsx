import React from 'react';
import { format, startOfWeek, addDays, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { Paper, Typography, Grid, Box, Button, useTheme } from '@mui/material';
import { getPriorityColor } from '../utils/priorityColors';

const Calendar = ({ tasks, currentDate, onPrevWeek, onNextWeek }) => {
  const theme = useTheme();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      name: format(date, 'EEE'),
      date: date,
    };
  });

  const getTaskPosition = (task, day) => {
    const startDay = parseISO(task.startDay);
    const endDay = parseISO(task.endDay);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const taskStart = isWithinInterval(startDay, { start: dayStart, end: dayEnd }) ? startDay : dayStart;
    const taskEnd = isWithinInterval(endDay, { start: dayStart, end: dayEnd }) ? endDay : dayEnd;

    const [startHour, startMinute] = task.startTime.split(':').map(Number);
    const [endHour, endMinute] = task.endTime.split(':').map(Number);

    const startPosition = startHour + startMinute / 60;
    const endPosition = endHour + endMinute / 60;
    const duration = endPosition - startPosition;

    return { startPosition, duration };
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={onPrevWeek} variant="outlined">
          Previous Week
        </Button>
        <Typography variant="h6">
          {format(weekStart, 'MMMM d, yyyy')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
        </Typography>
        <Button onClick={onNextWeek} variant="outlined">
          Next Week
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={1}>
          <Typography variant="subtitle2" sx={{ p: 1, fontWeight: 'bold' }}>Time</Typography>
        </Grid>
        {weekDays.map((day, index) => (
          <Grid item xs={1.5} key={index}>
            <Typography variant="subtitle2" sx={{ p: 1, fontWeight: 'bold', textAlign: 'center' }}>
              {day.name}
              <br />
              <Typography variant="caption">{format(day.date, 'MMM d')}</Typography>
            </Typography>
          </Grid>
        ))}
      </Grid>

      {hours.map((hour) => (
        <Grid container key={hour} sx={{ borderTop: '1px solid #e0e0e0', minHeight: '60px' }}>
          <Grid item xs={1}>
            <Typography variant="body2" sx={{ p: 1 }}>{`${hour.toString().padStart(2, '0')}:00`}</Typography>
          </Grid>
          {weekDays.map((day, dayIndex) => (
            <Grid item xs={1.5} key={`${hour}-${dayIndex}`} sx={{ position: 'relative', height: '60px' }}>
              {tasks.map((task, taskIndex) => {
                const { startPosition, duration } = getTaskPosition(task, day.date);
                if (Math.floor(startPosition) === hour && isSameDay(parseISO(task.startDay), day.date)) {
                  const priorityColor = getPriorityColor(task.priority, theme);
                  return (
                    <Box
                      key={taskIndex}
                      sx={{
                        position: 'absolute',
                        left: '2px',
                        right: '2px',
                        top: `${(startPosition % 1) * 60}px`,
                        height: `${duration * 60}px`,
                        backgroundColor: priorityColor.background,
                        borderLeft: `3px solid ${priorityColor.border}`,
                        color: priorityColor.text,
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

