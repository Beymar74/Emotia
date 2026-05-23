import Link from "next/link";

const PAGES = [
  { href: "/admin/empresas/actividad",   label: "Supervisar actividad", icon: "◷" },
  { href: "/admin/empresas/rendimiento", label: "Rendimiento",          icon: "▲" },
];

export default function SubNav({ activa }: { activa: "actividad" | "rendimiento" }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-1.5 flex flex-col sm:flex-row gap-1.5">
      {PAGES.map((p) => {
        const isActive = p.href.endsWith(activa);
        return (
          <Link
            key={p.href}
            href={p.href}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-[#8E1B3A] to-[#AB3A50] text-white shadow-sm"
                : "text-[#7A5260] hover:bg-[#FAF3EC] hover:text-[#5A0F24]"
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
