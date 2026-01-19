import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Order, Expense } from '../types';
import { formatCurrency } from '../utils';
import { TrendingUp, TrendingDown, Wallet, Calendar, IceCream, Filter } from 'lucide-react';

interface DashboardProps {
  orders: Order[];
  expenses: Expense[];
}

type TimeRange = 'week' | 'month' | 'year';

const Dashboard: React.FC<DashboardProps> = ({ orders, expenses }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  // 1. Calculate Date Cutoff
  const { cutoffDate, startDate } = useMemo(() => {
    const now = new Date();
    const d = new Date();
    
    // We set the time to midnight to avoid timezone issues when comparing just dates string wise later
    d.setHours(0,0,0,0);

    if (timeRange === 'week') d.setDate(now.getDate() - 6); // 7 days inc today
    if (timeRange === 'month') d.setDate(now.getDate() - 29); // 30 days inc today
    if (timeRange === 'year') d.setMonth(now.getMonth() - 11); // 12 months inc this one

    return { 
      cutoffDate: d.toISOString().split('T')[0],
      startDate: d
    };
  }, [timeRange]);

  // 2. Filter Data based on Cutoff
  const filteredOrders = useMemo(() => 
    orders.filter(o => o.date >= cutoffDate), 
  [orders, cutoffDate]);

  const filteredExpenses = useMemo(() => 
    expenses.filter(e => e.date >= cutoffDate), 
  [expenses, cutoffDate]);

  // 3. Calculate Cards Totals
  const totalRevenue = filteredOrders.reduce((acc, curr) => acc + curr.total, 0);
  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalRevenue - totalExpenses;

  // 4. Prepare Chart Data
  const chartData = useMemo(() => {
    const dataPoints: { name: string; fullDate: string; Receita: number; Despesa: number; Lucro: number }[] = [];
    const now = new Date();

    if (timeRange === 'year') {
      // Group by Month for Year view
      for (let i = 0; i < 12; i++) {
        const d = new Date(startDate);
        d.setMonth(startDate.getMonth() + i);
        const yearMonth = d.toISOString().slice(0, 7); // YYYY-MM
        const monthName = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

        const monthOrders = filteredOrders.filter(o => o.date.startsWith(yearMonth));
        const monthExpenses = filteredExpenses.filter(e => e.date.startsWith(yearMonth));

        const rev = monthOrders.reduce((acc, o) => acc + o.total, 0);
        const exp = monthExpenses.reduce((acc, e) => acc + e.amount, 0);

        dataPoints.push({
          name: monthName, // Out/24
          fullDate: yearMonth,
          Receita: rev,
          Despesa: exp,
          Lucro: rev - exp
        });
      }
    } else {
      // Group by Day for Week/Month view
      const days = timeRange === 'week' ? 7 : 30;
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        const daysOrders = filteredOrders.filter(o => o.date === dateStr);
        const daysExpenses = filteredExpenses.filter(e => e.date === dateStr);

        const rev = daysOrders.reduce((acc, o) => acc + o.total, 0);
        const exp = daysExpenses.reduce((acc, e) => acc + e.amount, 0);

        dataPoints.push({
          name: dayName, // 05/10
          fullDate: dateStr,
          Receita: rev,
          Despesa: exp,
          Lucro: rev - exp
        });
      }
    }
    return dataPoints;
  }, [filteredOrders, filteredExpenses, timeRange, startDate]);

  // 5. Flavor Popularity (Filtered)
  const flavorData = useMemo(() => {
    const counts: {[key: string]: number} = {};
    filteredOrders.forEach(order => {
      Object.entries(order.flavors).forEach(([key, qty]) => {
        counts[key] = (counts[key] || 0) + (qty as number);
      });
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.replace('_', ' '), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5
  }, [filteredOrders]);

  const COLORS = ['#f43f5e', '#a855f7', '#fb923c', '#e11d48', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
        
        <div className="bg-white p-1 rounded-lg border border-purple-100 flex shadow-sm">
          {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {range === 'week' ? '7 Dias' : range === 'month' ? '30 Dias' : '1 Ano'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Despesas Totais</p>
              <h3 className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(totalExpenses)}</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingDown className="text-red-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Saldo em Caixa</p>
              <h3 className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wallet className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calendar className="text-gray-400 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Fluxo de Caixa</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ color: '#6b7280' }}
                />
                <Legend />
                <Bar dataKey="Receita" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Flavors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <IceCream className="text-gray-400 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Top 5 Sabores</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
             {flavorData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={flavorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {flavorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             ) : (
               <div className="text-gray-400 text-sm">Sem dados para o período</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;