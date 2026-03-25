import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#F5E6D0] py-8 mt-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/dashboard" className="opacity-60 hover:opacity-100 transition-opacity">
          <Image
            src="/logo/logoextendido.png"
            alt="Emotia"
            width={110}
            height={35}
            className="object-contain h-8 w-auto"
          />
        </Link>
        <p className="text-sm text-[#B0B0B0]">
          © 2026 Explosión Pressman. EMI - La Paz, Bolivia.
        </p>
      </div>
    </footer>
  );
}
