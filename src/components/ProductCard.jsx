import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import WhatsAppButton from './WhatsAppButton';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Intersection Observer for scroll-in entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const saved = isInWishlist(product.id);

  return (
    <div 
      ref={cardRef}
      className={`card-enter ${isVisible ? 'visible' : ''} group flex flex-col bg-white border border-gray-100/50 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-500 relative shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]`}
    >
      {/* Wishlist Button Overlay */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md shadow-sm transition-transform active:scale-110 ${saved ? 'text-accent' : 'text-gray-400 hover:text-accent'}`}
        style={{ transition: 'transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275), color 200ms ease' }}
        aria-label="Save to Wishlist"
      >
        <Heart size={18} className={saved ? 'fill-accent' : ''} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-50 block card-img rounded-t-xl">
        {/* Loading Skeleton */}
        {!imageLoaded && <div className="absolute inset-0 skeleton"></div>}
        
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML += `<div class="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center"><span class="text-4xl font-serif text-gray-400">${product.name.charAt(0)}</span></div>`;
          }}
        />
        
        {/* Floating Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {product.status === 'out_of_stock' ? (
            <span className="card-tag sale border-none shadow-sm flex items-center w-fit">
              Sold Out
            </span>
          ) : product.isNew && (
            <span className="card-tag new border-none shadow-sm flex items-center w-fit">
              New Arrival
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow bg-white z-10 relative">
        <div className="flex-grow space-y-1 text-center">
          <div className="text-[10px] uppercase tracking-[0.15em] font-medium text-muted mb-1">{product.category}</div>
          <h3 className="card-name line-clamp-2">
            <Link to={`/product/${product.id}`} className="focus-visible:outline-2 focus-visible:outline-primary rounded">
              {product.name}
            </Link>
          </h3>
          
          <div className="flex items-center justify-center mt-2">
            {product.price ? (
              <>
                <span className="card-price">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="card-wholesale">₹{Math.floor(product.price * 1.5).toLocaleString('en-IN')}</span>
              </>
            ) : (
              <span className="italic text-xs text-muted mt-1">Price on Request</span>
            )}
          </div>
        </div>

        {/* Action - Hidden until hover */}
        <div className="mt-0 overflow-hidden max-h-0 group-hover:max-h-14 group-hover:mt-4 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <WhatsAppButton 
            productName={product.name}
            className="w-full text-[11px] py-2.5 rounded-lg border-none shadow-none tracking-[0.1em] uppercase"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
