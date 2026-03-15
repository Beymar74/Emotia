import React, { useState } from 'react';
import { Camera, User, Mail, Phone, MapPin, Award, Edit2 } from 'lucide-react';
import { COLORS } from '../constants';

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Beymar Mamani",
    email: "beymar.mamani@ejemplo.com",
    phone: "+591 71234567",
    address: "Zona Sur, Obrajes. La Paz, Bolivia"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Lógica para guardar la información
  };

  return (
    <div style={{ padding: '32px 40px', flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* ─── Encabezado ─── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: '8px' }}>
          Mi <em style={{ color: COLORS.garnet }}>Perfil</em>
        </h1>
        <p style={{ color: COLORS.gray, fontSize: '1rem' }}>
          Gestiona tu información personal y preferencias de entrega.
        </p>
      </div>

      {/* ─── Contenedor Principal del Perfil ─── */}
      <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 12px 32px rgba(90, 15, 36, 0.04)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Banner de fondo y Avatar */}
        <div style={{ height: '140px', background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-40px', left: '40px', width: '100px', height: '100px', borderRadius: '50%', background: 'white', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 800, position: 'relative' }}>
              BM
              <button style={{ position: 'absolute', bottom: 0, right: 0, background: 'white', border: `1px solid ${COLORS.beige}`, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.choco, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Camera size={14} />
              </button>
            </div>
          </div>
          
          <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', padding: '6px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
            <Award size={16} color={COLORS.gold} /> Cliente VIP
          </div>
        </div>

        {/* Sección de Datos Personales */}
        <div style={{ padding: '64px 40px 40px', position: 'relative' }}>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{ position: 'absolute', top: '24px', right: '40px', background: isEditing ? COLORS.garnet : 'white', color: isEditing ? 'white' : COLORS.choco, border: `1px solid ${isEditing ? 'transparent' : COLORS.gold + '40'}`, padding: '8px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', boxShadow: isEditing ? '0 4px 12px rgba(142,27,58,0.3)' : '0 2px 8px rgba(0,0,0,0.02)' }}
          >
            {isEditing ? 'Guardar Cambios' : <><Edit2 size={16} /> Editar Perfil</>}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Nombre Completo
              </label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing}
                style={{ background: isEditing ? '#FDFBF9' : 'transparent', border: isEditing ? `1px solid ${COLORS.gold}80` : '1px solid transparent', padding: '12px', borderRadius: '12px', fontSize: '1rem', color: COLORS.choco, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> Correo Electrónico
              </label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing}
                style={{ background: isEditing ? '#FDFBF9' : 'transparent', border: isEditing ? `1px solid ${COLORS.gold}80` : '1px solid transparent', padding: '12px', borderRadius: '12px', fontSize: '1rem', color: COLORS.choco, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> Teléfono Móvil
              </label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing}
                style={{ background: isEditing ? '#FDFBF9' : 'transparent', border: isEditing ? `1px solid ${COLORS.gold}80` : '1px solid transparent', padding: '12px', borderRadius: '12px', fontSize: '1rem', color: COLORS.choco, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Dirección Principal
              </label>
              <input 
                type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing}
                style={{ background: isEditing ? '#FDFBF9' : 'transparent', border: isEditing ? `1px solid ${COLORS.gold}80` : '1px solid transparent', padding: '12px', borderRadius: '12px', fontSize: '1rem', color: COLORS.choco, fontWeight: 500, outline: 'none', transition: 'all 0.2s' }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}