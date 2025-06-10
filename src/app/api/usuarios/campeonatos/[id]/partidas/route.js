// CÓDIGO PARA: src/app/api/campeonatos/[id]/partidas/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// POST: Cria uma nova partida dentro de um campeonato
export async function POST(req, { params }) {
  const { id: campeonato_id } = params;
  const body = await req.json();
  const { participante1, participante2, data_partida } = body;

  if (!participante1 || !participante2) {
    return NextResponse.json({ error: 'Uma partida precisa de dois participantes' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const partidas = db.collection('partidas');

    const novaPartida = {
      campeonato_id: new ObjectId(campeonato_id),
      participante1: new ObjectId(participante1), // Pode ser um jogador_id ou time_id
      participante2: new ObjectId(participante2), // Pode ser um jogador_id ou time_id
      data_partida: new Date(data_partida),
      status_partida: 'Agendada',
      resultado: null,
      vencedor: null,
    };

    await partidas.insertOne(novaPartida);
    return NextResponse.json({ message: 'Partida criada com sucesso!' }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar partida:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// GET: Lista todas as partidas de um campeonato
export async function GET(_, { params }) {
    const { id: campeonato_id } = params;
    // Aqui você faria uma busca na coleção 'partidas' filtrando pelo campeonato_id
    // ...
}