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
        description: 'Informe apenas o token JWT. O Swagger adicionará o prefixo Bearer.',
      },
    },
  },
  paths: {
    "/auth/login": {
      "post": {
        "tags": ["autorização"],
        "summary": "Login de usuário",
        "description": "Realiza o login de um usuário no sistema e gera um token de autenticação.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "senha"],
                "properties": {
                  "email": { "type": "string", "format": "email" },
                  "senha": { "type": "string", "format": "password" },
                }
              }
            }
          },
        },
        "responses": {
          "200": {
            "description": "Login bem-sucedido",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "statusCode": { "type": "integer", "example": 200 },
                    "timestamp": { "type": "string", "format": "date-time" },
                    "path": { "type": "string", "example": "/auth/login" },
                    "date": { "type": "string", "format": "date", "example": "2026-09-24T16:08:22.124Z" },
                    "data": {
                      "type": "object",
                      "properties": {
                        "access_token": { "type": "string", "example": "eyJhbGciOi..." }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Dados de login inválidos.",
            "content": {
              "application/json": {
                "example": {
                  "statusCode": 400,
                  "timestamp": "2026-09-24T16:08:22.124Z",
                  "path": "/auth/login",
                  "message": PadraoMensagem.ERRO_VALIDACAO
                },
                "schema": {
                  "type": "object",
                  "properties": {
                    "statusCode": { "type": "integer", "example": 400 },
                    "timestamp": { "type": "string", "format": "date-time" },
                    "path": { "type": "string", "example": "/auth/login" },
                    "message": { "type": "string", "example": PadraoMensagem.ERRO_VALIDACAO }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Erro de autenticação.",
            "content": {
              "application/json": {
                "example": {
                  "statusCode": 401,
                  "timestamp": "2026-09-24T16:08:22.124Z",
                  "path": "/auth/login",
                  "message": PadraoMensagem.ERRO_VALIDACAO
                },
                "schema": {
                  "type": "object",
                  "properties": {
                    "statusCode": { "type": "integer", "example": 401 },
                    "timestamp": { "type": "string", "format": "date-time" },
                    "path": { "type": "string", "example": "/auth/login" },
                    "message": { "type": "string", "example": PadraoMensagem.ERRO_VALIDACAO }
                  }
                }
              }
            }
          },
        }
      }
    },
    "/auth/validate-token": {
      "get": {
        "tags": ["autorização"],
        "summary": "Validar o token de acesso",
        "description": "Valida o token de autenticação do usuário.",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": {
            "description": "Token válido",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "valid": { "type": "boolean" }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Token inválido ou não fornecido",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "statusCode": { "type": "integer", "example": 401 },
                    "timestamp": { "type": "string", "format": "date-time" },
                    "path": { "type": "string", "example": "/auth/validate-token" },
                    "message": { "type": "string", "example": PadraoMensagem.ERRO_ACESSO_NEGADO }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/auth/google": {
      "get": {
        "tags": ["autorização"],
        "summary": "Iniciar autenticação via Google",
        "description": "Inicia o fluxo OAuth e redireciona o usuário para a tela de login do Google.",
        "responses": {
          "302": {
            "description": "Redireciona para o Google",
            "headers": {
              "Location": {
                "description": "URL de autorização do Google",
                "schema": { "type": "string", "format": "uri" }
              }
            }
          }
        }
      }
    },
    "/auth/google/callback": {
      "get": {
        "tags": ["autorização"],
        "summary": "Callback da autenticação via Google",
        "description": "Recebe o retorno do Google, cria ou localiza o usuário, grava o JWT no cookie HttpOnly auth_token e redireciona para o frontend.",
        "parameters": [
          {
            "name": "code",
            "in": "query",
            "required": false,
            "description": "Código OAuth enviado pelo Google",
            "schema": { "type": "string" }
          },
          {
            "name": "state",
            "in": "query",
            "required": false,
            "description": "Estado do fluxo OAuth, quando configurado",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "302": {
            "description": "Cookie criado e redirecionamento para o frontend",
            "headers": {
              "Location": {
                "description": "URL do frontend configurada em FRONTEND_URL",
                "schema": { "type": "string", "format": "uri" }
              },
              "Set-Cookie": {
                "description": "Cookie HttpOnly contendo o JWT da aplicação",
                "schema": { "type": "string" }
              }
            }
          },
          "401": {
            "description": "Falha na autenticação do Google",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "statusCode": { "type": "integer", "example": 401 },
                    "timestamp": { "type": "string", "format": "date-time" },
                    "path": { "type": "string", "example": "/auth/google/callback" },
                    "message": { "type": "string", "example": PadraoMensagem.ERRO_ACESSO_NEGADO }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno ao criar ou localizar o usuário Google",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "statusCode": { "type": "integer", "example": 500 },
                    "timestamp": { "type": "string", "format": "date-time" },
                    "path": { "type": "string", "example": "/auth/google/callback" },
                    "message": { "type": "string", "example": PadraoMensagem.ERRO_INTERNO }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export function setupSwagger(app: INestApplication): void {
  SwaggerModule.setup('api', app, swaggerDocument);
}