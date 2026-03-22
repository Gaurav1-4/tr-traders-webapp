import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import WhatsAppButton from '../components/WhatsAppButton';
import { getProducts } from '../services/productService';
import { ChevronDown } from 'lucide-react';

const categories = ['All', 'Casual', 'Formal', 'Bridal', 'Festive', 'Winter', 'Cotton'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.filter(p => activeCategory === 'All' || p.category === activeCategory).slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const scrollToCollection = () => {
    document.getElementById('collection-start')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* 1. Hero Section Wrapper */}
      <div className="hero-section pt-[72px]">
        {/* Trust bar at the very top */}
        <div className="trust-bar">
          <span>★ 4.9/5 Google Rating</span>
          <span>📍 Karawal Nagar, Delhi</span>
          <span>🕐 10:00 AM - 8:30 PM</span>
          <span>📦 Exporter & Wholesale</span>
        </div>

        <div className="hero-content">
          <div className="hero-monogram animate-fade-up">SVG</div>
          <div className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.1s' }}>MENS · KIDS · LADIES</div>
          <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.2s' }}>Shri Vrindavan<br/>Garments</h1>
          <p className="hero-desc animate-fade-up" style={{ animationDelay: '0.3s' }}>Delhi's premier wholesale and retail destination for family garments.</p>
          
          <div className="hero-actions flex-wrap gap-4 px-4 hidden sm:flex animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <button className="hero-btn" onClick={scrollToCollection}>View Collections</button>
            <button className="hero-wa-btn text-center" onClick={() => window.open(`https://wa.me/919555835833?text=${encodeURIComponent("Hello! I visited your website and want to enquire about your garments collection.")}`, "_blank")}>Wholesale Enquiry</button>
          </div>
          <div className="flex flex-col gap-3 px-4 mb-16 sm:hidden animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <button className="hero-btn w-full" onClick={scrollToCollection}>View Collections</button>
            <button className="hero-wa-btn w-full text-center" onClick={() => window.open(`https://wa.me/919555835833?text=${encodeURIComponent("Hello! I visited your website and want to enquire about your garments collection.")}`, "_blank")}>Wholesale Enquiry</button>
          </div>

          {/* Stats grid below buttons */}
          <div className="stats-grid animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="stat-box">
              <span className="stat-num">10k+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">5k+</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">15+</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Elegant Text-Link Category Menu */}
      <section id="collection-start" className="py-8 bg-bg sticky top-[72px] z-30 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto no-scrollbar scroll-smooth relative px-2">
            {['All', 'Mens Shirts', 'Mens Trousers', 'Ladies Suits', 'Kids Boys', 'Kids Girls', 'Wholesale Lot'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative flex-shrink-0 py-2 uppercase tracking-[0.1em] text-[12px] font-medium transition-colors hover:text-primary group ${
                  activeCategory === cat ? 'text-primary' : 'text-muted'
                }`}
              >
                {cat}
                {/* Animated Green Underline */}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${
                  activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Grid */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex-grow relative bg-bg">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16">
          {loading ? (
            <SkeletonLoader count={5} />
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted">
              <p className="font-serif text-xl italic mb-6">No products available in this category.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="text-primary hover:text-text uppercase tracking-[0.15em] text-xs font-bold transition-colors border-b border-primary/30 pb-1 hover:border-text"
              >
                View Complete Anthology
              </button>
            </div>
          )}
        </div>
        
        {products.length > 0 && (
          <div className="mt-20 flex justify-center">
            <Link to="/catalog" className="bg-surface border border-primary text-primary px-10 py-3.5 hover:bg-primary hover:text-white transition-all duration-300 uppercase tracking-widest text-[12px] font-bold rounded">
              View All Arrivals
            </Link>
          </div>
        )}
      </section>

      {/* 4. Brand Editorial */}
      <section className="bg-surface py-24 px-6 lg:px-16 border-t-[3px] border-accent mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
          
          <div className="w-full md:w-1/2 relative space-y-4 text-center md:text-left">
            <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-display text-text leading-tight font-bold">
              Trusted by thousands.<br/>
              <span className="text-primary">Loved by families.</span>
            </h2>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col space-y-6 md:border-l border-border md:pl-10 text-center md:text-left">
            <p className="text-muted font-body text-[15px] leading-relaxed">
              Based in the heart of Karawal Nagar, Delhi, SHRI VRINDAVAN GARMENTS has been delivering high-quality, affordable readymade garments for men, women, and kids. From single retail purchases to large wholesale lots, we guarantee the best price and unmatched reliability.
            </p>
            <p className="text-primary font-display italic text-2xl">
              "Quality Clothing. Best Price. Trusted Choice."
            </p>
            <div>
              <button 
                onClick={() => window.open(`https://wa.me/919555835833?text=${encodeURIComponent("Hello SVG! I am interested in wholesale/bulk orders. Can you please share your catalog and pricing?")}`, "_blank")}
                className="text-white bg-primary hover:bg-green-800 px-6 py-3 rounded-lg uppercase tracking-widest text-[11px] font-bold transition-all shadow-sm inline-block"
              >
                Wholesale Enquiries
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
