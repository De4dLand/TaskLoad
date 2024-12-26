import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import CalendarComponent from '../components/Calendar';
import { addWeeks, subWeeks } from 'date-fns';

const Calendar = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevWeek = () => {
    setCurrentDate(prevDate => subWeeks(prevDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, 1));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Calendar
      </Typography>
      <Box sx={{ mt: 2 }}>
        <CalendarComponent
          tasks={tasks}
          currentDate={currentDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      </Box>
    </Container>
  );
};

export default Calendar;

