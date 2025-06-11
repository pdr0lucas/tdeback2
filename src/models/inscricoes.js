// src/models/Inscricao.js
import mongoose from 'mongoose';

const InscricaoSchema = new mongoose.Schema({
  campeonato: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campeonato',
    required: true,
  },
  jogador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  // Se você for implementar times, pode adicionar um campo 'time' aqui
  // time: { type: mongoose.Schema.Types.ObjectId, ref: 'Time' },
  dataInscricao: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pendente', 'Aprovada', 'Rejeitada'],
    default: 'Aprovada', // Inscrição já entra como aprovada por padrão
  },
});

export default mongoose.models.Inscricao || mongoose.model('Inscricao', InscricaoSchema);