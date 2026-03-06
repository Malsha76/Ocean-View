import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import ProgressDashboard from '../../components/ProgressDashboard';
import { fallbackData, progressApi } from '../../api/client';
import type { ProgressPoint } from '../../data/mockData';

export default function ProgressPage() {
  const [points, setPoints] = useState<ProgressPoint[]>(fallbackData.progress);

  useEffect(() => {
    async function load() {
      try {
        const response = await progressApi.my();
        setPoints(response);
      } catch {
        setPoints(fallbackData.progress);
      }
    }
    void load();
  }, []);

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Progress Dashboard</h2>
        <ProgressDashboard points={points} />
      </main>
    </div>
  );
}
