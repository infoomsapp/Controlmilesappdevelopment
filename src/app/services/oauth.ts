// OAuth 2.0 Authorization Service
// Supports multiple providers: Google, Dropbox, Microsoft, etc.
// Uses PKCE (Proof Key for Code Exchange) for enhanced security

export type OAuthProvider = 
  | 'google' 
  | 'dropbox' 
  | 'microsoft' 
  | 'quickbooks'
  | 'uber'
  | 'lyft'
  | 'custom';

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  clientSecret?: string; // Optional - not needed for PKCE flow
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scopes: string[];
  usePKCE?: boolean; // Recommended for mobile/web apps
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // seconds
  tokenType: string;
  scope?: string;
  issuedAt: number; // timestamp
}

export interface StoredOAuthSession {
  provider: OAuthProvider;
  tokens: OAuthTokens;
  userInfo?: any;
  createdAt: number;
  lastRefreshed: number;
}

// Pre-configured OAuth providers
export const OAUTH_PROVIDERS: Record<OAuthProvider, Partial<OAuthConfig>> = {
  google: {
    provider: 'google',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/drive.file', 'profile', 'email'],
    usePKCE: true,
  },
  dropbox: {
    provider: 'dropbox',
    authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
    tokenEndpoint: 'https://api.dropboxapi.com/oauth2/token',
    scopes: ['files.content.write', 'files.content.read'],
    usePKCE: true,
  },
  microsoft: {
    provider: 'microsoft',
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopes: ['Files.ReadWrite', 'User.Read'],
    usePKCE: true,
  },
  quickbooks: {
    provider: 'quickbooks',
    authorizationEndpoint: 'https://appcenter.intuit.com/connect/oauth2',
    tokenEndpoint: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    scopes: ['com.intuit.quickbooks.accounting'],
    usePKCE: true,
  },
  uber: {
    provider: 'uber',
    authorizationEndpoint: 'https://login.uber.com/oauth/v2/authorize',
    tokenEndpoint: 'https://login.uber.com/oauth/v2/token',
    scopes: ['profile', 'history'],
    usePKCE: true,
  },
  lyft: {
    provider: 'lyft',
    authorizationEndpoint: 'https://api.lyft.com/oauth/authorize',
    tokenEndpoint: 'https://api.lyft.com/oauth/token',
    scopes: ['public', 'rides.read'],
    usePKCE: true,
  },
  custom: {
    provider: 'custom',
    authorizationEndpoint: '',
    tokenEndpoint: '',
    scopes: [],
    usePKCE: true,
  },
};

// PKCE Helper Functions
async function generateCodeVerifier(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
}

function base64URLEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Generate random state parameter for CSRF protection
function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

// LocalStorage keys
const OAUTH_STORAGE_KEY = 'controlmiles_oauth_sessions';
const OAUTH_STATE_KEY = 'controlmiles_oauth_state';
const OAUTH_VERIFIER_KEY = 'controlmiles_oauth_verifier';

// Store OAuth session
export function saveOAuthSession(provider: OAuthProvider, tokens: OAuthTokens, userInfo?: any): void {
  const sessions = getOAuthSessions();
  
  const session: StoredOAuthSession = {
    provider,
    tokens,
    userInfo,
    createdAt: Date.now(),
    lastRefreshed: Date.now(),
  };

  sessions[provider] = session;
  localStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(sessions));
}

// Get all OAuth sessions
export function getOAuthSessions(): Record<OAuthProvider, StoredOAuthSession> {
  const stored = localStorage.getItem(OAUTH_STORAGE_KEY);
  if (!stored) return {} as Record<OAuthProvider, StoredOAuthSession>;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse OAuth sessions:', error);
    return {} as Record<OAuthProvider, StoredOAuthSession>;
  }
}

// Get specific OAuth session
export function getOAuthSession(provider: OAuthProvider): StoredOAuthSession | null {
  const sessions = getOAuthSessions();
  return sessions[provider] || null;
}

// Remove OAuth session
export function removeOAuthSession(provider: OAuthProvider): void {
  const sessions = getOAuthSessions();
  delete sessions[provider];
  localStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(sessions));
}

// Check if access token is expired
export function isTokenExpired(session: StoredOAuthSession): boolean {
  const now = Date.now();
  const expiresAt = session.tokens.issuedAt + (session.tokens.expiresIn * 1000);
  // Add 5 minute buffer
  return now >= (expiresAt - 300000);
}

// Build authorization URL
export async function buildAuthorizationUrl(config: OAuthConfig): Promise<string> {
  const state = generateState();
  localStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state: state,
  });

  // Add PKCE parameters if enabled
  if (config.usePKCE) {
    const verifier = await generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    
    localStorage.setItem(OAUTH_VERIFIER_KEY, verifier);
    
    params.append('code_challenge', challenge);
    params.append('code_challenge_method', 'S256');
  }

  // Provider-specific parameters
  if (config.provider === 'google') {
    params.append('access_type', 'offline'); // Get refresh token
    params.append('prompt', 'consent');
  }

  if (config.provider === 'microsoft') {
    params.append('response_mode', 'query');
  }

  return `${config.authorizationEndpoint}?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(
  config: OAuthConfig,
  code: string,
  state: string
): Promise<OAuthTokens> {
  // Verify state to prevent CSRF attacks
  const storedState = localStorage.getItem(OAUTH_STATE_KEY);
  if (state !== storedState) {
    throw new Error('Invalid state parameter - possible CSRF attack');
  }

  const body: Record<string, string> = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
  };

  // Add client secret if provided (not needed for PKCE)
  if (config.clientSecret) {
    body.client_secret = config.clientSecret;
  }

  // Add PKCE verifier if enabled
  if (config.usePKCE) {
    const verifier = localStorage.getItem(OAUTH_VERIFIER_KEY);
    if (!verifier) {
      throw new Error('Missing PKCE code verifier');
    }
    body.code_verifier = verifier;
  }

  try {
    const response = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const data = await response.json();

    // Clean up temporary storage
    localStorage.removeItem(OAUTH_STATE_KEY);
    localStorage.removeItem(OAUTH_VERIFIER_KEY);

    const tokens: OAuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope,
      issuedAt: Date.now(),
    };

    return tokens;
  } catch (error) {
    // Clean up on error
    localStorage.removeItem(OAUTH_STATE_KEY);
    localStorage.removeItem(OAUTH_VERIFIER_KEY);
    throw error;
  }
}

// Refresh access token
export async function refreshAccessToken(
  config: OAuthConfig,
  refreshToken: string
): Promise<OAuthTokens> {
  const body: Record<string, string> = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
  };

  if (config.clientSecret) {
    body.client_secret = config.clientSecret;
  }

  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  const data = await response.json();

  const tokens: OAuthTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken, // Use old refresh token if new one not provided
    expiresIn: data.expires_in,
    tokenType: data.token_type,
    scope: data.scope,
    issuedAt: Date.now(),
  };

  return tokens;
}

// Get valid access token (auto-refresh if needed)
export async function getValidAccessToken(
  provider: OAuthProvider,
  config: OAuthConfig
): Promise<string> {
  const session = getOAuthSession(provider);
  
  if (!session) {
    throw new Error(`No OAuth session found for ${provider}`);
  }

  // Check if token is expired
  if (isTokenExpired(session)) {
    if (!session.tokens.refreshToken) {
      throw new Error('Access token expired and no refresh token available');
    }

    // Refresh the token
    const newTokens = await refreshAccessToken(config, session.tokens.refreshToken);
    
    // Update session
    saveOAuthSession(provider, newTokens, session.userInfo);
    
    return newTokens.accessToken;
  }

  return session.tokens.accessToken;
}

// Revoke access token
export async function revokeToken(
  provider: OAuthProvider,
  token: string
): Promise<void> {
  const revokeEndpoints: Record<string, string> = {
    google: 'https://oauth2.googleapis.com/revoke',
    microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout',
    dropbox: 'https://api.dropboxapi.com/2/auth/token/revoke',
  };

  const endpoint = revokeEndpoints[provider];
  if (!endpoint) {
    // Just remove from storage if no revoke endpoint
    removeOAuthSession(provider);
    return;
  }

  try {
    if (provider === 'google') {
      await fetch(`${endpoint}?token=${token}`, { method: 'POST' });
    } else if (provider === 'dropbox') {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error(`Failed to revoke token for ${provider}:`, error);
  } finally {
    removeOAuthSession(provider);
  }
}

// Initialize OAuth flow
export async function initiateOAuthFlow(
  provider: OAuthProvider,
  customConfig?: Partial<OAuthConfig>
): Promise<void> {
  const baseConfig = OAUTH_PROVIDERS[provider];
  
  if (!baseConfig) {
    throw new Error(`Unknown OAuth provider: ${provider}`);
  }

  const config: OAuthConfig = {
    ...baseConfig,
    ...customConfig,
  } as OAuthConfig;

  if (!config.clientId) {
    throw new Error('Client ID is required');
  }

  if (!config.redirectUri) {
    throw new Error('Redirect URI is required');
  }

  const authUrl = await buildAuthorizationUrl(config);
  
  // Open authorization URL in new window/tab
  window.location.href = authUrl;
}

// Handle OAuth callback (call this on redirect page)
export async function handleOAuthCallback(
  provider: OAuthProvider,
  customConfig?: Partial<OAuthConfig>
): Promise<StoredOAuthSession> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');

  if (error) {
    throw new Error(`OAuth error: ${error} - ${params.get('error_description')}`);
  }

  if (!code || !state) {
    throw new Error('Missing code or state parameter');
  }

  const baseConfig = OAUTH_PROVIDERS[provider];
  const config: OAuthConfig = {
    ...baseConfig,
    ...customConfig,
  } as OAuthConfig;

  const tokens = await exchangeCodeForTokens(config, code, state);
  
  // Optionally fetch user info
  let userInfo = undefined;
  if (provider === 'google') {
    userInfo = await fetchGoogleUserInfo(tokens.accessToken);
  } else if (provider === 'microsoft') {
    userInfo = await fetchMicrosoftUserInfo(tokens.accessToken);
  }

  saveOAuthSession(provider, tokens, userInfo);

  const session = getOAuthSession(provider);
  if (!session) {
    throw new Error('Failed to save OAuth session');
  }

  return session;
}

// Fetch user info from Google
async function fetchGoogleUserInfo(accessToken: string): Promise<any> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google user info');
  }

  return await response.json();
}

// Fetch user info from Microsoft
async function fetchMicrosoftUserInfo(accessToken: string): Promise<any> {
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Microsoft user info');
  }

  return await response.json();
}

// Export utility to check if provider is connected
export function isProviderConnected(provider: OAuthProvider): boolean {
  const session = getOAuthSession(provider);
  return session !== null && !isTokenExpired(session);
}

// Get all connected providers
export function getConnectedProviders(): OAuthProvider[] {
  const sessions = getOAuthSessions();
  return Object.keys(sessions).filter(provider => 
    !isTokenExpired(sessions[provider as OAuthProvider])
  ) as OAuthProvider[];
}
