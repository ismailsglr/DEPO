const express = require('express');
const supabase = require('../supabase.cjs');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', message: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by category', message: error.message });
  }
});

// Create new product (Admin only)
router.post('/', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product', message: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product', message: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', message: error.message });
  }
});

// Initialize default products
router.post('/initialize', async (req, res) => {
  try {
    const defaultProducts = [
      {
        name: 'Chicken',
        emoji: '🐔',
        price: 0.01,
        description: 'Fresh farm chicken, perfect for your farm.',
        features: ['Fresh', 'Healthy', 'Organic'],
        category: 'chicken',
        stock: 100,
        tier: 1,
        reward: 500,
        color: 'from-yellow-400 to-orange-500',
        bg_color: 'bg-yellow-500/10',
        border_color: 'border-yellow-500/20'
      },
      {
        name: 'Chicken',
        emoji: '🐔',
        price: 0.02,
        description: 'Advanced chicken for farming.',
        features: ['Advanced', 'Healthy', 'Organic'],
        category: 'chicken',
        stock: 100,
        tier: 2,
        reward: 750,
        color: 'from-yellow-400 to-orange-500',
        bg_color: 'bg-yellow-500/10',
        border_color: 'border-yellow-500/20'
      },
      {
        name: 'Chicken',
        emoji: '🐔',
        price: 0.03,
        description: 'Premium chicken for farming.',
        features: ['Premium', 'Healthy', 'Organic'],
        category: 'chicken',
        stock: 100,
        tier: 3,
        reward: 1000,
        color: 'from-yellow-400 to-orange-500',
        bg_color: 'bg-yellow-500/10',
        border_color: 'border-yellow-500/20'
      },
      {
        name: 'Duck',
        emoji: '🦆',
        price: 0.015,
        description: 'Fresh farm duck, perfect for your farm.',
        features: ['Fresh', 'Healthy', 'Organic'],
        category: 'duck',
        stock: 100,
        tier: 1,
        reward: 500,
        color: 'from-gray-400 to-blue-500',
        bg_color: 'bg-blue-500/10',
        border_color: 'border-blue-500/20'
      },
      {
        name: 'Duck',
        emoji: '🦆',
        price: 0.025,
        description: 'Advanced duck for farming.',
        features: ['Advanced', 'Healthy', 'Organic'],
        category: 'duck',
        stock: 100,
        tier: 2,
        reward: 750,
        color: 'from-gray-400 to-blue-500',
        bg_color: 'bg-blue-500/10',
        border_color: 'border-blue-500/20'
      },
      {
        name: 'Duck',
        emoji: '🦆',
        price: 0.035,
        description: 'Premium duck for farming.',
        features: ['Premium', 'Healthy', 'Organic'],
        category: 'duck',
        stock: 100,
        tier: 3,
        reward: 1000,
        color: 'from-gray-400 to-blue-500',
        bg_color: 'bg-blue-500/10',
        border_color: 'border-blue-500/20'
      },
      {
        name: 'Cow',
        emoji: '🐮',
        price: 0.05,
        description: 'Fresh farm cow, perfect for your farm.',
        features: ['Fresh', 'Healthy', 'Organic'],
        category: 'cow',
        stock: 100,
        tier: 1,
        reward: 500,
        color: 'from-brown-400 to-red-500',
        bg_color: 'bg-red-500/10',
        border_color: 'border-red-500/20'
      },
      {
        name: 'Cow',
        emoji: '🐮',
        price: 0.07,
        description: 'Advanced cow for farming.',
        features: ['Advanced', 'Healthy', 'Organic'],
        category: 'cow',
        stock: 100,
        tier: 2,
        reward: 750,
        color: 'from-brown-400 to-red-500',
        bg_color: 'bg-red-500/10',
        border_color: 'border-red-500/20'
      },
      {
        name: 'Cow',
        emoji: '🐮',
        price: 0.1,
        description: 'Premium cow for farming.',
        features: ['Premium', 'Healthy', 'Organic'],
        category: 'cow',
        stock: 100,
        tier: 3,
        reward: 1000,
        color: 'from-brown-400 to-red-500',
        bg_color: 'bg-red-500/10',
        border_color: 'border-red-500/20'
      }
    ];

    // Clear existing products and insert defaults
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { data: products, error } = await supabase
      .from('products')
      .insert(defaultProducts)
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ 
      message: 'Default products initialized successfully',
      products 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize products', message: error.message });
  }
});

module.exports = router; 