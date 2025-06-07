

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';


export async function POST(req) {
  const body = await req.json();
  const { nome, email, senha, tipo } = body;

  if (!nome || !email || !senha || !tipo) {
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


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usuarios = db.collection('usuarios');

    const listaUsuarios = await usuarios
      .find({}, { projection: { senha: 0 } }) 
      .toArray();

    return NextResponse.json(listaUsuarios, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}
