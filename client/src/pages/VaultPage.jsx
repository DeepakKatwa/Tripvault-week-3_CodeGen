import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './VaultPage.css';

const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

export default function VaultPage({ type }) {
  const navigate = useNavigate();
  const user = getUser();
  const isDocuments = type === 'documents';
  const storageKey = `tripvault_${type}_${user.id || user.email || 'user'}`;
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(storageKey) || '[]'));
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', trip: '', date: '', notes: '', category: isDocuments ? 'Passport' : 'Adventure', fileName: '', image: '' });

  const title = isDocuments ? 'Travel Documents' : 'Travel Memories';
  const description = isDocuments ? 'Keep important document details organized for every journey.' : 'Save the moments and stories you never want to forget.';
  const categories = useMemo(() => isDocuments ? ['Passport', 'Visa', 'Ticket', 'Insurance', 'Booking', 'Other'] : ['Adventure', 'Food', 'People', 'Nature', 'Culture', 'Other'], [isDocuments]);

  const saveItems = (next) => {
    setItems(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (isDocuments) {
      setForm((old) => ({ ...old, fileName: file.name }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Please choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((old) => ({ ...old, image: reader.result, fileName: file.name }));
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required.');
    const next = [{ ...form, title: form.title.trim(), id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...items];
    try {
      saveItems(next);
      setForm({ title: '', trip: '', date: '', notes: '', category: categories[0], fileName: '', image: '' });
      setShowForm(false);
    } catch {
      setError('Browser storage is full. Remove a large memory image and try again.');
    }
  };

  const remove = (id) => {
    if (window.confirm(`Delete this ${isDocuments ? 'document' : 'memory'}?`)) saveItems(items.filter((item) => item.id !== id));
  };

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><span>TV</span> TripVault</div>
        <nav>
          <button onClick={() => navigate('/dashboard')}>⌂ <span>My Trips</span></button>
          <button className={isDocuments ? 'active' : ''} onClick={() => navigate('/documents')}>◇ <span>Documents</span></button>
          <button className={!isDocuments ? 'active' : ''} onClick={() => navigate('/memories')}>☼ <span>Memories</span></button>
        </nav>
        <div className="sidebar-user"><div>{user.name?.[0]?.toUpperCase() || 'T'}</div><span><b>{user.name || 'Traveller'}</b><small>{user.email}</small></span></div>
        <button className="logout-button" onClick={logout}>Log out</button>
      </aside>

      <main className="dashboard vault-page">
        <header className="dashboard-header">
          <div><p className="eyebrow">{isDocuments ? 'TRAVEL ESSENTIALS' : 'YOUR STORY'}</p><h1>{title}</h1><span>{description}</span></div>
          <button className="dashboard-create-btn" onClick={() => setShowForm(true)}>+ Add {isDocuments ? 'Document' : 'Memory'}</button>
        </header>

        {!items.length ? (
          <section className="dashboard-empty"><div className="empty-icon">{isDocuments ? '◇' : '☼'}</div><h2>No {type} added yet</h2><p>{isDocuments ? 'Add your passport, visa, tickets or booking details.' : 'Add a photo and write the story behind the moment.'}</p><button className="dashboard-create-btn" onClick={() => setShowForm(true)}>Add your first {isDocuments ? 'document' : 'memory'}</button></section>
        ) : (
          <section className="vault-grid">{items.map((item) => <article className="vault-card" key={item.id}>{item.image ? <img src={item.image} alt={item.title} /> : <div className="vault-file-icon">{isDocuments ? 'DOC' : 'PHOTO'}</div>}<div className="vault-card-body"><span className="vault-badge">{item.category}</span><h2>{item.title}</h2>{item.trip && <p><b>Trip:</b> {item.trip}</p>}{item.date && <p><b>Date:</b> {new Date(`${item.date}T00:00:00`).toLocaleDateString()}</p>}{item.fileName && <p className="file-name">{item.fileName}</p>}{item.notes && <p>{item.notes}</p>}<button onClick={() => remove(item.id)}>Delete</button></div></article>)}</section>
        )}

        {showForm && <div className="trip-form-overlay" onMouseDown={(e) => e.target === e.currentTarget && setShowForm(false)}><div className="trip-form-modal"><h2>Add {isDocuments ? 'Document' : 'Memory'}</h2><p className="trip-form-intro">Save the details in your personal vault.</p>{error && <div className="form-error">{error}</div>}<form onSubmit={submit}><label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={isDocuments ? 'Passport copy' : 'Sunset at the beach'} required /></label><label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Related trip<input value={form.trip} onChange={(e) => setForm({ ...form, trip: e.target.value })} placeholder="Goa 2026" /></label><label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>{isDocuments ? 'Choose document (name is saved)' : 'Choose image (maximum 2 MB)'}<input type="file" accept={isDocuments ? '.pdf,.doc,.docx,.jpg,.jpeg,.png' : 'image/*'} onChange={handleFile} /></label><label>Notes<textarea rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add useful details..." /></label><div className="trip-form-actions"><button type="button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit">Save</button></div></form></div></div>}
      </main>
    </div>
  );
}
