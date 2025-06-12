import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Campeonato from '@/models/Campeonato';
import jwt from 'jsonwebtoken';

// Função para BUSCAR um campeonato específico por ID
export async function GET(request, context) {
  const { params } = context;
  const { id: campeonatoId } = params;

  try {
    await connectToDatabase();
    const campeonato = await Campeonato.findById(campeonatoId).populate('promotor_id', 'nome nickname');

    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 });
    }

    return NextResponse.json(campeonato, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar campeonato:", error);
    return NextResponse.json({ error: 'Erro ao buscar campeonato' }, { status: 500 });
  }
}

// Função para ATUALIZAR um campeonato
export async function PUT(request, context) {
  const { params } = context;
  const { id: campeonatoId } = params;
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const { id: promotorId } = jwt.verify(token, process.env.JWT_SECRET);
    const body = await request.json();

    await connectToDatabase();

    const campeonato = await Campeonato.findById(campeonatoId);
    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 });
    }

    // Lógica de segurança: Apenas o promotor que criou pode atualizar
    if (campeonato.promotor_id.toString() !== promotorId) {
      return NextResponse.json({ error: 'Não autorizado a atualizar este campeonato' }, { status: 403 });
    }

    const campeonatoAtualizado = await Campeonato.findByIdAndUpdate(campeonatoId, body, { new: true });

    return NextResponse.json(campeonatoAtualizado, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar campeonato:", error);
    return NextResponse.json({ error: 'Erro ao atualizar campeonato' }, { status: 500 });
  }
}

// Função para DELETAR um campeonato
export async function DELETE(request, context) {
  const { params } = context;
  const { id: campeonatoId } = params;
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const { id: promotorId } = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectToDatabase();
    
    const campeonato = await Campeonato.findById(campeonatoId);
    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 });
    }

    // Lógica de segurança: Apenas o promotor que criou pode deletar
    if (campeonato.promotor_id.toString() !== promotorId) {
      return NextResponse.json({ error: 'Não autorizado a deletar este campeonato' }, { status: 403 });
    }

    await Campeonato.findByIdAndDelete(campeonatoId);

    return NextResponse.json({ message: 'Campeonato deletado com sucesso' });

  } catch (error) {
    console.error("Erro ao deletar campeonato:", error);
    return NextResponse.json({ error: 'Erro ao deletar campeonato' }, { status: 500 });
  }
}