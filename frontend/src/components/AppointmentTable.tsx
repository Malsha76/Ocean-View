import type { Appointment } from '../data/mockData';

type AppointmentTableProps = {
  items: Appointment[];
  showActions?: boolean;
  onCancel?: (id: string) => void;
};

export default function AppointmentTable({ items, showActions, onCancel }: AppointmentTableProps) {
  return (
    <div className="panel table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Condition</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Fee</th>
            {showActions ? <th>Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.appointmentNumber}</td>
              <td>{item.patientName}</td>
              <td>{item.condition}</td>
              <td>{item.doctor}</td>
              <td>{item.date} {item.time}</td>
              <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
              <td>${item.consultationFee + item.extraServicesFee}</td>
              {showActions ? (
                <td>
                  <button type="button" className="btn danger" onClick={() => onCancel?.(item.id)}>Cancel</button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <p className="muted">No appointments found.</p>}
    </div>
  );
}
