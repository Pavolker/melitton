import { Box, Bait, ManagementLog } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
    getBoxes: async (): Promise<Box[]> => {
        const res = await fetch(`${API_URL}/boxes`);
        if (!res.ok) throw new Error('Failed to fetch boxes');
        return res.json();
    },

    createBox: async (box: Omit<Box, 'id' | 'managementHistory'>): Promise<Box> => {
        const res = await fetch(`${API_URL}/boxes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(box)
        });
        if (!res.ok) throw new Error('Failed to create box');
        return res.json();
    },

    updateBox: async (box: Box): Promise<Box> => {
        const res = await fetch(`${API_URL}/boxes/${box.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(box)
        });
        if (!res.ok) throw new Error('Failed to update box');
        return res.json();
    },

    deleteBox: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/boxes/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete box');
    },

    addLog: async (boxId: string, log: Omit<ManagementLog, 'id'>): Promise<ManagementLog> => {
        const res = await fetch(`${API_URL}/boxes/${boxId}/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
        });
        if (!res.ok) throw new Error('Failed to add log');
        return res.json();
    },

    getBaits: async (): Promise<Bait[]> => {
        const res = await fetch(`${API_URL}/baits`);
        if (!res.ok) throw new Error('Failed to fetch baits');
        return res.json();
    },

    createBait: async (bait: Omit<Bait, 'id'>): Promise<Bait> => {
        const res = await fetch(`${API_URL}/baits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bait)
        });
        if (!res.ok) throw new Error('Failed to create bait');
        return res.json();
    },

    updateBait: async (bait: Bait): Promise<Bait> => {
        const res = await fetch(`${API_URL}/baits/${bait.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bait)
        });
        if (!res.ok) throw new Error('Failed to update bait');
        return res.json();
    },

    deleteBait: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/baits/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete bait');
    }
};
