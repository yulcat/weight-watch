import { useRef } from 'react';
import type { AppData, BabyData } from '../types';
import { exportJson, importJson, generateReport } from '../store';

interface Props {
  baby: BabyData;
  data: AppData;
  onSetData: (updater: (prev: AppData) => AppData) => void;
}

export default function ExportPanel({ baby, data, onSetData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const json = exportJson(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weight-watch-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importJson(reader.result as string);
      if (result) {
        onSetData(() => result);
        alert('데이터를 성공적으로 가져왔습니다.');
      } else {
        alert('잘못된 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyReport = () => {
    const report = generateReport(baby);
    navigator.clipboard.writeText(report).then(
      () => alert('클립보드에 복사되었습니다.'),
      () => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = report;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        alert('클립보드에 복사되었습니다.');
      },
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-bold text-blue-900 mb-3">데이터 관리</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopyReport}
          className="col-span-2 py-3 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium active:bg-blue-200"
        >
          소아과 방문용 텍스트 복사
        </button>
        <button
          onClick={handleExportJson}
          className="py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium active:bg-gray-200"
        >
          JSON 내보내기
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium active:bg-gray-200"
        >
          JSON 가져오기
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJson}
        className="hidden"
      />
    </div>
  );
}
