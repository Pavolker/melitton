
import React from 'react';
import { AppState } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Trophy, ArrowUpRight, ArrowDownRight, Droplets } from 'lucide-react';

const COLORS = ['#FFD700', '#FFA000', '#FFC107', '#FF9800', '#FFB300', '#F59E0B'];

export default function Stats({ data }: { data: AppState }) {
  // Production per species
  const productionBySpecies = data.boxes.reduce((acc: any, box) => {
    const total = box.managementHistory
      .filter(l => l.type === 'colheita')
      .reduce((sub, log) => sub + parseFloat(log.quantity || '0'), 0);
    
    acc[box.species] = (acc[box.species] || 0) + total;
    return acc;
  }, {});

  const barData = Object.keys(productionBySpecies).map(key => ({
    name: key,
    total: productionBySpecies[key]
  })).sort((a, b) => b.total - a.total);

  const totalHoney = barData.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Estatísticas & Relatórios</h1>
          <p className="text-gray-500">Análise detalhada da sua produção e crescimento.</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
          Exportar Relatório PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
              <Trophy size={24} />
            </div>
            <h3 className="font-bold">Top Produtora</h3>
          </div>
          <p className="text-gray-500 text-sm mb-1">Espécie mais eficiente</p>
          <h4 className="text-2xl font-bold text-gray-800">{barData[0]?.name || '--'}</h4>
          <div className="flex items-center gap-1 mt-2 text-green-500 text-sm font-bold">
            <ArrowUpRight size={16} />
            <span>+12% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
              <Droplets size={24} />
            </div>
            <h3 className="font-bold">Média Mensal</h3>
          </div>
          <p className="text-gray-500 text-sm mb-1">Colheita de mel</p>
          <h4 className="text-2xl font-bold text-gray-800">{(totalHoney / 12).toFixed(1)}L / mês</h4>
          <div className="flex items-center gap-1 mt-2 text-gray-400 text-sm font-bold">
            <span>Dentro do esperado</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-2xl text-green-500">
              <ArrowUpRight size={24} />
            </div>
            <h3 className="font-bold">Taxa de Captura</h3>
          </div>
          <p className="text-gray-500 text-sm mb-1">Sucesso nas iscas</p>
          <h4 className="text-2xl font-bold text-gray-800">
            {data.baits.length > 0 ? ((data.baits.filter(b => b.status.state === 'ocupada').length / data.baits.length) * 100).toFixed(0) : 0}%
          </h4>
          <div className="flex items-center gap-1 mt-2 text-red-400 text-sm font-bold">
            <ArrowDownRight size={16} />
            <span>-5% vs primavera passada</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <h3 className="text-xl font-bold mb-8">Produção Total por Espécie (Litros)</h3>
        <div className="h-80">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f5f5f5" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 14, fontWeight: 'bold', fill: '#4B5563' }} />
                <Tooltip 
                  cursor={{ fill: '#FFFBEB' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={40}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-2xl">
              <p>Registre colheitas para ver o gráfico de produção.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-600 p-8 rounded-3xl text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">Calculadora de Expansão</h3>
            <p className="text-amber-100 mb-6 max-w-lg">
              Com base no seu estoque atual e taxa de sucesso, estimamos que em 12 meses você terá aproximadamente 
              <span className="text-white font-bold text-xl"> {(data.boxes.length * 1.5).toFixed(0)} colmeias </span> 
              se mantiver o ritmo de divisões.
            </p>
            <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              Ver Plano de Manejo Sugerido
            </button>
          </div>
          <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Próxima Divisão</p>
              <p className="text-3xl font-bold">15 Dias</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-500/20 rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-60 h-60 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}
