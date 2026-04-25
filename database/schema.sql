-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL, -- { "ar": "...", "en": "..." }
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name JSONB NOT NULL, -- { "ar": "...", "en": "..." }
    description JSONB NOT NULL, -- { "ar": "...", "en": "..." }
    slug TEXT UNIQUE NOT NULL,
    price NUMERIC(10, 2),
    image_url TEXT,
    images TEXT[] DEFAULT '{}', -- Gallery images
    specs JSONB DEFAULT '{}', -- { "origin": "...", "color": "...", "moisture": "...", "purity": "...", "size": "..." }
    uses JSONB DEFAULT '{}', -- { "ar": "...", "en": "..." }
    benefits JSONB DEFAULT '{}', -- { "ar": "...", "en": "..." }
    packaging JSONB DEFAULT '{}', -- { "ar": "...", "en": "..." }
    origin TEXT DEFAULT 'Egypt',
    meta_title JSONB, -- { "ar": "...", "en": "..." }
    meta_description JSONB, -- { "ar": "...", "en": "..." }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS product_views (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Hashed
    role TEXT DEFAULT 'editor', -- 'admin', 'editor'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL,
    image_url TEXT NOT NULL,
    description JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    content JSONB NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    quantity TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, contacted, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Categories Seed
INSERT INTO categories (name, slug) VALUES 
('{"ar": "الأعشاب", "en": "Herbs"}', 'herbs'),
('{"ar": "البذور", "en": "Seeds"}', 'seeds'),
('{"ar": "التوابل", "en": "Spices"}', 'spices'),
('{"ar": "الخضروات المجففة", "en": "Dehydrated Vegetables"}', 'dehydrated')
ON CONFLICT (slug) DO NOTHING;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
