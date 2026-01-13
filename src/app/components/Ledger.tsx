// Ledger - List of all daily records

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Calendar, Download, ChevronRight } from 'lucide-react';
import { DailyLedger } from '@/app/types';
import { getAllLedgers } from '@/app/services/storage';

interface LedgerProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Ledger({ onNavigate }: LedgerProps) {
  const [ledgers, setLedgers] = useState<DailyLedger[]>([]);
  const [filteredLedgers, setFilteredLedgers] = useState<DailyLedger[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLedgers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = ledgers.filter(ledger =>
        ledger.date.includes(searchTerm) ||
        ledger.recordHash.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLedgers(filtered);
    } else {
      setFilteredLedgers(ledgers);
    }
  }, [searchTerm, ledgers]);

  function loadLedgers() {
    const allLedgers = getAllLedgers();
    // Sort by date descending
    allLedgers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setLedgers(allLedgers);
    setFilteredLedgers(allLedgers);
  }

  const totalMiles = ledgers.reduce((sum, l) => sum + l.originalMiles, 0);
  const totalIncome = ledgers.reduce((sum, l) => sum + l.income, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Historial</h1>
              <p className="text-gray-600">{ledgers.length} días registrados</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => onNavigate('export')}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Millas</CardDescription>
              <CardTitle className="text-2xl">{totalMiles.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Ingresos</CardDescription>
              <CardTitle className="text-2xl">${totalIncome.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Deducción Total</CardDescription>
              <CardTitle className="text-2xl">${(totalMiles * 0.67).toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por fecha o hash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Ledger List */}
        <div className="space-y-2">
          {filteredLedgers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay registros disponibles</p>
              </CardContent>
            </Card>
          ) : (
            filteredLedgers.map((ledger) => (
              <Card
                key={ledger.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onNavigate('dayDetail', ledger)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          {new Date(ledger.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>
                        {ledger.corrections.length > 0 && (
                          <Badge variant="secondary">Corregido</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Millas:</span>
                          <span className="ml-1 font-medium">{ledger.originalMiles.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ingresos:</span>
                          <span className="ml-1 font-medium">${ledger.income.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Odómetro:</span>
                          <span className="ml-1 font-medium">{ledger.odometerStart} - {ledger.odometerEnd}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 font-mono truncate">
                        Hash: {ledger.recordHash}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
