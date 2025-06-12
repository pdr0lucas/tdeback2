// src/models/Campeonato.js
import mongoose from 'mongoose';

const CampeonatoSchema = new mongoose.Schema({
  nome_campeonato: { type: String, required: true },
  nome_jogo: { type: String, required: true },
  tipo: {
    type: String,
    required: true,
    enum: ['individual', 'equipes'] // CORRIGIDO: Adicionado 'individual'
  },
  max_participantes: { type: Number, required: true },
  valor_inscricao: { type: Number, default: 0 },
  formato: {
    type: String,
    enum: ['eliminacao-simples', 'fase-de-grupos', 'pontos-corridos'] // CORRIGIDO: Adicionado 'eliminacao-simples' e outros
  },
  regras: { type: String },
  premiacao: { type: String },
  status: {
    type: String,
    enum: ['Inscrições Abertas', 'Em Andamento', 'Finalizado'],
    default: 'Inscrições Abertas',
  },
  promotor_id: { // CORRIGIDO: Nome do campo ajustado
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
});

export default mongoose.models.Campeonato || mongoose.model('Campeonato', CampeonatoSchema);