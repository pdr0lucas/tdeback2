// CÓDIGO PARA: src/app/api/partidas/[partidaId]/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// PUT: Atualiza o resultado de uma partida
export async function PUT(req, { params }) {
  const { partidaId } = params;
  const body = await req.json();
  const { resultado, vencedor } = body; // ex: resultado: { score1: 2, score2: 1 }, vencedor: "id_do_vencedor"

  if (!ObjectId.isValid(partidaId)) {
    return NextResponse.json({ error: 'ID da partida inválido' }, { status: 400 });
  }
  if (!resultado || !vencedor) {
      return NextResponse.json({ error: 'Resultado e vencedor são obrigatórios para finalizar a partida'}, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const partidas = db.collection('partidas');

    const resultadoUpdate = await partidas.updateOne(
      { _id: new ObjectId(partidaId) },
      { 
        $set: {
            resultado: resultado,
            vencedor: new ObjectId(vencedor),
            status_partida: 'Concluída'
        } 
      }
    );

    if (resultadoUpdate.matchedCount === 0) {
      return NextResponse.json({ error: 'Partida não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resultado da partida atualizado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar partida' }, { status: 500 });
  }
}