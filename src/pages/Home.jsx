import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';

const GROOM_CATS = ['All', 'Sherwani', 'Wedding Suit', 'Nehru Jacket', 'Kurta Pajama', 'Indo-Western', 'Jodhpuri', 'Achkan', 'Bandhgala'];

const MARQUEE_ITEMS = [
  'Sherwani', 'Wedding Suit', 'Nehru Jacket', 'Kurta Pajama',
  'Indo-Western', 'Jodhpuri Suit', 'Achkan', 'Bandhgala',
];

const HERO_CARDS = [
  { emoji: '🥻', label: 'Sherwani', cat: 'Sherwani' },
  { emoji: '🤵', label: 'Wedding Suit', cat: 'Wedding Suit' },
  { emoji: '🎩', label: 'Jodhpuri', cat: 'Jodhpuri' },
];

const EMOJI_OPTIONS = ['🥻','✨','🎩','🧥','👘','💎','🏛️','👑','🌿','🤵','🪡','🎋','💍','⚔️','🦚','🌟'];

const EMPTY_FORM = {
  name: '', category: 'Sherwani', fabric: '', occasions: '', price: '',
  description: '', sizes: '', colors: '', isNew: false, featured: false, emoji: '🥻',
};

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(target, duration = 1400) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || target === 0) return;
    started.current = true;
    const step = target / (duration / 16);
    let curr = 0;
    const timer = setInterval(() => {
      curr += step;
      if (curr >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(curr));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ─── Embedded Admin Panel ──────────────────────────────────────────────────────
function EmbeddedAdmin({ products, setProducts }) {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('svg_admin') === 'true');
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [shake, setShake] = useState(false);
  const [tab, setTab] = useState('list');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === 'svg2025') {
      sessionStorage.setItem('svg_admin', 'true');
      setLoggedIn(true);
    } else {
      setPwError('Incorrect password. Try again.');
      setShake(true);
      setTimeout(() => { setShake(false); setPwError(''); }, 2500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('svg_admin');
    setLoggedIn(false);
    setTab('list');
  };

  const handleFormChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: form.price ? Number(form.price) : 0,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      occasions: form.occasions.split(',').map(o => o.trim()).filter(Boolean),
      images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80'],
      status: 'active',
    };
    if (editId) {
      const updated = await updateProduct(editId, productData);
      setProducts(ps => ps.map(p => p.id === editId ? { ...p, ...updated } : p));
    } else {
      const added = await addProduct(productData);
      setProducts(ps => [added, ...ps]);
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setTab('list');
  };

  const startEdit = (product) => {
    setForm({
      name: product.name || '',
      category: product.category || 'Sherwani',
      fabric: product.fabric || '',
      occasions: (product.occasions || []).join(', '),
      price: product.price || '',
      description: product.description || '',
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      isNew: product.isNew || false,
      featured: product.featured || false,
      emoji: product.emoji || '🥻',
    });
    setEditId(product.id);
    setTab('form');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    color: 'var(--cream)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    padding: '10px 14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'block', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px', fontFamily: 'var(--font-body)' };

  if (!loggedIn) {
    return (
      <section className="admin-section py-20 px-4">
        <div className="text-center mb-12">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>
            Admin Portal
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--cream)', fontWeight: 300 }}>
            Manage Your <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Collection</em>
          </h2>
        </div>

        <div className="admin-login-card">
          <img src="/images/svg-logo.png" alt="SVG" className="w-16 h-16 object-contain mx-auto mb-4" />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2rem' }}>
            Admin Access Required
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="Enter admin password..."
                className={`admin-input ${shake ? 'shake' : ''}`}
                style={{ ...inputStyle, borderColor: pwError ? 'var(--red)' : undefined }}
                required
              />
              {pwError && <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '6px', fontFamily: 'var(--font-body)' }}>{pwError}</p>}
            </div>
            <button type="submit" className="btn-primary w-full mt-4">
              Enter Panel
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-section px-4 sm:px-8 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
              Admin Portal
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--cream)', fontWeight: 300 }}>
              Welcome, <em style={{ color: 'var(--gold)' }}>Admin</em>
            </h2>
          </div>
          <button onClick={handleLogout} className="btn-outline text-sm">Logout</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            className={`admin-tab ${tab === 'list' ? 'active-tab' : ''}`}
            onClick={() => { setTab('list'); setEditId(null); setForm(EMPTY_FORM); }}
          >
            All Products ({products.length})
          </button>
          <button
            className={`admin-tab ${tab === 'form' ? 'active-tab' : ''}`}
            onClick={() => { setTab('form'); setEditId(null); setForm(EMPTY_FORM); }}
          >
            {editId ? 'Edit Product' : '+ Add Product'}
          </button>
        </div>

        {/* Product List */}
        {tab === 'list' && (
          <div className="space-y-2">
            {products.length === 0 && (
              <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px', textAlign: 'center', padding: '2rem' }}>
                No products. Add some above.
              </p>
            )}
            {products.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 gap-4"
                style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{p.emoji || '🥻'}</span>
                  <div className="min-w-0">
                    <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </p>
                    <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.1em' }}>
                      {p.category} · {p.fabric} {p.price ? `· ₹${Number(p.price).toLocaleString('en-IN')}` : '· Contact for Price'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(p)}
                    className="admin-tab"
                    style={{ padding: '6px 14px', fontSize: '9px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="admin-tab"
                    style={{ padding: '6px 14px', fontSize: '9px', borderColor: 'var(--red)', color: 'var(--red)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Form */}
        {tab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Emoji picker */}
            <div>
              <label style={labelStyle}>Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(em => (
                  <button
                    type="button"
                    key={em}
                    onClick={() => handleFormChange('emoji', em)}
                    style={{
                      fontSize: '1.5rem',
                      padding: '6px',
                      background: form.emoji === em ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.emoji === em ? 'var(--gold)' : 'var(--border)'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input style={inputStyle} className="admin-input" value={form.name} onChange={e => handleFormChange('name', e.target.value)} required placeholder="Royal Banarasi Sherwani" />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.category}
                  onChange={e => handleFormChange('category', e.target.value)}
                >
                  {GROOM_CATS.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Fabric *</label>
                <input style={inputStyle} className="admin-input" value={form.fabric} onChange={e => handleFormChange('fabric', e.target.value)} required placeholder="Banarasi Silk" />
              </div>
              <div>
                <label style={labelStyle}>Price (₹) — leave blank for contact</label>
                <input style={inputStyle} type="number" className="admin-input" value={form.price} onChange={e => handleFormChange('price', e.target.value)} placeholder="12999" />
              </div>
              <div>
                <label style={labelStyle}>Occasions (comma separated)</label>
                <input style={inputStyle} className="admin-input" value={form.occasions} onChange={e => handleFormChange('occasions', e.target.value)} placeholder="Wedding, Baraat" />
              </div>
              <div>
                <label style={labelStyle}>Sizes (comma separated)</label>
                <input style={inputStyle} className="admin-input" value={form.sizes} onChange={e => handleFormChange('sizes', e.target.value)} placeholder="38, 40, 42, 44" />
              </div>
              <div>
                <label style={labelStyle}>Colors (comma separated)</label>
                <input style={inputStyle} className="admin-input" value={form.colors} onChange={e => handleFormChange('colors', e.target.value)} placeholder="Ivory Gold, Champagne" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                className="admin-input"
                value={form.description}
                onChange={e => handleFormChange('description', e.target.value)}
                placeholder="A brief description of the product..."
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--muted)' }}>
                <input type="checkbox" checked={form.isNew} onChange={e => handleFormChange('isNew', e.target.checked)} style={{ accentColor: 'var(--gold)' }} />
                New Arrival
              </label>
              <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--muted)' }}>
                <input type="checkbox" checked={form.featured} onChange={e => handleFormChange('featured', e.target.checked)} style={{ accentColor: 'var(--gold)' }} />
                Featured
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                {editId ? 'Update Product' : 'Add to Collection'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => handleDelete(editId).then(() => { setEditId(null); setForm(EMPTY_FORM); setTab('list'); })}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--red)',
                    color: 'var(--red)',
                    padding: '14px 24px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  }}
                >
                  Delete Product
                </button>
              )}
              <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setTab('list'); }} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const productCount = useCounter(products.length > 0 ? 200 : 0, 1400);

  useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  const scrollToCollection = () =>
    document.getElementById('collection-start')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <div className="hero-section pt-[68px]">
        <div className="hero-grid" />

        {/* Trust bar */}
        <div className="trust-bar">
          <span>★ 4.9/5 Google Rating</span>
          <span>📍 Karawal Nagar, Delhi</span>
          <span>🕐 10:00 AM – 8:30 PM</span>
          <span>👑 The Groom's House</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left: Content */}
            <div className="flex-1 max-w-2xl lg:max-w-none">
              <div className="hero-eyebrow mb-4">New Collection 2025 · Delhi's Finest</div>
              <h1 className="hero-title">
                Dressed for<br />
                <em>Your Grand</em><br />
                Day.
              </h1>
              <p className="hero-desc mb-10">
                Sherwani, Suit, Nehru Jacket, Kurta Pajama — every style a groom could dream of.
                Crafted for the man who deserves to look extraordinary on his most important day.
              </p>
              <div className="hero-actions mb-12 flex-wrap">
                <button className="btn-primary" onClick={scrollToCollection} id="browse-collection-btn">
                  Browse Collection
                </button>
                <button
                  className="btn-outline"
                  onClick={() => window.open(`https://wa.me/919555835833?text=${encodeURIComponent('Hello SVG! I want to enquire about groom wear.')}`, '_blank')}
                  id="whatsapp-enquiry-btn"
                >
                  <span className="wa-dot mr-2"></span>
                  WhatsApp Enquiry
                </button>
              </div>
              <div className="hero-stats flex-wrap">
                <div><span className="stat-num">{productCount}+</span><span className="stat-label">Products</span></div>
                <div><span className="stat-num">4.9★</span><span className="stat-label">Google</span></div>
                <div><span className="stat-num">975+</span><span className="stat-label">Customers</span></div>
                <div><span className="stat-num">15+</span><span className="stat-label">Years</span></div>
              </div>
            </div>

            {/* Right: Floating card stack */}
            <div className="hidden lg:flex flex-col items-center gap-6" style={{ opacity: 0, animation: 'fadeRight 0.7s ease forwards 0.6s' }}>
              <div className="hero-card-stack">
                {HERO_CARDS.map((card, i) => (
                  <div
                    key={card.cat}
                    className={`hcard hc${i + 1} cursor-none`}
                    onClick={() => { setActiveCategory(card.cat); scrollToCollection(); }}
                  >
                    <span className="hcard-emoji">{card.emoji}</span>
                    <span className="hcard-label">{card.label}</span>
                    <div className="hcard-border" />
                  </div>
                ))}
                <div className="hero-badge">The Groom's House</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MARQUEE ───────────────────────────────────────────── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. FILTER CHIPS ─────────────────────────────────────── */}
      <div id="collection-start" className="fchip-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {GROOM_CATS.map(cat => (
              <button
                key={cat}
                className={`fchip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. PRODUCT GRID ─────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full flex-grow">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <SkeletonLoader count={8} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--muted)', marginBottom: '1rem' }}>
              No products in this category.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--gold)', cursor: 'pointer',
                borderBottom: '1px solid var(--gold)', paddingBottom: '2px',
              }}
            >
              View Complete Collection
            </button>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link to="/catalog" className="btn-outline">
              View All Arrivals →
            </Link>
          </div>
        )}
      </section>

      {/* ── 5. BRAND EDITORIAL ──────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        {/* Trust Strip */}
        <div className="brand-strip max-w-6xl mx-auto mb-20">
          {[
            { icon: '🎩', title: 'Premium Sherwanis', desc: 'Handcrafted embroidery, finest fabrics. Built for the groom who wants to make an entrance.' },
            { icon: '✂️', title: 'Custom Fitting', desc: 'Every piece tailored to your measurements. Walk in, get measured, walk out legendary.' },
            { icon: '📍', title: 'Visit Our Store', desc: '217, Street No. 5, Karawal Nagar, Delhi. Open Mon–Sat, 10AM–8:30PM.' },
            { icon: '⭐', title: '4.9 Google Rating', desc: '975+ happy customers. Trusted by families across Delhi for over 15 years.' },
          ].map(item => (
            <div key={item.title} className="brand-strip-item">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--cream)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Brand Story */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--cream)', fontWeight: 300, lineHeight: 1.15 }}>
              Trusted by thousands.<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Loved by grooms.</em>
            </h2>
          </div>
          <div className="w-full md:w-1/2 md:border-l md:pl-10" style={{ borderColor: 'var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
              Based in the heart of Karawal Nagar, Delhi, SHRI VRINDAVAN GARMENTS has been dressing
              grooms for over 15 years. From a single Sherwani to a complete wedding wardrobe,
              we guarantee the best price and unmatched quality.
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              "Quality Clothing. Best Price. Trusted Choice."
            </p>
            <button
              onClick={() => window.open(`https://wa.me/919555835833?text=${encodeURIComponent("Hello SVG! I am interested in a custom order for groom wear. Please share more details.")}`, '_blank')}
              className="btn-primary"
            >
              <span className="wa-dot mr-2"></span>
              Wholesale Enquiries
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. EMBEDDED ADMIN ───────────────────────────────────── */}
      <EmbeddedAdmin products={products} setProducts={setProducts} />
    </div>
  );
};

export default Home;
