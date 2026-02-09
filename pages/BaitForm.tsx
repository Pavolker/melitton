
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { Bait, BeeSpecies } from '../types';
import { SPECIES_LIST } from '../constants';

export default function BaitForm({ baits, onSave }: { baits?: Bait[], onSave: (b: Bait) => void }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const editingBait = baits?.find(b => b.id === id);

  const [formData, setFormData] = useState<Partial<Bait>>({
    name: '',
    type: 'Garrafa PET',
    attractant: 'Loção de Própolis',
    location: { description: '' },
    installDate: new Date().toISOString().split('T')[0],
    targetSpecies: 'Jataí',
    status: { state: 'vazia', lastInspection: new Date().toISOString().split('T')[0] },
    nextInspectionDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 15);
      return d.toISOString().split('T')[0];
    })()
  });

  useEffect(() => {
    if (editingBait) {
      setFormData(editingBait);
    }
  }, [editingBait]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bait: Bait = {
      ...formData as Bait,
      id: formData.id || crypto.randomUUID()
    };
    onSave(bait);
    navigate('/baits');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">{editingBait ? 'Editar Isca' : 'Nova Isca'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Identificador da Isca</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Isca #42 - Mata do Meio"
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none text-lg font-semibold"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Modelo da Isca</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Garrafa PET 2L"
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Espécie Alvo</label>
            <select 
              required
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              value={formData.targetSpecies}
              onChange={e => setFormData({ ...formData, targetSpecies: e.target.value as BeeSpecies })}
            >
              {SPECIES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Localização</label>
            <input 
              required
              type="text" 
              placeholder="Ex: No pé da mangueira, 2m de altura"
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.location?.description}
              onChange={e => setFormData({ ...formData, location: { description: e.target.value } })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Data de Instalação</label>
            <input 
              required
              type="date" 
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              value={formData.installDate}
              onChange={e => setFormData({ ...formData, installDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status da Isca</label>
            <select 
              required
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              value={formData.status?.state}
              onChange={e => setFormData({ ...formData, status: { ...formData.status!, state: e.target.value as any } })}
            >
              <option value="vazia">Vazia (Aguardando)</option>
              <option value="ocupada">Ocupada (Enxameada!)</option>
              <option value="coletada">Coletada (Retirada)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t flex gap-4">
          <button 
            type="submit" 
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Salvar Isca
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-8 bg-white border text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
