import { useState, useEffect, useCallback } from 'react';
import type { AppData, BabyData } from './types';
import { loadData, saveData, updateBaby } from './store';
import BabyTab from './components/BabyTab.tsx';

function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Screen Wake Lock
  useEffect(() => {
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen');
          setWakeLock(lock);
        }
      } catch {
        // Wake lock not supported or denied
      }
    }
    requestWakeLock();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      wakeLock?.release().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTab = data.activeTab;
  const baby = data.babies[activeTab];

  const handleUpdateBaby = useCallback(
    (updates: Partial<BabyData>) => {
      setData((prev) => updateBaby(prev, prev.activeTab, updates));
    },
    [],
  );

  const handleSetData = useCallback((updater: (prev: AppData) => AppData) => {
    setData(updater);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 pt-3 pb-0">
          <h1 className="text-lg font-bold text-blue-900 text-center mb-3">
            Weight Watch
            <span className="text-sm font-normal text-blue-500 ml-2">신생아 체중 추적</span>
          </h1>
          {/* Twin Tabs */}
          <div className="flex">
            {data.babies.map((b, i) => (
              <button
                key={i}
                onClick={() => setData((prev) => ({ ...prev, activeTab: i }))}
                className={`flex-1 py-2.5 text-center font-medium text-sm rounded-t-lg transition-colors ${
                  activeTab === i
                    ? 'bg-blue-50 text-blue-700 border-t-2 border-x border-blue-300'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {b.name || (i === 0 ? '아둥이' : '바둥이')}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 mt-4">
        <BabyTab
          baby={baby}
          tabIndex={activeTab}
          onUpdateBaby={handleUpdateBaby}
          data={data}
          onSetData={handleSetData}
        />
      </main>
    </div>
  );
}

export default App;
