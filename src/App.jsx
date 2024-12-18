'use client'

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import OptionsPanel from './components/OptionsPanel';
import Auth from './components/Auth';
import Account from './components/Account';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);
  const url = "http://localhost:3000";
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3000/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url + '/api/tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url + "/api/tasks/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url + `/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      setTasks(tasks.map(task => task._id === id ? data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/task/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <div className="dashboard">
      <Navbar user={user} />
      <Sidebar tasks={tasks} updateTask={updateTask} user={user} />
      <MainContent tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />
      <OptionsPanel addTask={addTask} />
      <Account user={user} setUser={setUser} />
    </div>
  );
}

