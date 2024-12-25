import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseISO, isWithinInterval, addDays, format } from 'date-fns';

const TimeTracker = ({ tasks }) => {
  const [timeCount, setTimeCount] = useState([]);

  useEffect(() => {
    const calculateTimeCount = () => {
      const today = new Date();
      const nextMonth = addDays(today, 30);
      const dailyCounts = {};

      tasks.forEach(task => {
        const startDay = parseISO(task.startDay);
        const endDay = parseISO(task.endDay);

        if (isWithinInterval(startDay, { start: today, end: nextMonth })) {
          const taskDate = format(startDay, 'yyyy-MM-dd');
          if (!dailyCounts[taskDate]) {
            dailyCounts[taskDate] = 0;
          }
          dailyCounts[taskDate] += task.duration;
        }
      });

      const timeCountArray = Object.entries(dailyCounts).map(([date, minutes]) => ({
        date,
        hours: Math.round(minutes / 60 * 10) / 10, // Round to 1 decimal place
      }));

      setTimeCount(timeCountArray);
    };

    calculateTimeCount();
  }, [tasks]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Time Tracker</Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeCount}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#8884d8" name="Hours" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TimeTracker;

