import mongoose from 'mongoose';

const CampeonatoSchema = new mongoose.Schema({
  nome_campeonato: { type: String, required: true },
  nome_jogo: { type: String, required: true },
  promotor_id: { // Relação com o criador do campeonato
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  tipo: { type: String, required: true, enum: ['Individual', 'Equipes'] },
  formato: { type: String, required: true, enum: ['Eliminação Simples', 'Eliminação Dupla', 'Fase de Grupos'] },
  max_participantes: { type: Number, required: true },
  premiacao: { type: String },
  regras: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['Inscrições Abertas', 'Em Andamento', 'Finalizado'],
    default: 'Inscrições Abertas'
  }
});

export default mongoose.models.Campeonato || mongoose.model('Campeonato', CampeonatoSchema);