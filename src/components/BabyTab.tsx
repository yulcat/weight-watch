import { useState } from 'react';
import type { AppData, BabyData } from '../types';
import StatusCard from './StatusCard.tsx';
import WeightEntry from './WeightEntry.tsx';
import WeightChart from './WeightChart.tsx';
import ExportPanel from './ExportPanel.tsx';

interface Props {
  baby: BabyData;
  tabIndex: number;
  onUpdateBaby: (updates: Partial<BabyData>) => void;
  data: AppData;
  onSetData: (updater: (prev: AppData) => AppData) => void;
}

export default function BabyTab({ baby, tabIndex, onUpdateBaby, data, onSetData }: Props) {
  const isSetup = !baby.birthWeight || !baby.birthDate;

  if (isSetup) {
    return <SetupForm baby={baby} onUpdateBaby={onUpdateBaby} />;
  }

  return (
    <div className="space-y-4">
      {/* Birth Info */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">출생 정보</div>
            <div className="font-bold text-blue-900">
              {baby.name} · {baby.birthWeight}g · {baby.birthDate}
            </div>
          </div>
          <button
            onClick={() => onUpdateBaby({ birthWeight: 0, birthDate: '', records: [] })}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            초기화
          </button>
        </div>
      </div>

      <StatusCard baby={baby} />
      <WeightChart baby={baby} />
      <WeightEntry baby={baby} tabIndex={tabIndex} data={data} onSetData={onSetData} />
      <ExportPanel baby={baby} data={data} onSetData={onSetData} />
    </div>
  );
}

function SetupForm({
  baby,
  onUpdateBaby,
}: {
  baby: BabyData;
  onUpdateBaby: (updates: Partial<BabyData>) => void;
}) {
  const [name, setName] = useState(baby.name);
  const [birthDate, setBirthDate] = useState(baby.birthDate || new Date().toISOString().slice(0, 10));
  const [birthWeight, setBirthWeight] = useState(baby.birthWeight ? String(baby.birthWeight) : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseInt(birthWeight, 10);
    if (!name.trim() || !birthDate || !w || w < 500 || w > 10000) return;
    onUpdateBaby({
      name: name.trim(),
      birthDate,
      birthWeight: w,
      records: [{ date: birthDate, weight: w }],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-bold text-blue-900 text-center">출생 정보 입력</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">아기 이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 아둥이"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">출생 날짜</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">출생 체중 (g)</label>
        <input
          type="number"
          value={birthWeight}
          onChange={(e) => setBirthWeight(e.target.value)}
          placeholder="예: 3200"
          inputMode="numeric"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-base font-bold active:bg-blue-700"
      >
        시작하기
      </button>
    </form>
  );
}
