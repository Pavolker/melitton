
import { BeeSpecies, BoxStatus, ManagementType } from './types';

export const SPECIES_LIST: BeeSpecies[] = [
  'Jataí', 'Mandaçaia', 'Uruçu', 'Mirim', 'Iraí', 'Bugia', 'Tubuna', 'Mandaguari', 'Outra'
];

export const BOX_STATUS_LABELS: Record<BoxStatus, string> = {
  'ativa': 'Ativa',
  'em observação': 'Em Observação',
  'enxameada': 'Enxameada',
  'morta': 'Morta'
};

export const MANAGEMENT_TYPE_LABELS: Record<ManagementType, string> = {
  'inspeção': 'Inspeção de Rotina',
  'alimentação': 'Alimentação',
  'divisão': 'Divisão / Multiplicação',
  'colheita': 'Colheita de Mel',
  'tratamento': 'Tratamento Sanitário',
  'mudança': 'Mudança de Local'
};

export const STATUS_COLORS: Record<string, string> = {
  'ativa': 'bg-green-100 text-green-800',
  'em observação': 'bg-yellow-100 text-yellow-800',
  'enxameada': 'bg-blue-100 text-blue-800',
  'morta': 'bg-red-100 text-red-800',
  'vazia': 'bg-gray-100 text-gray-800',
  'ocupada': 'bg-amber-100 text-amber-800',
  'coletada': 'bg-purple-100 text-purple-800'
};
