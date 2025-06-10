// CÓDIGO PARA: src/app/api/auth/login/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// POST: Realiza o login do usuário
export async function POST(req) {
  const body = await req.json();
  const { email, senha } = body;

  if (!email || !senha) {
    return NextResponse.json({ error: 'Email and senha são obrigatórios' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usuarios = db.collection('usuarios');
    const usuario = await usuarios.findOne({ email });

    if (!usuario) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // A senha está correta, gerar o token!
    const token = jwt.sign(
      { 
        userId: usuario._id, 
        tipo: usuario.tipo 
      },
      process.env.JWT_SECRET, // Adicione uma JWT_SECRET no seu arquivo .env.local!
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // Remove a senha do objeto antes de retornar
    delete usuario.senha;

    return NextResponse.json({ usuario, token });

  } catch (error) {
    console.error('Erro de login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}