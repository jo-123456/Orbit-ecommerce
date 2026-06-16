// Run with: npm run seed
// Wipes existing products/users and inserts demo data, including an admin login.
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  { name: 'AeroBuds Pro', description: 'Wireless earbuds with active noise cancellation and a 30-hour battery.', price: 2999, category: 'Audio', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop', stock: 25, rating: 4.6 },
  { name: 'Resonance Mini Speaker', description: 'Pocket-sized Bluetooth speaker with surprisingly deep bass.', price: 1799, category: 'Audio', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', stock: 40, rating: 4.4 },
  { name: 'Pulse Fitness Band', description: 'Tracks heart rate, sleep, and steps with a 10-day battery life.', price: 2199, category: 'Wearables', image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop', stock: 30, rating: 4.3 },
  { name: 'Orbit Smartwatch', description: 'AMOLED display, GPS, and 100+ workout modes.', price: 5499, category: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', stock: 18, rating: 4.7 },
  { name: 'Lumen Smart Bulb (Pack of 2)', description: 'Wi-Fi color bulbs that work with voice assistants.', price: 1299, category: 'Smart Home', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', stock: 50, rating: 4.2 },
  { name: 'NestCam Indoor', description: '1080p indoor security camera with night vision and motion alerts.', price: 2499, category: 'Smart Home', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop', stock: 22, rating: 4.5 },
  { name: 'DriftBook Air 14"', description: 'Lightweight ultrabook with all-day battery for study and work.', price: 54999, category: 'Computing', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', stock: 8, rating: 4.8 },
  { name: 'KeyForge Mechanical Keyboard', description: 'Hot-swappable switches with per-key RGB lighting.', price: 3499, category: 'Computing', image: 'https://images.unsplash.com/photo-1601445638532-3ef6a89dc6f0?w=600&h=600&fit=crop', stock: 35, rating: 4.6 },
  { name: 'Glide Wireless Mouse', description: 'Ergonomic wireless mouse with silent clicks.', price: 999, category: 'Computing', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop', stock: 60, rating: 4.1 },
  { name: 'VoltCharge 65W GaN Charger', description: 'Compact fast charger for laptops and phones alike.', price: 1599, category: 'Accessories', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop', stock: 45, rating: 4.5 },
  { name: 'ShieldCase Phone Cover', description: 'Drop-tested protective case with raised camera bumper.', price: 499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop', stock: 100, rating: 4.0 },
  { name: 'CarryAll Tech Backpack', description: 'Padded laptop compartment with daily-carry organization.', price: 2299, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', stock: 27, rating: 4.4 },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected. Seeding...');

    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products.`);

    await User.deleteMany({ email: { $in: ['admin@orbit.com', 'user@orbit.com'] } });
    await User.create({ name: 'Admin', email: 'admin@orbit.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Demo User', email: 'user@orbit.com', password: 'user1234', role: 'user' });
    console.log('Demo accounts ready -> admin@orbit.com / admin123 (admin), user@orbit.com / user1234 (user)');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

run();