// import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';

// LOCALHOST:3300/API/[ID]
// POST -> CADASTRO USUÁRIO
// REQUER NO CORPO {NOME, EMAIL, SENHA, TIPO}


// GET -> BUSCA TODOS OS USUÁRIOS
export async function GET() {
  // try {
  //   const client = await clientPromise;
  //   const db = client.db();
  //   const usuarios = db.collection('usuarios');

  //   const listaUsuarios = await usuarios
  //     .find({}, { projection: { senha: 0 } }) 
  //     .toArray();

  //   return NextResponse.json(listaUsuarios, { status: 200 });
  // } catch (error) {
  //   console.error('Erro ao buscar usuários:', error);
  //   return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  // }
  return NextResponse.json({ok: 'OK GET API'},  {status: 200})
}
