import { useState } from 'react';
import type { AppData, BabyData } from '../types';
import { getDayNumber, formatPercentage } from '../types';
import { addRecord, deleteRecord } from '../store';

interface Props {
  baby: BabyData;
  tabIndex: number;
  data: AppData;
  onSetData: (updater: (prev: AppData) => AppData) => void;
}

export default function WeightEntry({ baby, tabIndex, data, onSetData }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState('');

  if (!baby.birthWeight || !baby.birthDate) return null;

  const handleAdd = () => {
    const w = parseInt(weight, 10);
    if (!w || w < 500 || w > 10000) return;
    onSetData(() => addRecord(data, tabIndex, { date, weight: w }));
    setWeight('');
  };

  const handleDelete = (recordDate: string) => {
    onSetData(() => deleteRecord(data, tabIndex, recordDate));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-bold text-blue-900 mb-3">체중 기록</h3>

      {/* Input Row */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="체중(g)"
          inputMode="numeric"
          className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium active:bg-blue-700 whitespace-nowrap"
        >
          추가
        </button>
      </div>

      {/* Records Table */}
      {baby.records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">일차</th>
                <th className="pb-2 font-medium">날짜</th>
                <th className="pb-2 font-medium text-right">체중</th>
                <th className="pb-2 font-medium text-right">변화율</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {baby.records.map((r) => {
                const day = getDayNumber(baby.birthDate, r.date);
                const pct = formatPercentage(baby.birthWeight, r.weight);
                const pctNum = parseFloat(pct);
                const colorClass =
                  pctNum >= 98
                    ? 'text-green-600'
                    : pctNum >= 93
                      ? 'text-yellow-600'
                      : pctNum >= 90
                        ? 'text-orange-600'
                        : 'text-red-600';
                return (
                  <tr key={r.date} className="border-b border-gray-100">
                    <td className="py-2 font-medium">D+{day}</td>
                    <td className="py-2 text-gray-600">{r.date.slice(5)}</td>
                    <td className="py-2 text-right">{r.weight}g</td>
                    <td className={`py-2 text-right font-bold ${colorClass}`}>{pct}%</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => handleDelete(r.date)}
                        className="text-gray-400 hover:text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
