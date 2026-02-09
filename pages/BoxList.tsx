
import React, { useState } from 'react';
import { Box, BeeSpecies, BoxStatus } from '../types';
// Fix: Added missing Box as BoxIcon import from lucide-react to resolve error on line 89
import { Search, Filter, Plus, ChevronRight, MapPin, Tag, Box as BoxIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STATUS_COLORS, SPECIES_LIST, BOX_STATUS_LABELS } from '../constants';

export default function BoxList({ boxes }: { boxes: Box[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<BeeSpecies | 'todas'>('todas');
  const [statusFilter, setStatusFilter] = useState<BoxStatus | 'todos'>('todos');

  const filteredBoxes = boxes.filter(box => {
    const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          box.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'todas' || box.species === speciesFilter;
    const matchesStatus = statusFilter === 'todos' || box.status === statusFilter;
    return matchesSearch && matchesSpecies && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Minhas Caixas</h1>
          <p className="text-gray-500">{boxes.length} colmeias registradas no total</p>
        </div>
        <Link 
          to="/boxes/new" 
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Adicionar Caixa</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou ID..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-amber-500 rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Filter size={16} />
            <span>Filtros:</span>
          </div>
          <select 
            className="bg-gray-50 border-none text-sm font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value as any)}
          >
            <option value="todas">Todas Espécies</option>
            {SPECIES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="bg-gray-50 border-none text-sm font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="todos">Todos Status</option>
            {Object.keys(BOX_STATUS_LABELS).map(key => (
              <option key={key} value={key}>{BOX_STATUS_LABELS[key as BoxStatus]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBoxes.length > 0 ? (
          filteredBoxes.map((box) => (
            <Link 
              key={box.id} 
              to={`/boxes/${box.id}`}
              className="bg-white border p-4 rounded-2xl hover:border-amber-400 hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                  {box.photo ? (
                    <img src={box.photo} alt={box.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <BoxIcon size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg truncate pr-2">{box.name}</h3>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-fit mb-2">
                    <Tag size={12} />
                    {box.species}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} />
                    <span className="truncate">{box.location.description}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${STATUS_COLORS[box.status]}`}>
                  {BOX_STATUS_LABELS[box.status]}
                </span>
                <span className="text-[10px] text-gray-400">
                  Desde {new Date(box.installDate).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white border border-dashed rounded-2xl">
            <Search size={48} className="mb-2 opacity-20" />
            <p className="font-medium">Nenhuma caixa encontrada com esses filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
