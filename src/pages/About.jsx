import { useEffect } from 'react';

const About = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen pt-[68px]" style={{ background: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            Our Story
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>
            The Groom's <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Legacy</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--muted)' }}>
            Dressing Delhi's most extraordinary grooms since 2010
          </p>
        </div>

        {/* Banner Image */}
        <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img
            src="https://images.unsplash.com/photo-1583391733981-8498408ee4b6?auto=format&fit=crop&q=80&w=2000"
            alt="Groom wear collection"
            style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Content */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9 }}>
            Welcome to <strong style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Shri Vrindavan Garments (SVG)</strong> — Delhi's most trusted destination
            for men's wedding and occasion wear. Founded with a passion for preserving traditional
            Indian craftsmanship while embracing a modern aesthetic, we are the Groom's House.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9 }}>
            Our journey began over a decade ago in the wholesale markets of Delhi. Through an
            unwavering commitment to quality — in silk, wool, brocade, and embroidery — we
            earned the loyalty of thousands of grooms and families across the city.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--cream)', marginTop: '2rem', lineHeight: 1.2 }}>
            Our <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Craftsmanship</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9 }}>
            Every piece at SVG tells a story. We work with artisans who have mastered the art of
            Zardozi, threadwork, and hand-embroidery over generations. Whether you're looking for an
            opulent Banarasi Sherwani for the Baraat, a clean Jodhpuri Bandhgala for the reception,
            or a relaxed silk Kurta Pajama for the Mehndi — we have every chapter of the groom's journey covered.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--cream)', marginTop: '2rem', lineHeight: 1.2 }}>
            The <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Promise</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9 }}>
            We believe every groom deserves to feel legendary without compromise. Zero concessions on
            fabric purity, stitching standards, or finishing. When you walk out of SVG dressed for your
            big day — you will know the difference.
          </p>

          <blockquote
            className="pl-6 py-4"
            style={{ borderLeft: '2px solid var(--gold)', marginTop: '2rem' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--cream)', lineHeight: 1.5 }}>
              "Though our catalogue is online, our service remains deeply personal. Each groom who walks
              in becomes part of our story."
            </p>
          </blockquote>
        </div>

        {/* Visit Us */}
        <div
          className="text-center p-10"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <div className="text-3xl mb-4">📍</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--cream)', marginBottom: '12px', fontWeight: 300 }}>
            Come Visit <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>The Store</em>
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', lineHeight: 2, marginBottom: '1.5rem' }}>
            217, Street No. 5, Shaheed Bhagat Singh Colony<br />
            Karawal Nagar, Delhi — 110090<br />
            📞 095558 35833<br />
            🕐 Mon–Sat: 10:00 AM – 8:30 PM
          </p>
          <button
            onClick={() => window.open(`https://wa.me/919555835833?text=${encodeURIComponent("Hello! I visited SVG website and would like to know more about your groom collection.")}`, '_blank')}
            className="btn-primary"
          >
            Book a Fitting →
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;
