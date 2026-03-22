import { isMockMode, db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Mock data for initial review (Phase 2 upgrades)
const mockProducts = [
  {
    id: 'svg1',
    name: 'Classic White Linen Mens Shirt',
    category: 'Mens Shirts',
    fabric: 'Linen',
    occasions: ['Formal', 'Casual'],
    description: 'A breathable classic white linen shirt for men. Perfect for summer days and evening resort wear.',
    price: 850,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Navy'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1596455607563-ad6193f76b17?w=600&q=80'],
    status: 'active',
    isNew: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg2',
    name: 'Groomsmen Special Silk Blend Kurta Set',
    category: 'Mens Kurta',
    fabric: 'Silk Blend',
    occasions: ['Wedding', 'Party'],
    description: 'Elegant silk blend kurta set with subtle zari work on the collar. Paired with comfortable churidar.',
    price: 1850,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Mustard', 'Ivory', 'Emerald'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1628102491629-77858ab57202?w=600&q=80'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg3',
    name: 'Premium Chino Trousers (Olive)',
    category: 'Mens Trousers',
    fabric: 'Cotton Blend',
    occasions: ['Casual', 'Formal'],
    description: 'Slim-fit cotton chino trousers with a slight stretch for all-day comfort. Available in multiple versatile colors.',
    price: 950,
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Olive', 'Khaki', 'Navy'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg4',
    name: 'Jaipuri Print Pure Cotton Suit Set',
    category: 'Ladies Suits',
    fabric: 'Pure Cotton',
    occasions: ['Daily', 'Casual'],
    description: 'Comfortable 3-piece pure cotton suit set featuring authentic Jaipuri block prints and a malmal dupatta.',
    price: 1250,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Indigo', 'Crimson'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
    status: 'active',
    isNew: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg5',
    name: 'Designer Party Wear Anarkali Kurti',
    category: 'Ladies Kurti',
    fabric: 'Rayon',
    occasions: ['Party', 'Wedding'],
    description: 'Floor-length flared Anarkali kurti with heavy gota patti work on the yoke and border.',
    price: 1650,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Wine', 'Emerald', 'Mustard'],
    stock: 'low_stock',
    images: ['https://images.unsplash.com/photo-1583391733958-d25e07fac0ce?w=600&q=80'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg6',
    name: 'Boys Festive Waistcoat & Kurta Set',
    category: 'Kids Boys',
    fabric: 'Silk Blend',
    occasions: ['Wedding', 'Festival'],
    description: 'Cute and comfortable 3-piece traditional set for boys. Includes cotton kurta, pyjama, and a printed silk jacket.',
    price: 1100,
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Mustard', 'Navy'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1549488344-c1fb6839bb9b?w=600&q=80'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg7',
    name: 'Girls Sequin Embellished Lehenga Choli',
    category: 'Kids Girls',
    fabric: 'Georgette',
    occasions: ['Wedding', 'Party'],
    description: 'Lightweight flowy lehenga with sequence work choli, perfect for twirling at family weddings.',
    price: 1450,
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['Rose Gold', 'Sage'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80'],
    status: 'active',
    isNew: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg8',
    name: 'Wholesale: Assorted Mens Check Shirts (Combo of 10)',
    category: 'Wholesale Lot',
    fabric: 'Cotton Blend',
    occasions: ['Wholesale'],
    description: 'A wholesale bundle of 10 high-quality men\'s casual check shirts in assorted colors and standard size ratios.',
    price: 4500,
    sizes: ['Combo'],
    colors: ['Assorted'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg9',
    name: 'Wholesale: Daily Wear Cotton Kurtis (Bulk of 20)',
    category: 'Wholesale Lot',
    fabric: 'Pure Cotton',
    occasions: ['Wholesale'],
    description: 'Fast-moving daily wear cotton kurtis straight from the manufacturer. Pack of 20 pieces in mixed prints.',
    price: 7000,
    sizes: ['Combo'],
    colors: ['Assorted'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg10',
    name: 'Classic Blue Slim Fit Denim',
    category: 'Mens Trousers',
    fabric: 'Denim',
    occasions: ['Casual', 'Daily'],
    description: 'Everyday classic blue jeans with a comfortable stretch and slim fit construction.',
    price: 1050,
    sizes: ['30', '32', '34', '36'],
    colors: ['Navy', 'Black'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1542272604-780c96850d76?w=600&q=80'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg11',
    name: 'Office Wear Formal Chiffon Saree',
    category: 'Ladies Suits',
    fabric: 'Chiffon',
    occasions: ['Formal', 'Office'],
    description: 'Lightweight elegant chiffon saree with minimal border work, suitable for formal wear and office settings.',
    price: 1150,
    sizes: ['Free Size'],
    colors: ['Teal', 'Navy'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1620862551532-68045fb9fbd8?w=600&q=80'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'svg12',
    name: 'Boys Graphic Print T-Shirt & Shorts Combo',
    category: 'Kids Boys',
    fabric: 'Hosiery',
    occasions: ['Casual', 'Daily'],
    description: 'Soft hosiery cotton casual sets for active toddlers. Easy to wash and maintain.',
    price: 450,
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    colors: ['Multi'],
    stock: 'in_stock',
    images: ['https://images.unsplash.com/photo-1519238396081-01f654b9d0b5?w=600&q=80'],
    status: 'active',
    isNew: true,
    createdAt: new Date().toISOString()
  }
];

const getMockProducts = () => {
  try {
    const stored = localStorage.getItem('tr_traders_products');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Local storage parse error:", e);
  }
  
  localStorage.setItem('tr_traders_products', JSON.stringify(mockProducts));
  return mockProducts;
};

const saveMockProducts = (products) => {
  localStorage.setItem('tr_traders_products', JSON.stringify(products));
};

export const getProducts = async (includeHidden = false) => {
  if (isMockMode) {
    return new Promise(resolve => setTimeout(() => {
      let products = getMockProducts();
      if (!includeHidden) {
        products = products.filter(p => p.status === 'active');
      }
      resolve(products);
    }, 800));
  }
  
  try {
    // 5-second timeout for Firebase connection hangs
    const fetchDocs = getDocs(collection(db, "products"));
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000));
    
    const querySnapshot = await Promise.race([fetchDocs, timeout]);
    
    let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (!includeHidden) {
      products = products.filter(p => p.status === 'active');
    }
    return products;
  } catch (error) {
    console.warn("Firebase fetch failed or timed out. Falling back to mock data.", error);
    let products = getMockProducts();
    if (!includeHidden) {
      products = products.filter(p => p.status === 'active');
    }
    return products;
  }
};

export const getProductById = async (id) => {
  if (isMockMode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = getMockProducts().find(p => p.id === id);
        if (product) resolve(product);
        else reject(new Error("Product not found"));
      }, 500);
    });
  }

  try {
    const docRef = doc(db, "products", id);
    const fetchDoc = getDoc(docRef);
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000));
    
    const docSnap = await Promise.race([fetchDoc, timeout]);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such product!");
    }
  } catch (error) {
    console.warn("Firebase fetch failed or timed out. Falling back to mock data.", error);
    const product = getMockProducts().find(p => p.id === id);
    if (product) return product;
    throw new Error("Product not found");
  }
};

export const addProduct = async (productData) => {
  if (isMockMode) {
    return new Promise(resolve => {
      setTimeout(() => {
        const products = getMockProducts();
        const newProduct = { ...productData, id: `prod_${Date.now()}`, createdAt: new Date().toISOString() };
        saveMockProducts([newProduct, ...products]);
        resolve(newProduct);
      }, 800);
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
          reject(new Error("Product not found"));
        }
      }, 500);
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
