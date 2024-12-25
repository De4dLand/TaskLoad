import React from 'react';
import TaskManagerComponent from '../components/TaskManager';
import { useAuth } from '../context/AuthContext';

const TaskManager = ({ onTasksChange }) => {
  const { user } = useAuth();

  if (!user) {
    return <div className="container mx-auto p-4">Please log in to manage your tasks.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskManagerComponent onTasksChange={onTasksChange} />
    </div>
  );
};

export default TaskManager;

