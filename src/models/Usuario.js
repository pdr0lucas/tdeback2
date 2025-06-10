import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nickname: {type: String, required: true},
  data_nascimento: { type: String, required: true},
  tipo: { type: String, enum: ['jogador', 'organizador'], required: true },
  dataCadastro: { type: Date, default: Date.now }
});

export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
