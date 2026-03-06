import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { help as helpApi } from '../api/client';

export default function Help() {
  const [content, setContent] = useState('');

  useEffect(() => {
    helpApi.get().then((r) => setContent(r.content)).catch(() => setContent('Help content could not be loaded.'));
  }, []);

  return (
    <>
      <p><Link to="/">← Back to menu</Link></p>
      <div className="card">
        <h2>Help – Guidelines for New Staff</h2>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{content || 'Loading...'}</pre>
      </div>
    </>
  );
}
