import type { StringValue } from 'ms';

export const TAMANHO_PAGINA_PADRAO = 10;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_OR_ROUNDS = process.env.SALT_OR_ROUNDS;
export const MONGO_URI = process.env.MONGO_URI!;
export const APP_URL = process.env.APP_URL!;
export const PORT = process.env.PORT!;
export const JWT_EXPIRATION:StringValue = (process.env.JWT_EXPIRATION as StringValue);
export const VENCENDO_PADRAO =  parseInt(process.env.VENCENDO_PADRAO!);
export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const SUPABASE_JWKS_URL = process.env.SUPABASE_JWKS_URL!;
export const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!;