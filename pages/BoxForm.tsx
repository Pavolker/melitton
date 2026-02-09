
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Camera, MapPin, Info } from 'lucide-react';
import { Box, BeeSpecies, BoxStatus } from '../types';
import { SPECIES_LIST, BOX_STATUS_LABELS } from '../constants';

export default function BoxForm({ boxes, onSave }: { boxes?: Box[], onSave: (b: Box) => void }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const editingBox = boxes?.find(b => b.id === id);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Partial<Box>>({
    name: '',
    species: 'Jataí',
    boxType: '',
    installDate: new Date().toISOString().split('T')[0],
    origin: 'captura',
    location: { description: '' },
    status: 'ativa',
    observations: '',
    managementHistory: []
  });

  useEffect(() => {
    if (editingBox) {
      setFormData(editingBox);
    }
  }, [editingBox]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const box: Box = {
      ...formData as Box,
      id: formData.id || crypto.randomUUID(),
      managementHistory: formData.managementHistory || []
    };
    onSave(box);
    navigate('/boxes');
  };

  const handleCapturePhoto = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({
          ...formData,
          location: {
            ...formData.location!,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            description: formData.location?.description || 'Local atual via GPS'
          }
        });
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">{editingBox ? 'Editar Caixa' : 'Nova Caixa'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Identificador / Nome</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Caixa 01 - Quintal"
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none text-lg font-semibold"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Espécie de Abelha</label>
            <select 
              required
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              value={formData.species}
              onChange={e => setFormData({ ...formData, species: e.target.value as BeeSpecies })}
            >
              {SPECIES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status Inicial</label>
            <select 
              required
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as BoxStatus })}
            >
              {Object.keys(BOX_STATUS_LABELS).map(key => (
                <option key={key} value={key}>{BOX_STATUS_LABELS[key as BoxStatus]}</option>
              ))}
            </select>
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
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Origem</label>
            <select 
              required
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              value={formData.origin}
              onChange={e => setFormData({ ...formData, origin: e.target.value as any })}
            >
              <option value="captura">Captura (Isca)</option>
              <option value="divisão">Divisão / Multiplicação</option>
              <option value="compra">Compra / Aquisição</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Localização</label>
            <div className="flex gap-2">
              <input 
                required
                type="text" 
                placeholder="Ex: Próximo à pitangueira"
                className="flex-1 bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.location?.description}
                onChange={e => setFormData({ ...formData, location: { ...formData.location!, description: e.target.value } })}
              />
              <button 
                type="button"
                onClick={handleGetLocation}
                className="bg-amber-100 text-amber-600 p-4 rounded-2xl hover:bg-amber-200 transition-colors"
                title="Pegar localização GPS"
              >
                <MapPin size={24} />
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Foto da Caixa</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Camera size={32} />
                  </div>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoSelected}
              />
              <button 
                type="button" 
                onClick={handleCapturePhoto}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Capturar Foto
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Observações Adicionais</label>
            <textarea 
              className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 outline-none h-32"
              placeholder="Modelo da caixa, dimensões, etc..."
              value={formData.observations}
              onChange={e => setFormData({ ...formData, observations: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-6 border-t flex gap-4">
          <button 
            type="submit" 
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Salvar Colmeia
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

      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
        <Info className="text-blue-500 shrink-0" size={20} />
        <p className="text-sm text-blue-700">
          <strong>Dica:</strong> Manter o registro da origem ajuda a evitar a consanguinidade na hora de realizar futuras divisões.
        </p>
      </div>
    </div>
  );
}
