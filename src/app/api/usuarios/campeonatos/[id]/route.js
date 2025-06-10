// CÓDIGO PARA: src/app/api/campeonatos/[id]/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET: Busca um campeonato específico
export async function GET(_, { params }) {
    // Implementação similar ao GET de /api/usuarios/[id]/route.js
    // ...
}

// PUT: Atualiza um campeonato
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const campeonatos = db.collection('campeonatos');

    const resultado = await campeonatos.updateOne(
      { _id: new ObjectId(id) },
      { $set: body } // Atualiza com os novos dados do corpo da requisição
    );

    if (resultado.matchedCount === 0) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Campeonato atualizado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar campeonato' }, { status: 500 });
  }
}

// DELETE: Exclui um campeonato
export async function DELETE(_, { params }) {
    // Implementação similar ao DELETE de /api/usuarios/[id]/route.js
    // ...
}