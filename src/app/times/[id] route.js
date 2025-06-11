import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Time from '@/models/Time'; // Certifique-se que o caminho para seu modelo está correto

// Buscar time por ID
export async function GET(request, { params }) {
    const { id } = params;
    try {
        await connectToDatabase();
        const time = await Time.findById(id).populate('jogadores', 'nome nickname');
        if (!time) {
            return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
        }
        return NextResponse.json(time);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar time' }, { status: 500 });
    }
}

// Atualizar time por ID
export async function PUT(request, { params }) {
    const { id } = params;
    const body = await request.json();
    try {
        await connectToDatabase();
        const updatedTime = await Time.findByIdAndUpdate(id, body, { new: true });
        if (!updatedTime) {
            return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
        }
        return NextResponse.json(updatedTime);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar time' }, { status: 500 });
    }
}

// Deletar time por ID
export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        await connectToDatabase();
        const deletedTime = await Time.findByIdAndDelete(id);
        if (!deletedTime) {
            return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Time deletado com sucesso' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao deletar time' }, { status: 500 });
    }
}