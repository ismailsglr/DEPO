const express = require('express');
const supabase = require('../supabase.cjs');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
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
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
});

// Get orders by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
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
      .eq('user_wallet_address', req.params.walletAddress)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user orders', message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: order, error } = await supabase
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
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { user, productId, transactionSignature, amount } = req.body;

    // Validate product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if transaction signature already exists
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('transaction_signature', transactionSignature)
      .single();
    
    if (existingOrder) {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    // Create or update user
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', user.walletAddress)
      .single();

    let userId;
    if (!existingUser) {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          wallet_address: user.walletAddress,
          public_key: user.publicKey,
          total_purchases: 1,
          total_spent: amount,
          first_purchase: new Date().toISOString(),
          last_purchase: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (userError) throw userError;
      userId = newUser.id;
    } else {
      // Update existing user stats
      const { error: updateError } = await supabase
        .from('users')
        .update({
          total_purchases: existingUser.total_purchases + 1,
          total_spent: existingUser.total_spent + amount,
          last_purchase: new Date().toISOString()
        })
        .eq('id', existingUser.id);
      
      if (updateError) throw updateError;
      userId = existingUser.id;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        user_wallet_address: user.walletAddress,
        user_public_key: user.publicKey,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_emoji: product.emoji,
        transaction_signature: transactionSignature,
        transaction_amount: amount,
        transaction_status: 'confirmed',
        order_status: 'completed'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Update product stock
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: Math.max(0, product.stock - 1) })
      .eq('id', productId);

    if (stockError) throw stockError;

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order', message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status', message: error.message });
  }
});

// Get order statistics
router.get('/stats/overview', async (req, res) => {
  try {
    // Get total orders and revenue
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('transaction_amount, order_status');
    
    if (ordersError) throw ordersError;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.transaction_amount), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get status breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.order_status] = (acc[order.order_status] || 0) + 1;
      return acc;
    }, {});

    // Get recent orders
    const { data: recentOrders, error: recentError } = await supabase
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
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    res.json({
      overview: { totalOrders, totalRevenue, averageOrderValue },
      statusBreakdown,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order statistics', message: error.message });
  }
});

// Get orders by date range
router.get('/stats/date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = supabase.from('orders').select(`
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
    `);

    if (startDate && endDate) {
      query = query
        .gte('created_at', startDate)
        .lte('created_at', endDate);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate daily stats
    const dailyStats = orders.reduce((acc, order) => {
      const date = order.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { count: 0, revenue: 0 };
      }
      acc[date].count += 1;
      acc[date].revenue += parseFloat(order.transaction_amount);
      return acc;
    }, {});

    const dailyStatsArray = Object.entries(dailyStats).map(([date, stats]) => ({
      _id: date,
      count: stats.count,
      revenue: stats.revenue
    })).sort((a, b) => a._id.localeCompare(b._id));

    res.json({
      orders,
      dailyStats: dailyStatsArray
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by date range', message: error.message });
  }
});

module.exports = router; 