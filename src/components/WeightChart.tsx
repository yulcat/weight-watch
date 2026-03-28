import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { BabyData } from '../types';
import { getDayNumber } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  baby: BabyData;
}

export default function WeightChart({ baby }: Props) {
  if (!baby.birthWeight || !baby.birthDate || baby.records.length === 0) return null;

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const percentages: number[] = [];

    // Always include D+0 as birth weight = 100%
    const recordDays = baby.records.map((r) => ({
      day: getDayNumber(baby.birthDate, r.date),
      pct: (r.weight / baby.birthWeight) * 100,
    }));

    // Add birth day if not present
    const hasBirthDay = recordDays.some((d) => d.day === 0);
    const allPoints = hasBirthDay
      ? recordDays
      : [{ day: 0, pct: 100 }, ...recordDays];

    allPoints.sort((a, b) => a.day - b.day);

    for (const p of allPoints) {
      labels.push(`D+${p.day}`);
      percentages.push(Math.round(p.pct * 10) / 10);
    }

    return {
      labels,
      datasets: [
        {
          label: '출생 체중 대비 %',
          data: percentages,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: percentages.map((p) =>
            p >= 98 ? '#22c55e' : p >= 93 ? '#eab308' : p >= 90 ? '#f97316' : '#ef4444',
          ),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.3,
          fill: false,
        },
      ],
    };
  }, [baby]);

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        y: {
          min: 85,
          max: 105,
          ticks: {
            callback: (value) => `${value}%`,
            stepSize: 2,
            font: { size: 11 },
          },
          grid: {
            color: (ctx) => {
              const v = ctx.tick.value;
              if (v === 100) return '#3b82f6';
              if (v === 90) return 'rgba(239, 68, 68, 0.5)';
              return 'rgba(0,0,0,0.06)';
            },
            lineWidth: (ctx) => {
              const v = ctx.tick.value;
              return v === 100 || v === 90 ? 2 : 1;
            },
          },
        },
        x: {
          ticks: { font: { size: 11 } },
          grid: { display: false },
        },
      },
    }),
    [],
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-bold text-blue-900 mb-1">체중 변화 차트</h3>
      <p className="text-xs text-gray-500 mb-3">
        AAP 기준: 90% 이하 = 과도한 체중 감소 → 소아과 상담
      </p>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          98~102% 정상
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
          93~97% 주의
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          90~92% 경계
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          90% 미만 위험
        </span>
      </div>
      <div className="h-56">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
