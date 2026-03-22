import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Search } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';

const Navbar = ({ onOpenWishlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  // Remove scrolled effect to keep "white border bottom" nav consistently
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/catalog' },
    { name: 'About', path: '/about' },
  ];

  const handleCategoryClick = (cat) => {
    navigate(`/catalog?category=${cat}`);
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-surface border-b-2 border-primary py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Left: Logo area */}
          <Link to="/" className="brand-area">
            <div className="brand-monogram">SVG</div>
            <div className="brand-text hidden sm:block">
              <div className="brand-name">SHRI VRINDAVAN GARMENTS</div>
              <div className="brand-sub">Garment Exporter · Delhi</div>
            </div>
          </Link>

          {/* Center: Category quick links (new addition) */}
          <div className="nav-cats hidden md:flex items-center space-x-2">
            <button onClick={() => handleCategoryClick('Mens Shirts')}>Mens</button>
            <button onClick={() => handleCategoryClick('Ladies Suits')}>Ladies</button>
            <button onClick={() => handleCategoryClick('Kids Boys')}>Kids</button>
          </div>

          {/* Right: Keep existing nav right elements (wishlist, navLinks) */}
          <div className="nav-right hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-wider transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary font-medium' : 'text-text'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Wishlist Link */}
            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1.5 transition-colors relative group text-text hover:text-primary"
              title="Saved Items"
            >
              <Heart size={20} className={wishlist.length > 0 ? "fill-accent text-accent" : ""} />
              {wishlist.length > 0 && <span className="font-medium text-primary">{wishlist.length}</span>}
              <span className="sr-only">Wishlist</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={onOpenWishlist}
              className="text-text hover:text-primary relative"
            >
              <Heart size={24} className={wishlist.length > 0 ? "fill-accent text-accent" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text hover:text-primary transition-colors focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface shadow-md border-t border-border animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {['Mens Shirts', 'Ladies Suits', 'Kids Boys'].map(cat => (
               <button
                 key={cat}
                 onClick={() => { handleCategoryClick(cat); setIsOpen(false); }}
                 className="block w-full text-left text-lg py-3 border-b border-border/50 text-text hover:text-primary font-medium"
               >
                 {cat.split(' ')[0]} Collection
               </button>
            ))}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left text-lg py-3 border-b border-border/50 ${
                  location.pathname === link.path ? 'text-primary font-medium' : 'text-text'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
