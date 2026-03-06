type DashboardCardProps = {
  title: string;
  value: string | number;
  hint?: string;
};

export default function DashboardCard({ title, value, hint }: DashboardCardProps) {
  return (
    <article className="dashboard-card">
      <p className="meta">{title}</p>
      <h3>{value}</h3>
      {hint ? <p className="meta">{hint}</p> : null}
    </article>
  );
}
