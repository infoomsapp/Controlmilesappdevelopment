// Earnings - Income calculations and efficiency metrics

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, TrendingUp, DollarSign, Gauge } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLedger } from '@/app/types';
import { getAllLedgers, getSettings } from '@/app/services/storage';

interface EarningsProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Earnings({ onNavigate }: EarningsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [ledgers, setLedgers] = useState<DailyLedger[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [period]);

  function loadData() {
    const all = getAllLedgers();
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    const filtered = all.filter(l => new Date(l.date) >= startDate);
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setLedgers(filtered);

    // Prepare chart data
    const data = filtered.map(l => ({
      date: new Date(l.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      millas: l.originalMiles,
      ingresos: l.income,
      porMilla: l.originalMiles > 0 ? l.income / l.originalMiles : 0,
    }));

    setChartData(data);
  }

  const settings = getSettings();
  const totalMiles = ledgers.reduce((sum, l) => sum + l.originalMiles, 0);
  const totalIncome = ledgers.reduce((sum, l) => sum + l.income, 0);
  const incomePerMile = totalMiles > 0 ? totalIncome / totalMiles : 0;
  const taxDeduction = totalMiles * settings.standardMileageRate;

  const periodLabels = {
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Ganancias</h1>
            <p className="text-gray-600">Análisis de eficiencia e ingresos</p>
          </div>
        </div>

        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mes</TabsTrigger>
            <TabsTrigger value="year">Año</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Millas</CardDescription>
              <CardTitle className="text-2xl">{totalMiles.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                {periodLabels[period]}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Ingresos</CardDescription>
              <CardTitle className="text-2xl text-green-600">${totalIncome.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                {periodLabels[period]}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ingreso por Milla</CardDescription>
              <CardTitle className="text-2xl text-blue-600">${incomePerMile.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-gray-500">
                <Gauge className="h-3 w-3 mr-1" />
                Eficiencia
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Deducción IRS</CardDescription>
              <CardTitle className="text-2xl text-purple-600">${taxDeduction.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                ${settings.standardMileageRate}/milla
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp className="h-5 w-5 inline mr-2" />
              Ingresos Diarios
            </CardTitle>
            <CardDescription>Tendencia de ganancias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" fill="#10b981" name="Ingresos ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <DollarSign className="h-5 w-5 inline mr-2" />
              Eficiencia ($/Milla)
            </CardTitle>
            <CardDescription>Ganancia por milla recorrida</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="porMilla" stroke="#3b82f6" name="$/Milla" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose Diario</CardTitle>
            <CardDescription>{ledgers.length} días en este período</CardDescription>
          </CardHeader>
          <CardContent>
            {ledgers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay datos para este período</p>
            ) : (
              <div className="space-y-2">
                {ledgers.map((ledger) => (
                  <div
                    key={ledger.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => onNavigate('dayDetail', ledger)}
                  >
                    <div>
                      <div className="font-medium">
                        {new Date(ledger.date).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {ledger.originalMiles.toFixed(2)} millas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">${ledger.income.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        ${ledger.originalMiles > 0 ? (ledger.income / ledger.originalMiles).toFixed(2) : '0.00'}/mi
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle>Deducción Fiscal Estimada</CardTitle>
            <CardDescription>Basado en la tasa estándar del IRS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Millas:</span>
              <span className="font-semibold">{totalMiles.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasa IRS:</span>
              <span className="font-semibold">${settings.standardMileageRate}/milla</span>
            </div>
            <div className="h-px bg-purple-300 my-2" />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Deducción Total:</span>
              <span className="font-bold text-purple-700">${taxDeduction.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              * Esta es una estimación. Consulta con un contador para tu situación fiscal específica.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
