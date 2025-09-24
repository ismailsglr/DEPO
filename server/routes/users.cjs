const express = require('express');
const supabase = require('../supabase.cjs');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// Get user by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', req.params.walletAddress)
      .single();
    
    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// Create or update user
router.post('/', async (req, res) => {
  try {
    const { walletAddress, publicKey, profile } = req.body;
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    let user;
    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          public_key: publicKey,
          username: profile?.username || existingUser.username,
          avatar: profile?.avatar || existingUser.avatar
        })
        .eq('id', existingUser.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      user = updatedUser;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          wallet_address: walletAddress,
          public_key: publicKey,
          username: profile?.username,
          avatar: profile?.avatar
        }])
        .select()
        .single();
      
      if (createError) throw createError;
      user = newUser;
    }
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create/update user', message: error.message });
  }
});

// Update user profile
router.patch('/:id/profile', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        username: req.body.username,
        avatar: req.body.avatar
      })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user profile', message: error.message });
  }
});

// Update user preferences
router.patch('/:id/preferences', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        notifications: req.body.notifications,
        newsletter: req.body.newsletter
      })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user preferences', message: error.message });
  }
});

// Get user orders
router.get('/:id/orders', async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('id', req.params.id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        products:product_id (
          id,
          name,
          emoji,
          price,
          category,
          tier,
          reward
        )
      `)
      .eq('user_wallet_address', user.wallet_address)
      .order('created_at', { ascending: false });
    
    if (ordersError) throw ordersError;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user orders', message: error.message });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('id', req.params.id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('transaction_amount, created_at')
      .eq('user_wallet_address', user.wallet_address);
    
    if (ordersError) throw ordersError;
    
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.transaction_amount), 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + parseFloat(order.transaction_amount), 0) / orders.length : 0,
      firstOrder: orders.length > 0 ? Math.min(...orders.map(o => new Date(o.created_at))) : null,
      lastOrder: orders.length > 0 ? Math.max(...orders.map(o => new Date(o.created_at))) : null
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user statistics', message: error.message });
  }
});

// Get top users by purchases
router.get('/stats/top-buyers', async (req, res) => {
  try {
    const { data: topBuyers, error } = await supabase
      .from('users')
      .select('*')
      .limit(10);
    
    if (error) throw error;
    res.json(topBuyers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top buyers', message: error.message });
  }
});

// Deactivate user
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to deactivate user', message: error.message });
  }
});

// Reactivate user
router.patch('/:id/reactivate', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to reactivate user', message: error.message });
  }
});

// Kullanıcının ödüllerini hesaplar ve toplar
router.post('/wallet/:walletAddress/claim-rewards', async (req, res) => {
  const { walletAddress } = req.params;

  try {
    // 1. Kullanıcıyı bul
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, coins, last_claimed_at')
      .eq('wallet_address', walletAddress)
      .single();

    if (userError || !user) {
      console.error('Kullanıcı bulunamadı:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    const lastClaimedAt = user.last_claimed_at ? new Date(user.last_claimed_at) : new Date(0);

    // 2. Kullanıcının tüm siparişlerini ve ürün detaylarını çek
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        created_at,
        products:product_id (
          reward
        )
      `)
      .eq('user_wallet_address', walletAddress)
      .order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    let totalRewards = 0;
    const now = new Date();

    // 3. Her bir sipariş için birikmiş ödülü hesapla
    orders.forEach(order => {
      const orderCreatedAt = new Date(order.created_at);
      const rewardRate = order.products.reward;

      // Ödül hesaplama süresini belirle (son talepten veya siparişin oluşturulma anından itibaren)
      const startTime = orderCreatedAt > lastClaimedAt ? orderCreatedAt : lastClaimedAt;
      const elapsedTimeInMs = now - startTime;
      const elapsedTimeInHours = elapsedTimeInMs / (1000 * 60 * 60);

      if (elapsedTimeInHours > 0) {
        totalRewards += rewardRate * elapsedTimeInHours;
      }
    });

    // 4. Kullanıcının coins bakiyesini güncelle ve son talep zamanını kaydet
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        coins: user.coins + Math.floor(totalRewards),
        last_claimed_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ claimedAmount: Math.floor(totalRewards), newCoinBalance: updatedUser.coins });
  } catch (error) {
    console.error('Ödül talep etme hatası:', error);
    res.status(500).json({ error: 'Failed to claim rewards', message: error.message });
  }
});

// Kullanıcının toplam harcama ve satın alma istatistiklerini günceller
router.patch('/wallet/:walletAddress/stats', async (req, res) => {
  const { walletAddress } = req.params;
  const { amount } = req.body;

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, total_spent, total_purchases')
      .eq('wallet_address', walletAddress)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newTotalSpent = (user.total_spent || 0) + parseFloat(amount);
    const newTotalPurchases = (user.total_purchases || 0) + 1;

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        total_spent: newTotalSpent,
        total_purchases: newTotalPurchases,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(updatedUser);
  } catch (error) {
    console.error('Kullanıcı istatistiklerini güncelleme hatası:', error);
    res.status(500).json({ error: 'Failed to update user stats', message: error.message });
  }
});

module.exports = router;