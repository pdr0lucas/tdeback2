import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import Usuario from '@/models/Usuario';

export async function POST(req) {
  // MENSAGEM DE TESTE DEFINITIVO
  console.log("--- EXECUTANDO O CÓDIGO CORRETO (COM BANCO DE DADOS) ---");

  try {
    const { nome, nickname, dataNascimento, email, senha, tipo } = await req.json();

    if (!nome || !nickname || !dataNascimento || !email || !senha || !tipo) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    await clientPromise; 

    const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { nickname }] });

    if (usuarioExistente) {
      return NextResponse.json({ error: 'Email ou nickname já cadastrado' }, { status: 409 });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome,
      nickname,
      dataNascimento,
      email,
      senha: senhaCriptografada,
      tipo,
    });

    return NextResponse.json({ message: 'Usuário criado com sucesso!' }, { status: 201 });

  } catch (error) {
    console.error('ERRO NO BLOCO DE CÓDIGO CORRETO:', error); 
    return NextResponse.json({ error: 'Erro interno do servidor ao cadastrar' }, { status: 500 });
  }
}