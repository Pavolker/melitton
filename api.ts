import { Box, Bait, ManagementLog } from './types';

const RAW_API_URL = import.meta.env.VITE_API_URL;
const API_URL =
    (RAW_API_URL && RAW_API_URL.trim()) ||
    (import.meta.env.PROD
        ? 'https://backend-production-1e27.up.railway.app/api'
        : 'http://localhost:3001/api');

// Funções de fallback para armazenamento local
const LOCAL_STORAGE_KEY = 'melitton_local_data';

interface LocalStorageData {
  boxes: Box[];
  baits: Bait[];
}

const getLocalData = (): LocalStorageData => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : { boxes: [], baits: [] };
};

const saveLocalData = (data: LocalStorageData) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const api = {
    getBoxes: async (): Promise<Box[]> => {
      try {
        const res = await fetch(`${API_URL}/boxes`);
        if (!res.ok) throw new Error('Failed to fetch boxes from server');
        return res.json();
      } catch (error) {
        console.warn('Server fetch failed, using local data:', error);
        return getLocalData().boxes;
      }
    },

    createBox: async (box: Omit<Box, 'id' | 'managementHistory'>): Promise<Box> => {
      try {
        const res = await fetch(`${API_URL}/boxes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(box)
        });
        if (!res.ok) throw new Error('Failed to create box on server');
        const result = await res.json();
        
        // Atualizar dados locais também
        const localData = getLocalData();
        localData.boxes.push(result);
        saveLocalData(localData);
        
        return result;
      } catch (error) {
        console.warn('Server create failed, saving locally:', error);
        // Gerar ID único para o box local
        const localBox = { ...box, id: `local_${Date.now()}`, managementHistory: [] };
        const localData = getLocalData();
        localData.boxes.push(localBox);
        saveLocalData(localData);
        return localBox;
      }
    },

    updateBox: async (box: Box): Promise<Box> => {
      try {
        const res = await fetch(`${API_URL}/boxes/${box.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(box)
        });
        if (!res.ok) throw new Error('Failed to update box on server');
        const result = await res.json();
        
        // Atualizar dados locais também
        const localData = getLocalData();
        const index = localData.boxes.findIndex(b => b.id === box.id);
        if (index !== -1) {
          localData.boxes[index] = result;
          saveLocalData(localData);
        }
        
        return result;
      } catch (error) {
        console.warn('Server update failed, updating locally:', error);
        const localData = getLocalData();
        const index = localData.boxes.findIndex(b => b.id === box.id);
        if (index !== -1) {
          localData.boxes[index] = box;
          saveLocalData(localData);
        }
        return box;
      }
    },

    deleteBox: async (id: string): Promise<void> => {
      try {
        const res = await fetch(`${API_URL}/boxes/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete box on server');
        
        // Remover dos dados locais também
        const localData = getLocalData();
        localData.boxes = localData.boxes.filter(b => b.id !== id);
        saveLocalData(localData);
      } catch (error) {
        console.warn('Server delete failed, removing locally:', error);
        const localData = getLocalData();
        localData.boxes = localData.boxes.filter(b => b.id !== id);
        saveLocalData(localData);
      }
    },

    addLog: async (boxId: string, log: Omit<ManagementLog, 'id'>): Promise<ManagementLog> => {
      try {
        const res = await fetch(`${API_URL}/boxes/${boxId}/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
        if (!res.ok) throw new Error('Failed to add log on server');
        const result = await res.json();
        
        // Atualizar dados locais também
        const localData = getLocalData();
        const boxIndex = localData.boxes.findIndex(b => b.id === boxId);
        if (boxIndex !== -1) {
          localData.boxes[boxIndex].managementHistory.push(result);
          saveLocalData(localData);
        }
        
        return result;
      } catch (error) {
        console.warn('Server log addition failed, adding locally:', error);
        const localLog = { ...log, id: `local_log_${Date.now()}` };
        const localData = getLocalData();
        const boxIndex = localData.boxes.findIndex(b => b.id === boxId);
        if (boxIndex !== -1) {
          localData.boxes[boxIndex].managementHistory.push(localLog);
          saveLocalData(localData);
        }
        return localLog;
      }
    },

    getBaits: async (): Promise<Bait[]> => {
      try {
        const res = await fetch(`${API_URL}/baits`);
        if (!res.ok) throw new Error('Failed to fetch baits from server');
        return res.json();
      } catch (error) {
        console.warn('Server fetch baits failed, using local data:', error);
        return getLocalData().baits;
      }
    },

    createBait: async (bait: Omit<Bait, 'id'>): Promise<Bait> => {
      try {
        const res = await fetch(`${API_URL}/baits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bait)
        });
        if (!res.ok) throw new Error('Failed to create bait on server');
        const result = await res.json();
        
        // Atualizar dados locais também
        const localData = getLocalData();
        localData.baits.push(result);
        saveLocalData(localData);
        
        return result;
      } catch (error) {
        console.warn('Server bait creation failed, saving locally:', error);
        // Gerar ID único para a isca local
        const localBait = { ...bait, id: `local_bait_${Date.now()}` };
        const localData = getLocalData();
        localData.baits.push(localBait);
        saveLocalData(localData);
        return localBait;
      }
    },

    updateBait: async (bait: Bait): Promise<Bait> => {
      try {
        const res = await fetch(`${API_URL}/baits/${bait.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bait)
        });
        if (!res.ok) throw new Error('Failed to update bait on server');
        const result = await res.json();
        
        // Atualizar dados locais também
        const localData = getLocalData();
        const index = localData.baits.findIndex(b => b.id === bait.id);
        if (index !== -1) {
          localData.baits[index] = result;
          saveLocalData(localData);
        }
        
        return result;
      } catch (error) {
        console.warn('Server bait update failed, updating locally:', error);
        const localData = getLocalData();
        const index = localData.baits.findIndex(b => b.id === bait.id);
        if (index !== -1) {
          localData.baits[index] = bait;
          saveLocalData(localData);
        }
        return bait;
      }
    },

    deleteBait: async (id: string): Promise<void> => {
      try {
        const res = await fetch(`${API_URL}/baits/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete bait on server');
        
        // Remover dos dados locais também
        const localData = getLocalData();
        localData.baits = localData.baits.filter(b => b.id !== id);
        saveLocalData(localData);
      } catch (error) {
        console.warn('Server bait deletion failed, removing locally:', error);
        const localData = getLocalData();
        localData.baits = localData.baits.filter(b => b.id !== id);
        saveLocalData(localData);
      }
    }
};
