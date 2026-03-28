import type { AppData, BabyData, WeightRecord } from './types';

const STORAGE_KEY = 'weight-watch-data';

function defaultBaby(name: string): BabyData {
  return {
    name,
    birthDate: '',
    birthWeight: 0,
    records: [],
  };
}

export function defaultAppData(): AppData {
  return {
    babies: [defaultBaby('아둥이'), defaultBaby('바둥이')],
    activeTab: 0,
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppData();
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.babies || parsed.babies.length !== 2) return defaultAppData();
    return parsed;
  } catch {
    return defaultAppData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateBaby(data: AppData, tabIndex: number, updates: Partial<BabyData>): AppData {
  const newData = { ...data, babies: [...data.babies] as [BabyData, BabyData] };
  newData.babies[tabIndex] = { ...newData.babies[tabIndex], ...updates };
  return newData;
}

export function addRecord(data: AppData, tabIndex: number, record: WeightRecord): AppData {
  const baby = data.babies[tabIndex];
  const existing = baby.records.findIndex((r) => r.date === record.date);
  const newRecords = [...baby.records];
  if (existing >= 0) {
    newRecords[existing] = record;
  } else {
    newRecords.push(record);
  }
  newRecords.sort((a, b) => a.date.localeCompare(b.date));
  return updateBaby(data, tabIndex, { records: newRecords });
}

export function deleteRecord(data: AppData, tabIndex: number, date: string): AppData {
  const baby = data.babies[tabIndex];
  return updateBaby(data, tabIndex, {
    records: baby.records.filter((r) => r.date !== date),
  });
}

export function exportJson(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importJson(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json) as AppData;
    if (parsed.babies && parsed.babies.length === 2) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function generateReport(baby: BabyData): string {
  if (!baby.birthWeight || !baby.birthDate) return '출생 정보를 먼저 입력해주세요.';
  const lines = [`[${baby.name}] 체중 변화 기록`, `출생 체중: ${baby.birthWeight}g`, `출생일: ${baby.birthDate}`, ''];
  for (const r of baby.records) {
    const birth = new Date(baby.birthDate);
    const rec = new Date(r.date);
    const day = Math.round((rec.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const pct = ((r.weight / baby.birthWeight) * 100).toFixed(1);
    const diff = r.weight - baby.birthWeight;
    const sign = diff >= 0 ? '+' : '';
    lines.push(`D+${day}일 (${r.date}): ${r.weight}g → ${pct}% (${sign}${diff}g)`);
  }
  return lines.join('\n');
}
