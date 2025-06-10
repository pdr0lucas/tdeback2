import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// http://localhost:3300/api/usuarios/criar-usuario
// POST -> RECEBE NO CORPO {nome, nickname, data-nascimento, email, senha, tipo}
export async function POST(req) {
  const body = await req.json();
  const { nome, nickname, data_nascimento, email, senha, tipo } = body;

  if (!nome || !nickname || !data_nascimento || !email || !senha || !tipo) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usuarios = db.collection('usuarios');

    const usuarioExistente = await usuarios.findOne({ email });

    if (usuarioExistente) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
      email,
      senha: senhaCriptografada,
      tipo,
      dataCadastro: new Date(),
    };

    await usuarios.insertOne(novoUsuario);

    return NextResponse.json({ message: 'Usuário criado com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}