// Welcome - Login and registration screen

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Mail, Lock, User, AlertCircle, Shield, Car } from 'lucide-react';
import { createAccount, login, recoverUsername, requestPasswordReset, resetPassword } from '@/app/services/auth';
import { toast } from 'sonner';

interface WelcomeProps {
  onLogin: () => void;
}

type Screen = 'login' | 'register' | 'forgot-password' | 'forgot-username' | 'reset-password';

export function Welcome({ onLogin }: WelcomeProps) {
  const [screen, setScreen] = useState<Screen>('login');
  const [loading, setLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  // Forgot username state
  const [forgotUsernameEmail, setForgotUsernameEmail] = useState('');
  
  // Forgot password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetCode, setShowResetCode] = useState(false);

  // Get email provider logo/color
  const getEmailProviderInfo = (email: string) => {
    const domain = email.toLowerCase().split('@')[1];
    if (domain?.includes('gmail')) return { name: 'Gmail', color: 'text-red-500' };
    if (domain?.includes('outlook') || domain?.includes('hotmail') || domain?.includes('live')) 
      return { name: 'Outlook', color: 'text-blue-500' };
    if (domain?.includes('yahoo')) return { name: 'Yahoo', color: 'text-purple-500' };
    if (domain?.includes('proton')) return { name: 'ProtonMail', color: 'text-purple-600' };
    return { name: 'Email', color: 'text-gray-500' };
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      toast.success('Welcome to ControlMiles!');
      onLogin();
    } else {
      toast.error(result.error || 'Login error');
    }

    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await createAccount(registerEmail, registerUsername, registerPassword);
    
    if (result.success) {
      toast.success('Account created successfully!');
      onLogin();
    } else {
      toast.error(result.error || 'Error creating account');
    }

    setLoading(false);
  }

  async function handleForgotUsername(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = recoverUsername(forgotUsernameEmail);
    
    if (result.success) {
      toast.success(`Your username is: ${result.username}`);
      setTimeout(() => setScreen('login'), 2000);
    } else {
      toast.error(result.error || 'Email not found');
    }

    setLoading(false);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = requestPasswordReset(forgotPasswordEmail);
    
    if (result.success) {
      const provider = getEmailProviderInfo(forgotPasswordEmail);
      toast.success(
        <div>
          <p className="font-medium">Recovery code sent!</p>
          <p className="text-sm">Check your {provider.name} inbox</p>
        </div>
      );
      setShowResetCode(true);
    } else {
      toast.error(result.error || 'Email not found');
    }

    setLoading(false);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = resetPassword(forgotPasswordEmail, resetCode, newPassword);
    
    if (result.success) {
      toast.success('Password reset successfully!');
      setTimeout(() => setScreen('login'), 2000);
    } else {
      toast.error(result.error || 'Invalid code');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Car className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">ControlMiles</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your trusted companion for mileage tracking
          </p>
          <p className="text-sm text-gray-500 italic">
            A Software by Olympus Mont Systems LLC
          </p>
        </div>

        {/* Login Screen */}
        {screen === 'login' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>Sign in to your ControlMiles account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">
                    <Lock className="inline h-4 w-4 mr-1" />
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setScreen('forgot-username')}
                    className="text-blue-600 hover:underline"
                  >
                    Forgot your username?
                  </button>
                  <span className="text-gray-400">•</span>
                  <button
                    type="button"
                    onClick={() => setScreen('forgot-password')}
                    className="text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Separator className="my-4" />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setScreen('register')}
                >
                  Create New Account
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Register Screen */}
        {screen === 'register' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Join ControlMiles today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="email@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Used for account recovery and notifications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-username">
                    <User className="inline h-4 w-4 mr-1" />
                    Username
                  </Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="username123"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">
                    <Lock className="inline h-4 w-4 mr-1" />
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">
                    <Lock className="inline h-4 w-4 mr-1" />
                    Confirm Password
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Repeat your password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setScreen('login')}
                >
                  Already have an account? Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Forgot Username Screen */}
        {screen === 'forgot-username' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Recover Username</CardTitle>
              <CardDescription>Enter your email to recover your username</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotUsername} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-username-email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="forgot-username-email"
                    type="email"
                    placeholder="email@example.com"
                    value={forgotUsernameEmail}
                    onChange={(e) => setForgotUsernameEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Searching...' : 'Recover Username'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setScreen('login')}
                >
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Forgot Password Screen */}
        {screen === 'forgot-password' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                {!showResetCode 
                  ? 'Enter your email to receive a recovery code' 
                  : 'Enter the code sent to your email'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResetCode ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-password-email">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </Label>
                    <Input
                      id="forgot-password-email"
                      type="text"
                      placeholder="email@example.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Sending code...' : 'Send Recovery Code'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setScreen('login')}
                  >
                    Back to Sign In
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium">Code sent to your email</p>
                      <p>Check your {getEmailProviderInfo(forgotPasswordEmail).name} inbox</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reset-code">Recovery Code</Label>
                    <Input
                      id="reset-code"
                      type="text"
                      placeholder="XXXXXXXX"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">
                      <Lock className="inline h-4 w-4 mr-1" />
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">
                      <Lock className="inline h-4 w-4 mr-1" />
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Repeat your new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Resetting password...' : 'Reset Password'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowResetCode(false);
                      setScreen('login');
                    }}
                  >
                    Back to Sign In
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Offline-first • SHA-256 Encrypted • IRS Audit-Ready</span>
          </div>
          <p className="text-xs text-gray-500">
            All data is stored locally on your device. No information is sent to external servers.
          </p>
        </div>
      </div>
    </div>
  );
}