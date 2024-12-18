import 'dotenv/config';
import Express from "express";
import mongoose from "mongoose";
import pkg from 'body-parser';
import cors from 'cors';

import taskRoutes from './routers/taskRoutes.js';
import userRoutes from './routers/userRoutes.js';

const { json, urlencoded } = pkg;

var app = Express();

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));
// Define REST API, Task
app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
mongoose.connect(process.env.VITE_MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    });
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

