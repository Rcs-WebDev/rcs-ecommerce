CREATE TABLE IF NOT EXISTS product_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL UNIQUE,
    description TEXT,
    specifications TEXT,
    colors TEXT,       -- Disimpan sebagai format JSON Array: '["Petrol Blue", "Hitam Jet Black", "Hijau Army"]'
    sizes TEXT,        -- Disimpan sebagai format JSON Array: '["M", "L", "XL", "XXL"]'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);