import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ task, user }) => {

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  // Sample initial events
  const initialEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      dayStart: 1, // Monday
      dayEnd: 1,   // Monday
      startTime: '10:00',
      endTime: '11:00'
    },
    {
      id: 2,
      title: 'Project Review',
      dayStart: 3, // Wednesday
      dayEnd: 3,   // Wednesday
      startTime: '14:00',
      endTime: '16:00'
    },
    {
      id: 3,
      title: 'Client Presentation',
      dayStart: 4, // Thursday
      dayEnd: 4,   // Thursday
      startTime: '09:00',
      endTime: '11:30'
    }
  ];

  useEffect(() => {
    setTasks(task);
  }, []);

  // Generate days for the current week
  const generateWeekDays = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return {
        date: day,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });
  };

  const weekDays = generateWeekDays();

  const changeWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-3 align-items-center">
        <Col xs={2}>
          <Button
            variant="outline-secondary"
            onClick={() => changeWeek('prev')}
            className="d-flex align-items-center"
          >
            <ChevronLeft size={20} />
          </Button>
        </Col>
        <Col xs={8} className="text-center">
          <h4>
            {weekDays[0].fullDate} - {weekDays[6].fullDate}
          </h4>
        </Col>
        <Col xs={2} className="text-end">
          <Button
            variant="outline-secondary"
            onClick={() => changeWeek('next')}
            className="d-flex align-items-center justify-content-center"
          >
            <ChevronRight size={20} />
          </Button>
        </Col>
      </Row>

      <Row className="calendar-grid border">
        {weekDays.map((day, index) => (
          <Col key={index} className="border p-2">
            <div className="text-center mb-2">
              <strong>{day.dayName}</strong>
              <div className="text-muted">{day.fullDate}</div>
            </div>
            <div className="events-container">
              {
                tasks.filter(task => task.startDay.getDay() === weekDays[dayIndex - 1].dayName)
                  .map(task => (
                    <div
                      key={task.id}
                      className="event-block bg-primary text-white p-2 rounded mb-2"
                      style={{
                        fontSize: '0.8rem',
                        position: 'relative',
                        width: '100%'
                      }}
                    >
                      <strong>{task.title}</strong>
                      <div>{task.duration}</div>
                    </div>
                  ))
              }
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Calendar;