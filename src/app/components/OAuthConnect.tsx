// OAuth Connection Component
// Displays available OAuth providers and allows users to connect/disconnect

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { 
  Cloud, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  LogOut,
  Loader2,
  Link as LinkIcon,
  Shield,
} from 'lucide-react';
import {
  type OAuthProvider,
  initiateOAuthFlow,
  getOAuthSession,
  removeOAuthSession,
  revokeToken,
  isProviderConnected,
  getConnectedProviders,
  type StoredOAuthSession,
} from '@/app/services/oauth';
import { toast } from 'sonner';

interface OAuthProviderInfo {
  id: OAuthProvider;
  name: string;
  description: string;
  icon: string;
  color: string;
  scopes: string[];
  clientId?: string; // Set via environment variables
  redirectUri?: string;
  enabled: boolean;
  comingSoon?: boolean;
}

const OAUTH_PROVIDERS_INFO: OAuthProviderInfo[] = [
  {
    id: 'google',
    name: 'Google Drive',
    description: 'Export reports to Google Drive for cloud backup',
    icon: '📁',
    color: 'bg-blue-500',
    scopes: ['drive.file', 'profile', 'email'],
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/google`,
    enabled: true,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Backup your mileage data to Dropbox',
    icon: '📦',
    color: 'bg-blue-600',
    scopes: ['files.content.write', 'files.content.read'],
    clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/dropbox`,
    enabled: true,
  },
  {
    id: 'microsoft',
    name: 'OneDrive',
    description: 'Store reports in Microsoft OneDrive',
    icon: '☁️',
    color: 'bg-cyan-500',
    scopes: ['Files.ReadWrite', 'User.Read'],
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/microsoft`,
    enabled: true,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Sync expenses with QuickBooks accounting',
    icon: '💼',
    color: 'bg-green-600',
    scopes: ['com.intuit.quickbooks.accounting'],
    clientId: import.meta.env.VITE_QUICKBOOKS_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/quickbooks`,
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'uber',
    name: 'Uber',
    description: 'Access your Uber trip history (read-only)',
    icon: '🚗',
    color: 'bg-black',
    scopes: ['profile', 'history'],
    clientId: import.meta.env.VITE_UBER_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/uber`,
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'lyft',
    name: 'Lyft',
    description: 'Access your Lyft ride history (read-only)',
    icon: '🚙',
    color: 'bg-pink-500',
    scopes: ['public', 'rides.read'],
    clientId: import.meta.env.VITE_LYFT_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/lyft`,
    enabled: false,
    comingSoon: true,
  },
];

interface OAuthConnectProps {
  onConnect?: (provider: OAuthProvider, session: StoredOAuthSession) => void;
  onDisconnect?: (provider: OAuthProvider) => void;
}

export function OAuthConnect({ onConnect, onDisconnect }: OAuthConnectProps) {
  const [connectedProviders, setConnectedProviders] = useState<OAuthProvider[]>([]);
  const [loading, setLoading] = useState<OAuthProvider | null>(null);
  const [sessions, setSessions] = useState<Record<OAuthProvider, StoredOAuthSession | null>>({} as any);

  useEffect(() => {
    loadConnectedProviders();
  }, []);

  function loadConnectedProviders() {
    const connected = getConnectedProviders();
    setConnectedProviders(connected);

    const sessionData: Record<OAuthProvider, StoredOAuthSession | null> = {} as any;
    OAUTH_PROVIDERS_INFO.forEach(provider => {
      sessionData[provider.id] = getOAuthSession(provider.id);
    });
    setSessions(sessionData);
  }

  async function handleConnect(providerInfo: OAuthProviderInfo) {
    if (!providerInfo.clientId) {
      toast.error(`${providerInfo.name} integration not configured. Please contact support.`);
      return;
    }

    setLoading(providerInfo.id);

    try {
      await initiateOAuthFlow(providerInfo.id, {
        clientId: providerInfo.clientId,
        redirectUri: providerInfo.redirectUri!,
        scopes: providerInfo.scopes,
      });
    } catch (error) {
      console.error('OAuth connection failed:', error);
      toast.error(`Failed to connect to ${providerInfo.name}`);
      setLoading(null);
    }
  }

  async function handleDisconnect(providerInfo: OAuthProviderInfo) {
    const session = sessions[providerInfo.id];
    if (!session) return;

    setLoading(providerInfo.id);

    try {
      await revokeToken(providerInfo.id, session.tokens.accessToken);
      loadConnectedProviders();
      toast.success(`Disconnected from ${providerInfo.name}`);
      onDisconnect?.(providerInfo.id);
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error(`Failed to disconnect from ${providerInfo.name}`);
    } finally {
      setLoading(null);
    }
  }

  function getProviderStatus(providerId: OAuthProvider): 'connected' | 'disconnected' | 'expired' {
    const session = sessions[providerId];
    if (!session) return 'disconnected';
    
    const isConnected = isProviderConnected(providerId);
    return isConnected ? 'connected' : 'expired';
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Cloud className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">External Integrations</h2>
          <p className="text-sm text-gray-600">
            Connect external services to backup data or sync with accounting software
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy & Security:</strong> ControlMiles uses OAuth 2.0 with PKCE for secure authorization. 
          Your credentials are never stored on our servers. You can revoke access at any time.
        </AlertDescription>
      </Alert>

      {/* Connected Providers Summary */}
      {connectedProviders.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Connected Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {connectedProviders.map(providerId => {
                const info = OAUTH_PROVIDERS_INFO.find(p => p.id === providerId);
                if (!info) return null;
                
                return (
                  <Badge key={providerId} className={info.color}>
                    {info.icon} {info.name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OAUTH_PROVIDERS_INFO.map(provider => {
          const status = getProviderStatus(provider.id);
          const session = sessions[provider.id];
          const isLoading = loading === provider.id;
          const isDisabled = !provider.enabled || provider.comingSoon;

          return (
            <Card 
              key={provider.id} 
              className={
                status === 'connected' 
                  ? 'border-green-300 bg-green-50' 
                  : status === 'expired'
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200'
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{provider.icon}</span>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {provider.name}
                        {provider.comingSoon && (
                          <Badge variant="outline" className="text-xs">
                            Coming Soon
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {provider.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {status === 'connected' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {status === 'expired' && (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  {status === 'disconnected' && !isDisabled && (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Connection Info */}
                {session && (
                  <div className="space-y-1 text-xs text-gray-600">
                    {session.userInfo?.email && (
                      <p>
                        <strong>Account:</strong> {session.userInfo.email}
                      </p>
                    )}
                    <p>
                      <strong>Connected:</strong>{' '}
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                    {status === 'expired' && (
                      <p className="text-yellow-600 font-medium">
                        ⚠️ Access token expired - reconnect to refresh
                      </p>
                    )}
                  </div>
                )}

                {/* Scopes */}
                <div className="flex flex-wrap gap-1">
                  {provider.scopes.map(scope => (
                    <Badge key={scope} variant="outline" className="text-xs">
                      {scope}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                {status === 'connected' ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDisconnect(provider)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant={status === 'expired' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => handleConnect(provider)}
                    disabled={isLoading || isDisabled}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {status === 'expired' ? 'Reconnect' : 'Connect'}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Setup Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>For Developers:</strong> To enable OAuth integrations, you need to configure client IDs 
            in your environment variables:
          </p>
          <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_DROPBOX_CLIENT_ID=your_dropbox_app_key
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
VITE_UBER_CLIENT_ID=your_uber_client_id
VITE_LYFT_CLIENT_ID=your_lyft_client_id`}
          </pre>
          <p className="text-xs text-gray-600">
            See <code>/OAUTH_SETUP.md</code> for detailed configuration instructions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
