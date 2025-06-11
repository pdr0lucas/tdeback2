import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb'; // Importa a nova função de conexão
import Usuario from '@/models/Usuario'; // Seu modelo Mongoose

export async function POST(req) {
  const body = await req.json();
  const { nome, nickname, data_nascimento, email, senha, tipo } = body;

  if (!nome || !nickname || !data_nascimento || !email || !senha || !tipo) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    // 1. Conecta ao banco usando Mongoose
    await connectToDatabase();

    // 2. Verifica se o usuário já existe usando o modelo Mongoose
    const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { nickname }] });

    if (usuarioExistente) {
      return NextResponse.json({ error: 'Email ou nickname já cadastrado' }, { status: 409 });
    }

    // 3. Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // 4. Cria o usuário com o modelo Mongoose
    // O erro de digitação estava aqui: 'dataNascimento' foi trocado por 'data_nascimento'
    await Usuario.create({
      nome,
      nickname,
      data_nascimento, // CORRIGIDO
      email,
      senha: senhaCriptografada,
      tipo,
    });

    return NextResponse.json({ message: 'Usuário criado com sucesso!' }, { status: 201 });

  } catch (error) {
    console.error('ERRO AO CRIAR USUÁRIO:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao cadastrar' }, { status: 500 });
  }
}