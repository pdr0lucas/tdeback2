import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb'; // Importa a nova função de conexão
import Usuario from '@/models/Usuario';       // Importa o modelo de usuário

export async function POST(req) {
  const body = await req.json();
  const { email, senha } = body;

  if (!email || !senha) {
    return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
  }

  try {
    // 1. Conecta ao banco usando Mongoose
    await connectToDatabase();

    // 2. Encontra o usuário no banco com Mongoose
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Mensagem genérica para não informar se o email existe ou não
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // 3. Compara a senha enviada com a senha criptografada no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // 4. A senha está correta, vamos gerar o token!
    const token = jwt.sign(
      {
        id: usuario._id, // Usando 'id' para consistência
        tipo: usuario.tipo
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // Remove a senha do objeto antes de retornar a resposta
    const { senha: _, ...usuarioSemSenha } = usuario.toObject();

    return NextResponse.json({ usuario: usuarioSemSenha, token });

  } catch (error) {
    console.error('Erro de login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}