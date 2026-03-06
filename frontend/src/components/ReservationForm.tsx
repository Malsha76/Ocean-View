import { useMemo, useState } from 'react';
import type { ReservationFormInput, Room } from '../types/hotel';
import { useToast } from '../context/ToastContext';

type ReservationFormProps = {
  rooms: Room[];
  defaultRoomId?: string;
  onSubmit: (payload: ReservationFormInput) => void;
  submitLabel?: string;
};

export default function ReservationForm({ rooms, defaultRoomId, onSubmit, submitLabel = 'Confirm booking' }: ReservationFormProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<ReservationFormInput>({
    roomId: defaultRoomId ?? rooms[0]?.id ?? '',
    guestName: '',
    guestEmail: '',
    contactNumber: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
  });

  const selectedRoom = useMemo(() => rooms.find((room) => room.id === form.roomId), [rooms, form.roomId]);
  const checkOutMinDate = useMemo(() => {
    if (!form.checkInDate) return undefined;
    const date = new Date(form.checkInDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }, [form.checkInDate]);
  const todayMinDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  function update<K extends keyof ReservationFormInput>(key: K, value: ReservationFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form
      className="reservation-form"
      onSubmit={submit}
      onInvalidCapture={(event) => {
        event.preventDefault();
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        if (target?.validationMessage) {
          showToast('error', target.validationMessage);
        }
      }}
    >
      <div className="grid-2">
        <div className="field">
          <label>Room</label>
          <select value={form.roomId} onChange={(e) => update('roomId', e.target.value)}>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} - ${room.pricePerNight}/night
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Guests</label>
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            value={form.guests}
            onChange={(e) => update('guests', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>Guest name</label>
          <input value={form.guestName} onChange={(e) => update('guestName', e.target.value)} required />
        </div>
        <div className="field">
          <label>Guest email</label>
          <input type="email" value={form.guestEmail} onChange={(e) => update('guestEmail', e.target.value)} required />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>Contact number</label>
          <input
            value={form.contactNumber}
            onChange={(e) => update('contactNumber', e.target.value)}
            inputMode="numeric"
            pattern="\d{10}"
            maxLength={10}
            title="Contact number must be exactly 10 digits"
            required
          />
        </div>
        <div className="field">
          <label>Check-in date</label>
          <input
            type="date"
            min={todayMinDate}
            value={form.checkInDate}
            onChange={(e) => update('checkInDate', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label>Check-out date</label>
        <input
          type="date"
          value={form.checkOutDate}
          min={checkOutMinDate}
          onChange={(e) => update('checkOutDate', e.target.value)}
          required
        />
      </div>

      <div className="form-footer">
        <p className="meta">Rate: ${selectedRoom?.pricePerNight ?? 0} / night</p>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}
