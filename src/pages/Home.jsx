import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProducts } from '../services/productService';
import { useSettings } from '../hooks/useSettings';
import { Play } from 'lucide-react';

const GROOM_CATS = ['All', 'Sherwani', 'Wedding Suit', 'Nehru Jacket', 'Kurta Pajama', 'Indo-Western', 'Jodhpuri', 'Achkan', 'Bandhgala'];

const MARQUEE_ITEMS = [
  'Sherwani', 'Wedding Suit', 'Nehru Jacket', 'Kurta Pajama',
  'Indo-Western', 'Jodhpuri Suit', 'Achkan', 'Bandhgala',
];

// ─── Reads video showcase config from localStorage (set by Admin Panel) ────────
function useVideoShowcase() {
  const [videos, setVideos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('svg_video_showcase') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onStorage = () => {
      try {
        setVideos(JSON.parse(localStorage.getItem('svg_video_showcase') || '[]'));
      } catch { /* noop */ }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return videos;
}

// ─── Video Card ───────────────────────────────────────────────────────────────
const VideoCard = ({ url, label, index }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Determine if it's an embed URL (YouTube/Insta) or direct mp4
  const isEmbed = url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com'));
  const embedSrc = url ? (
    url.includes('youtu.be/')
      ? url.replace('youtu.be/', 'www.youtube.com/embed/')
      : url.includes('watch?v=')
        ? url.replace('watch?v=', 'embed/')
        : url
  ) : null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  if (!url) {
    return (
      <div
        className="rounded-2xl overflow-hidden flex items-center justify-center text-center p-8"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,150,12,0.15)', minHeight: '260px' }}
      >
        <div>
          <Play size={32} style={{ color: '#B8960C', margin: '0 auto 12px' }} />
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8A8A8A' }}>Video {index + 1}</p>
          <p className="text-[10px] mt-1" style={{ color: '#555' }}>Configure in Admin Panel</p>
        </div>
      </div>
    );
  }

  if (isEmbed) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '9/16', background: '#000', minHeight: '260px' }}>
        <iframe
          src={embedSrc}
          className="w-full h-full"
          title={label || `Video ${index + 1}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        {label && (
          <div className="px-3 pb-3 pt-2 text-xs tracking-widest uppercase" style={{ color: '#B8960C' }}>
            {label}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden relative cursor-pointer group" onClick={togglePlay} style={{ background: '#000', minHeight: '260px' }}>
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        playsInline
        loop
        muted={!playing}
        preload="none"
        style={{ display: 'block' }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all group-hover:bg-black/10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(184,150,12,0.9)' }}>
            <Play size={22} fill="#fff" color="#fff" />
          </div>
        </div>
      )}
      {label && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#EAE2C6' }}>{label}</p>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Home = () => {
  const { whatsappNumber, storeName } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const videos = useVideoShowcase();
  const filterBarRef = useRef(null);

  useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  // Ensure we always have 3 video slots (fill with empty)  
  const videoSlots = [
    videos[0] || null,
    videos[1] || null,
    videos[2] || null,
  ];

  const videoLabels = [
    videos[0]?.label || 'Sherwani Collection',
    videos[1]?.label || 'Wedding Suits',
    videos[2]?.label || 'Kurta Pajama',
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ─── 1. HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '100dvh' }}>

        {/* Background: STRICTLY local image. No external URLs. */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center animate-[hero-zoom_25s_ease-in-out_infinite_alternate]"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
            // Fallback: neutral color only — no substitute image
            backgroundColor: '#2C2215',
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4"
          style={{ minHeight: '100dvh', paddingTop: '80px', paddingBottom: '40px' }}
        >
          <div className="animate-fade-up">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-6" style={{ color: '#B8960C' }}>
              New Arrivals 2025
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase font-light leading-none mb-4" style={{ color: '#EAE2C6', letterSpacing: '0.08em' }}>
              {storeName || 'Shri Vrindavan Garments'}
            </h1>
            <p className="font-serif text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase mb-8" style={{ color: '#D4C99A' }}>
              Curators of Royal Menswear
            </p>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-12" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Karawal Nagar • Delhi
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('collection-start')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 text-xs tracking-[0.25em] uppercase font-bold transition-all hover:scale-105"
                style={{ background: '#B8960C', color: '#0C0A08', borderRadius: '2px' }}
              >
                Browse Collection
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${storeName || 'SVG'}! I want to enquire about groom wear.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 text-xs tracking-[0.25em] uppercase font-medium border transition-all hover:scale-105 flex items-center gap-2"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#EAE2C6', borderRadius: '2px' }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. MARQUEE ───────────────────────────────────────────────────────── */}
      <div className="marquee-wrap overflow-hidden" style={{ background: '#0C0A08', borderTop: '1px solid rgba(184,150,12,0.2)', borderBottom: '1px solid rgba(184,150,12,0.2)' }}>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ─── 3. VIDEO SHOWCASE ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0C0A08' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#B8960C' }}>Lookbook</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: '#EAE2C6' }}>
              The Royal Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {videoSlots.map((video, i) => (
              <VideoCard
                key={i}
                index={i}
                url={video?.url || null}
                label={videoLabels[i]}
              />
            ))}
          </div>

          <p className="text-center mt-6 text-[10px] tracking-widest uppercase" style={{ color: '#444' }}>
            Videos managed via Admin Panel
          </p>
        </div>
      </section>

      {/* ─── 4. STICKY FILTER BAR ─────────────────────────────────────────────── */}
      <div
        id="collection-start"
        ref={filterBarRef}
        className="sticky z-40"
        style={{
          top: '64px',
          background: 'rgba(250,250,248,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
            {GROOM_CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`fchip flex-shrink-0 ${activeCategory === cat ? 'active' : ''}`}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 5. PRODUCT GRID ──────────────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full flex-grow">
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
            <p className="font-serif text-2xl italic mb-4" style={{ color: 'var(--muted)' }}>
              No products in this category.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="text-[10px] tracking-[0.2em] uppercase border-b pb-0.5 hover:text-primary transition-colors"
              style={{ color: 'var(--gold)', borderColor: 'var(--gold)' }}
            >
              View Complete Collection
            </button>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link to="/catalog" className="btn-outline">
              View All Arrivals →
            </Link>
          </div>
        )}
      </section>

      {/* ─── 6. BRAND STORY ───────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 lg:px-16"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight" style={{ color: 'var(--text)' }}>
              Trusted by thousands.<br />
              <em style={{ color: 'var(--gold)' }}>Loved by grooms.</em>
            </h2>
          </div>
          <div className="w-full md:w-1/2 md:border-l md:pl-10" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              Based in the heart of Karawal Nagar, Delhi, {storeName || 'Shri Vrindavan Garments'} has been
              dressing grooms for over 15 years. From a single Sherwani to a complete wedding
              wardrobe, we guarantee the best price and unmatched quality.
            </p>
            <p className="font-serif text-xl italic mb-6" style={{ color: 'var(--gold)' }}>
              "Quality Clothing. Best Price. Trusted Choice."
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${storeName || 'SVG'}! I am interested in a custom order for groom wear.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Wholesale Enquiries
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
