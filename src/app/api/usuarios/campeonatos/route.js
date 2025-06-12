import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Campeonato from '@/models/Campeonato';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/usuarios/campeonatos:
 * post:
 * summary: Cria um novo campeonato
 * description: Cria um novo campeonato, requer autenticação de um promotor de eventos.
 * tags: [Campeonatos]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome_campeonato:
 * type: string
 * nome_jogo:
 * type: string
 * tipo:
 * type: string
 * max_participantes:
 * type: number
 * valor_inscricao:
 * type: number
 * formato:
 * type: string
 * regras:
 * type: string
 * premiacao:
 * type: string
 * responses:
 * '201':
 * description: Campeonato criado com sucesso.
 * '400':
 * description: Campos obrigatórios ausentes.
 * '401':
 * description: Token não fornecido ou inválido.
 * '403':
 * description: Apenas promotores de eventos podem criar campeonatos.
 * '500':
 * description: Erro interno do servidor.
 */
export async function POST(request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const { id: promotorId, tipo: tipoUsuario } = jwt.verify(token, process.env.JWT_SECRET);

    // Verificação de segurança: apenas promotores podem criar campeonatos
    if (tipoUsuario !== 'Promotor de Eventos') {
      return NextResponse.json({ error: 'Apenas promotores de eventos podem criar campeonatos' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validação alinhada com os erros do Mongoose que você recebeu
    if (!body.nome_campeonato || !body.nome_jogo || !body.tipo || !body.max_participantes) {
        return NextResponse.json({ 
            error: 'Campos obrigatórios ausentes. Verifique se enviou: nome_campeonato, nome_jogo, tipo, max_participantes.' 
        }, { status: 400 });
    }

    await connectToDatabase();

   // CÓDIGO CORRIGIDO
const novoCampeonato = await Campeonato.create({
  ...body,
  promotor_id: promotorId, 
});

    return NextResponse.json(novoCampeonato, { status: 201 });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    // Se for um erro de validação do Mongoose, retorna uma mensagem mais clara
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Erro de validação', details: error.message }, { status: 400 });
    }
    console.error('Erro ao criar campeonato:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao criar campeonato' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/usuarios/campeonatos:
 * get:
 * summary: Lista todos os campeonatos
 * description: Retorna uma lista de todos os campeonatos cadastrados na plataforma.
 * tags: [Campeonatos]
 * responses:
 * '200':
 * description: Lista de campeonatos retornada com sucesso.
 * '500':
 * description: Erro interno do servidor.
 */
export async function GET() {
  try {
    await connectToDatabase();
    // Usamos .populate() para substituir o ID do promotor por alguns de seus dados
    const campeonatos = await Campeonato.find({}).populate('promotor', 'nome nickname');
    return NextResponse.json(campeonatos);
  } catch (error) {
    console.error('Erro ao buscar campeonatos:', error);
    return NextResponse.json({ error: 'Erro ao buscar campeonatos' }, { status: 500 });
  }
}