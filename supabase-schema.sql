-- Supabase veritabanı şeması
-- Bu SQL komutlarını Supabase Dashboard > SQL Editor'da çalıştır

-- Users tablosu
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    public_key VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    avatar TEXT,
    total_purchases INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    first_purchase TIMESTAMP WITH TIME ZONE,
    last_purchase TIMESTAMP WITH TIME ZONE,
    notifications BOOLEAN DEFAULT true,
    newsletter BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products tablosu
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL,
    features TEXT[],
    category VARCHAR(50) NOT NULL CHECK (category IN ('chicken', 'duck', 'cow', 'goose', 'turkey', 'sheep', 'pig')),
    stock INTEGER DEFAULT 100 CHECK (stock >= 0),
    is_active BOOLEAN DEFAULT true,
    image_url TEXT DEFAULT '',
    color VARCHAR(20),
    bg_color VARCHAR(20),
    border_color VARCHAR(20),
    tier INTEGER DEFAULT 1,
    reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders tablosu
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_wallet_address VARCHAR(255) NOT NULL,
    user_public_key VARCHAR(255) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(100) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    product_emoji VARCHAR(10) NOT NULL,
    transaction_signature VARCHAR(255) UNIQUE NOT NULL,
    transaction_amount DECIMAL(10,2) NOT NULL,
    transaction_status VARCHAR(20) DEFAULT 'pending' CHECK (transaction_status IN ('pending', 'confirmed', 'failed')),
    transaction_block_time TIMESTAMP WITH TIME ZONE,
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'completed', 'cancelled', 'failed')),
    solana_network VARCHAR(20) DEFAULT 'devnet' CHECK (solana_network IN ('devnet', 'testnet', 'mainnet-beta')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_total_purchases ON users(total_purchases DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category, is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_wallet ON orders(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_signature ON orders(transaction_signature);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(order_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_status ON orders(transaction_status);

-- RLS (Row Level Security) politikaları
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Herkes products tablosunu okuyabilir
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Herkes orders oluşturabilir
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Kullanıcılar kendi order'larını görebilir
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (true);

-- Herkes user oluşturabilir
CREATE POLICY "Anyone can create users" ON users
    FOR INSERT WITH CHECK (true);

-- Kullanıcılar kendi bilgilerini güncelleyebilir
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true);

-- Örnek veri ekleme
INSERT INTO products (name, emoji, price, description, category, tier, reward) VALUES
('Chicken', '🐔', 0.01, 'Basic chicken for farming', 'chicken', 1, 500),
('Chicken', '🐔', 0.02, 'Advanced chicken for farming', 'chicken', 2, 750),
('Chicken', '🐔', 0.03, 'Premium chicken for farming', 'chicken', 3, 1000),
('Duck', '🦆', 0.015, 'Basic duck for farming', 'duck', 1, 500),
('Duck', '🦆', 0.025, 'Advanced duck for farming', 'duck', 2, 750),
('Duck', '🦆', 0.035, 'Premium duck for farming', 'duck', 3, 1000),
('Cow', '🐮', 0.05, 'Basic cow for farming', 'cow', 1, 500),
('Cow', '🐮', 0.07, 'Advanced cow for farming', 'cow', 2, 750),
('Cow', '🐮', 0.1, 'Premium cow for farming', 'cow', 3, 1000)
ON CONFLICT DO NOTHING;
