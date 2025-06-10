// CÓDIGO PARA: src/app/api/campeonatos/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// POST: Cria um novo campeonato
export async function POST(req) {
  const body = await req.json();
  // Inclui todos os campos que definimos para campeonatos
  const { 
    nome_campeonato, nome_jogo, promotor_id, tipo, formato, 
    max_participantes, valor_inscricao, premiacao, regras, 
    data_inicio, data_fim, localizacao 
  } = body;

  // Validação simples dos campos
  if (!nome_campeonato || !nome_jogo || !promotor_id || !tipo) {
    return NextResponse.json({ error: 'Dados essenciais incompletos' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const campeonatos = db.collection('campeonatos');

    const novoCampeonato = {
      ...body,
      status: 'Inscrições Abertas', // Status inicial padrão
      dataCriacao: new Date()
    };

    await campeonatos.insertOne(novoCampeonato);

    return NextResponse.json({ message: 'Campeonato criado com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar campeonato:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// GET: Lista todos os campeonatos
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const campeonatos = db.collection('campeonatos');

    const listaCampeonatos = await campeonatos.find({}).toArray();

    return NextResponse.json(listaCampeonatos, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar campeonatos:', error);
    return NextResponse.json({ error: 'Erro ao buscar campeonatos' }, { status: 500 });
  }
}