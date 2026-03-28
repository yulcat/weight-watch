import type { BabyData } from '../types';
import { getAlertLevel, getDayNumber, formatPercentage } from '../types';

interface Props {
  baby: BabyData;
}

export default function StatusCard({ baby }: Props) {
  if (!baby.birthWeight || !baby.birthDate) return null;

  const lastRecord = baby.records[baby.records.length - 1];
  if (!lastRecord) return null;

  const pct = parseFloat(formatPercentage(baby.birthWeight, lastRecord.weight));
  const level = getAlertLevel(pct);
  const day = getDayNumber(baby.birthDate, lastRecord.date);
  const isOverD14 = day > 14 && pct < 100;

  const configs = {
    safe: {
      bg: 'bg-green-50 border-green-300',
      text: 'text-green-800',
      icon: '🟢',
      message: '정상 범위입니다.',
    },
    caution: {
      bg: 'bg-yellow-50 border-yellow-300',
      text: 'text-yellow-800',
      icon: '🟡',
      message: '주의: 체중 감소가 있습니다. 수유량을 확인하세요.',
    },
    warning: {
      bg: 'bg-orange-50 border-orange-300',
      text: 'text-orange-800',
      icon: '🟠',
      message: '다음 수유 시 증가 없으면 소아과 상담이 필요합니다.',
    },
    danger: {
      bg: 'bg-red-50 border-red-400',
      text: 'text-red-800',
      icon: '🔴',
      message: '과도한 체중 감소! 성북우리아이들병원 즉시 방문을 권고합니다.',
    },
  };

  const config = configs[level];

  return (
    <div className="space-y-2">
      <div className={`rounded-xl border-2 p-4 ${config.bg}`}>
        <div className={`font-bold text-base ${config.text}`}>
          {config.icon} D+{day}일: {lastRecord.weight}g ({pct}%)
        </div>
        <p className={`mt-1 text-sm ${config.text}`}>{config.message}</p>
        {level === 'danger' && (
          <a
            href="tel:029456275"
            className="inline-block mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium active:bg-red-700"
          >
            성북우리아이들병원 전화
          </a>
        )}
      </div>

      {isOverD14 && (
        <div className="rounded-xl border-2 bg-yellow-50 border-yellow-300 p-4">
          <div className="font-bold text-base text-yellow-800">
            ⚠️ D+14일을 지났지만 출생 체중 미회복
          </div>
          <p className="mt-1 text-sm text-yellow-700">
            소아과 상담을 권장합니다.
          </p>
        </div>
      )}
    </div>
  );
}
