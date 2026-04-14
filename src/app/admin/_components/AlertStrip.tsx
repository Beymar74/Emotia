interface AlertStripProps {
  message: string;
  sub: string;
}

export default function AlertStrip({ message, sub }: AlertStripProps) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#8E1B3A]/8 to-[#BC9968]/8 border border-[#8E1B3A]/15 rounded-xl px-6 py-4">
      <div>
        <p className="text-base font-medium text-[#5A0F24]">{message}</p>
        <p className="text-sm text-[#7A5260] mt-0.5">{sub}</p>
      </div>
      <div className="flex gap-3 flex-shrink-0">
        <button className="text-sm bg-[#8E1B3A] text-white px-5 py-2 rounded-lg font-medium hover:opacity-85 transition-opacity">
          Revisar solicitudes
        </button>
        <button className="text-sm bg-[#8E1B3A]/10 text-[#8E1B3A] px-5 py-2 rounded-lg font-medium hover:opacity-85 transition-opacity">
          Ver todas
        </button>
      </div>
    </div>
  );
}
