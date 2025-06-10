// CÓDIGO PARA: src/app/api/times/[id]/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET: Busca um time específico por ID
export async function GET(_, { params }) {
    // Implementação similar ao GET de /api/usuarios/[id]/route.js
    // Você pode usar o mesmo $lookup do GET de todos os times para detalhar os membros
    // ...
}


// PUT: Atualiza um time (ex: adicionar membro)
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { adicionar_membro_id, remover_membro_id, nome_time } = body;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID do time inválido' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const times = db.collection('times');
    
    const updateQuery = {};
    if (nome_time) {
        updateQuery.$set = { nome_time };
    }
    if (adicionar_membro_id) {
        // Usa $addToSet para adicionar um membro apenas se ele não existir no array
        updateQuery.$addToSet = { membros: new ObjectId(adicionar_membro_id) };
    }
    if (remover_membro_id) {
        // Usa $pull para remover um membro do array
        updateQuery.$pull = { membros: new ObjectId(remover_membro_id) };
    }

    const resultado = await times.updateOne({ _id: new ObjectId(id) }, updateQuery);

    if (resultado.matchedCount === 0) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Time atualizado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar time' }, { status: 500 });
  }
}

// DELETE: Exclui um time
export async function DELETE(_, { params }) {
    // Implementação similar ao DELETE de /api/usuarios/[id]/route.js
    // ...
}