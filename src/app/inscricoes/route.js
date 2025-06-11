// src/app/api/inscricoes/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';
import Campeonato from '@/models/Campeonato'; // Precisamos verificar as vagas
import jwt from 'jsonwebtoken';

// Função para um jogador se inscrever em um campeonato
export async function POST(request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const { id: jogadorId } = jwt.verify(token, process.env.JWT_SECRET);
    const { campeonatoId } = await request.json();

    if (!campeonatoId) {
      return NextResponse.json({ error: 'ID do campeonato é obrigatório' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Verificar se o campeonato existe e se há vagas
    const campeonato = await Campeonato.findById(campeonatoId);
    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 });
    }

    const totalInscritos = await Inscricao.countDocuments({ campeonato: campeonatoId, status: 'Aprovada' });
    if (totalInscritos >= campeonato.numeroMaximoDeParticipantes) {
      return NextResponse.json({ error: 'Não há mais vagas para este campeonato' }, { status: 409 });
    }

    // 2. Verificar se o jogador já está inscrito
    const inscricaoExistente = await Inscricao.findOne({ campeonato: campeonatoId, jogador: jogadorId });
    if (inscricaoExistente) {
      return NextResponse.json({ error: 'Você já está inscrito neste campeonato' }, { status: 409 });
    }

    // 3. Criar a nova inscrição
    const novaInscricao = await Inscricao.create({
      campeonato: campeonatoId,
      jogador: jogadorId,
    });

    return NextResponse.json({ message: 'Inscrição realizada com sucesso!', inscricao: novaInscricao }, { status: 201 });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    console.error('Erro ao criar inscrição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}