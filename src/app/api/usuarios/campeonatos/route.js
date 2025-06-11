import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Campeonato from '@/models/Campeonato'; // Certifique-se que o caminho para seu modelo está correto

// Função para buscar um campeonato por ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();
    const campeonato = await Campeonato.findById(id);

    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 });
    }

    return NextResponse.json(campeonato);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar campeonato', details: error.message }, { status: 500 });
  }
}

// Função para atualizar um campeonato por ID
export async function PUT(request, { params }) {
    const { id } = params;
    const body = await request.json();

    try {
        await connectToDatabase();
        const updatedCampeonato = await Campeonato.findByIdAndUpdate(id, body, { new: true });

        if (!updatedCampeonato) {
            return NextResponse.json({ error: 'Campeonato não encontrado para atualização' }, { status: 404 });
        }

        return NextResponse.json(updatedCampeonato);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar campeonato', details: error.message }, { status: 500 });
    }
}

// Função para deletar um campeonato por ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();
    const deletedCampeonato = await Campeonato.findByIdAndDelete(id);

    if (!deletedCampeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado para exclusão' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Campeonato deletado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar campeonato', details: error.message }, { status: 500 });
  }
}