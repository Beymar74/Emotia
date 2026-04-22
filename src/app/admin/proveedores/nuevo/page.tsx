import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormProveedor from "../_components/FormProveedor";

export default function NuevoProveedorPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/proveedores/actividad" 
          className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Directorio</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Nuevo Proveedor</h1>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#FAF3EC] to-white p-1 rounded-2xl shadow-xl shadow-[#8E1B3A]/5">
        <FormProveedor />
      </div>
    </div>
  );
}
