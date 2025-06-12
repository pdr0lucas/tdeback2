import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';
import Campeonato from '@/models/Campeonato';
import Usuario from '@/models/Usuario'; // Importar para registrar o schema
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/usuarios/inscricoes/{inscricaoId}:
 * put:
 * summary: Atualiza o status de uma inscrição (Aprovar/Rejeitar)
 * description: Permite que o promotor de um campeonato aprove ou rejeite uma inscrição específica. Requer autenticação de promotor.
 * tags: [Inscrições]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: inscricaoId
 * required: true
 * schema:
 * type: string
 * description: O ID da inscrição a ser atualizada.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * enum: [Aprovada, Rejeitada]
 * responses:
 * '200':
 * description: Inscrição atualizada com sucesso.
 * '400':
 * description: Status inválido ou faltando.
 * '401':
 * description: Token não fornecido, inválido ou expirado.
 * '403':
 * description: Ação não autorizada (usuário não é o promotor do evento).
 * '404':
 * description: Inscrição ou campeonato não encontrado.
 * '500':
 * description: Erro interno do servidor.
 */
export async function PUT(request, context) {
  const { params } = context;
  const { id: inscricaoId } = params;

  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const { id: promotorId, tipo } = jwt.verify(token, process.env.JWT_SECRET);

    if (tipo !== 'Promotor de Eventos') {
      return NextResponse.json({ error: 'Apenas promotores podem gerenciar inscrições' }, { status: 403 });
    }

    const { status } = await request.json();
    if (!status || !['Aprovada', 'Rejeitada'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido. Use "Aprovada" ou "Rejeitada".' }, { status: 400 });
    }

    await connectToDatabase();

    // Lógica de segurança para garantir que o usuário logado é o dono do campeonato
    const inscricao = await Inscricao.findById(inscricaoId);
    if (!inscricao) {
      return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
    }

    const campeonato = await Campeonato.findById(inscricao.campeonato);
    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato associado não encontrado' }, { status: 404 });
    }

    // Compara o ID do dono do campeonato com o ID do token
    if (campeonato.promotor_id.toString() !== promotorId) {
      return NextResponse.json({ error: 'Você não tem permissão para gerenciar inscrições deste campeonato' }, { status: 403 });
    }

    // Se tudo estiver certo, atualiza a inscrição
    const inscricaoAtualizada = await Inscricao.findByIdAndUpdate(
      inscricaoId,
      { status },
      { new: true }
    );

    return NextResponse.json(inscricaoAtualizada, { status: 200 });

  } catch (error) {
    // Tratamento de erro específico para token expirado
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expirado. Por favor, faça login novamente.' }, { status: 401 });
    }
    console.error("Erro ao atualizar inscrição:", error);
    return NextResponse.json({ error: 'Erro ao atualizar inscrição', details: error.message }, { status: 500 });
  }
}

// Você pode adicionar outras funções (GET, DELETE) para este arquivo no futuro, se necessário.