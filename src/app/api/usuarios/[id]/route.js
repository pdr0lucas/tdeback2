import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Usuario from '@/models/Usuario';
import jwt from 'jsonwebtoken';

// Função para buscar um usuário
export async function GET(request, { params }) {
    // ... (pode manter como está, pois é uma busca pública de perfil)
}

// Função para ATUALIZAR um usuário
export async function PUT(request, { params }) {
  const { id } = params;
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verifica se o ID do token é o mesmo da rota
    if (decoded.id !== id) {
      return NextResponse.json({ error: 'Não autorizado. Você só pode atualizar seu próprio perfil.' }, { status: 403 });
    }

    const body = await request.json();
    await connectToDatabase();
    
    // Evita que o usuário altere a senha ou o tipo de perfil por esta rota
    delete body.senha;
    delete body.tipo_perfil;

    const updatedUser = await Usuario.findByIdAndUpdate(id, body, { new: true }).select('-senha');
    if (!updatedUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido ou erro no servidor' }, { status: 401 });
  }
}

// Função para DELETAR um usuário (lógica similar ao PUT)
export async function DELETE(request, { params }) {
    const { id } = params;
    const token = request.headers.get('authorization')?.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.id !== id) {
            return NextResponse.json({ error: 'Não autorizado. Você só pode deletar seu próprio perfil.' }, { status: 403 });
        }

        await connectToDatabase();
        const deletedUser = await Usuario.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        return NextResponse.json({ error: 'Token inválido ou erro no servidor' }, { status: 401 });
    }
}