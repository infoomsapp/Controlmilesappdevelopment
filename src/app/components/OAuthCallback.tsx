// OAuth Callback Handler
// Handles the OAuth redirect and exchanges authorization code for tokens

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { 
  type OAuthProvider, 
  handleOAuthCallback,
  type StoredOAuthSession,
} from '@/app/services/oauth';

interface OAuthCallbackProps {
  provider: OAuthProvider;
  onSuccess?: (session: StoredOAuthSession) => void;
  onError?: (error: Error) => void;
  onNavigate?: (screen: string) => void;
}

export function OAuthCallback({ provider, onSuccess, onError, onNavigate }: OAuthCallbackProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [session, setSession] = useState<StoredOAuthSession | null>(null);

  useEffect(() => {
    processCallback();
  }, []);

  async function processCallback() {
    try {
      setStatus('processing');

      // Get client ID from environment
      const clientIdMap: Record<OAuthProvider, string | undefined> = {
        google: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        dropbox: import.meta.env.VITE_DROPBOX_CLIENT_ID,
        microsoft: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
        quickbooks: import.meta.env.VITE_QUICKBOOKS_CLIENT_ID,
        uber: import.meta.env.VITE_UBER_CLIENT_ID,
        lyft: import.meta.env.VITE_LYFT_CLIENT_ID,
        custom: undefined,
      };

      const clientId = clientIdMap[provider];
      if (!clientId) {
        throw new Error(`Client ID not configured for ${provider}`);
      }

      const redirectUri = `${window.location.origin}${window.location.pathname}`;

      const newSession = await handleOAuthCallback(provider, {
        clientId,
        redirectUri,
      });

      setSession(newSession);
      setStatus('success');
      onSuccess?.(newSession);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        onNavigate?.('settings');
      }, 2000);
    } catch (error) {
      console.error('OAuth callback error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setStatus('error');
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  const providerNames: Record<OAuthProvider, string> = {
    google: 'Google Drive',
    dropbox: 'Dropbox',
    microsoft: 'OneDrive',
    quickbooks: 'QuickBooks',
    uber: 'Uber',
    lyft: 'Lyft',
    custom: 'Custom Provider',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {providerNames[provider]} Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Processing State */}
          {status === 'processing' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">Connecting...</h3>
                <p className="text-sm text-gray-600">
                  Exchanging authorization code for access tokens
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && session && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <div>
                <h3 className="font-semibold text-lg text-green-700">
                  Successfully Connected!
                </h3>
                <p className="text-sm text-gray-600">
                  {providerNames[provider]} has been connected to ControlMiles
                </p>
              </div>

              {/* User Info */}
              {session.userInfo && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-1 text-sm">
                      {session.userInfo.email && (
                        <p>
                          <strong>Account:</strong> {session.userInfo.email}
                        </p>
                      )}
                      {session.userInfo.name && (
                        <p>
                          <strong>Name:</strong> {session.userInfo.name}
                        </p>
                      )}
                      <p>
                        <strong>Connected:</strong>{' '}
                        {new Date(session.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-gray-500">
                Redirecting to settings...
              </p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-600" />
              <div>
                <h3 className="font-semibold text-lg text-red-700">
                  Connection Failed
                </h3>
                <p className="text-sm text-gray-600">
                  Unable to connect to {providerNames[provider]}
                </p>
              </div>

              {/* Error Details */}
              <Alert variant="destructive">
                <AlertDescription>
                  <p className="font-medium">Error Details:</p>
                  <p className="text-sm mt-1">{errorMessage}</p>
                </AlertDescription>
              </Alert>

              {/* Retry Actions */}
              <div className="space-y-2">
                <Button 
                  onClick={processCallback} 
                  className="w-full"
                  variant="outline"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => onNavigate?.('settings')} 
                  className="w-full"
                  variant="default"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Settings
                </Button>
              </div>

              {/* Common Issues */}
              <div className="text-left bg-blue-50 p-3 rounded border border-blue-200">
                <p className="font-medium text-sm mb-2">Common Issues:</p>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                  <li>OAuth client ID not configured</li>
                  <li>Redirect URI mismatch</li>
                  <li>User denied permission</li>
                  <li>Network connection issues</li>
                  <li>Invalid authorization code</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
