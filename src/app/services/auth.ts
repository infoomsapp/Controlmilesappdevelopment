// Authentication service for ControlMiles

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  emailProvider?: 'gmail' | 'outlook' | 'yahoo' | 'protonmail' | 'other';
  createdAt: number;
  lastLogin: number;
}

const AUTH_STORAGE_KEY = 'controlmiles_auth';
const SESSION_STORAGE_KEY = 'controlmiles_session';

// Simple hash function (in production, use bcrypt or similar)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get email provider from email address
function getEmailProvider(email: string): UserAccount['emailProvider'] {
  const domain = email.toLowerCase().split('@')[1];
  if (domain?.includes('gmail')) return 'gmail';
  if (domain?.includes('outlook') || domain?.includes('hotmail') || domain?.includes('live')) return 'outlook';
  if (domain?.includes('yahoo')) return 'yahoo';
  if (domain?.includes('proton')) return 'protonmail';
  return 'other';
}

// Create new account
export async function createAccount(email: string, username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (!email || !username || !password) {
      return { success: false, error: 'Todos los campos son requeridos' };
    }

    if (password.length < 8) {
      return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }

    // Check if account already exists
    const accounts = getAllAccounts();
    if (accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Ya existe una cuenta con este email' };
    }

    if (accounts.find(acc => acc.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Ya existe una cuenta con este nombre de usuario' };
    }

    // Create new account
    const passwordHash = await hashPassword(password);
    const newAccount: UserAccount = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      username,
      passwordHash,
      emailProvider: getEmailProvider(email),
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };

    // Save account
    accounts.push(newAccount);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accounts));

    // Create session
    createSession(newAccount);

    return { success: true };
  } catch (error) {
    console.error('Error creating account:', error);
    return { success: false, error: 'Error al crear la cuenta' };
  }
}

// Login with email or username
export async function login(emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!emailOrUsername || !password) {
      return { success: false, error: 'Email/usuario y contraseña son requeridos' };
    }

    const accounts = getAllAccounts();
    const account = accounts.find(
      acc => acc.email.toLowerCase() === emailOrUsername.toLowerCase() || 
             acc.username.toLowerCase() === emailOrUsername.toLowerCase()
    );

    if (!account) {
      return { success: false, error: 'Cuenta no encontrada' };
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== account.passwordHash) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Update last login
    account.lastLogin = Date.now();
    const accountIndex = accounts.findIndex(acc => acc.id === account.id);
    accounts[accountIndex] = account;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accounts));

    // Create session
    createSession(account);

    return { success: true };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
}

// Create session
function createSession(account: UserAccount) {
  const session = {
    userId: account.id,
    email: account.email,
    username: account.username,
    timestamp: Date.now(),
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

// Get current session
export function getCurrentSession() {
  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getCurrentSession() !== null;
}

// Logout
export function logout() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// Get all accounts
function getAllAccounts(): UserAccount[] {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
}

// Recover username by email
export function recoverUsername(email: string): { success: boolean; username?: string; error?: string } {
  const accounts = getAllAccounts();
  const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
  
  if (!account) {
    return { success: false, error: 'No se encontró una cuenta con este email' };
  }

  return { success: true, username: account.username };
}

// Request password reset (in production, this would send an email)
export async function requestPasswordReset(emailOrUsername: string): Promise<{ success: boolean; error?: string; resetCode?: string }> {
  const accounts = getAllAccounts();
  const account = accounts.find(
    acc => acc.email.toLowerCase() === emailOrUsername.toLowerCase() || 
           acc.username.toLowerCase() === emailOrUsername.toLowerCase()
  );
  
  if (!account) {
    return { success: false, error: 'No se encontró una cuenta con este email/usuario' };
  }

  // Generate reset code (in production, send this via email)
  const resetCode = Math.random().toString(36).substr(2, 8).toUpperCase();
  
  // Store reset code temporarily (expires in 15 minutes)
  const resetData = {
    userId: account.id,
    code: resetCode,
    expires: Date.now() + 15 * 60 * 1000,
  };
  localStorage.setItem('controlmiles_reset', JSON.stringify(resetData));

  return { success: true, resetCode };
}

// Reset password with code
export async function resetPassword(code: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (newPassword.length < 8) {
      return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }

    const resetDataStr = localStorage.getItem('controlmiles_reset');
    if (!resetDataStr) {
      return { success: false, error: 'Código de recuperación no válido o expirado' };
    }

    const resetData = JSON.parse(resetDataStr);
    
    if (resetData.code !== code.toUpperCase()) {
      return { success: false, error: 'Código de recuperación incorrecto' };
    }

    if (Date.now() > resetData.expires) {
      localStorage.removeItem('controlmiles_reset');
      return { success: false, error: 'El código ha expirado' };
    }

    // Update password
    const accounts = getAllAccounts();
    const accountIndex = accounts.findIndex(acc => acc.id === resetData.userId);
    
    if (accountIndex === -1) {
      return { success: false, error: 'Cuenta no encontrada' };
    }

    const passwordHash = await hashPassword(newPassword);
    accounts[accountIndex].passwordHash = passwordHash;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accounts));

    // Clear reset data
    localStorage.removeItem('controlmiles_reset');

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: 'Error al restablecer la contraseña' };
  }
}

// Get current user info
export function getCurrentUser(): UserAccount | null {
  const session = getCurrentSession();
  if (!session) return null;

  const accounts = getAllAccounts();
  return accounts.find(acc => acc.id === session.userId) || null;
}
