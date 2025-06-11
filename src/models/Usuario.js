import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }, // A senha deve ser armazenada como um hash
  data_nascimento: { type: Date, required: true },
  tipo: { 
    type: String, 
    required: true, 
    enum: ['Jogador', 'Promotor de Eventos'] // Garante que o tipo seja um dos dois permitidos
  },
  dataCadastro: { type: Date, default: Date.now }
});

// A linha abaixo evita que o modelo seja recompilado em ambientes de desenvolvimento (hot-reloading)
export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);