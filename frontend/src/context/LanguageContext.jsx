import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const translations = {
  id: {
    // Header & Nav
    catalog: 'Katalog',
    searchPlaceholder: 'Cari produk, merek, atau toko...',
    notifications: 'Notifikasi',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
    myAccount: 'Akun Saya',
    
    // Quick Menu
    rcsMall: 'RCS Mall',
    rcsMallSub: '100% Original',
    flashSale: 'Flash Sale',
    flashSaleSub: 'Diskon s.d 70%',
    rcsSupermarket: 'RCS Supermarket',
    rcsSupermarketSub: 'Kebutuhan Harian',
    freeShipping: 'Gratis Ongkir',
    freeShippingSub: 'Voucher & Cashback',
    allPromo: 'Semua Promo',
    allPromoSub: 'Klaim Kupon',

    // Titles
    categoriesTitle: 'KATEGORI (Category Cart)',
    flashSaleTitle: 'FLASH SALE (Flash Sale Cart)',
    endsIn: 'Berakhir Dalam',
    topProductsTitle: 'PRODUK TERATAS (Top Products Cart)',
    allProductsTitle: 'SEMUA PRODUK',
    sold: 'Terjual',

    // Chat
    chatTitle: 'Dukungan RCSMART',
    chatPlaceholder: 'Ketik pesan...',
    send: 'Kirim',
    online: 'Online',
    chatWelcome: 'Halo! Ada yang bisa kami bantu hari ini?',
    
    // Vouchers & Modals
    claim: 'Klaim',
    claimed: 'Terklaim',
    close: 'Tutup',
    freeShippingVoucher: 'Voucher Gratis Ongkir Min. Belanja Rp0',
    discountVoucher: 'Diskon 50% hingga Rp100.000',
    mallVoucher: 'Voucher Khusus RCS Mall Diskon 20%'
  },
  en: {
    // Header & Nav
    catalog: 'Catalog',
    searchPlaceholder: 'Search products, brands, or stores...',
    notifications: 'Notifications',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    myAccount: 'My Account',
    
    // Quick Menu
    rcsMall: 'RCS Mall',
    rcsMallSub: '100% Authentic',
    flashSale: 'Flash Sale',
    flashSaleSub: 'Up to 70% Off',
    rcsSupermarket: 'RCS Supermarket',
    rcsSupermarketSub: 'Daily Essentials',
    freeShipping: 'Free Shipping',
    freeShippingSub: 'Vouchers & Cashback',
    allPromo: 'All Promos',
    allPromoSub: 'Claim Coupons',

    // Titles
    categoriesTitle: 'CATEGORIES (Category Cart)',
    flashSaleTitle: 'FLASH SALE (Flash Sale Cart)',
    endsIn: 'Ends In',
    topProductsTitle: 'TOP PRODUCTS (Top Products Cart)',
    allProductsTitle: 'ALL PRODUCTS',
    sold: 'Sold',

    // Chat
    chatTitle: 'RCSMART Support',
    chatPlaceholder: 'Type a message...',
    send: 'Send',
    online: 'Online',
    chatWelcome: 'Hello! How can we assist you today?',
    
    // Vouchers & Modals
    claim: 'Claim',
    claimed: 'Claimed',
    close: 'Close',
    freeShippingVoucher: 'Free Shipping Voucher Min. Spend $0',
    discountVoucher: '50% Discount Voucher up to $50',
    mallVoucher: 'RCS Mall Special 20% Off Voucher'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id');

  const toggleLanguage = (selectedLang) => {
    if (selectedLang) {
      setLang(selectedLang);
    } else {
      setLang(prev => (prev === 'id' ? 'en' : 'id'));
    }
  };

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
