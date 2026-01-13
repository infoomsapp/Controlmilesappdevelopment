// ControlMiles - Main Application Component

import { useState, useEffect } from 'react';
import { Toaster } from '@/app/components/ui/sonner';
import { Welcome } from '@/app/components/Welcome';
import { Dashboard } from '@/app/components/Dashboard';
import { Ledger } from '@/app/components/Ledger';
import { DayDetail } from '@/app/components/DayDetail';
import { Photos } from '@/app/components/Photos';
import { Earnings } from '@/app/components/Earnings';
import { Export } from '@/app/components/Export';
import { Settings } from '@/app/components/Settings';
import { Button } from '@/app/components/ui/button';
import { Menu, Settings as SettingsIcon, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import { DailyLedger } from '@/app/types';
import { generateMockData } from '@/app/services/mockData';
import { isLoggedIn, logout, getCurrentUser } from '@/app/services/auth';
import { toast } from 'sonner';

type Screen =
  | 'dashboard'
  | 'ledger'
  | 'dayDetail'
  | 'photos'
  | 'earnings'
  | 'export'
  | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [screenData, setScreenData] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and initialize
    async function init() {
      const loggedIn = isLoggedIn();
      setIsAuthenticated(loggedIn);
      
      if (loggedIn) {
        // Initialize mock data only if logged in
        await generateMockData();
      }
      
      setIsLoading(false);
    }
    init();
  }, []);

  const handleLogin = async () => {
    setIsAuthenticated(true);
    setIsLoading(true);
    await generateMockData();
    setIsLoading(false);
    const user = getCurrentUser();
    if (user) {
      toast.success(`¡Bienvenido, ${user.username}!`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentScreen('dashboard');
    toast.success('Sesión cerrada correctamente');
  };

  const navigate = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    setScreenData(data);
    setMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">ControlMiles</div>
          <div className="text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  // Show welcome screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Welcome onLogin={handleLogin} />
        <Toaster position="top-center" />
      </>
    );
  }

  // Render the appropriate screen component
  const renderScreen = () => {
    const props = { onNavigate: navigate };

    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'ledger':
        return <Ledger {...props} />;
      case 'dayDetail':
        return <DayDetail {...props} ledger={screenData as DailyLedger} />;
      case 'photos':
        return <Photos {...props} ledger={screenData as DailyLedger} />;
      case 'earnings':
        return <Earnings {...props} />;
      case 'export':
        return <Export {...props} />;
      case 'settings':
        return <Settings {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  };

  return (
    <div className="relative">
      {/* Navigation Menu - Only show on Dashboard */}
      {currentScreen === 'dashboard' && (
        <div className="fixed top-4 right-4 z-50">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="shadow-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>ControlMiles</SheetTitle>
                <SheetDescription>Menú de navegación</SheetDescription>
              </SheetHeader>
              
              {/* User Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {getCurrentUser()?.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{getCurrentUser()?.username}</p>
                    <p className="text-xs text-gray-600 truncate">{getCurrentUser()?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('ledger')}
                >
                  Historial
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('earnings')}
                >
                  Ganancias
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('export')}
                >
                  Exportar
                </Button>
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('settings')}
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Configuración
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Main Content */}
      {renderScreen()}

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </div>
  );
}