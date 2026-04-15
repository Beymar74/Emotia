"use client";

interface Props {
  disabled?: boolean;
}

export default function ExportarPDFButton({ disabled }: Props) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      disabled={disabled}
      className="bg-[#8E1B3A] text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 4V1h8v3M4 12H2a1 1 0 01-1-1V6a1 1 0 011-1h12a1 1 0 011 1v5a1 1 0 01-1 1h-2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="4" y="9" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      Exportar PDF
    </button>
  );
}
