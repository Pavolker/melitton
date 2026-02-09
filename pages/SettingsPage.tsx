
import React from 'react';
import { User, Bell, Download, Trash2, ShieldCheck, Sun, Moon } from 'lucide-react';

interface Settings {
  userName: string;
  inspectionFrequencyDays: number;
  theme: 'light' | 'dark';
}

export default function SettingsPage({ settings, onUpdate, onReset }: { settings: Settings, onUpdate: (s: Settings) => void, onReset: () => void }) {

  const handleExport = () => {
    const data = localStorage.getItem('meligestao_data');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_meligestao_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleReset = () => {
    if (window.confirm('TEM CERTEZA? Isso apagará TODOS os seus dados permanentemente.')) {
      onReset();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-gray-500">Personalize sua experiência e gerencie seus dados.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-800 mb-6">
            <User size={20} className="text-amber-500" />
            <h2>Perfil do Usuário</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome do Meliponicultor</label>
              <input
                type="text"
                className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
                value={settings.userName}
                onChange={e => onUpdate({ ...settings, userName: e.target.value })}
              />
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-800 mb-6">
            <Bell size={20} className="text-amber-500" />
            <h2>Notificações & Frequência</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Intervalo de Inspeção (Dias)</label>
              <input
                type="number"
                className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
                value={settings.inspectionFrequencyDays}
                onChange={e => onUpdate({ ...settings, inspectionFrequencyDays: parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-400 mt-2">Usado para calcular os lembretes automáticos de vistoria de iscas e caixas.</p>
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-800 mb-6">
            <Download size={20} className="text-amber-500" />
            <h2>Dados & Backup</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl flex items-center gap-3 transition-colors"
            >
              <div className="p-2 bg-white rounded-xl text-gray-400 shadow-sm"><Download size={20} /></div>
              <div className="text-left">
                <p className="font-bold text-sm">Exportar Backup</p>
                <p className="text-[10px] text-gray-400">Salvar arquivo JSON</p>
              </div>
            </button>
            <button
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl flex items-center gap-3 transition-colors opacity-50 cursor-not-allowed"
              title="Em breve"
            >
              <div className="p-2 bg-white rounded-xl text-gray-400 shadow-sm"><ShieldCheck size={20} /></div>
              <div className="text-left">
                <p className="font-bold text-sm">Sincronizar Nuvem</p>
                <p className="text-[10px] text-gray-400">Em breve</p>
              </div>
            </button>
          </div>
        </section>

        <section className="bg-red-50 border border-red-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-red-800 mb-4">
            <Trash2 size={20} />
            <h2>Zona de Perigo</h2>
          </div>
          <p className="text-sm text-red-700 mb-6">
            A limpeza dos dados é irreversível. Certifique-se de ter um backup antes de prosseguir.
          </p>
          <button
            onClick={handleReset}
            className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            Apagar Todos os Dados
          </button>
        </section>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Melitton v1.0.0 Stable</p>
      </div>
    </div>
  );
}
