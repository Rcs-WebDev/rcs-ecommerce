import React, { useState, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import '../styles/ChatWidget.css';

export default function ChatWidget({ isOpen, setIsOpen }) {
  const { t } = useContext(LanguageContext);
  const [internalOpen, setInternalOpen] = useState(false);

  // Sync external controlled state if provided
  const activeOpen = isOpen !== undefined ? isOpen : internalOpen;
  const toggleOpen = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen);
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo! Selamat datang di RCSMART CS Center. Ada yang bisa kami bantu seputar Fashion, Food, Tech atau Pesanan Anda?', time: '14:30' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeOpen) scrollToBottom();
  }, [messages, activeOpen, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Terima kasih telah menghubungi kami! Tim customer service RCSMART siap membantu Anda.";
      const lower = text.toLowerCase();

      if (lower.includes('status') || lower.includes('pesanan') || lower.includes('order')) {
        replyText = "Untuk mengecek status pesanan, Anda bisa mengeklik tombol 'OrderStatus' di menu utama atau melacak via nomor resi pengiriman.";
      } else if (lower.includes('fashion') || lower.includes('baju') || lower.includes('sepatu') || lower.includes('ukuran')) {
        replyText = "Koleksi Fashion kami meliputi Oversized Hoodie, Leather Jacket, dan Sneakers original. Panduan ukuran lengkap tersedia di halaman produk!";
      } else if (lower.includes('makanan') || lower.includes('kopi') || lower.includes('food')) {
        replyText = "RCS Food menyediakan Kopi Arabica Blend, Matcha Ceremonial, dan Snack Platter segar dengan pengiriman Express!";
      } else if (lower.includes('ongkir') || lower.includes('shipping') || lower.includes('gratis')) {
        replyText = "Voucher Gratis Ongkir RP 0 dapat Anda klaim langsung di bagian menu utama 'Gratis Ongkir'.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const quickChips = [
    "Koleksi Fashion Pria & Wanita 👔",
    "Promo Food & Culinary ☕",
    "Cek Status Pesanan 📦",
    "Voucher Gratis Ongkir 🚚"
  ];

  return (
    <>
      {/* Floating FAB Button - Hidden on mobile view */}
      <button onClick={toggleOpen} className="chat-fab-btn" title="Chat CS RCSMART">
        {activeOpen ? <X size={26} /> : <MessageSquare size={26} />}
        {!activeOpen && <span className="chat-unread-dot">1</span>}
      </button>

      {/* Chat Drawer Panel */}
      {activeOpen && (
        <div className="chat-drawer-panel glass-panel">
          <div className="chat-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{t('chatTitle')}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399' }} />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{t('online')}</span>
                </div>
              </div>
            </div>

            <button onClick={toggleOpen} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-body-scroll">
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', marginTop: '4px', padding: '0 4px' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Sparkles size={14} className="animate-spin" />
                <span>RCSMART CS sedang mengetik...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-chips-bar">
            {quickChips.map((chip, idx) => (
              <button key={idx} onClick={() => handleSend(chip)} className="chat-chip-btn">
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="chat-input-form">
            <input
              type="text"
              placeholder={t('chatPlaceholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="form-input"
              style={{ borderRadius: '20px', padding: '8px 14px', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '34px', height: '34px', padding: 0, flexShrink: 0 }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
