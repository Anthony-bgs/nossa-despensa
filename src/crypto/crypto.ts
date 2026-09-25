const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();


async function getKey(): Promise<CryptoKey> {
  const keySecret = process.env.CRYPTO_SECRET_KEY; // Ou Deno.env.get() no Supabase Functions
  if (!keySecret || keySecret.length !== 32) {
    throw new Error("A chave secreta precisa ter exatamente 32 caracteres.");
  }
  
  const keyData = ENCODER.encode(keySecret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}
// Função para criptografar
export async function encryptData(text: string): Promise<string> {
  const key = await getKey();
  // O IV (Vetor de Inicialização) deve ser único para cada criptografia
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ENCODER.encode(text)
  );

  // Junta o IV + Dado Criptografado em um único array para salvar no banco
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);

  // Converte para Base64 para salvar como texto (TEXT ou VARCHAR) no Supabase
  return btoa(String.fromCharCode(...combined));
}

// Função para descriptografar
export async function decryptData(encryptedBase64: string): Promise<string> {
  const key = await getKey();
  
  // Converte de volta de Base64 para bytes
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  
  // Separa o IV do dado criptografado
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedData
  );

  return DECODER.decode(decrypted);
}