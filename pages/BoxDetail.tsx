
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Plus,
  History,
  Activity,
  Droplet,
  ClipboardCheck,
  Zap,
  ChevronDown
} from 'lucide-react';
import { Box, ManagementLog, ManagementType } from '../types';
import { BOX_STATUS_LABELS, STATUS_COLORS, MANAGEMENT_TYPE_LABELS } from '../constants';

export default function BoxDetail({ boxes, onUpdate, onDelete, onAddLog }: {
  boxes: Box[],
  onUpdate: (b: Box) => void,
  onDelete: (id: string) => void,
  onAddLog: (boxId: string, log: ManagementLog) => void
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const box = boxes.find(b => b.id === id);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newLog, setNewLog] = useState<Partial<ManagementLog>>({ type: 'inspeção', date: new Date().toISOString().split('T')[0], notes: '' });

  if (!box) return <div>Caixa não encontrada</div>;

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta caixa? Todo o histórico será perdido.')) {
      onDelete(box.id);
      navigate('/boxes');
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const log: ManagementLog = {
      id: crypto.randomUUID(), // Temp ID, backend generates real one
      date: newLog.date || new Date().toISOString().split('T')[0],
      type: newLog.type as ManagementType,
      notes: newLog.notes || '',
      quantity: newLog.quantity
    };
    onAddLog(box.id, log);
    setShowLogForm(false);
    setNewLog({ type: 'inspeção', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/boxes')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <Link to={`/boxes/edit/${box.id}`} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors">
            <Edit2 size={20} />
          </Link>
          <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
            <div className="aspect-square bg-gray-100 relative">
              {box.photo ? (
                <img src={box.photo} alt={box.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Activity size={64} />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm ${STATUS_COLORS[box.status]}`}>
                  {BOX_STATUS_LABELS[box.status]}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-1">{box.name}</h1>
              <p className="text-amber-600 font-bold mb-4">{box.species}</p>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-500">Instalação:</span>
                  <span className="font-medium">{new Date(box.installDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-500">Localização:</span>
                  <span className="font-medium">{box.location.description}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Zap size={16} className="text-gray-400" />
                  <span className="text-gray-500">Origem:</span>
                  <span className="font-medium capitalize">{box.origin}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-600 text-white p-6 rounded-3xl shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Droplet size={20} /> Previsão de Mel
            </h3>
            <div className="text-center py-4">
              <p className="text-4xl font-bold">1.2L</p>
              <p className="text-amber-200 text-sm mt-1">Estimativa anual</p>
            </div>
            <p className="text-xs text-amber-100 mt-4 bg-black/10 p-3 rounded-xl">
              Baseado na espécie {box.species} e idade da colônia de {(new Date().getFullYear() - new Date(box.installDate).getFullYear()) || 1} ano(s).
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History className="text-amber-500" /> Histórico de Manejo
              </h3>
              <button
                onClick={() => setShowLogForm(!showLogForm)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
              >
                {showLogForm ? <ChevronDown size={18} /> : <Plus size={18} />}
                Novo Manejo
              </button>
            </div>

            {showLogForm && (
              <form onSubmit={handleAddLog} className="mb-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 space-y-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tipo de Manejo</label>
                    <select
                      required
                      className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
                      value={newLog.type}
                      onChange={e => setNewLog({ ...newLog, type: e.target.value as ManagementType })}
                    >
                      {Object.keys(MANAGEMENT_TYPE_LABELS).map(key => (
                        <option key={key} value={key}>{MANAGEMENT_TYPE_LABELS[key as ManagementType]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Data</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
                      value={newLog.date}
                      onChange={e => setNewLog({ ...newLog, date: e.target.value })}
                    />
                  </div>
                </div>
                {newLog.type === 'colheita' || newLog.type === 'alimentação' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Quantidade (ex: 500ml)</label>
                    <input
                      type="text"
                      placeholder="Ex: 500ml"
                      className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
                      value={newLog.quantity}
                      onChange={e => setNewLog({ ...newLog, quantity: e.target.value })}
                    />
                  </div>
                ) : null}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Observações</label>
                  <textarea
                    className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-amber-500 outline-none h-24"
                    placeholder="O que você observou?"
                    value={newLog.notes}
                    onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600">Salvar Registro</button>
                  <button type="button" onClick={() => setShowLogForm(false)} className="px-6 bg-white text-gray-500 border font-bold rounded-xl">Cancelar</button>
                </div>
              </form>
            )}

            <div className="relative space-y-6">
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-100" />
              {box.managementHistory.length > 0 ? (
                box.managementHistory.map((log) => (
                  <div key={log.id} className="relative flex gap-6 group">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 
                      ${log.type === 'inspeção' ? 'bg-blue-50 text-blue-500' :
                        log.type === 'colheita' ? 'bg-amber-50 text-amber-500' :
                          log.type === 'alimentação' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-500'}
                    `}>
                      <ClipboardCheck size={20} />
                    </div>
                    <div className="flex-1 pb-6 group-last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-800">{MANAGEMENT_TYPE_LABELS[log.type]}</h4>
                        <span className="text-xs font-medium text-gray-400">{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{log.notes}</p>
                      {log.quantity && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-bold text-gray-500">
                          {log.type === 'colheita' ? <Droplet size={12} /> : null}
                          {log.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <History size={48} className="mx-auto mb-2 opacity-10" />
                  <p>Nenhum manejo registrado ainda.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-dashed">
            <h3 className="font-bold text-gray-700 mb-2">Observações Gerais</h3>
            <p className="text-gray-500 text-sm">{box.observations || "Nenhuma observação cadastrada para esta colmeia."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
