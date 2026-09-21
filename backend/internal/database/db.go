package database

import (
	"log"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

type User struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `gorm:"not null"`
	Email     string    `gorm:"uniqueIndex;not null"`
	Password  string    `gorm:"not null"`
	CreatedAt time.Time
}

type Product struct {
	ID          uint    `gorm:"primaryKey"`
	Name        string  `gorm:"not null"`
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"type:real;not null"`
	Stock       int32   `gorm:"not null"`
	ImageURL    string  `gorm:"type:text"`
	Category    string  `gorm:"type:text;not null;default:'computers'"`
}

type CartItem struct {
	ID        uint    `gorm:"primaryKey"`
	UserID    uint    `gorm:"index;not null"`
	ProductID uint    `gorm:"not null"`
	Product   Product `gorm:"foreignKey:ProductID"`
	Quantity  int32   `gorm:"not null"`
}

type Order struct {
	ID          string      `gorm:"primaryKey;type:text"`
	UserID      uint        `gorm:"index;not null"`
	TotalAmount float64     `gorm:"type:real;not null"`
	Status      string      `gorm:"type:text;default:'pending'"` // pending, paid, settlement, expire, cancel
	SnapToken   string      `gorm:"type:text"`
	CreatedAt   time.Time
	OrderItems  []OrderItem `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE"`
}

type OrderItem struct {
	ID        uint    `gorm:"primaryKey"`
	OrderID   string  `gorm:"index;not null"`
	ProductID uint    `gorm:"not null"`
	Product   Product `gorm:"foreignKey:ProductID"`
	Quantity  int32   `gorm:"not null"`
	Price     float64 `gorm:"type:real;not null"`
}

func InitDB(dbPath string) {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto migrate schemas
	err = DB.AutoMigrate(&User{}, &Product{}, &CartItem{}, &Order{}, &OrderItem{})
	if err != nil {
		log.Fatalf("Failed to auto migrate database schemas: %v", err)
	}

	// Seed products if database is empty or outdated
	seedProducts()
}

func seedProducts() {
	var count int64
	DB.Model(&Product{}).Count(&count)
	if count >= 40 {
		return
	}

	// Clear older seed data if incomplete to ensure clean state
	if count > 0 {
		DB.Exec("DELETE FROM products")
	}

	products := []Product{
		{
			Name:        "NVIDIA RTX 4080 Super Gaming OC 16GB",
			Description: "VGA Komponen PC Ultra High Performance untuk gaming & rendering 4K ray tracing.",
			Price:       18500000.0,
			Stock:       10,
			Category:    "computers",
			ImageURL:    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
		},
		{
			Name:        "Mechanical Custom Keyboard RGB Hot-Swap",
			Description: "Keyboard mechanical tactile switch dengan backlight RGB dinamis.",
			Price:       1250000.0,
			Stock:       50,
			Category:    "computers",
			ImageURL:    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
		},
		{
			Name:        "Curved Ultrawide Gaming Monitor 34\" 144Hz",
			Description: "Monitor lengkung QD-OLED resolusi WQHD 1ms response time.",
			Price:       7800000.0,
			Stock:       15,
			Category:    "computers",
			ImageURL:    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
		},
		{
			Name:        "SEENDA MOE300 Mouse Ergonomic Vertical Wireless Dual Mode",
			Description: "Mouse ergonomis vertikal nirkabel anti pegal tangan dengan dual mode bluetooth & 2.4G.",
			Price:       277920.0,
			Stock:       100,
			Category:    "electronics",
			ImageURL:    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
		},
		{
			Name:        "Wireless ANC Gaming Headphones 7.1",
			Description: "Headset nirkabel dengan Active Noise Cancelling & mikrofon jernih.",
			Price:       1950000.0,
			Stock:       30,
			Category:    "electronics",
			ImageURL:    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
		},
		{
			Name:        "Smart TV 43 Inch 4K UHD HDR Android TV",
			Description: "TV pintar layar 4K UHD dengan sistem Android, Dolby Audio & Wi-Fi.",
			Price:       3850000.0,
			Stock:       20,
			Category:    "electronics",
			ImageURL:    "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500",
		},
		{
			Name:        "Powerbank Fast Charging 20000mAh Dual Output",
			Description: "Pengisi daya portabel kapasitas jumbo 20.000mAh dengan pengisian cepat Type-C.",
			Price:       299000.0,
			Stock:       60,
			Category:    "electronics",
			ImageURL:    "https://images.unsplash.com/photo-1609592424074-124b823e593e?w=500",
		},
		{
			Name:        "Laptop Gaming ROG Strix Intel Core i7 Gen 13",
			Description: "Laptop performa monster dengan prosesor Intel i7, RTX 4060 & layar 165Hz.",
			Price:       18990000.0,
			Stock:       12,
			Category:    "computers",
			ImageURL:    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
		},
		{
			Name:        "Heavyweight Cotton Oversized Hoodie - Black Edition",
			Description: "Hoodie pria & wanita bahan fleece premium 330gsm ultra nyaman.",
			Price:       450000.0,
			Stock:       40,
			Category:    "men-fashion",
			ImageURL:    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500",
		},
		{
			Name:        "Vintage Biker Leather Jacket Original",
			Description: "Jaket kulit sintetis premium gaya retro street fashion.",
			Price:       850000.0,
			Stock:       20,
			Category:    "men-fashion",
			ImageURL:    "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500",
		},
		{
			Name:        "Kemeja Flanel Casual Cotton Premium",
			Description: "Kemeja motif flanel kasual bahan 100% katun lembut & tidak panas.",
			Price:       285000.0,
			Stock:       45,
			Category:    "men-fashion",
			ImageURL:    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
		},
		{
			Name:        "Korean Elegance Blazer Jacket Suede - Cream",
			Description: "Blazer wanita gaya Korea modern cocok untuk casual & formal.",
			Price:       520000.0,
			Stock:       25,
			Category:    "women-fashion",
			ImageURL:    "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=500",
		},
		{
			Name:        "Dress Casual Floral Satin Premium",
			Description: "Gaun wanita motif bunga elegan bahan satin halus untuk pesta & hangout.",
			Price:       395000.0,
			Stock:       30,
			Category:    "women-fashion",
			ImageURL:    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
		},
		{
			Name:        "Cardigan Rajut Oversize Style Korea",
			Description: "Sweater cardigan rajut tebal wanita gaya ala drama Korea.",
			Price:       245000.0,
			Stock:       35,
			Category:    "women-fashion",
			ImageURL:    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
		},
		{
			Name:        "Retro Low Streetwear Sneakers Unisex",
			Description: "Sepatu kets kasual bahan kulit asli dengan insole empuk ergonomis.",
			Price:       680000.0,
			Stock:       35,
			Category:    "shoes",
			ImageURL:    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
		},
		{
			Name:        "Sepatu Lari UltraBoost Cushioning Running",
			Description: "Sepatu olahraga lari ultra ringan dengan sol busa peredam benturan.",
			Price:       1150000.0,
			Stock:       25,
			Category:    "shoes",
			ImageURL:    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
		},
		{
			Name:        "Sepatu Formal Leather Oxford Shoes",
			Description: "Sepatu kerja pria bahan kulit asli berkualitas untuk acara formal.",
			Price:       790000.0,
			Stock:       20,
			Category:    "shoes",
			ImageURL:    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500",
		},
		{
			Name:        "Luxury Designer Leather Crossbody Handbag",
			Description: "Tas selempang wanita bahan kulit berkualitas dengan kompartemen luas.",
			Price:       1150000.0,
			Stock:       18,
			Category:    "bags",
			ImageURL:    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
		},
		{
			Name:        "Ransel Anti Air Laptop 15.6 Inch USB Port",
			Description: "Tas punggung ransel kerja & kuliah bahan waterproof dilengkapi slot charger USB.",
			Price:       349000.0,
			Stock:       40,
			Category:    "bags",
			ImageURL:    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
		},
		{
			Name:        "Dompet Kulit Asli Pria Slim RFID Blocking",
			Description: "Dompet saku pria lipat bahan kulit sapi asli dengan pengaman kartu RFID.",
			Price:       199000.0,
			Stock:       50,
			Category:    "bags",
			ImageURL:    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
		},
		{
			Name:        "Automatic Chronograph Stainless Steel Watch",
			Description: "Jam tangan pria waterproof 50m dengan kristal sapphire tahan gores.",
			Price:       1450000.0,
			Stock:       22,
			Category:    "watches",
			ImageURL:    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
		},
		{
			Name:        "Smartwatch AMOLED Heart Rate & SpO2 Tracker",
			Description: "Jam tangan pintar layar AMOLED dengan pemantau detak jantung & 100+ mode olahraga.",
			Price:       899000.0,
			Stock:       30,
			Category:    "watches",
			ImageURL:    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
		},
		{
			Name:        "Jam Tangan Minimalis Leather Strap Unisex",
			Description: "Jam tangan kasual tali kulit asli gaya simpel & elegan.",
			Price:       420000.0,
			Stock:       35,
			Category:    "watches",
			ImageURL:    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
		},
		{
			Name:        "Kopi Kenangan Special Arabica Blend 500g",
			Description: "Biji kopi sangrai khas Nusantara aromatis dengan rasa bold caramel.",
			Price:       120000.0,
			Stock:       80,
			Category:    "food",
			ImageURL:    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
		},
		{
			Name:        "Ceremonial Uji Matcha Powder Organic 100g",
			Description: "Bubuk hijau matcha murni impor Jepang mutu terbaik tanpa gula.",
			Price:       185000.0,
			Stock:       60,
			Category:    "food",
			ImageURL:    "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500",
		},
		{
			Name:        "Dark Artisan Gourmet Chocolate Gift Box",
			Description: "Kotak cokelat hitam olahan kakao lokal dengan isian kacang almond.",
			Price:       175000.0,
			Stock:       50,
			Category:    "food",
			ImageURL:    "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500",
		},
		{
			Name:        "Keripik Pedas Level 10 Nusantara Pack",
			Description: "Camilan gurih renyah kripik singkong dengan bumbu cabai asli resep tradisional.",
			Price:       45000.0,
			Stock:       100,
			Category:    "food",
			ImageURL:    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500",
		},
		{
			Name:        "Hydrating Glow Serum Niacinamide 10%",
			Description: "Serum perawatan wajah melembabkan & mencerahkan kulit kusam.",
			Price:       195000.0,
			Stock:       75,
			Category:    "beauty",
			ImageURL:    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
		},
		{
			Name:        "Signature Eau De Parfum Intense 50ml",
			Description: "Parfum beraroma woody & amber segar dengan daya tahan hingga 12 jam.",
			Price:       380000.0,
			Stock:       45,
			Category:    "beauty",
			ImageURL:    "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500",
		},
		{
			Name:        "Sunscreen Watery Gel SPF 50 PA++++",
			Description: "Tabir surya tekstur gel ringan bebas minyak pelindung UVA/UVB.",
			Price:       125000.0,
			Stock:       80,
			Category:    "beauty",
			ImageURL:    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500",
		},
		{
			Name:        "Smart Air Purifier HEPA H13 Filter",
			Description: "Pembersih udara pintar dengan sensor PM2.5 & kendali aplikasi HP.",
			Price:       1450000.0,
			Stock:       15,
			Category:    "home-living",
			ImageURL:    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500",
		},
		{
			Name:        "Ultrasonic Essential Oil Aroma Diffuser 500ml",
			Description: "Pelembab udara aroma terapi dengan lampu LED 7 warna pilihan.",
			Price:       299000.0,
			Stock:       40,
			Category:    "home-living",
			ImageURL:    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
		},
		{
			Name:        "Lampu Meja Smart LED Dimming RGB",
			Description: "Lampu baca meja belajar dengan pengaturan kecerahan & warna cahaya fleksibel.",
			Price:       215000.0,
			Stock:       35,
			Category:    "home-living",
			ImageURL:    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
		},
		{
			Name:        "Vitamin C 1000mg + Zinc Multi-Guard 60 Tablet",
			Description: "Suplemen daya tahan tubuh menjaga daya imunitas harian keluarga.",
			Price:       165000.0,
			Stock:       90,
			Category:    "health",
			ImageURL:    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
		},
		{
			Name:        "Termometer Digital Infrared Non-Contact",
			Description: "Alat pengukur suhu tubuh instan tanpa sentuh akurasi tinggi.",
			Price:       245000.0,
			Stock:       50,
			Category:    "health",
			ImageURL:    "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500",
		},
		{
			Name:        "Masker Medis 3-Ply Earloop Surgical Grade (50 pcs)",
			Description: "Masker pelindung mulut & hidung 3 lapis standar rumah sakit.",
			Price:       45000.0,
			Stock:       200,
			Category:    "health",
			ImageURL:    "https://images.unsplash.com/photo-1586942593568-29364ef88e16?w=500",
		},
		{
			Name:        "Tensimeter Digital Omron Blood Pressure Monitor",
			Description: "Alat pemantau tekanan darah otomatis dengan layar LCD digital ramah lansia.",
			Price:       580000.0,
			Stock:       30,
			Category:    "health",
			ImageURL:    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500",
		},
		{
			Name:        "Stroller Bayi Lipat Cabin Size Premium",
			Description: "Kereta dorong bayi praktis dapat dilipat kecil muat di kabin pesawat.",
			Price:       1850000.0,
			Stock:       15,
			Category:    "mom-baby",
			ImageURL:    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=500",
		},
		{
			Name:        "Botol Susu Anti-Kolik BPA Free 250ml",
			Description: "Botol susu bayi berbahan aman bebas BPA dengan sistem ventilasi udara.",
			Price:       135000.0,
			Stock:       60,
			Category:    "mom-baby",
			ImageURL:    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500",
		},
		{
			Name:        "Popok Bayi Soft Pants Extra Dry L44",
			Description: "Popok celana bayi elastis & daya serap tinggi pencegah ruam.",
			Price:       115000.0,
			Stock:       80,
			Category:    "mom-baby",
			ImageURL:    "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500",
		},
		{
			Name:        "Sterilizer Botol Susu & Penghangat Makanan",
			Description: "Mesin pembersih kuman uap panas cepat untuk perlengkapan bayi.",
			Price:       420000.0,
			Stock:       25,
			Category:    "mom-baby",
			ImageURL:    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
		},
		{
			Name:        "Full Face Helmet Carbon Fiber Modular",
			Description: "Helm motor full face pelindung kepala serat karbon standar SNI & DOT.",
			Price:       2100000.0,
			Stock:       12,
			Category:    "automotive",
			ImageURL:    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500",
		},
		{
			Name:        "Dashcam Mobil Dual Lens Front & Rear 4K",
			Description: "Kamera perekam perjalanan mobil depan & belakang dengan night vision.",
			Price:       1250000.0,
			Stock:       20,
			Category:    "automotive",
			ImageURL:    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500",
		},
		{
			Name:        "Kain Lap Microfiber Super Absorbent Set 5pcs",
			Description: "Kain pembersih bodi & kaca mobil halus tanpa menggores.",
			Price:       75000.0,
			Stock:       100,
			Category:    "automotive",
			ImageURL:    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500",
		},
		{
			Name:        "Pompa Ban Portable Digital Cordless Air Compressor",
			Description: "Pompa elektrik mini bertenaga baterai presisi otomatis.",
			Price:       385000.0,
			Stock:       45,
			Category:    "automotive",
			ImageURL:    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500",
		},
	}

	for _, p := range products {
		DB.Create(&p)
	}
	log.Println("Database seeded with comprehensive product catalog successfully!")
}
