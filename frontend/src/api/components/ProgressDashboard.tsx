import type { ProgressPoint } from '../data/mockData';

type ProgressDashboardProps = {
  points: ProgressPoint[];
};

export default function ProgressDashboard({ points }: ProgressDashboardProps) {
  const latest = points[points.length - 1];

  return (
    <div className="grid-2">
      <article className="panel">
        <h3>Health Overview</h3>
        <div className="stats-grid">
          <div className="stat-item"><p>Latest Weight</p><strong>{latest?.weight ?? '-'} kg</strong></div>
          <div className="stat-item"><p>Blood Pressure</p><strong>{latest?.bloodPressure ?? '-'}</strong></div>
          <div className="stat-item"><p>Activity Score</p><strong>{latest?.activityScore ?? '-'}</strong></div>
        </div>
      </article>

      <article className="panel">
        <h3>Monthly Activity Trend</h3>
        <div className="bar-list">
          {points.map((point) => (
            <div key={point.month} className="bar-row">
              <span>{point.month}</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${point.activityScore}%` }} /></div>
              <strong>{point.activityScore}</strong>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
