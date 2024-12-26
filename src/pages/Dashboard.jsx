import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    highestHoursInDay: 0,
    highestHoursDate: null,
    upcomingTasks: 0,
    overdueTasks: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
      processDashboardData(tasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const processDashboardData = (tasks) => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    let totalTasks = tasks.length;
    let completedTasks = tasks.filter(task => task.completed).length;
    let upcomingTasks = tasks.filter(task => new Date(task.startDay) > now).length;
    let overdueTasks = tasks.filter(task => new Date(task.endDay) < now && !task.completed).length;

    let dailyHours = daysInWeek.map(day => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.startDay);
        return taskDate.toDateString() === day.toDateString();
      });
      const totalMinutes = dayTasks.reduce((sum, task) => sum + task.duration, 0);
      return { date: day, hours: totalMinutes / 60 };
    });

    let highestHoursDay = dailyHours.reduce((max, day) => day.hours > max.hours ? day : max);

    setDashboardData({
      totalTasks,
      completedTasks,
      highestHoursInDay: Math.round(highestHoursDay.hours * 10) / 10,
      highestHoursDate: highestHoursDay.date,
      upcomingTasks,
      overdueTasks
    });
  };

  const DashboardCard = ({ title, value, icon, color }) => (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" component="h2" ml={1}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="p" color={color}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Tasks"
            value={dashboardData.totalTasks}
            icon={<AssignmentIcon fontSize="large" color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Completed Tasks"
            value={dashboardData.completedTasks}
            icon={<CheckCircleIcon fontSize="large" color="success" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Highest Hours in a Day"
            value={`${dashboardData.highestHoursInDay} hrs`}
            icon={<AccessTimeIcon fontSize="large" color="secondary" />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Upcoming Tasks"
            value={dashboardData.upcomingTasks}
            icon={<TrendingUpIcon fontSize="large" color="info" />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Overdue Tasks"
            value={dashboardData.overdueTasks}
            icon={<WarningIcon fontSize="large" color="error" />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Busiest Day This Week
            </Typography>
            <Typography variant="body1">
              {dashboardData.highestHoursDate
                ? format(dashboardData.highestHoursDate, 'EEEE, MMMM d')
                : 'N/A'}
            </Typography>
            <Typography variant="h4" component="p" color="secondary.main" mt={2}>
              {dashboardData.highestHoursInDay} hrs
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

