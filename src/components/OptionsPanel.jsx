import React, { useState } from 'react';

const OptionsPanel = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Low');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({
      title,
      priority,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration,
      completed: false,
    });
    setTitle('');
    setPriority('Low');
    setStartDate('');
    setEndDate('');
    setDuration(60);
  };

  return (
    <aside className="options-panel">
      <div className="panel-header">
        <h2>Task Options</h2>
      </div>

      <form className="add-task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            className="form-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="datetime-local"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="datetime-local"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            className="form-input"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            min="15"
            step="15"
            required
          />
        </div>
        <button type="submit" className="form-submit">Save Task</button>
      </form>
    </aside>
  );
};

export default OptionsPanel;

