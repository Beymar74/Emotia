import React from 'react';
import * as LucideIcons from 'lucide-react';

interface EmotiaIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export const EmotiaIcon: React.FC<EmotiaIconProps> = ({ 
  name, 
  size = 24, 
  color = "currentColor", 
  className = "" 
}) => {
  // Busca el componente exacto en la librería de Lucide
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
  
  if (!IconComponent) {
    console.warn(`Ícono '${name}' no encontrado en lucide-react.`);
    return null; 
  }

  // strokeWidth={1.5} le da ese look fino y elegante
  return <IconComponent size={size} color={color} strokeWidth={1.5} className={className} />;
};