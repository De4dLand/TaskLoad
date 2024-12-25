import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme
} from '@mui/material';
import { getPriorityColor } from '../utils/priorityColors';

const TaskManager = ({ onTasksChange }) => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        priority: 'Low',
        startDay: '',
        startTime: '',
        endDay: '',
        endTime: '',
        duration: 60,
    });
    const [editingTask, setEditingTask] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const theme = useTheme();

    const fetchTasks = async () => {
        setIsLoading(true);
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
            const data = await response.json();
            setTasks(data);
            onTasksChange();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            const createdTask = await response.json();
            setTasks(prev => [...prev, createdTask]);
            setNewTask({
                title: '',
                priority: 'Low',
                startDay: '',
                startTime: '00:00',
                endDay: '',
                endTime: '23:59',
                duration: 60,
            });
            onTasksChange();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/tasks/${editingTask._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editingTask),
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            const updatedTaskData = await response.json();
            setTasks(prev => prev.map(task => task._id === updatedTaskData._id ? updatedTaskData : task));
            setIsEditDialogOpen(false);
            onTasksChange();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            setTasks(prev => prev.filter(task => task._id !== id));
            onTasksChange();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSort = () => {
        const sortedTasks = [...tasks].sort((a, b) => {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        setTasks(sortedTasks);
    };

    const openEditDialog = (task) => {
        setEditingTask(task);
        setIsEditDialogOpen(true);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Add New Task</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Task Title"
                            name="title"
                            value={newTask.title}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                name="priority"
                                value={newTask.priority}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Start Day"
                            type="date"
                            name="startDay"
                            value={newTask.startDay}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Start Time"
                            type="time"
                            name="startTime"
                            value={newTask.startTime ? newTask.startTime : "00:00"}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="End Day"
                            type="date"
                            name="endDay"
                            value={newTask.endDay}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="End Time"
                            type="time"
                            name="endTime"
                            value={newTask.endTime ? newTask.endTime : "23:59"}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}

                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Duration (minutes)"
                            type="number"
                            name="duration"
                            value={newTask.duration}
                            onChange={handleInputChange}
                            inputProps={{ min: "15", step: "15" }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Add Task
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Task List</Typography>
            <Button onClick={handleSort} variant="outlined" color="primary" sx={{ mb: 2 }}>
                Sort by Priority
            </Button>
            <Grid container spacing={2}>
                {tasks.map(task => {
                    const priorityColor = getPriorityColor(task.priority, theme);
                    return (
                        <Grid item xs={12} sm={6} md={4} key={task._id}>
                            <Card sx={{
                                backgroundColor: priorityColor.background,
                                borderLeft: `4px solid ${priorityColor.border}`,
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: priorityColor.text }}>{task.title}</Typography>
                                    <Typography color="textSecondary">Priority: {task.priority}</Typography>
                                    <Typography color="textSecondary">
                                        Start: {format(new Date(task.startDay), 'yyyy-MM-dd')} {task.startTime}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        End: {format(new Date(task.endDay), 'yyyy-MM-dd')} {task.endTime}
                                    </Typography>
                                    <Typography color="textSecondary">Duration: {task.duration} minutes</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => openEditDialog(task)}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="secondary" onClick={() => handleDelete(task._id)}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Task Title"
                        name="title"
                        value={editingTask?.title || ''}
                        onChange={handleEditInputChange}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            name="priority"
                            value={editingTask?.priority || ''}
                            onChange={handleEditInputChange}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Start Day"
                        type="date"
                        name="startDay"
                        value={editingTask?.startDay || ''}
                        onChange={handleEditInputChange}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Start Time"
                        type="time"
                        name="startTime"
                        value={editingTask?.startTime || ''}
                        onChange={handleEditInputChange}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="End Day"
                        type="date"
                        name="endDay"
                        value={editingTask?.endDay || ''}
                        onChange={handleEditInputChange}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="End Time"
                        type="time"
                        name="endTime"
                        value={editingTask?.endTime || ''}
                        onChange={handleEditInputChange}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Duration (minutes)"
                        type="number"
                        name="duration"
                        value={editingTask?.duration || ''}
                        onChange={handleEditInputChange}
                        margin="normal"
                        inputProps={{ min: "15", step: "15" }}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default TaskManager;

