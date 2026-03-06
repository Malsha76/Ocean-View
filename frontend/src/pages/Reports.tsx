import { useState } from 'react';
import { Link } from 'react-router-dom';
import { reports, type ReservationResponse } from '../api/client';
import { useToast } from '../context/ToastContext';

type ReportType = 'daily' | 'roomType' | 'checkouts' | 'revenue' | null;

export default function Reports() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<ReportType>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [roomTypeCode, setRoomTypeCode] = useState('STANDARD');
  const [days, setDays] = useState(7);
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [dailyList, setDailyList] = useState<ReservationResponse[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<ReservationResponse[]>([]);
  const [checkoutList, setCheckoutList] = useState<ReservationResponse[]>([]);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [error, setError] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const allowedRoomTypes = new Set(['STANDARD', 'DELUXE', 'SUITE']);

  async function runDaily() {
    setError('');
    if (!date) {
      const message = 'Please select a date.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const list = await reports.dailyCheckIns(date);
      setDailyList(list);
      setReportType('daily');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error';
      setError(message);
      showToast('error', message);
    }
  }
  async function runByRoomType() {
    setError('');
    if (!allowedRoomTypes.has(roomTypeCode)) {
      const message = 'Please select a valid room type.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const list = await reports.byRoomType(roomTypeCode);
      setRoomTypeList(list);
      setReportType('roomType');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error';
      setError(message);
      showToast('error', message);
    }
  }
  async function runCheckouts() {
    setError('');
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      const message = 'Days must be between 1 and 365.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const list = await reports.upcomingCheckouts(days);
      setCheckoutList(list);
      setReportType('checkouts');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error';
      setError(message);
      showToast('error', message);
    }
  }
  async function runRevenue() {
    setError('');
    if (!fromDate || !toDate) {
      const message = 'Please select both from and to dates.';
      setError(message);
      showToast('error', message);
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      const message = 'To date must be on or after from date.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const res = await reports.revenue(fromDate, toDate);
      setRevenue(res.totalRevenue);
      setReportType('revenue');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error';
      setError(message);
      showToast('error', message);
    }
  }

  return (
    <>
      <p><Link to="/">← Back to menu</Link></p>
      <div className="card">
        <h2>Reports</h2>
        {error && <div className="error">{error}</div>}
        <ul className="menu-list" style={{ listStyle: 'none' }}>
          <li>
            <div className="form-group">
              <label>Daily check-ins (by date)</label>
              <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} required />
              <button type="button" onClick={runDaily} style={{ marginTop: '0.5rem' }}>Run</button>
            </div>
          </li>
          <li>
            <div className="form-group">
              <label>Reservations by room type</label>
              <select value={roomTypeCode} onChange={(e) => setRoomTypeCode(e.target.value)}>
                <option value="STANDARD">STANDARD</option>
                <option value="DELUXE">DELUXE</option>
                <option value="SUITE">SUITE</option>
              </select>
              <button type="button" onClick={runByRoomType} style={{ marginTop: '0.5rem' }}>Run</button>
            </div>
          </li>
          <li>
            <div className="form-group">
              <label>Upcoming check-outs (next N days)</label>
              <input type="number" min={1} max={365} step={1} value={days} onChange={(e) => setDays(Number(e.target.value))} required />
              <button type="button" onClick={runCheckouts} style={{ marginTop: '0.5rem' }}>Run</button>
            </div>
          </li>
          <li>
            <div className="form-group">
              <label>Total revenue by date range (check-out dates)</label>
              <input type="date" value={fromDate} max={toDate || undefined} onChange={(e) => setFromDate(e.target.value)} required /> to{' '}
              <input type="date" value={toDate} min={fromDate || undefined} onChange={(e) => setToDate(e.target.value)} required />
              <button type="button" onClick={runRevenue} style={{ marginTop: '0.5rem' }}>Run</button>
            </div>
          </li>
        </ul>
        {reportType === 'daily' && (
          <div className="card">
            <h3>Daily check-ins for {date}</h3>
            {dailyList.length === 0 ? <p>No check-ins.</p> : (
              <table>
                <thead>
                  <tr><th>Reservation</th><th>Guest</th><th>Room</th><th>Check-in</th></tr>
                </thead>
                <tbody>
                  {dailyList.map((r) => (
                    <tr key={r.id}>
                      <td>{r.reservationNumber}</td>
                      <td>{r.guestInfo?.guestName}</td>
                      <td>{r.roomTypeCode}</td>
                      <td>{r.checkInDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {reportType === 'roomType' && (
          <div className="card">
            <h3>Reservations by room type: {roomTypeCode}</h3>
            {roomTypeList.length === 0 ? <p>None.</p> : (
              <table>
                <thead>
                  <tr><th>Reservation</th><th>Guest</th><th>Check-in</th><th>Check-out</th></tr>
                </thead>
                <tbody>
                  {roomTypeList.map((r) => (
                    <tr key={r.id}>
                      <td>{r.reservationNumber}</td>
                      <td>{r.guestInfo?.guestName}</td>
                      <td>{r.checkInDate}</td>
                      <td>{r.checkOutDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {reportType === 'checkouts' && (
          <div className="card">
            <h3>Upcoming check-outs (next {days} days)</h3>
            {checkoutList.length === 0 ? <p>None.</p> : (
              <table>
                <thead>
                  <tr><th>Reservation</th><th>Guest</th><th>Check-out</th></tr>
                </thead>
                <tbody>
                  {checkoutList.map((r) => (
                    <tr key={r.id}>
                      <td>{r.reservationNumber}</td>
                      <td>{r.guestInfo?.guestName}</td>
                      <td>{r.checkOutDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {reportType === 'revenue' && (
          <div className="card">
            <h3>Total revenue ({fromDate} to {toDate})</h3>
            <p><strong>${revenue != null ? Number(revenue).toFixed(2) : '0.00'}</strong></p>
          </div>
        )}
      </div>
    </>
  );
}
