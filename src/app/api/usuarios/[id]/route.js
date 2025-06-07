import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(_, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usuarios = db.collection('usuarios');

    const usuario = await usuarios.findOne(
      { _id: new ObjectId(id) },
      { projection: { senha: 0 } }
    );

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { nome, email, tipo } = body;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usuarios = db.collection('usuarios');

    const resultado = await usuarios.updateOne(
      { _id: new ObjectId(id) },
      { $set: { nome, email, tipo } }
    );

    if (resultado.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usuarios = db.collection('usuarios');

    const resultado = await usuarios.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
