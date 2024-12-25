import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  startDay: { type: Date, required: true },
  startTime: { type: String, required: true, default: "00:00" },
  endDay: { type: Date, required: true },
  endTime: { type: String, required: true, default: "23:59" },
  duration: { type: Number, required: true, min: 15 }, // Duration in minutes
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('Task', taskSchema);

