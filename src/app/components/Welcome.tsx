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
      toast.success('¡Bienvenido a ControlMiles!');
      onLogin();
    } else {
      toast.error(result.error || 'Error al iniciar sesión');
    }

    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const result = await createAccount(registerEmail, registerUsername, registerPassword);
    
    if (result.success) {
      toast.success('¡Cuenta creada exitosamente!');
      onLogin();
    } else {
      toast.error(result.error || 'Error al crear la cuenta');
    }

    setLoading(false);
  }

  async function handleForgotUsername(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = recoverUsername(forgotUsernameEmail);
    
    if (result.success) {
      toast.success(`Tu nombre de usuario es: ${result.username}`);
      setTimeout(() => setScreen('login'), 2000);
    } else {
      toast.error(result.error || 'Error al recuperar usuario');
    }

    setLoading(false);
  }

  async function handleRequestPasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await requestPasswordReset(forgotPasswordEmail);
    
    if (result.success) {
      toast.success(`Código de recuperación: ${result.resetCode}`, { duration: 10000 });
      setResetCode('');
      setShowResetCode(true);
      setScreen('reset-password');
    } else {
      toast.error(result.error || 'Error al solicitar recuperación');
    }

    setLoading(false);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const result = await resetPassword(resetCode, newPassword);
    
    if (result.success) {
      toast.success('Contraseña restablecida exitosamente');
      setScreen('login');
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowResetCode(false);
    } else {
      toast.error(result.error || 'Error al restablecer contraseña');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Car className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ControlMiles</h1>
          <p className="text-blue-100">Tu compañero de confianza para el registro de millas</p>
        </div>

        <Card className="shadow-2xl">
          {/* Login Screen */}
          {screen === 'login' && (
            <>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>Ingresa a tu cuenta de ControlMiles</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email o Usuario</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="text"
                        placeholder="correo@ejemplo.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    {loginEmail.includes('@') && (
                      <p className={`text-xs ${getEmailProviderInfo(loginEmail).color}`}>
                        {getEmailProviderInfo(loginEmail).name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => setScreen('forgot-username')}
                      className="text-blue-600 hover:underline"
                    >
                      ¿Olvidaste tu usuario?
                    </button>
                    <span className="text-gray-400">•</span>
                    <button
                      type="button"
                      onClick={() => setScreen('forgot-password')}
                      className="text-blue-600 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>

                  <Separator />

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setScreen('register')}
                  >
                    Crear Nueva Cuenta
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* Register Screen */}
          {screen === 'register' && (
            <>
              <CardHeader>
                <CardTitle>Crear Cuenta</CardTitle>
                <CardDescription>Regístrate para usar ControlMiles</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    {registerEmail.includes('@') && (
                      <div className="flex items-center gap-2">
                        <p className={`text-xs ${getEmailProviderInfo(registerEmail).color}`}>
                          {getEmailProviderInfo(registerEmail).name}
                        </p>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Compatible
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username">Nombre de Usuario</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="usuario123"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800">
                      Tus datos se almacenan de forma segura y cifrada localmente en tu dispositivo.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setScreen('login')}
                  >
                    Volver al Inicio de Sesión
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* Forgot Username Screen */}
          {screen === 'forgot-username' && (
            <>
              <CardHeader>
                <CardTitle>Recuperar Usuario</CardTitle>
                <CardDescription>Ingresa tu email para recuperar tu nombre de usuario</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotUsername} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-username-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="forgot-username-email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={forgotUsernameEmail}
                        onChange={(e) => setForgotUsernameEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Recuperando...' : 'Recuperar Usuario'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setScreen('login')}
                  >
                    Volver
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* Forgot Password Screen */}
          {screen === 'forgot-password' && (
            <>
              <CardHeader>
                <CardTitle>Recuperar Contraseña</CardTitle>
                <CardDescription>Ingresa tu email o usuario para recuperar tu contraseña</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-password-email">Email o Usuario</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="forgot-password-email"
                        type="text"
                        placeholder="correo@ejemplo.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      Recibirás un código de recuperación que deberás usar para restablecer tu contraseña.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Solicitar Código'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setScreen('login')}
                  >
                    Volver
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* Reset Password Screen */}
          {screen === 'reset-password' && (
            <>
              <CardHeader>
                <CardTitle>Restablecer Contraseña</CardTitle>
                <CardDescription>Ingresa el código de recuperación y tu nueva contraseña</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-code">Código de Recuperación</Label>
                    <Input
                      id="reset-code"
                      type="text"
                      placeholder="XXXXXXXX"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirmar Nueva Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-new-password"
                        type="password"
                        placeholder="Repite tu nueva contraseña"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setScreen('login')}
                  >
                    Volver
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-sm">
          <p className="flex items-center justify-center gap-1">
            <Shield className="h-4 w-4" />
            Offline-first • Cifrado SHA-256 • IRS Audit-Ready
          </p>
        </div>
      </div>
    </div>
  );
}
