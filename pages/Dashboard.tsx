
import React from 'react';
// Fix: Added missing CheckCircle2 import from lucide-react to resolve errors on lines 192 and 199
import {
  TrendingUp,
  Droplets,
  MapPin,
  Box as BoxIcon,
  AlertCircle,
  CalendarDays,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { AppState } from '../types';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#FFD700', '#FFA000', '#FFC107', '#FF9800', '#FFB300'];

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }: any) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
    <p className="text-gray-500 font-medium mb-1">{title}</p>
    <h3 className="text-3xl font-bold">{value}</h3>
    {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
  </div>
);

export default function Dashboard({ data }: { data: AppState }) {
  const activeBoxes = data.boxes.filter(b => b.status === 'ativa').length;
  const occupiedBaits = data.baits.filter(b => b.status.state === 'ocupada').length;

  // Calc honey production
  const totalHoney = data.boxes.reduce((acc, box) => {
    const honeyLogs = box.managementHistory.filter(l => l.type === 'colheita');
    return acc + honeyLogs.reduce((sub, log) => sub + parseFloat(log.quantity || '0'), 0);
  }, 0);

  // Species distribution data
  const speciesCount = data.boxes.reduce((acc: any, box) => {
    acc[box.species] = (acc[box.species] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(speciesCount).map(key => ({ name: key, value: speciesCount[key] }));

  // Growth data (Simplified: boxes per month)
  const growthData = [
    { name: 'Jan', count: 1 },
    { name: 'Fev', count: 2 },
    { name: 'Mar', count: 3 },
    { name: 'Abr', count: activeBoxes },
  ];


  // Estimate total bees
  const ESTIMATED_BEES_PER_BOX = 3000;
  const totalBees = activeBoxes * ESTIMATED_BEES_PER_BOX;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, {data.settings.userName}! 👋</h1>
          <p className="text-gray-500">Veja como está o seu meliponário hoje.</p>
        </div>
        <div className="bg-white border p-3 px-4 rounded-xl flex items-center gap-3 shadow-sm">
          <CalendarDays className="text-amber-500" />
          <span className="font-medium">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Caixas Ativas"
          value={activeBoxes}
          icon={BoxIcon}
          colorClass="bg-amber-500"
          subtitle={`${data.boxes.length} total cadastradas`}
        />
        <StatCard
          title="Estima. Abelhas"
          value={totalBees.toLocaleString('pt-BR')}
          icon={TrendingUp}
          colorClass="bg-blue-500"
          subtitle="~3.000 por caixa"
        />
        <StatCard
          title="Iscas Ocupadas"
          value={occupiedBaits}
          icon={MapPin}
          colorClass="bg-orange-500"
          subtitle={`${data.baits.length} instaladas`}
        />
        <StatCard
          title="Mel Colhido"
          value={`${totalHoney}L`}
          icon={Droplets}
          colorClass="bg-yellow-400"
          subtitle="Estimativa total acumulada"
        />
        <StatCard
          title="Saúde Média"
          value="85%"
          icon={TrendingUp}
          colorClass="bg-green-500"
          subtitle="Baseado em manejos recentes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Crescimento do Meliponário</h3>
            <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">Últimos 6 meses</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={4} dot={{ r: 6, fill: '#F59E0B' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-center">Espécies</h3>
          <div className="h-64 relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <BoxIcon size={48} className="mb-2 opacity-20" />
                <p>Sem dados de espécies</p>
              </div>
            )}
            {pieData.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.boxes.length}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {pieData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-800 font-bold mb-4">
            <AlertCircle size={20} />
            <h3>Ações Recomendadas</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-amber-200">
              <CheckCircle2 size={18} className="text-amber-600 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Verificar Iscas</p>
                <p className="text-xs text-amber-700">Faz 15 dias desde a última vistoria no local A.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-amber-200">
              <CheckCircle2 size={18} className="text-amber-600 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Alimentação Mandaçaia #02</p>
                <p className="text-xs text-amber-700">Previsão de escassez para esta semana na região.</p>
              </div>
            </li>
          </ul>
          <Link to="/boxes" className="mt-4 flex items-center gap-2 text-sm font-bold text-amber-700 hover:underline">
            Ver todas as caixas <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
          <h3 className="font-bold text-lg mb-2">Dica do Especialista 🐝</h3>
          <p className="text-gray-300 text-sm mb-4">
            As abelhas Jataí costumam enxamear entre Setembro e Março. Prepare suas iscas com atrativo forte de própolis e cera de Jataí para aumentar as chances de captura.
          </p>
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-xs font-medium text-amber-400 uppercase mb-1">Próxima Lua Cheia</p>
            <p className="font-bold text-lg">25 de Maio</p>
            <p className="text-xs text-gray-400 mt-1 italic">Momento ideal para divisões em climas quentes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
