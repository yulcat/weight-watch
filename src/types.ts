export interface WeightRecord {
  date: string; // YYYY-MM-DD
  weight: number; // grams
}

export interface BabyData {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthWeight: number; // grams
  records: WeightRecord[];
}

export interface AppData {
  babies: [BabyData, BabyData];
  activeTab: number;
}

export type AlertLevel = 'safe' | 'caution' | 'warning' | 'danger';

export function getAlertLevel(percentage: number): AlertLevel {
  if (percentage >= 98) return 'safe';
  if (percentage >= 93) return 'caution';
  if (percentage >= 90) return 'warning';
  return 'danger';
}

export function getDayNumber(birthDate: string, recordDate: string): number {
  const birth = new Date(birthDate);
  const record = new Date(recordDate);
  const diff = record.getTime() - birth.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function formatPercentage(birthWeight: number, currentWeight: number): string {
  return ((currentWeight / birthWeight) * 100).toFixed(1);
}
