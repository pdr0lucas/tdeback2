// CÓDIGO PARA: src/app/api/inscricoes/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// POST: Realiza a inscrição de um jogador ou time em um campeonato
export async function POST(req) {
  const body = await req.json();
  const { campeonato_id, jogador_id, time_id } = body;

  if (!campeonato_id || (!jogador_id && !time_id)) {
    return NextResponse.json({ error: 'Dados de inscrição incompletos' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // 1. VERIFICAR O CAMPEONATO
    const campeonatos = db.collection('campeonatos');
    const campeonato = await campeonatos.findOne({ _id: new ObjectId(campeonato_id) });

    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 });
    }
    if (campeonato.status !== 'Inscrições Abertas') {
      return NextResponse.json({ error: 'As inscrições para este campeonato não estão abertas' }, { status: 403 });
    }

    // 2. VERIFICAR VAGAS
    const inscricoes = db.collection('inscricoes');
    const totalInscritos = await inscricoes.countDocuments({ campeonato_id: new ObjectId(campeonato_id) });
    
    if (totalInscritos >= campeonato.max_participantes) {
      return NextResponse.json({ error: 'Não há mais vagas para este campeonato' }, { status: 409 }); // 409 Conflict
    }

    // 3. VERIFICAR SE JÁ ESTÁ INSCRITO
    const filtroInscricaoExistente = { campeonato_id: new ObjectId(campeonato_id) };
    if (jogador_id) filtroInscricaoExistente.jogador_id = new ObjectId(jogador_id);
    if (time_id) filtroInscricaoExistente.time_id = new ObjectId(time_id);
    
    const inscricaoExistente = await inscricoes.findOne(filtroInscricaoExistente);
    if (inscricaoExistente) {
        return NextResponse.json({ error: 'Este participante já está inscrito no campeonato' }, { status: 409 });
    }

    // 4. CRIAR A INSCRIÇÃO
    const novaInscricao = {
      campeonato_id: new ObjectId(campeonato_id),
      ...(jogador_id && { jogador_id: new ObjectId(jogador_id) }),
      ...(time_id && { time_id: new ObjectId(time_id) }),
      data_inscricao: new Date(),
      status_inscricao: 'Aprovada' // ou 'Pendente' se precisar de aprovação do promotor
    };

    await inscricoes.insertOne(novaInscricao);

    return NextResponse.json({ message: 'Inscrição realizada com sucesso!' }, { status: 201 });

  } catch (error) {
    console.error('Erro ao realizar inscrição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}