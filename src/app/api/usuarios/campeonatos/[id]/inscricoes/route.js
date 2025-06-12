import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';
import Usuario from '@/models/Usuario'; // CORREÇÃO 2: Importa o modelo Usuario

export async function GET(request, context) { // CORREÇÃO 1: 'context' em vez de '{ params }'
  
  // CORREÇÃO 1: Acessa os params a partir do context
  const { params } = context;
  const { id: campeonatoId } = params;

  if (!campeonatoId) {
    return NextResponse.json({ error: 'ID do campeonato é obrigatório' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const inscricoes = await Inscricao.find({ campeonato: campeonatoId })
      .populate('jogador', 'nome nickname');

    return NextResponse.json(inscricoes, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return NextResponse.json({ error: 'Erro ao buscar inscrições' }, { status: 500 });
  }
}