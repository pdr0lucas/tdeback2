// CÓDIGO PARA: src/app/api/times/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// POST: Cria um novo time
export async function POST(req) {
  const body = await req.json();
  const { nome_time, lider_id, membros } = body; // 'membros' deve ser um array de IDs de usuários

  if (!nome_time || !lider_id) {
    return NextResponse.json({ error: 'Nome do time e ID do líder são obrigatórios' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const times = db.collection('times');

    // Garante que os IDs dos membros são válidos e converte para ObjectId
    const membrosIds = (membros || []).map(id => new ObjectId(id));

    const novoTime = {
      nome_time,
      lider_id: new ObjectId(lider_id),
      membros: [new ObjectId(lider_id), ...membrosIds], // O líder também é um membro
      dataCriacao: new Date(),
    };

    await times.insertOne(novoTime);

    return NextResponse.json({ message: 'Time criado com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar time:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// GET: Lista todos os times
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const times = db.collection('times');
    
    // Usando aggregate para buscar os dados dos membros em vez de apenas os IDs
    const listaTimes = await times.aggregate([
      {
        $lookup: {
          from: 'usuarios', // A coleção de usuários
          localField: 'membros',
          foreignField: '_id',
          as: 'detalhes_membros' // Novo campo com os dados completos dos membros
        }
      },
      {
        $project: { // Exclui a senha dos membros retornados
          'detalhes_membros.senha': 0
        }
      }
    ]).toArray();

    return NextResponse.json(listaTimes, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar times:', error);
    return NextResponse.json({ error: 'Erro ao buscar times' }, { status: 500 });
  }
}