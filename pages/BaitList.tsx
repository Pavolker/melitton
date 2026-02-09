
import React from 'react';
import { Bait } from '../types';
import { Plus, MapPin, Calendar, Clock, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { STATUS_COLORS } from '../constants';

export default function BaitList({ baits, onDelete, onUpdate }: { baits: Bait[], onDelete: (id: string) => void, onUpdate: (b: Bait) => void }) {
  const navigate = useNavigate();

  const handleMarkInspected = (e: React.MouseEvent, bait: Bait) => {
    e.preventDefault();
    e.stopPropagation();
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 15);
    onUpdate({
      ...bait,
      status: { ...bait.status, lastInspection: new Date().toISOString().split('T')[0] },
      nextInspectionDate: nextDate.toISOString().split('T')[0]
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Excluir esta isca?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Minhas Iscas</h1>
          <p className="text-gray-500">{baits.length} iscas instaladas no campo</p>
        </div>
        <Link 
          to="/baits/new" 
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Nova Isca</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {baits.length > 0 ? (
          baits.map((bait) => {
            const isOverdue = new Date(bait.nextInspectionDate) < new Date();
            return (
              <div 
                key={bait.id}
                onClick={() => navigate(`/baits/edit/${bait.id}`)}
                className="bg-white border rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold">{bait.name}</h3>
                      <p className="text-xs text-amber-700 font-semibold">{bait.targetSpecies}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleDelete(e, bait.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Instalação</span>
                    </div>
                    <p className="text-xs font-bold">{new Date(bait.installDate).toLocaleDateString()}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${isOverdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-400' : 'text-gray-400'} mb-1`}>
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Próx. Inspeção</span>
                    </div>
                    <p className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(bait.nextInspectionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${STATUS_COLORS[bait.status.state]}`}>
                    {bait.status.state}
                  </span>
                  <button 
                    onClick={(e) => handleMarkInspected(e, bait)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Inspecionar
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 bg-white border border-dashed rounded-3xl">
            <MapPin size={64} className="mb-4 opacity-10" />
            <h3 className="font-bold text-gray-600">Nenhuma isca cadastrada</h3>
            <p className="text-sm">Comece instalando iscas para capturar novos enxames.</p>
          </div>
        )}
      </div>
    </div>
  );
}
