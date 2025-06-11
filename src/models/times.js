// src/models/Time.js
import mongoose from 'mongoose';

const TimeSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  capitao: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

export default mongoose.models.Time || mongoose.model('Time', TimeSchema);