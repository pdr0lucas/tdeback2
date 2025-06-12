import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';
import Campeonato from '@/models/Campeonato';
import Usuario from '@/models/Usuario';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/jogador/inscricoes:
 * get:
 * summary: Lista os campeonatos em que o jogador logado está inscrito
 * description: Retorna uma lista de todas as inscrições do jogador autenticado, com detalhes dos campeonatos.
 * tags: [Painel do Jogador]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Lista de inscrições retornada com sucesso.
 * '401':
 * description: Token não fornecido, inválido ou expirado.
 * '500':
 * description: Erro interno do servidor.
 */
export async function GET(request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const { id: jogadorId } = jwt.verify(token, process.env.JWT_SECRET);

    await connectToDatabase();

    // Encontra todas as inscrições que pertencem ao jogador logado
    const minhasInscricoes = await Inscricao.find({ jogador: jogadorId })
      .populate({
        path: 'campeonato',
        model: 'Campeonato',
        select: 'nome_campeonato nome_jogo tipo' // Seleciona apenas alguns campos do campeonato
      });

    return NextResponse.json(minhasInscricoes, { status: 200 });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expirado. Por favor, faça login novamente.' }, { status: 401 });
    }
    console.error("Erro ao buscar inscrições do jogador:", error);
    return NextResponse.json({ error: 'Erro ao buscar inscrições do jogador' }, { status: 500 });
  }
}