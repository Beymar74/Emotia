"use client";
import { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 1, title: 'Kit Café de Altura Local', price: 150, category: 'Experiencias', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Selección de los mejores granos de café tostado artesanal, incluye taza de cerámica y prensa francesa.' },
  { id: 2, title: 'Cena Romántica 2 pax', price: 320, category: 'Cenas', img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Experiencia gastronómica inolvidable en un restaurante exclusivo con vista a la ciudad.' },
  { id: 3, title: 'Terrario Personalizado', price: 85, category: 'Detalles', img: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Ecosistema autosustentable en frasco de vidrio geométrico.' },
  { id: 4, title: 'Caja Dulces Premium', price: 110, category: 'Dulces', img: 'https://images.unsplash.com/photo-1548842407-f65c929de26e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Caja de madera con selección de chocolates belgas y alfajores artesanales.' },
  { id: 5, title: 'Set Cuidado Facial Botánico', price: 180, category: 'Detalles', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Productos orgánicos para el cuidado de la piel con esencias naturales.' },
  { id: 6, title: 'Cata de Vinos', price: 250, category: 'Experiencias', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Degustación guiada de 4 vinos de altura con maridaje de quesos locales.' },
];

// Motor de recomendación inteligente
function getAIResponse(msg: string) {
  const lower = msg.toLowerCase();

  // Detectar presupuesto
  const budgetMatch = lower.match(/(\d+)\s*bs?/);
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

  // Detectar ocasión
  const ocasiones: Record<string, string> = {
    'cumpleaños': 'cumpleaños', 'birthday': 'cumpleaños',
    'aniversario': 'aniversario', 'boda': 'aniversario',
    'graduaci': 'graduación', 'título': 'graduación',
    'día de la madre': 'Día de la Madre', 'mama': 'Día de la Madre', 'mamá': 'Día de la Madre',
    'san valentin': 'San Valentín', 'amor': 'San Valentín',
    'navidad': 'Navidad', 'año nuevo': 'Año Nuevo',
  };
  let ocasion = '';
  for (const key of Object.keys(ocasiones)) {
    if (lower.includes(key)) { ocasion = ocasiones[key]; break; }
  }

  // Detectar destinatario
  const destinatarios: Record<string, string> = {
    'pareja': 'tu pareja', 'novia': 'tu pareja', 'novio': 'tu pareja',
    'mamá': 'tu mamá', 'mama': 'tu mamá', 'madre': 'tu mamá',
    'papá': 'tu papá', 'papa': 'tu papá', 'padre': 'tu papá',
    'amigo': 'un amigo', 'amiga': 'una amiga',
    'jefe': 'tu jefe', 'colega': 'un colega', 'compañero': 'un compañero',
    'hijo': 'tu hijo', 'hija': 'tu hija',
  };
  let destinatario = '';
  for (const key of Object.keys(destinatarios)) {
    if (lower.includes(key)) { destinatario = destinatarios[key]; break; }
  }

  // Filtrar productos por presupuesto
  let filtered = budget
    ? MOCK_PRODUCTS.filter(p => p.price <= budget)
    : MOCK_PRODUCTS;

  // Ordenar por relevancia según ocasión/destinatario
  if (ocasion === 'San Valentín' || destinatario === 'tu pareja') {
    filtered = filtered.filter(p => ['Cenas', 'Dulces', 'Detalles'].includes(p.category));
  } else if (destinatario === 'tu mamá' || ocasion === 'Día de la Madre') {
    filtered = filtered.filter(p => ['Detalles', 'Dulces', 'Experiencias'].includes(p.category));
  } else if (ocasion === 'graduación') {
    filtered = filtered.filter(p => ['Experiencias', 'Detalles'].includes(p.category));
  }

  if (filtered.length === 0) filtered = MOCK_PRODUCTS.slice(0, 2);
  const suggestions = filtered.slice(0, 2);

  // Construir respuesta natural
  let text = '¡Perfecto! ';
  if (destinatario) text += `Para ${destinatario}`;
  if (ocasion) text += `${destinatario ? ' en su' : 'Para el'} ${ocasion}`;
  if (budget) text += `${destinatario || ocasion ? ',' : ''} con un presupuesto de hasta ${budget} Bs`;
  text += ', te recomiendo estas opciones que encajan perfecto:';

  if (!destinatario && !ocasion && !budget) {
    text = 'Aquí tienes algunas opciones destacadas de nuestro catálogo. ¿Tienes alguna ocasión o presupuesto en mente? ¡Puedo afinar mejor las sugerencias!';
  }

  return { text, suggestions };
}

export default function AIAdvisorChat({ onClose, onOpenProduct }: { onClose: () => void, onOpenProduct: (p: any) => void }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola Beymar! Soy Emotia 💝 Cuéntame: ¿para quién es el regalo, qué ocasión es y cuál es tu presupuesto? Con eso te doy la recomendación perfecta.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = ['Regalo para mi mamá 🌸', 'Aniversario, 200 Bs', 'Cumpleaños amigo', 'San Valentín pareja'];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const { text: aiText, suggestions } = getAIResponse(text);
      setMessages(prev => [...prev, { role: 'ai', text: aiText, suggestions } as any]);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(inputMessage); };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#F5E6D0] flex flex-col overflow-hidden z-[90] animate-in slide-in-from-bottom-10 h-[520px] max-h-[85vh]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] p-4 flex justify-between items-center text-[#FFFFFF]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#BC9968]" />
          <div>
            <h3 className="font-bold text-sm">Asesor IA Emotia</h3>
            <span className="text-xs text-[#BC9968] flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> En línea
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[#FFFFFF]/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
      </div>

      {/* Mensajes */}
      <div className="flex-grow p-4 overflow-y-auto bg-[#F5E6D0]/10 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-3 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-[#F5E6D0] text-[#5C3A2E] rounded-br-sm border border-[#BC9968]/30'
                : 'bg-[#FFFFFF] text-[#5C3A2E] rounded-bl-sm border border-[#F5E6D0] shadow-sm'
            }`}>
              <p>{msg.text}</p>
              {(msg as any).suggestions && (
                <div className="mt-3 space-y-2">
                  {(msg as any).suggestions.map((prod: any) => (
                    <div key={prod.id} onClick={() => onOpenProduct(prod)}
                      className="bg-[#F5E6D0]/30 p-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-[#F5E6D0] transition-colors border border-[#F5E6D0]">
                      <img src={prod.img} alt={prod.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#8E1B3A] leading-tight">{prod.title}</p>
                        <p className="text-xs text-[#5C3A2E] font-semibold">{prod.price} Bs</p>
                        <p className="text-[10px] text-[#B0B0B0]">{prod.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#FFFFFF] p-3 rounded-2xl rounded-bl-sm border border-[#F5E6D0] shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-[#BC9968] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#BC9968] rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span>
              <span className="w-2 h-2 bg-[#BC9968] rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></span>
            </div>
          </div>
        )}
      </div>

      {/* Sugerencias rápidas */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex gap-2 overflow-x-auto">
          {quickSuggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="whitespace-nowrap text-xs bg-[#F5E6D0] text-[#8E1B3A] px-3 py-1.5 rounded-full border border-[#BC9968]/30 hover:bg-[#BC9968] hover:text-white transition-colors font-semibold shrink-0">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#FFFFFF] border-t border-[#F5E6D0] flex items-center gap-2">
        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ej: Cumpleaños mamá, 150 Bs..."
          className="flex-grow bg-[#F5E6D0]/30 border border-[#F5E6D0] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#BC9968] text-[#5C3A2E]" />
        <button type="submit" disabled={!inputMessage.trim()}
          className="bg-[#8E1B3A] text-[#FFFFFF] p-2 rounded-full disabled:opacity-50 hover:bg-[#5A0F24] transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
