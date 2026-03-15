import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../constants';
import { IconGift, IconStar } from './Icons';

// ─── Interfaces ───
interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  recommendations?: any[];
}

export default function AsesorIA({ navigate }: { navigate: (t: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ─── Simulación del Flujo de Conversación Inicial ───
  useEffect(() => {
    const startConversation = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1500));
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: '¡Hola Beymar! Soy tu Asistente Emotia ✨. Estoy aquí para ayudarte a encontrar el detalle perfecto. Para empezar, ¿para quién estamos buscando un regalo hoy?',
          options: ['Mi pareja', 'Mi madre/padre', 'Un amigo/a', 'Un colega', 'Para mí']
        }
      ]);
      setIsTyping(false);
    };
    startConversation();
  }, []);

  // ─── Manejador de Opciones Predefinidas ───
  const handleOptionClick = async (option: string, msgId: string) => {
    // Evitar doble clic
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, options: undefined } : m));
    
    // Agregar mensaje del usuario
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: option };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Lógica simulada de respuesta de la IA basada en el flujo
    await new Promise(r => setTimeout(r, 1500));
    
    if (option === 'Mi pareja' || option === 'Mi madre/padre') {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: '¡Qué lindo! 💖 ¿Cómo describirías su personalidad o qué cosas le apasionan más?',
        options: ['Naturaleza y plantas 🌿', 'Arte y manualidades 🎨', 'Café y gastronomía ☕', 'Aventura y viajes ✈️']
      }]);
    } 
    else if (option.includes('Naturaleza') || option.includes('Café')) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Excelente perfil. 📝 Por último, ¿cuál es tu presupuesto aproximado en Bolivianos (Bs.)?',
        options: ['Menos de 100 Bs.', 'Entre 100 y 250 Bs.', 'Entre 250 y 500 Bs.', 'Más de 500 Bs.']
      }]);
    }
    else if (option.includes('Bs.')) {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 2000)); // Simulando carga de datos
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: '¡Perfecto! He analizado el perfil y el presupuesto. Aquí tienes 3 opciones curadas por proveedores paceños que seguro le encantarán: 🎁',
        recommendations: [
          { id: 1, title: 'Caja Botánica "Calma"', price: '180 Bs', desc: 'Incluye suculenta en maceta artesanal, café de altura (Coroico) y taza de cerámica.', img: '🪴' },
          { id: 2, title: 'Kit "Tarde de Café"', price: '220 Bs', desc: 'Prensa francesa personal, blend de café local y galletas artesanales.', img: '☕' },
          { id: 3, title: 'Experiencia Spa en casa', price: '250 Bs', desc: 'Velas aromáticas, sales de baño naturales y jabones artesanales paceños.', img: '🕯️' }
        ]
      }]);
    }
    else {
      // Fallback genérico
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Entendido. Cuéntame un poco más sobre la ocasión.',
      }]);
    }
    setIsTyping(false);
  };

  // ─── Manejador de Input de Texto Libre ───
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => {
      // Remover opciones del último mensaje de la IA si el usuario escribe libremente
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.sender === 'ai' && lastMsg.options) {
         return [...prev.slice(0, -1), { ...lastMsg, options: undefined }, userMsg];
      }
      return [...prev, userMsg];
    });
    
    setInputValue('');
    setIsTyping(true);

    // Respuesta genérica para texto libre
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'He anotado ese detalle. Para ser más preciso, ¿podrías indicarme tu presupuesto aproximado?',
        options: ['Menos de 100 Bs.', 'Entre 100 y 250 Bs.', 'Entre 250 y 500 Bs.']
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Header del Chat */}
      <div style={{ background: 'white', padding: '20px 24px', borderRadius: '20px 20px 0 0', border: `1px solid ${COLORS.gold}30`, borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: `0 4px 12px ${COLORS.garnet}30` }}>
            <IconStar />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 800, color: COLORS.bordeaux, margin: 0 }}>Asesoría Inteligente</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', background: '#16A34A', borderRadius: '50%', boxShadow: '0 0 8px #16A34A' }}></span>
              IA en línea
            </div>
          </div>
        </div>
        <button style={{ background: `${COLORS.beige}50`, color: COLORS.choco, border: `1px solid ${COLORS.gold}40`, padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMessages([])}>
          Reiniciar Chat
        </button>
      </div>

      {/* Área de Mensajes */}
      <div style={{ flex: 1, background: 'white', borderLeft: `1px solid ${COLORS.gold}30`, borderRight: `1px solid ${COLORS.gold}30`, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Mensaje de Bienvenida Fijo */}
        <div style={{ textAlign: 'center', margin: '10px 0 30px' }}>
          <span style={{ background: `${COLORS.beige}60`, color: COLORS.gray, padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>Hoy · Conexión Segura</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'ai' ? 'flex-start' : 'flex-end', width: '100%' }}>
            
            {/* Burbuja de texto */}
            <div style={{ 
              maxWidth: '80%', 
              padding: '16px 20px', 
              fontSize: '0.95rem', 
              lineHeight: 1.5,
              fontWeight: 500,
              background: msg.sender === 'ai' ? '#F9F8F6' : `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.crimson})`,
              color: msg.sender === 'ai' ? COLORS.choco : 'white',
              borderRadius: msg.sender === 'ai' ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
              border: msg.sender === 'ai' ? `1px solid ${COLORS.gold}30` : 'none',
              boxShadow: msg.sender === 'ai' ? '0 4px 12px rgba(0,0,0,0.02)' : `0 4px 16px ${COLORS.garnet}30`,
              animation: 'fadeSlideUp 0.4s ease'
            }}>
              {msg.text}
            </div>

            {/* Opciones interactivas (Si es IA y tiene opciones) */}
            {msg.sender === 'ai' && msg.options && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', marginLeft: '12px', animation: 'fadeSlideUp 0.5s ease 0.2s both' }}>
                {msg.options.map((opt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleOptionClick(opt, msg.id)}
                    style={{ background: 'white', border: `1.5px solid ${COLORS.garnet}40`, color: COLORS.garnet, padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(142,27,58,0.05)' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = COLORS.garnet; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = COLORS.garnet; }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Tarjetas de Recomendación (Si es IA y devuelve catálogo) */}
            {msg.sender === 'ai' && msg.recommendations && (
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', width: '100%', padding: '16px 4px', marginTop: '8px', animation: 'fadeSlideUp 0.6s ease' }}>
                {msg.recommendations.map((rec) => (
                  <div key={rec.id} style={{ minWidth: '240px', background: 'white', border: `1px solid ${COLORS.gold}40`, borderRadius: '20px', padding: '20px', flexShrink: 0, transition: 'transform 0.2s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px', textAlign: 'center' }}>{rec.img}</div>
                    <div style={{ fontWeight: 800, color: COLORS.bordeaux, marginBottom: '4px', fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>{rec.title}</div>
                    <div style={{ color: COLORS.garnet, fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>{rec.price}</div>
                    <div style={{ color: COLORS.gray, fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '16px' }}>{rec.desc}</div>
                    <button style={{ width: '100%', background: `${COLORS.beige}60`, color: COLORS.choco, border: 'none', padding: '10px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => navigate('catalogo')}>
                      Ver detalle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Indicador "Escribiendo..." */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F9F8F6', padding: '16px 20px', borderRadius: '20px 20px 20px 4px', border: `1px solid ${COLORS.gold}30`, width: 'fit-content', animation: 'fadeSlideUp 0.3s ease' }}>
            <div className="typing-dots"><span /><span /><span /></div>
          </div>
        )}
        
        {/* Div invisible para anclar el scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ background: 'white', padding: '20px 24px', borderRadius: '0 0 20px 20px', border: `1px solid ${COLORS.gold}30`, borderTop: `1px solid ${COLORS.gold}15`, flexShrink: 0 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu respuesta o pide sugerencias..." 
            disabled={isTyping}
            style={{ flex: 1, background: '#F5F2EE', border: `1px solid ${COLORS.gold}30`, borderRadius: '100px', padding: '16px 24px', fontSize: '0.95rem', color: COLORS.choco, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = COLORS.garnet}
            onBlur={e => e.currentTarget.style.borderColor = `${COLORS.gold}30`}
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping} style={{ width: '52px', height: '52px', borderRadius: '50%', background: inputValue.trim() && !isTyping ? `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})` : COLORS.gray, border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease', flexShrink: 0 }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: COLORS.gray }}>
          La IA de Emotia analiza tus respuestas para generar opciones únicas.
        </div>
      </div>

    </div>
  );
}