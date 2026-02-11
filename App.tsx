
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Box as BoxIcon,
  MapPin,
  History,
  BarChart3,
  Settings,
  PlusCircle,
  Menu,
  X,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { AppState, Box, Bait, ManagementLog } from './types';
import { api } from './api';
import Dashboard from './pages/Dashboard';
import BoxList from './pages/BoxList';
import BoxDetail from './pages/BoxDetail';
import BaitList from './pages/BaitList';
import Stats from './pages/Stats';
import SettingsPage from './pages/SettingsPage';
import BoxForm from './pages/BoxForm';
import BaitForm from './pages/BaitForm';

const STORAGE_KEY = 'meligestao_data';

const INITIAL_STATE: AppState = {
  boxes: [],
  baits: [],
  settings: {
    userName: 'Meliponicultor',
    inspectionFrequencyDays: 15,
    theme: 'light'
  }
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/boxes', icon: BoxIcon, label: 'Minhas Caixas' },
    { to: '/baits', icon: MapPin, label: 'Minhas Iscas' },
    { to: '/stats', icon: BarChart3, label: 'Estatísticas' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/mdh.gif" alt="Melitton" className="w-8 h-8 rounded-lg" />
          <h1 className="font-bold text-lg">Melitton</h1>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Desktop Sidebar / Mobile Drawer */}
      <nav className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="hidden md:flex items-center gap-3 p-6 border-b">
            <img src="/mdh.gif" alt="Melitton" className="w-10 h-10 rounded-xl" />
            <div>
              <h1 className="font-bold text-xl leading-tight">Melitton</h1>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Abelhas sem Ferrão</span>
            </div>
          </div>

          <div className="flex-1 py-4 overflow-y-auto">
            <div className="px-4 mb-4">
              <Link
                to="/boxes/new"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-95"
              >
                <PlusCircle size={20} />
                <span>Nova Caixa</span>
              </Link>
            </div>

            <ul className="space-y-1 px-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                        ${isActive
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <Icon size={20} className={isActive ? 'text-amber-600' : 'text-gray-400'} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold">
                MP
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold truncate">Meliponário Pro</p>
                <p className="text-xs text-gray-500">Versão 1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default function App() {
  const [appData, setAppData] = useState<AppState>(() => {
    // Tenta carregar do localStorage como fallback
    const savedData = localStorage.getItem('melitton_local_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          boxes: parsed.boxes || [],
          baits: parsed.baits || [],
          settings: {
            userName: 'Meliponário Pro',
            inspectionFrequencyDays: 15,
            theme: 'light'
          }
        };
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
    
    // Valor padrão se não houver dados salvos
    return {
      boxes: [],
      baits: [],
      settings: {
        userName: 'Meliponário Pro',
        inspectionFrequencyDays: 15,
        theme: 'light'
      }
    };
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [boxes, baits] = await Promise.all([api.getBoxes(), api.getBaits()]);
        // Mescla dados do servidor com dados locais para garantir que nada seja perdido
        setAppData(prev => {
          const mergedBoxes = [...boxes, ...prev.boxes.filter(localBox => 
            !boxes.some(serverBox => serverBox.id === localBox.id)
          )];
          
          const mergedBaits = [...baits, ...prev.baits.filter(localBait => 
            !baits.some(serverBait => serverBait.id === localBait.id)
          )];
          
          return { ...prev, boxes: mergedBoxes, baits: mergedBaits };
        });
      } catch (err) {
        console.error('Failed to load data from server, using local data:', err);
        // Os dados já estão carregados do localStorage no estado inicial
      }
    };
    loadData();
  }, []);

  // Sincroniza dados locais com o servidor periodicamente
  useEffect(() => {
    const syncLocalData = async () => {
      setSyncStatus('syncing');
      
      const localData = localStorage.getItem('melitton_local_data');
      if (!localData) {
        setSyncStatus('idle');
        return;
      }

      try {
        const { boxes: localBoxes, baits: localBaits } = JSON.parse(localData);

        // Sincroniza boxes locais que não estão no servidor
        for (const localBox of localBoxes) {
          if (!appData.boxes.some(serverBox => serverBox.id === localBox.id)) {
            try {
              // Verifica se é um ID local (começa com 'local_')
              if (localBox.id.startsWith('local_')) {
                // Se for um ID local, cria um novo no servidor
                const { id, managementHistory, ...boxData } = localBox;
                await api.createBox(boxData);
              } else {
                // Se for um ID do servidor, atualiza
                await api.updateBox(localBox);
              }
            } catch (error) {
              console.error(`Falha ao sincronizar box ${localBox.id}:`, error);
            }
          }
        }

        // Sincroniza baits locais que não estão no servidor
        for (const localBait of localBaits) {
          if (!appData.baits.some(serverBait => serverBait.id === localBait.id)) {
            try {
              // Verifica se é um ID local (começa com 'local_')
              if (localBait.id.startsWith('local_')) {
                // Se for um ID local, cria um novo no servidor
                const { id, ...baitData } = localBait;
                await api.createBait(baitData);
              } else {
                // Se for um ID do servidor, atualiza
                await api.updateBait(localBait);
              }
            } catch (error) {
              console.error(`Falha ao sincronizar bait ${localBait.id}:`, error);
            }
          }
        }
        
        setSyncStatus('success');
        
        // Volta ao estado idle após 3 segundos
        setTimeout(() => {
          setSyncStatus('idle');
        }, 3000);
      } catch (error) {
        console.error('Erro ao sincronizar dados locais:', error);
        setSyncStatus('error');
        
        // Volta ao estado idle após 3 segundos
        setTimeout(() => {
          setSyncStatus('idle');
        }, 3000);
      }
    };

    // Executa a sincronização a cada 5 minutos
    const syncInterval = setInterval(syncLocalData, 5 * 60 * 1000);
    
    // Executa uma vez imediatamente
    syncLocalData();

    return () => clearInterval(syncInterval);
  }, [appData.boxes, appData.baits]);

  const updateAppData = (newData: Partial<AppState>) => {
    setAppData(prev => ({ ...prev, ...newData }));
  };

  const addBox = async (box: Box) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, managementHistory, ...data } = box;
      const newBox = await api.createBox(data);
      setAppData(prev => ({ ...prev, boxes: [newBox, ...prev.boxes] }));
    } catch (err) {
      console.error('Failed to add box:', err);
    }
  };

  const updateBox = async (updatedBox: Box) => {
    try {
      const result = await api.updateBox(updatedBox);
      setAppData(prev => ({
        ...prev,
        boxes: prev.boxes.map(b => b.id === result.id ? { ...result, managementHistory: b.managementHistory } : b)
      }));
    } catch (err) {
      console.error('Failed to update box:', err);
    }
  };

  const deleteBox = async (id: string) => {
    try {
      await api.deleteBox(id);
      setAppData(prev => ({ ...prev, boxes: prev.boxes.filter(b => b.id !== id) }));
    } catch (err) {
      console.error('Failed to delete box:', err);
    }
  };

  const addLog = async (boxId: string, log: ManagementLog) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = log;
      const newLog = await api.addLog(boxId, data);
      setAppData(prev => ({
        ...prev,
        boxes: prev.boxes.map(b =>
          b.id === boxId
            ? { ...b, managementHistory: [newLog, ...b.managementHistory] }
            : b
        )
      }));
    } catch (err) {
      console.error('Failed to add log:', err);
    }
  };

  const addBait = async (bait: Bait) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = bait;
      const newBait = await api.createBait(data);
      setAppData(prev => ({ ...prev, baits: [newBait, ...prev.baits] }));
    } catch (err) {
      console.error('Failed to add bait:', err);
    }
  };

  const updateBait = async (updatedBait: Bait) => {
    try {
      const result = await api.updateBait(updatedBait);
      setAppData(prev => ({
        ...prev,
        baits: prev.baits.map(b => b.id === result.id ? result : b)
      }));
    } catch (err) {
      console.error('Failed to update bait:', err);
    }
  };

  const deleteBait = async (id: string) => {
    try {
      await api.deleteBait(id);
      setAppData(prev => ({ ...prev, baits: prev.baits.filter(b => b.id !== id) }));
    } catch (err) {
      console.error('Failed to delete bait:', err);
    }
  };

  const exportData = () => {
    // Inclui dados locais no backup
    const localData = localStorage.getItem('melitton_local_data');
    const localParsed = localData ? JSON.parse(localData) : { boxes: [], baits: [] };
    
    // Combina dados do estado com dados locais para garantir tudo seja exportado
    const combinedData = {
      ...appData,
      boxes: [...appData.boxes, ...localParsed.boxes.filter((localBox: Box) => 
        !appData.boxes.some((stateBox: Box) => stateBox.id === localBox.id)
      )],
      baits: [...appData.baits, ...localParsed.baits.filter((localBait: Bait) => 
        !appData.baits.some((stateBait: Bait) => stateBait.id === localBait.id)
      )]
    };
    
    const dataStr = JSON.stringify(combinedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `melitton-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setAppData(importedData);
        
        // Salva os dados importados no armazenamento local também
        const localData = {
          boxes: importedData.boxes || [],
          baits: importedData.baits || []
        };
        localStorage.setItem('melitton_local_data', JSON.stringify(localData));
        
        alert('Dados importados com sucesso!');
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        alert('Erro ao importar dados. Verifique o formato do arquivo.');
      }
    };
    reader.readAsText(file);
  };

  // Componente para mostrar status de sincronização
  const SyncStatusIndicator = () => {
    const getStatusColor = () => {
      switch (syncStatus) {
        case 'syncing': return 'text-blue-500';
        case 'success': return 'text-green-500';
        case 'error': return 'text-red-500';
        default: return 'text-gray-400';
      }
    };

    const getStatusText = () => {
      switch (syncStatus) {
        case 'syncing': return 'Sincronizando...';
        case 'success': return 'Sincronizado';
        case 'error': return 'Erro na sincronização';
        default: return 'Sincronizado';
      }
    };

    const getStatusIcon = () => {
      switch (syncStatus) {
        case 'syncing': 
          return (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 0a6 6 0 016-6v4a2 2 0 00-2 2H6z"></path>
            </svg>
          );
        case 'success': return '✓';
        case 'error': return '⚠';
        default: return '✓';
      }
    };

    return (
      <div className={`flex items-center gap-2 text-xs ${getStatusColor()} px-3 py-1.5 rounded-full bg-gray-100`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    );
  };

  return (
    <HashRouter>
      <div className="min-h-screen md:pl-64 flex flex-col">
        <Navigation />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-end mb-4">
            <SyncStatusIndicator />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard data={appData} />} />
            <Route path="/boxes" element={<BoxList boxes={appData.boxes} />} />
            <Route path="/boxes/new" element={<BoxForm onSave={addBox} />} />
            <Route path="/boxes/edit/:id" element={<BoxForm boxes={appData.boxes} onSave={updateBox} />} />
            <Route path="/boxes/:id" element={<BoxDetail boxes={appData.boxes} onUpdate={updateBox} onDelete={deleteBox} onAddLog={addLog} />} />
            <Route path="/baits" element={<BaitList baits={appData.baits} onDelete={deleteBait} onUpdate={updateBait} />} />
            <Route path="/baits/new" element={<BaitForm onSave={addBait} />} />
            <Route path="/baits/edit/:id" element={<BaitForm baits={appData.baits} onSave={updateBait} />} />
            <Route path="/stats" element={<Stats data={appData} />} />
            <Route path="/settings" element={
              <SettingsPage 
                settings={appData.settings} 
                onUpdate={(s) => updateAppData({ settings: s })} 
                onReset={() => setAppData(INITIAL_STATE)}
                onExport={exportData}
                onImport={importData}
              />} 
            />
          </Routes>
        </main>

        <footer className="mt-auto p-8 border-t bg-white text-center text-sm text-gray-500">
          <p>© 2026 MDH - Melitton - Versão 1.0 - Desenvolvido por PVolker</p>
        </footer>
      </div>
    </HashRouter>
  );
}
