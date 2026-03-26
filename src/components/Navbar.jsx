import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Facebook, Instagram, MapPin } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useSettings } from '../hooks/useSettings';

const SOCIAL_LINKS = [
  {
    icon: Facebook,
    href: 'https://www.facebook.com/p/SVG-Ethnic-wear-By-Sri-Vrindavan-garments-61566550774578/',
    label: 'SVG on Facebook',
  },
  {
    icon: Instagram,
    href: 'https://www.instagram.com/sri_vrindavan_garments/',
    label: 'SVG on Instagram',
  },
];

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Collection', path: '/catalog' },
  { name: 'About', path: '/about' },
];

const Navbar = ({ onOpenWishlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { whatsappNumber, storeName } = useSettings();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          background: transparent ? 'transparent' : 'rgba(12,10,8,0.96)',
          backdropFilter: transparent ? 'none' : 'blur(16px)',
          borderBottom: transparent ? 'none' : '1px solid rgba(184,150,12,0.15)',
          boxShadow: transparent ? 'none' : '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* LEFT: Logo + Brand */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src="/images/svg-logo.png"
                alt={storeName || 'SVG'}
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-contain"
                style={{ background: '#1A1208', padding: '2px' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="hidden sm:block">
                <div
                  className="font-serif text-sm md:text-base leading-tight tracking-widest uppercase"
                  style={{ color: '#EAE2C6' }}
                >
                  {storeName || 'Shri Vrindavan Garments'}
                </div>
                <div className="text-[9px] tracking-[0.25em] uppercase" style={{ color: '#B8960C' }}>
                  The Groom's House
                </div>
              </div>
            </Link>

            {/* CENTER: Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-[11px] tracking-[0.2em] uppercase font-medium py-1 group transition-colors"
                  style={{ color: location.pathname === link.path ? '#B8960C' : '#EAE2C6' }}
                >
                  {link.name}
                  <span
                    className="absolute bottom-0 left-0 h-[1px] transition-all duration-300 group-hover:w-full"
                    style={{
                      background: '#B8960C',
                      width: location.pathname === link.path ? '100%' : '0%',
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* RIGHT: Social Icons + Wishlist + Reach Us */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Social Icons (desktop) */}
              <div className="hidden md:flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#EAE2C6',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#B8960C'; e.currentTarget.style.color = '#000'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#EAE2C6'; }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>

              {/* Admin Portal (Subtle) */}
              <a
                href="/admin-panel.html"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8A8A8A',
                }}
                title="Admin Portal"
              >
                <div className="text-[10px] font-bold">AD</div>
              </a>

              {/* Wishlist */}
              <button
                onClick={onOpenWishlist}
                aria-label="Open Wishlist"
                className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: wishlist.length > 0 ? '#B8960C' : '#EAE2C6',
                }}
              >
                <Heart size={16} className={wishlist.length > 0 ? 'fill-current' : ''} />
                {wishlist.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                    style={{ background: '#B8960C', color: '#0C0A08' }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Reach Us button (desktop) */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I want to visit your store.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded text-[10px] tracking-[0.2em] uppercase font-semibold transition-all hover:scale-105"
                style={{ background: '#ffffff', color: '#1A1A1A', boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
              >
                <MapPin size={13} />
                Reach Us
              </a>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded"
                aria-label="Toggle Menu"
                style={{ color: '#EAE2C6' }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[360px]' : 'max-h-0'}`}
          style={{ background: 'rgba(12,10,8,0.98)', borderTop: '1px solid rgba(184,150,12,0.15)' }}
        >
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-3 border-b text-xs tracking-[0.2em] uppercase font-medium transition-colors hover:text-gold"
                style={{
                  borderColor: 'rgba(255,255,255,0.06)',
                  color: location.pathname === link.path ? '#B8960C' : '#EAE2C6',
                }}
              >
                {link.name}
              </Link>
            ))}

            {/* Social Icons (mobile) */}
            <div className="flex items-center gap-3 pt-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#EAE2C6' }}
                >
                  <Icon size={16} />
                </a>
              ))}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I want to visit your store.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded text-[10px] tracking-[0.2em] uppercase font-bold"
                style={{ background: '#ffffff', color: '#1A1208' }}
              >
                <MapPin size={12} />
                Reach Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Non-home spacer so content starts below fixed nav */}
      {!isHome && <div className="h-16 md:h-20 bg-[#0C0A08]" />}
    </>
  );
};

export default Navbar;
