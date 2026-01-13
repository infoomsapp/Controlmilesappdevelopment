# ControlMiles - OAuth 2.0 Integration Setup Guide

## 📋 Overview

ControlMiles supports OAuth 2.0 authentication with multiple external services to enable:
- ☁️ **Cloud Backup** - Export reports to Google Drive, Dropbox, OneDrive
- 💼 **Accounting Integration** - Sync expenses with QuickBooks
- 🚗 **Gig Platform APIs** - Read trip history from Uber, Lyft (if APIs become available)

All OAuth flows use **PKCE (Proof Key for Code Exchange)** for enhanced security, making them safe for client-side web applications and mobile apps.

---

## 🔐 Security Features

### PKCE (Proof Key for Code Exchange)
- ✅ No client secret needed in client-side code
- ✅ Protection against authorization code interception
- ✅ Safe for single-page applications (SPAs)
- ✅ Recommended by OAuth 2.0 best practices

### Additional Security
- ✅ State parameter for CSRF protection
- ✅ Automatic token refresh
- ✅ Secure token storage (localStorage with encryption option)
- ✅ Token expiration handling
- ✅ Revocation support

---

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in your project root:

```bash
# Google OAuth (Drive API)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Dropbox OAuth
VITE_DROPBOX_CLIENT_ID=your_dropbox_app_key

# Microsoft OAuth (OneDrive)
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id

# QuickBooks OAuth (Coming Soon)
VITE_QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id

# Uber OAuth (Coming Soon)
VITE_UBER_CLIENT_ID=your_uber_client_id

# Lyft OAuth (Coming Soon)
VITE_LYFT_CLIENT_ID=your_lyft_client_id
```

### 2. Register Redirect URIs

For each OAuth provider, register these redirect URIs:

**Development:**
```
http://localhost:5173/oauth/callback/google
http://localhost:5173/oauth/callback/dropbox
http://localhost:5173/oauth/callback/microsoft
```

**Production:**
```
https://your-domain.com/oauth/callback/google
https://your-domain.com/oauth/callback/dropbox
https://your-domain.com/oauth/callback/microsoft
```

---

## 📱 Provider Setup Instructions

### 🔵 Google Drive (Google Cloud Console)

**Step 1: Create OAuth Client**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Drive API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"

**Step 2: Configure OAuth Consent Screen**
1. Navigate to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Fill in application details:
   - **App name:** ControlMiles
   - **User support email:** your-email@example.com
   - **Developer contact:** your-email@example.com
4. Add scopes:
   - `https://www.googleapis.com/auth/drive.file` (Create and manage files)
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. Add test users (for development)

**Step 3: Create OAuth Credentials**
1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: ControlMiles Web
5. Authorized JavaScript origins:
   ```
   http://localhost:5173
   https://your-domain.com
   ```
6. Authorized redirect URIs:
   ```
   http://localhost:5173/oauth/callback/google
   https://your-domain.com/oauth/callback/google
   ```
7. Click "Create" and copy the **Client ID**

**Step 4: Add to Environment**
```bash
VITE_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
```

**API Endpoints:**
- Authorization: `https://accounts.google.com/o/oauth2/v2/auth`
- Token: `https://oauth2.googleapis.com/token`
- Revoke: `https://oauth2.googleapis.com/revoke`

---

### 📦 Dropbox (Dropbox App Console)

**Step 1: Create Dropbox App**
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click "Create app"
3. Choose API: **Scoped access**
4. Choose access type: **App folder** (recommended) or **Full Dropbox**
5. Name your app: ControlMiles

**Step 2: Configure Permissions**
1. Navigate to "Permissions" tab
2. Enable scopes:
   - `files.content.write` - Write files
   - `files.content.read` - Read files

**Step 3: Configure OAuth**
1. Navigate to "Settings" tab
2. Add Redirect URIs:
   ```
   http://localhost:5173/oauth/callback/dropbox
   https://your-domain.com/oauth/callback/dropbox
   ```
3. Copy the **App key** (this is your Client ID)

**Step 4: Add to Environment**
```bash
VITE_DROPBOX_CLIENT_ID=your_dropbox_app_key
```

**API Endpoints:**
- Authorization: `https://www.dropbox.com/oauth2/authorize`
- Token: `https://api.dropboxapi.com/oauth2/token`
- Revoke: `https://api.dropboxapi.com/2/auth/token/revoke`

---

### ☁️ Microsoft OneDrive (Azure Portal)

**Step 1: Register App in Azure**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Fill in details:
   - **Name:** ControlMiles
   - **Supported account types:** Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI:** Web - `http://localhost:5173/oauth/callback/microsoft`

**Step 2: Configure Authentication**
1. Navigate to "Authentication"
2. Add additional redirect URIs:
   ```
   https://your-domain.com/oauth/callback/microsoft
   ```
3. Enable:
   - ✅ Access tokens
   - ✅ ID tokens
4. Supported account types: **Personal Microsoft accounts only** (for OneDrive personal)

**Step 3: Configure API Permissions**
1. Navigate to "API permissions"
2. Click "Add a permission" → "Microsoft Graph"
3. Select "Delegated permissions"
4. Add permissions:
   - `Files.ReadWrite` - Read and write user files
   - `User.Read` - Sign in and read user profile
5. Click "Grant admin consent" (if applicable)

**Step 4: Get Client ID**
1. Navigate to "Overview"
2. Copy **Application (client) ID**

**Step 5: Add to Environment**
```bash
VITE_MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789abc
```

**API Endpoints:**
- Authorization: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
- Token: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
- Graph API: `https://graph.microsoft.com/v1.0/`

---

### 💼 QuickBooks (Intuit Developer Portal) - Coming Soon

**Step 1: Create QuickBooks App**
1. Go to [Intuit Developer Portal](https://developer.intuit.com/)
2. Create an app
3. Select scopes: **Accounting**

**Step 2: Configure OAuth**
1. Add Redirect URIs:
   ```
   http://localhost:5173/oauth/callback/quickbooks
   https://your-domain.com/oauth/callback/quickbooks
   ```
2. Copy **Client ID** and **Client Secret**

**Step 3: Add to Environment**
```bash
VITE_QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
VITE_QUICKBOOKS_CLIENT_SECRET=your_quickbooks_client_secret
```

**API Endpoints:**
- Authorization: `https://appcenter.intuit.com/connect/oauth2`
- Token: `https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer`

---

### 🚗 Uber API - Coming Soon

**Step 1: Register Uber App**
1. Go to [Uber Developer Dashboard](https://developer.uber.com/)
2. Create an application
3. Select scopes: `profile`, `history`

**Step 2: Configure Redirect URIs**
```
http://localhost:5173/oauth/callback/uber
https://your-domain.com/oauth/callback/uber
```

**Step 3: Add to Environment**
```bash
VITE_UBER_CLIENT_ID=your_uber_client_id
```

**API Endpoints:**
- Authorization: `https://login.uber.com/oauth/v2/authorize`
- Token: `https://login.uber.com/oauth/v2/token`

---

### 🚙 Lyft API - Coming Soon

**Step 1: Register Lyft App**
1. Go to [Lyft Developer Portal](https://www.lyft.com/developers)
2. Create an application
3. Select scopes: `public`, `rides.read`

**Step 2: Configure Redirect URIs**
```
http://localhost:5173/oauth/callback/lyft
https://your-domain.com/oauth/callback/lyft
```

**Step 3: Add to Environment**
```bash
VITE_LYFT_CLIENT_ID=your_lyft_client_id
```

**API Endpoints:**
- Authorization: `https://api.lyft.com/oauth/authorize`
- Token: `https://api.lyft.com/oauth/token`

---

## 🔧 Implementation Guide

### 1. Add OAuth Routes

Update your `App.tsx` to handle OAuth callbacks:

```typescript
import { OAuthCallback } from '@/app/components/OAuthCallback';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [oauthProvider, setOAuthProvider] = useState<OAuthProvider | null>(null);

  // Detect OAuth callback on load
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path.startsWith('/oauth/callback/')) {
      const provider = path.split('/').pop() as OAuthProvider;
      setOAuthProvider(provider);
      setCurrentScreen('oauth-callback');
    }
  }, []);

  // Render OAuth callback screen
  if (currentScreen === 'oauth-callback' && oauthProvider) {
    return (
      <OAuthCallback
        provider={oauthProvider}
        onSuccess={(session) => {
          console.log('OAuth success:', session);
        }}
        onNavigate={setCurrentScreen}
      />
    );
  }

  // ... rest of your app
}
```

### 2. Add OAuth Connect to Settings

```typescript
import { OAuthConnect } from '@/app/components/OAuthConnect';

export function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="space-y-6">
      {/* ... other settings ... */}
      
      <OAuthConnect
        onConnect={(provider, session) => {
          console.log('Connected:', provider, session);
        }}
        onDisconnect={(provider) => {
          console.log('Disconnected:', provider);
        }}
      />
    </div>
  );
}
```

### 3. Use OAuth Tokens in API Calls

**Example: Upload to Google Drive**

```typescript
import { getValidAccessToken } from '@/app/services/oauth';

async function uploadToGoogleDrive(fileName: string, content: Blob) {
  // Get valid access token (auto-refreshes if expired)
  const accessToken = await getValidAccessToken('google', {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/google`,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  // Create file metadata
  const metadata = {
    name: fileName,
    mimeType: 'application/pdf',
  };

  // Upload file
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', content);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
}
```

**Example: Upload to Dropbox**

```typescript
async function uploadToDropbox(path: string, content: Blob) {
  const accessToken = await getValidAccessToken('dropbox', {
    clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/dropbox`,
    scopes: ['files.content.write'],
  });

  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: `/ControlMiles/${path}`,
        mode: 'add',
        autorename: true,
      }),
    },
    body: content,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
}
```

---

## 📊 Token Management

### Automatic Token Refresh

The OAuth service automatically refreshes expired tokens:

```typescript
// This will automatically refresh if token is expired
const accessToken = await getValidAccessToken('google', config);
```

### Manual Token Refresh

```typescript
import { refreshAccessToken, getOAuthSession } from '@/app/services/oauth';

const session = getOAuthSession('google');
if (session?.tokens.refreshToken) {
  const newTokens = await refreshAccessToken(config, session.tokens.refreshToken);
  saveOAuthSession('google', newTokens, session.userInfo);
}
```

### Check Connection Status

```typescript
import { isProviderConnected, getConnectedProviders } from '@/app/services/oauth';

// Check specific provider
if (isProviderConnected('google')) {
  console.log('Google Drive is connected');
}

// Get all connected providers
const connected = getConnectedProviders();
console.log('Connected providers:', connected);
```

### Revoke Access

```typescript
import { revokeToken, getOAuthSession } from '@/app/services/oauth';

const session = getOAuthSession('google');
if (session) {
  await revokeToken('google', session.tokens.accessToken);
}
```

---

## 🧪 Testing

### Local Testing

1. Start development server:
   ```bash
   npm run dev
   ```

2. Navigate to Settings → External Integrations

3. Click "Connect" on a provider

4. Complete OAuth flow in popup/redirect

5. Verify connection in UI

### Test OAuth Flow

```typescript
// Test connection
import { initiateOAuthFlow } from '@/app/services/oauth';

await initiateOAuthFlow('google', {
  clientId: 'YOUR_CLIENT_ID',
  redirectUri: 'http://localhost:5173/oauth/callback/google',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
```

---

## 🐛 Troubleshooting

### Common Issues

**❌ "redirect_uri_mismatch"**
- **Cause:** Redirect URI not registered in OAuth app
- **Solution:** Add exact redirect URI to provider console

**❌ "invalid_client"**
- **Cause:** Wrong client ID or missing environment variable
- **Solution:** Check `.env` file and provider console

**❌ "access_denied"**
- **Cause:** User denied permission
- **Solution:** User needs to grant requested permissions

**❌ "Token expired and no refresh token"**
- **Cause:** Refresh token not requested (Google requires `access_type=offline`)
- **Solution:** Reconnect to get refresh token

**❌ "CORS error"**
- **Cause:** Browser blocking cross-origin requests
- **Solution:** Ensure redirect URI matches exactly (including protocol)

### Debug Mode

Enable debug logging:

```typescript
// Add to oauth.ts
const DEBUG = true;

if (DEBUG) {
  console.log('OAuth Config:', config);
  console.log('Authorization URL:', authUrl);
  console.log('Token Response:', data);
}
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Use PKCE for all OAuth flows
- Store tokens in localStorage (or encrypted storage)
- Use HTTPS in production
- Validate state parameter
- Set minimal required scopes
- Implement token refresh
- Revoke tokens on logout

### ❌ DON'T:
- Expose client secrets in client-side code
- Store tokens in cookies (vulnerable to CSRF)
- Use implicit flow (deprecated)
- Request unnecessary scopes
- Skip state parameter validation
- Hardcode credentials

---

## 📚 API Documentation

### OAuth Service API

```typescript
// Initialize OAuth flow
await initiateOAuthFlow(provider: OAuthProvider, config?: Partial<OAuthConfig>): Promise<void>

// Handle callback
await handleOAuthCallback(provider: OAuthProvider, config?: Partial<OAuthConfig>): Promise<StoredOAuthSession>

// Get valid access token
await getValidAccessToken(provider: OAuthProvider, config: OAuthConfig): Promise<string>

// Refresh token
await refreshAccessToken(config: OAuthConfig, refreshToken: string): Promise<OAuthTokens>

// Revoke token
await revokeToken(provider: OAuthProvider, token: string): Promise<void>

// Storage
saveOAuthSession(provider: OAuthProvider, tokens: OAuthTokens, userInfo?: any): void
getOAuthSession(provider: OAuthProvider): StoredOAuthSession | null
removeOAuthSession(provider: OAuthProvider): void

// Utilities
isProviderConnected(provider: OAuthProvider): boolean
getConnectedProviders(): OAuthProvider[]
isTokenExpired(session: StoredOAuthSession): boolean
```

---

## 📱 Mobile App Considerations

### React Native

For React Native apps, use:
- [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)
- Custom URL schemes for redirect URIs: `controlmiles://oauth/callback`

### Capacitor (iOS/Android)

Configure custom URL schemes in `capacitor.config.json`:

```json
{
  "plugins": {
    "Browser": {
      "windowOptions": "hidden=yes"
    }
  }
}
```

Register deep links:
- iOS: `controlmiles://oauth/callback/google`
- Android: `controlmiles://oauth/callback/google`

---

## ✅ Checklist

Before going to production:

- [ ] All OAuth apps created and configured
- [ ] Redirect URIs registered for production domain
- [ ] Environment variables set in hosting platform
- [ ] OAuth consent screens configured
- [ ] Privacy policy URL added to OAuth apps
- [ ] Terms of service URL added to OAuth apps
- [ ] Test OAuth flow in production environment
- [ ] Implement error handling
- [ ] Add analytics tracking
- [ ] Document API rate limits
- [ ] Set up monitoring/alerts

---

## 📞 Support

For issues or questions:
- Check provider documentation links above
- Review OAuth 2.0 specification: [RFC 6749](https://tools.ietf.org/html/rfc6749)
- PKCE specification: [RFC 7636](https://tools.ietf.org/html/rfc7636)

---

**Built with security and privacy in mind** 🔒
