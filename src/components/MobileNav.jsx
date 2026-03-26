import { useLocation } from 'react-router-dom';
import { Home, Search, Heart, MessageCircle } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';

const MobileNav = ({ onOpenWishlist }) => {
  const location = useLocation();
  const { wishlist } = useWishlist();

  if (location.pathname.startsWith('/admin')) return null;

  const navItems = [
    { name: 'Home', path: '/', icon: Home, action: 'home' },
    { name: 'Catalogue', path: '/catalog', icon: Search, action: 'catalog' },
    { name: 'Saved', path: '#', icon: Heart, action: 'wishlist' },
    { name: 'WhatsApp', path: 'whatsapp', icon: MessageCircle, action: 'whatsapp' },
  ];

  return (
    <>
      <div className="h-16 md:hidden" />
      <div
        className="fixed bottom-0 left-0 right-0 h-16 md:hidden z-50 flex justify-around items-center px-2"
        style={{
          background: 'rgba(12,10,8,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && item.action !== 'wishlist' && item.action !== 'whatsapp';
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.action === 'whatsapp') {
                  window.open(`https://wa.me/919555835833?text=${encodeURIComponent('Hello SVG! I want to enquire about groom wear collection.')}`, '_blank');
                } else if (item.action === 'wishlist') {
                  if (onOpenWishlist) onOpenWishlist();
                } else if (item.action === 'home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  if (location.pathname !== '/') window.location.href = '/';
                } else {
                  if (location.pathname !== item.path) window.location.href = item.path;
                  else window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center justify-center w-full h-full relative"
              style={{ color: isActive ? 'var(--gold)' : 'var(--muted)', transition: 'color 0.2s' }}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b"
                  style={{ background: 'var(--gold)' }}
                />
              )}
              <div className="relative">
                <Icon size={20} />
                {item.action === 'wishlist' && wishlist.length > 0 && (
                  <span
                    className="absolute -top-1 -right-2 text-[9px] min-w-[14px] h-3.5 flex items-center justify-center rounded-full px-0.5 font-bold"
                    style={{ background: 'var(--gold)', color: '#0C0A08' }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-1 tracking-wide uppercase">{item.name}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default MobileNav;
