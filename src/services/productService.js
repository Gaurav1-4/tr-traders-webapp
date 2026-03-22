import { isMockMode, db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// ─── Groom's House Mock Catalog ─────────────────────────────────────────────
const mockProducts = [
  {
    id: 'svg1',
    name: 'Royal Banarasi Sherwani',
    category: 'Sherwani',
    fabric: 'Banarasi Silk',
    occasions: ['Wedding', 'Baraat'],
    description: 'Opulent Banarasi silk sherwani with intricate zari weaving and gold threadwork. The epitome of regal bridal wear — crafted for the groom who wants to command every room.',
    price: 12999,
    sizes: ['38','40','42','44','46'],
    colors: ['Ivory Gold','Champagne','Shahi Maroon'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600&q=80'],
    status: 'active',
    isNew: true,
    featured: true,
    emoji: '🥻',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg2',
    name: 'Classic Ivory Sherwani',
    category: 'Sherwani',
    fabric: 'Art Silk',
    occasions: ['Wedding', 'Reception'],
    description: 'Timeless ivory sherwani with subtle embroidery on collar and cuffs. Clean, elegant, and eternally stylish. Comes with matching churidar and dupatta.',
    price: 8499,
    sizes: ['38','40','42','44','46','48'],
    colors: ['Pure Ivory','Off White','Pearl'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80'],
    status: 'active',
    isNew: false,
    featured: false,
    emoji: '✨',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'svg3',
    name: 'Jodhpuri Bandhgala Suit',
    category: 'Jodhpuri',
    fabric: 'Wool Blend',
    occasions: ['Reception', 'Sangeet'],
    description: 'Sharp Jodhpuri bandhgala with mandarin collar and contrast buttons. Indo-Western at its finest — sophisticated, structured, unmistakably royal.',
    price: 7999,
    sizes: ['38','40','42','44','46'],
    colors: ['Midnight Navy','Charcoal','Bottle Green'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'],
    status: 'active',
    isNew: true,
    featured: true,
    emoji: '🎩',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'svg4',
    name: 'Embroidered Nehru Jacket Set',
    category: 'Nehru Jacket',
    fabric: 'Brocade',
    occasions: ['Sangeet', 'Mehndi'],
    description: 'Ornate brocade Nehru jacket over a plain silk kurta. Perfect for pre-wedding functions — dashing without going full bridal.',
    price: 4999,
    sizes: ['S','M','L','XL','XXL'],
    colors: ['Royal Blue','Burgundy','Forest Green','Copper'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=600&q=80'],
    status: 'active',
    isNew: false,
    featured: false,
    emoji: '🧥',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 'svg5',
    name: 'Premium Silk Kurta Pajama',
    category: 'Kurta Pajama',
    fabric: 'Pure Silk',
    occasions: ['Mehndi', 'Haldi', 'Casual'],
    description: 'Luxurious pure silk kurta with subtle self-print and straight-cut pajama. Comfort meets elegance — ideal for daytime wedding functions.',
    price: 3499,
    sizes: ['S','M','L','XL','XXL','XXXL'],
    colors: ['Pastel Pink','Mint Green','Peach','Sky Blue','Butter Yellow'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1604652716175-25a82e9b9a48?w=600&q=80'],
    status: 'active',
    isNew: false,
    featured: false,
    emoji: '👘',
    createdAt: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 'svg6',
    name: 'Indo-Western Velvet Jacket',
    category: 'Indo-Western',
    fabric: 'Velvet & Silk',
    occasions: ['Cocktail', 'Reception'],
    description: 'Contemporary sherwani-style jacket with a modern silhouette. Velvet lapels, silk body, slim fit. Where tradition meets fashion week.',
    price: 9999,
    sizes: ['38','40','42','44','46'],
    colors: ['Emerald Velvet','Midnight Blue','Deep Burgundy'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80'],
    status: 'active',
    isNew: true,
    featured: true,
    emoji: '💎',
    createdAt: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 'svg7',
    name: 'Traditional Achkan Set',
    category: 'Achkan',
    fabric: 'Cotton Silk',
    occasions: ['All Wedding Functions'],
    description: 'Traditional achkan with closed neck, knee-length cut and side slits. Full 3-piece set with matching pajama and stole. Regal, versatile, timeless.',
    price: 6499,
    sizes: ['38','40','42','44','46','48'],
    colors: ['Cream','Shahi White','Light Gold'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1595341595379-cf1cd0ed7ad1?w=600&q=80'],
    status: 'active',
    isNew: false,
    featured: false,
    emoji: '🏛️',
    createdAt: new Date(Date.now() - 518400000).toISOString()
  },
  {
    id: 'svg8',
    name: 'Designer Heavy Sherwani',
    category: 'Sherwani',
    fabric: 'Georgette & Net',
    occasions: ['Baraat', 'Reception'],
    price: 0,
    contact: true,
    description: 'Fully embroidered designer sherwani with heavy stone and sequin work. Matching dupatta and churidar included. Customization available in color and size.',
    sizes: ['Custom'],
    colors: ['Custom on Request'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1583391734000-cb67d17c8c03?w=600&q=80'],
    status: 'active',
    isNew: false,
    featured: false,
    emoji: '👑',
    createdAt: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: 'svg9',
    name: 'Festive Kurta Churidar',
    category: 'Kurta Pajama',
    fabric: 'Cotton Blend',
    occasions: ['Haldi', 'Mehndi', 'Casual'],
    description: 'Lightweight festive kurta with churidar and dupatta. Subtle block print with contrast piping. Cool, comfortable, stylish for outdoor functions.',
    price: 2199,
    sizes: ['S','M','L','XL','XXL'],
    colors: ['Saffron','Terracotta','Olive','Mustard'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1615886753866-39fc9aa6b1d4?w=600&q=80'],
    status: 'active',
    isNew: true,
    featured: false,
    emoji: '🌿',
    createdAt: new Date(Date.now() - 691200000).toISOString()
  },
  {
    id: 'svg10',
    name: 'Luxury 3-Piece Wedding Suit',
    category: 'Wedding Suit',
    fabric: 'Italian Wool Blend',
    occasions: ['Reception', 'Post-Wedding'],
    description: 'Sharp 3-piece wedding suit in premium Italian wool blend. Slim lapels, structured shoulders, contrast vest. For the groom who carries elegance beyond the wedding day.',
    price: 15999,
    sizes: ['38','40','42','44','46'],
    colors: ['Charcoal Black','Navy Blue','Dark Burgundy'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&q=80'],
    status: 'active',
    isNew: true,
    featured: true,
    emoji: '🤵',
    createdAt: new Date(Date.now() - 777600000).toISOString()
  },
  {
    id: 'svg11',
    name: 'Bandhgala Ceremonial Coat',
    category: 'Bandhgala',
    fabric: 'Dupion Silk',
    occasions: ['Wedding', 'Formal'],
    description: 'Elegant bandhgala coat in dupion silk with contrast piping along collar and placket. Worn over kurta for a commanding ceremonial look.',
    price: 8999,
    sizes: ['38','40','42','44','46','48'],
    colors: ['Champagne','Ivory','Pale Gold','Dusty Rose'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80'],
    status: 'active',
    isNew: false,
    featured: false,
    emoji: '🪡',
    createdAt: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: 'svg12',
    name: 'Printed Silk Kurta Set',
    category: 'Kurta Pajama',
    fabric: 'Modal Silk',
    occasions: ['Sangeet', 'Casual'],
    description: "Vibrant printed modal silk kurta with matching pants. Contemporary patterns, relaxed fit, premium feel. The modern groom's off-duty essential.",
    price: 1999,
    sizes: ['S','M','L','XL','XXL'],
    colors: ['Indigo Print','Rust Print','Teal Print'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
    status: 'active',
    isNew: true,
    featured: false,
    emoji: '🎋',
    createdAt: new Date(Date.now() - 950400000).toISOString()
  }
];

const STORAGE_KEY = 'svg_grooms_products';

const getMockProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Local storage parse error:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
  return mockProducts;
};

const saveMockProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProducts = async (includeHidden = false) => {
  if (isMockMode) {
    return new Promise(resolve => setTimeout(() => {
      let products = getMockProducts();
      if (!includeHidden) {
        products = products.filter(p => p.status === 'active');
      }
      resolve(products);
    }, 600));
  }

  try {
    const fetchDocs = getDocs(collection(db, 'products'));
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000));
    const querySnapshot = await Promise.race([fetchDocs, timeout]);
    let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (!includeHidden) products = products.filter(p => p.status === 'active');
    return products;
  } catch (error) {
    console.warn('Firebase fetch failed, using mock data.', error);
    let products = getMockProducts();
    if (!includeHidden) products = products.filter(p => p.status === 'active');
    return products;
  }
};

export const getProductById = async (id) => {
  if (isMockMode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = getMockProducts().find(p => p.id === id);
        if (product) resolve(product);
        else reject(new Error('Product not found'));
      }, 400);
    });
  }

  try {
    const docRef = doc(db, 'products', id);
    const fetchDoc = getDoc(docRef);
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000));
    const docSnap = await Promise.race([fetchDoc, timeout]);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    throw new Error('No such product!');
  } catch (error) {
    console.warn('Firebase fetch failed, using mock data.', error);
    const product = getMockProducts().find(p => p.id === id);
    if (product) return product;
    throw new Error('Product not found');
  }
};

export const addProduct = async (productData) => {
  if (isMockMode) {
    return new Promise(resolve => {
      setTimeout(() => {
        const products = getMockProducts();
        const newProduct = { ...productData, id: `prod_${Date.now()}`, createdAt: new Date().toISOString(), status: 'active' };
        saveMockProducts([newProduct, ...products]);
        resolve(newProduct);
      }, 600);
    });
  }
};

export const updateProduct = async (id, updates) => {
  if (isMockMode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let products = getMockProducts();
        const index = products.findIndex(p => p.id === id);
        if (index > -1) {
          products[index] = { ...products[index], ...updates };
          saveMockProducts(products);
          resolve(products[index]);
        } else {
          reject(new Error('Product not found'));
        }
      }, 400);
    });
  }
};

export const deleteProduct = async (id) => {
  if (isMockMode) {
    return new Promise(resolve => {
      setTimeout(() => {
        let products = getMockProducts();
        products = products.filter(p => p.id !== id);
        saveMockProducts(products);
        resolve(true);
      }, 300);
    });
  }
};
