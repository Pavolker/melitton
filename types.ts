
export type BeeSpecies = 'Jataí' | 'Mandaçaia' | 'Uruçu' | 'Mirim' | 'Iraí' | 'Bugia' | 'Tubuna' | 'Mandaguari' | 'Outra';

export type BoxStatus = 'ativa' | 'em observação' | 'enxameada' | 'morta';

export type ManagementType = 'inspeção' | 'alimentação' | 'divisão' | 'colheita' | 'tratamento' | 'mudança';

export interface Location {
  lat?: number;
  lng?: number;
  description: string;
}

export interface ManagementLog {
  id: string;
  date: string;
  type: ManagementType;
  notes: string;
  quantity?: string; // e.g., "500ml", "200g"
  photo?: string; // base64
}

export interface Box {
  id: string;
  name: string;
  species: BeeSpecies;
  boxType: string;
  installDate: string;
  origin: 'captura' | 'divisão' | 'compra';
  location: Location;
  status: BoxStatus;
  photo?: string;
  observations: string;
  managementHistory: ManagementLog[];
}

export interface BaitStatus {
  state: 'vazia' | 'ocupada' | 'coletada';
  lastInspection: string;
}

export interface Bait {
  id: string;
  name: string;
  type: string;
  attractant: string;
  location: Location;
  installDate: string;
  targetSpecies: BeeSpecies;
  status: BaitStatus;
  nextInspectionDate: string;
  photo?: string;
}

export interface AppState {
  boxes: Box[];
  baits: Bait[];
  settings: {
    userName: string;
    inspectionFrequencyDays: number;
    theme: 'light' | 'dark';
  };
}
