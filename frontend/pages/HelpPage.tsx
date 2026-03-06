import Navbar from '../components/Navbar';

export default function HelpPage() {
  const helpItems = [
    {
      icon: '🔐',
      title: 'Login to the system',
      content: 'Open Login, select STAFF role, enter your staff email and password, then continue to the Staff Dashboard.',
    },
    {
      icon: '🛎️',
      title: 'Add a new reservation',
      content: 'Go to Reservation page, fill guest details, choose room and dates, then submit to confirm the booking.',
    },
    {
      icon: '📋',
      title: 'View reservation details',
      content: 'Open Reservation List to see reservation number, guest, room, dates, status, and total amount.',
    },
    {
      icon: '✏️',
      title: 'Update or cancel reservation',
      content: 'From Reservation List, use Update to edit details and use Cancel when the guest requests cancellation.',
    },
    {
      icon: '💳',
      title: 'Calculate and print bill',
      content: 'Open Billing, select a reservation, generate the bill summary, then click Print bill for a receipt.',
    },
    {
      icon: '🚪',
      title: 'Logout / Exit system',
      content: 'Use Exit System in the top navigation. Confirm the prompt to safely end the session and return to Login.',
    },
  ];

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Staff Help Section</h1>
        <p className="meta">Step-by-step guide for new reception staff at OceanView Luxury Resort.</p>

        <div className="help-grid">
          {helpItems.map((item) => (
            <article key={item.title} className="help-step-card">
              <h3>
                <span aria-hidden>{item.icon}</span> {item.title}
              </h3>
              <p>{item.content}</p>
            </article>
          ))}
        </div>

        <div className="help-card" style={{ marginTop: '1rem' }}>
          <h3>Need support?</h3>
          <p className="meta">
            If you are unable to complete an operation, contact Admin through the internal support process.
          </p>
        </div>
      </main>
    </div>
  );
}
