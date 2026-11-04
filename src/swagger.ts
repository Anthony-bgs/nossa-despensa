import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';
import { PadraoMensagem } from './utils/padraomensagem';

export const swaggerDocument: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Nossa Despensa API',
    description: 'Documentação da API do sistema Nossa Despensa',
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Informe apenas o token JWT. O Swagger adicionará o prefixo Bearer.',
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['autorização'],
        summary: 'Login de usuário',
        description:
          'Realiza o login de um usuário no sistema e gera um token de autenticação.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'senha'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  senha: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login bem-sucedido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 200 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/login' },
                    data: {
                      type: 'object',
                      properties: {
                        access_token: {
                          type: 'string',
                          example: 'eyJhbGciOi...',
                        },
                        date: {
                          type: 'string',
                          format: 'date-time',
                          example: '2026-09-24T16:08:22.124Z',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados de login inválidos.',
            content: {
              'application/json': {
                example: {
                  statusCode: 400,
                  timestamp: '2026-09-24T16:08:22.124Z',
                  path: '/auth/login',
                  message: PadraoMensagem.ERRO_VALIDACAO,
                },
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 400 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/login' },
                    message: {
                      type: 'string',
                      example: PadraoMensagem.ERRO_VALIDACAO,
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Erro de autenticação.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-24T16:08:22.124Z',
                  path: '/auth/login',
                  message: PadraoMensagem.ERRO_VALIDACAO,
                },
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 401 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/login' },
                    message: {
                      type: 'string',
                      example: PadraoMensagem.ERRO_VALIDACAO,
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 500 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/login' },
                    message: {
                      type: 'string',
                      example: PadraoMensagem.ERRO_INTERNO,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/validate-token': {
      get: {
        tags: ['autorização'],
        summary: 'Validar o token de acesso',
        description: 'Valida o token de autenticação do usuário.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Token válido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 200 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/validate-token' },
                    data: {
                      type: 'object',
                      properties: {
                        valid: { type: 'boolean', example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Token inválido ou não fornecido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 401 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/validate-token' },
                    message: {
                      type: 'string',
                      example: PadraoMensagem.ERRO_ACESSO_NEGADO,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/google': {
      get: {
        tags: ['autorização'],
        summary: 'Iniciar autenticação via Google',
        description:
          'Inicia o fluxo OAuth e redireciona o usuário para a tela de login do Google.',
        responses: {
          '302': {
            description: 'Redireciona para o Google',
            headers: {
              Location: {
                description: 'URL de autorização do Google',
                schema: { type: 'string', format: 'uri' },
              },
            },
          },
        },
      },
    },
    '/auth/google/callback': {
      get: {
        tags: ['autorização'],
        summary: 'Callback da autenticação via Google',
        description:
          'Recebe o retorno do Google, cria ou localiza o usuário, grava o JWT no cookie HttpOnly auth_token e redireciona para o frontend.',
        parameters: [
          {
            name: 'code',
            in: 'query',
            required: false,
            description: 'Código OAuth enviado pelo Google',
            schema: { type: 'string' },
          },
          {
            name: 'state',
            in: 'query',
            required: false,
            description: 'Estado do fluxo OAuth, quando configurado',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '302': {
            description: 'Cookie criado e redirecionamento para o frontend',
            headers: {
              Location: {
                description: 'URL do frontend configurada em FRONTEND_URL',
                schema: { type: 'string', format: 'uri' },
              },
              'Set-Cookie': {
                description: 'Cookie HttpOnly contendo o JWT da aplicação',
                schema: { type: 'string' },
              },
            },
          },
          '401': {
            description: 'Falha na autenticação do Google',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 401 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/google/callback' },
                    message: {
                      type: 'string',
                      example: PadraoMensagem.ERRO_ACESSO_NEGADO,
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Erro interno ao criar ou localizar o usuário Google',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 500 },
                    timestamp: { type: 'string', format: 'date-time' },
                    path: { type: 'string', example: '/auth/google/callback' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/casa/': {
      post: {
        tags: ['casa'],
        summary: 'Criar uma nova casa',
        description:
          'Cria uma nova casa no sistema. O usuarioID e obtido automaticamente do token JWT enviado no header Authorization; portanto, nao deve ser informado no corpo da requisicao.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome'],
                properties: {
                  nome: { type: 'string', example: 'Minha Casa' },
                  descricao: { type: 'string', example: 'Casa de exemplo' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Casa criada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 201,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/',
                  data: 1,
                },
              },
            },
          },
          '400': {
            description: 'Dados da casa invalidos.',
            content: {
              'application/json': {
                example: {
                  statusCode: 400,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/',
                  message:
                    PadraoMensagem.ERRO_DADOS_INVALIDOS +
                    ' ou ' +
                    PadraoMensagem.ERRO_DADOS_INCOMPLETOS,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT invalido ou nao fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/',
                  message: 'Acesso negado',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno ao criar a casa.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/',
                },
              },
            },
          },
        },
      },
    },
    '/casa/minha-casa': {
      get: {
        tags: ['casa'],
        summary: 'Obter informações da casa do usuário',
        description:
          'Retorna as informações da casa do usuário logado. O usuarioID é obtido automaticamente do token JWT enviado no header Authorization; ',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Informações da casa obtidas com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/minha-casa',
                  data: {
                    casa: {
                      id: 1,
                      nome: 'Minha Casa',
                      descricao: 'Casa de exemplo',
                      criadoPor: 1,
                      atualizadoEm: '2026-09-25T12:00:00.000Z',
                      criadoEm: '2026-09-25T12:00:00.000Z',
                    },
                    membros: [],
                  },
                },
              },
            },
          },
          '401': {
            description: 'Token JWT invalido ou nao fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/minha-casa',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: '',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/minha-casa',
                },
              },
            },
          },
          '404': {
            description: 'Casa do usuário não encontrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/minha-casa',
                  message: PadraoMensagem.ERRO_NAO_ENCONTRADO,
                },
              },
            },
          },
        },
      },
    },
    '/casa/entrar-convite': {
      post: {
        tags: ['casa'],
        summary: 'Entrar em uma casa através de um convite',
        description:
          'Permite que um usuário entre em uma casa existente através de um convite, as informações do usuário são obtidas automaticamente do token JWT enviado no header Authorization; portanto, não devem ser informadas no corpo da requisição.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  codigo: {
                    type: 'string',
                    example: 'ABC123',
                    description: 'Código do convite',
                  },
                },
                required: ['codigo'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário entrou na casa com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 201,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/entrar-convite',
                  data: 'Operação realizada com sucesso',
                },
              },
            },
          },
          '400': {
            description: 'Convite inválido ou erro ao processar a entrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 400,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/entrar-convite',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
    },
    '/casa/criacao-completa': {
      post: {
        tags: ['fluxo completo'],
        summary: 'fluxo completo de criação',
        description:
          'Cria uma nova casa, despensa, local de armazenamento e adiciona produtos. O usuarioID é obtido automaticamente do token JWT enviado no header Authorization; portanto, não deve ser informado no corpo da requisição.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['casa', 'itens'],
                properties: {
                  casa: { type: 'string', example: 'Minha Casa' },
                  itens: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['despensa', 'prateleira', 'produtos'],
                      properties: {
                        despensa: { type: 'string', example: 'Minha Despensa' },
                        prateleira: {
                          type: 'string',
                          example: 'Minha Prateleira',
                        },
                        produtos: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: [
                              'id',
                              'codigoBarras',
                              'nome',
                              'marca',
                              'tamanhoPadrao',
                              'unidadeMedida',
                              'criadoEm',
                              'atualizadoEm',
                              'itemDespensa',
                            ],
                            properties: {
                              id: { type: 'integer', example: 1 },
                              codigoBarras: {
                                type: 'string',
                                example: '7891234567890',
                              },
                              nome: { type: 'string', example: 'Arroz' },
                              marca: { type: 'string', example: 'Marca' },
                              tamanhoPadrao: { type: 'number', example: 1 },
                              unidadeMedida: { type: 'string', example: 'kg' },
                              criadoEm: { type: 'string', format: 'date-time' },
                              atualizadoEm: {
                                type: 'string',
                                format: 'date-time',
                              },
                              itemDespensa: {
                                type: 'object',
                                required: [
                                  'quantidade',
                                  'validade',
                                  'categoria',
                                ],
                                properties: {
                                  quantidade: { type: 'number', example: 2 },
                                  validade: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2026-12-31',
                                  },
                                  categoria: { type: 'integer', example: 1 },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description:
              'Casa, despensa, local de armazenamento e produtos criados com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 201,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/criacao-completa',
                  data: 'Operacao realizada com sucesso',
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos ou falha ao criar algum recurso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 400,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/criacao-completa',
                  message: PadraoMensagem.ERRO_DADOS_INVALIDOS,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/criacao-completa',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/casa/criacao-completa',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
    },
    '/categorias': {
      post: {
        tags: ['categoria'],
        summary: 'Criar uma nova categoria',
        description: 'Cria uma nova categoria no sistema.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome'],
                properties: {
                  nome: { type: 'string', example: 'Bebidas' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Categoria criada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 201,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias',
                  data: {
                    id: 1,
                    nome: 'Bebidas',
                    criado_em: '2026-09-25T12:00:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos ou falha ao criar a categoria.',
            content: {
              'application/json': {
                example: {
                  statusCode: 400,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['categoria'],
        summary: 'Listar categorias',
        description: 'Lista todas as categorias no sistema.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: {
                    type: 'string',
                    description: 'Filtro parcial pelo nome da categoria.',
                    example: 'Beb',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Categorias listadas com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias',
                  data: [
                    {
                      id: 1,
                      nome: 'Bebidas',
                      criado_em: '2026-09-25T12:00:00.000Z',
                    },
                  ],
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
    },
    '/categorias/{id}': {
      get: {
        tags: ['categoria'],
        summary: 'Buscar categoria por ID',
        description: 'Busca uma categoria específica pelo seu ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Categoria encontrada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  data: {
                    id: 1,
                    nome: 'Bebidas',
                    criado_em: '2026-09-25T12:00:00.000Z',
                  },
                },
              },
            },
          },
          '404': {
            description: 'Categoria não encontrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/999',
                  message: PadraoMensagem.ERRO_NAO_ENCONTRADO,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['categoria'],
        summary: 'Atualizar categoria por ID',
        description: 'Atualiza uma categoria específica pelo seu ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Categoria atualizada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  data: PadraoMensagem.SUCESSO_ATUALIZACAO,
                },
              },
            },
          },
          '404': {
            description: 'Categoria não encontrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/999',
                  message: PadraoMensagem.ERRO_NAO_ENCONTRADO,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['categoria'],
        summary: 'Deletar categoria por ID',
        description: 'Deleta uma categoria específica pelo seu ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Categoria deletada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  data: 'Operação realizada com sucesso',
                },
              },
            },
          },
          '404': {
            description: 'Categoria não encontrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/999',
                  message: PadraoMensagem.ERRO_NAO_ENCONTRADO,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
          '400': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 400,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/categorias/1',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
    },
    '/despensas': {
      post: {
        tags: ['despensa'],
        summary: 'Criar uma nova despensa',
        description: 'Cria uma nova despensa no sistema.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'casaId'],
                properties: {
                  nome: { type: 'string', example: 'Despensa da Cozinha' },
                  casaId: { type: 'integer', example: 1 },
                  descricao: {
                    type: 'string',
                    example: 'Despensa para alimentos secos',
                  },
                  tipo: { type: 'string', example: 'produtos de limpeza' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Despensa criada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 201,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas',
                  data: {
                    id: 1,
                    nome: 'Despensa da Cozinha',
                    idUsuario: 1,
                    criadoEm: '2026-09-25T12:00:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos ou faltando',
            content: {
              'application/json': {
                example: {
                  statusCode: 400,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas',
                  message:
                    PadraoMensagem.ERRO_DADOS_INVALIDOS +
                    ' ou ' +
                    PadraoMensagem.ERRO_DADOS_INCOMPLETOS,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['despensa'],
        summary: 'Listar as despensas do usuário',
        description: 'Retorna as despensas vinculadas ao usuário autenticado.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Despensas listadas com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas',
                  data: [
                    {
                      id: 1,
                      nome: 'Despensa da Cozinha',
                      idUsuario: 1,
                      criadoEm: '2026-09-25T12:00:00.000Z',
                      quantidadeProdutos: 3,
                      quantidadeLocaisArmazenamento: 2,
                    },
                  ],
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor.',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas',
                  message: PadraoMensagem.ERRO_INTERNO,
                },
              },
            },
          },
        },
      },
    },
    '/despensas/{id}': {
      get: {
        tags: ['despensa'],
        summary: 'Buscar despensa por ID',
        description: 'Retorna uma despensa específica pelo seu ID.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Despensa encontrada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/1',
                  data: {
                    id: 1,
                    nome: 'Despensa da Cozinha',
                    idUsuario: 1,
                    criadoEm: '2026-09-25T12:00:00.000Z',
                    quantidadeProdutos: 3,
                    quantidadeLocaisArmazenamento: 2,
                    locaisArmazenamentoDespensa: [],
                  },
                },
              },
            },
          },
          '404': {
            description: 'Despensa não encontrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/999',
                  message: PadraoMensagem.ERRO_NAO_ENCONTRADO,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/1',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['despensa'],
        summary: 'Atualizar despensa por ID',
        description: 'Atualiza o nome de uma despensa específica.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome'],
                properties: {
                  nome: { type: 'string', example: 'Despensa atualizada' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Despensa atualizada com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/1',
                  data: {
                    id: 1,
                    nome: 'Despensa atualizada',
                    idUsuario: 1,
                    criadoEm: '2026-09-25T12:00:00.000Z',
                  },
                },
              },
            },
          },
          '404': {
            description: 'Despensa não encontrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/999',
                  message: PadraoMensagem.ERRO_NAO_ENCONTRADO,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/1',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['despensa'],
        summary: 'Excluir despensa por ID',
        description: 'Exclui uma despensa específica pelo seu ID.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Despensa excluída com sucesso.',
            content: {
              'application/json': {
                example: {
                  statusCode: 200,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/1',
                  data: 'Operação realizada com sucesso',
                },
              },
            },
          },
          '404': {
            description: 'Despensa não encontrada.',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/999',
                  message: PadraoMensagem.ERRO_NAO_ENCONTRADO,
                },
              },
            },
          },
          '401': {
            description: 'Token JWT inválido ou não fornecido.',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  timestamp: '2026-09-25T12:00:00.000Z',
                  path: '/despensas/1',
                  message: PadraoMensagem.ERRO_ACESSO_NEGADO,
                },
              },
            },
          },
        },
      },
    },
  },
};
export function setupSwagger(app: INestApplication): void {
  SwaggerModule.setup('api', app, swaggerDocument);
}
