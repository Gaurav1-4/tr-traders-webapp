import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  const setFilter = (cat) => {
    navigate(`/catalog?category=${cat}`);
    window.scrollTo(0, 0);
  };

  const openWA = (text) => {
    window.open(`https://wa.me/919555835833?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <footer className="bg-[#0F2D1A] text-white/75 py-12 border-t-[3px] border-accent mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div>
            <div className="w-[52px] h-[52px] bg-accent text-[#1A1A2E] font-display text-[18px] font-bold rounded-[10px] flex items-center justify-center mb-4">
              SVG
            </div>
            <div className="font-display text-[1.3rem] text-white font-semibold mb-1">
              SHRI VRINDAVAN GARMENTS
            </div>
            <p className="text-sm opacity-90 mb-1">A Platform For Readymade Garments</p>
            <p className="text-xs opacity-70 mb-4">Mens · Kids · Ladies</p>
            <button 
              className="bg-wa text-white border-none py-2.5 px-5 rounded-lg font-body text-[13px] font-medium cursor-pointer w-full hover:bg-green-600 transition-colors"
              onClick={() => openWA('Hello SVG!')}
            >
              WhatsApp Us
            </button>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-white font-display text-lg mb-4">Our Collection</h4>
            <ul className="space-y-3 text-sm flex flex-col items-start">
              <li><button onClick={() => setFilter('Mens Shirts')} className="hover:text-accent transition-colors">Mens Shirts</button></li>
              <li><button onClick={() => setFilter('Mens Kurta')} className="hover:text-accent transition-colors">Mens Kurta</button></li>
              <li><button onClick={() => setFilter('Ladies Suits')} className="hover:text-accent transition-colors">Ladies Suits</button></li>
              <li><button onClick={() => setFilter('Ladies Kurti')} className="hover:text-accent transition-colors">Ladies Kurti</button></li>
              <li><button onClick={() => setFilter('Kids Boys')} className="hover:text-accent transition-colors">Kids Boys Wear</button></li>
              <li><button onClick={() => setFilter('Kids Girls')} className="hover:text-accent transition-colors">Kids Girls Wear</button></li>
              <li><button onClick={() => setFilter('Wholesale Lot')} className="hover:text-accent transition-colors">Wholesale Lots</button></li>
            </ul>
          </div>

          {/* Column 3: Info */}
          <div>
            <h4 className="text-white font-display text-lg mb-4">Visit Us</h4>
            <div className="space-y-3 text-sm">
              <p>217, Street No. 5, Shaheed Bhagat Singh Colony</p>
              <p>Karawal Nagar, Delhi — 110090</p>
              <p className="flex items-center gap-2 mt-4">📞 095558 35833</p>
              <p className="flex items-center gap-2">🕐 Mon–Sat: 10:00 AM – 8:30 PM</p>
              <p className="flex items-center gap-2">📦 Wholesale & Retail Both</p>
            </div>
          </div>

          {/* Column 4: Google Rating */}
          <div>
            <h4 className="text-white font-display text-lg mb-4">Customer Reviews</h4>
            <div className="text-accent text-[20px] tracking-[3px] mb-1">★★★★★</div>
            <div className="font-display text-[2rem] text-white font-bold mb-1">4.9 / 5</div>
            <div className="text-sm opacity-80 mb-4">975 Google Reviews</div>
            <div className="space-y-2 text-xs italic opacity-60">
              <p>"Best price and very good quality"</p>
              <p>"Very cheap and best prices"</p>
              <p>"Totally happy customer"</p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs opacity-70">
          <p>© 2025 Shri Vrindavan Garments · Karawal Nagar, Delhi</p>
          <p className="mt-2 md:mt-0">Garment Exporter · Wholesale & Retail</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
