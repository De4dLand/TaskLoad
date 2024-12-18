import React from 'react';

const Sidebar = ({ tasks, updateTask, user }) => (
  <aside className="sidebar bg-gray-100 p-4 w-64">
    <h2 className="sidebar-title text-xl font-bold mb-4">Welcome, {user.username}</h2>
    <h3 className="text-lg font-semibold mt-6 mb-2">Your Tasks</h3>
    {tasks.length === 0 ? (
      <p className="text-gray-500">No tasks yet. Add some tasks to get started!</p>
    ) : (
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task._id} className="task-card bg-white p-2 rounded shadow">
            <div className="flex justify-between items-center">
              <span className={`task-priority priority-${task.priority} px-2 py-1 rounded text-xs font-semibold`}>
                {task.priority}
              </span>
              <h4 className="font-medium mt-1">{task.title}</h4>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => updateTask(task._id, { completed: !task.completed })}
                className="form-checkbox h-5 w-5 text-blue-600 justify-content-end"
              />
            </div>
          </li>
        ))}
      </ul>
    )}
  </aside>
);

export default Sidebar;

