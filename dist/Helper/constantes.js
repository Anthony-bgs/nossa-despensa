"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENCENDO_PADRAO = exports.JWT_EXPIRATION = exports.PORT = exports.APP_URL = exports.MONGO_URI = exports.SALT_OR_ROUNDS = exports.JWT_SECRET = exports.TAMANHO_PAGINA_PADRAO = void 0;
exports.TAMANHO_PAGINA_PADRAO = 10;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.SALT_OR_ROUNDS = process.env.SALT_OR_ROUNDS;
exports.MONGO_URI = process.env.MONGO_URI;
exports.APP_URL = process.env.APP_URL;
exports.PORT = process.env.PORT;
exports.JWT_EXPIRATION = process.env.JWT_EXPIRATION;
exports.VENCENDO_PADRAO = parseInt(process.env.VENCENDO_PADRAO);
//# sourceMappingURL=constantes.js.map