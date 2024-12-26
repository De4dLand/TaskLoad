import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Container, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { parseISO, format, addDays, subDays, isWithinInterval } from 'date-fns';
import { getPriorityColor } from '../utils/priorityColors';
import { useTheme } from '@mui/material/styles';

const TimeTracker = ({ tasks }) => {
  const [timeData, setTimeData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const calculateTimeData = () => {
      const today = new Date();
      const startDate = subDays(today, 15);
      const endDate = addDays(today, 15);
      const dailyData = {};

      // Initialize dailyData with all dates in the range
      for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const dateStr = format(day, 'yyyy-MM-dd');
        dailyData[dateStr] = { date: dateStr, totalDuration: 0, tasks: [] };
      }

      tasks.forEach(task => {
        const startDay = parseISO(task.startDay);
        const endDay = parseISO(task.endDay);

        if (isWithinInterval(startDay, { start: startDate, end: endDate })) {
          const taskDate = format(startDay, 'yyyy-MM-dd');
          if (dailyData[taskDate]) {
            dailyData[taskDate].totalDuration += task.duration;
            dailyData[taskDate].tasks.push(task);
          }
        }
      });

      const timeDataArray = Object.values(dailyData).map(day => ({
        ...day,
        hours: Math.round(day.totalDuration / 60 * 10) / 10, // Round to 1 decimal place
        warning: day.totalDuration > 12 * 60
      }));

      setTimeData(timeDataArray);
    };

    calculateTimeData();
  }, [tasks]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`Date: ${label}`}</p>
          <p className="intro">{`Total Hours: ${dayData.hours}`}</p>
          <div className="desc">
            {dayData.tasks.sort((a, b) => {
              const priorityOrder = { High: 3, Medium: 2, Low: 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }).map((task, index) => (
              <p key={index}>{`${task.title} (${task.priority}): ${task.duration} min`}</p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Time Tracker
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData}>
              <XAxis dataKey="date" tickFormatter={(tick) => format(parseISO(tick), 'dd MMM')} />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="hours" name="Hours">
                {timeData.map((entry, index) => {
                  const maxPriorityTask = entry.tasks.reduce((max, task) => {
                    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                    return priorityOrder[task.priority] > priorityOrder[max.priority] ? task : max;
                  }, { priority: 'Low' });
                  const color = getPriorityColor(maxPriorityTask.priority, theme);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={color.background}
                      stroke={color.border}
                      strokeWidth={2}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {timeData.some(day => day.warning) && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Some days have more than 12 hours of scheduled tasks. Consider redistributing your workload.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default TimeTracker;

