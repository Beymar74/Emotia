import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#7A5260] mb-4 flex-wrap">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[#BC9968]/50 select-none">/</span>}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="hover:text-[#8E1B3A] transition-colors font-medium"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? "text-[#5A0F24] font-semibold" : "font-medium"}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
