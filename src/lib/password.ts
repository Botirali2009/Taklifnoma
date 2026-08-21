import bcrypt from "bcryptjs";

const ROUNDS = 12;
export const MIN_PASSWORD_LENGTH = 8;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Emailni tekshiradi va normal ko'rinishga keltiradi */
export function normalizeEmail(email: string): string | null {
  const value = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return null;
  return value;
}

/** Parol talablari — xato matni yoki null */
export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Parol kamida ${MIN_PASSWORD_LENGTH} ta belgidan iborat bo'lsin.`;
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Parolda kamida bitta harf va bitta raqam bo'lsin.";
  }

  return null;
}
