type DeltaType = "up" | "down" | "neutral";

interface MetricCardProps {
  value: string;
  label: string;
  delta: string;
  deltaType: DeltaType;
  barFrom: string;
  barTo: string;
}

const deltaStyles: Record<DeltaType, string> = {
  up:      "bg-[#EEF8F0] text-[#2D7A47]",
  down:    "bg-[#FBF0F0] text-[#A32D2D]",
  neutral: "bg-[#BC9968]/15 text-[#5C3A2E]",
};

const deltaPrefix: Record<DeltaType, string> = {
  up:      "↑ ",
  down:    "↓ ",
  neutral: "",
};

export default function MetricCard({ value, label, delta, deltaType, barFrom, barTo }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${barFrom}, ${barTo})` }}
      />
      <p className="font-serif text-4xl font-bold text-[#5A0F24] leading-none">
        {value}
      </p>
      <p className="text-sm text-[#7A5260] mt-2 mb-4">{label}</p>
      <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${deltaStyles[deltaType]}`}>
        {deltaPrefix[deltaType]}{delta}
      </span>
    </div>
  );
}
