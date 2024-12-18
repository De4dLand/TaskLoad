import React from 'react';
import Calendar from './Calendar';
const priority = ['Low', 'Medium', 'High'];
const MainContent = ({ tasks, users, addTask, updateTask }) => (
  <main className="main-content">
    <section className="calendar">
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      {/* <Calendar tasks={tasks} addTask={addTask} updateTask={updateTask} /> */}
    </section>

    <section className="tasks-list mt-8">
      <h2 className="text-2xl font-bold mb-4">Tasks by Priority</h2>
      {
        priority.map(priority => (
          tasks.map(task => (
            priority == task.priority && (
              <div key={task._id} className="task-row">
                <div>
                  <span className={`task-priority priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  {task.title}
                </div>
                <span>{new Date(task.endDate).toLocaleString()}</span>
              </div>
            )
          )
          )
        )
        )
      }
    </section>
  </main>
);

export default MainContent;

