"use client";

import { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Package,
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  Info,
} from "lucide-react";

interface Categorias {
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  precio_venta: number;
  stock: number;
  imagen_url: string | null;
  activo: boolean;
  categorias: Categorias | null;
  created_at: string | Date;
}

interface Cliente {
  nombre: string;
  apellido: string | null;
  email?: string;
}

interface PedidoInfo {
  id: number;
  created_at: string | Date;
  estado: string;
  usuarios: Cliente;
}

interface PedidoDetalle {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  mensaje_personal: string | null;
  empaque_especial: boolean;
  created_at: string | Date;
  pedidos: PedidoInfo;
  productos: {
    nombre: string;
  };
}

interface ResenaDetalle {
  id: number;
  calificacion: number | null;
  resena: string | null;
  created_at: string | Date;
  pedidos: {
    usuarios: Cliente;
  };
  productos: {
    nombre: string;
  };
}

interface Empresa {
  id: number;
  nombre_negocio: string;
  descripcion: string | null;
  logo_url: string | null;
  categorias: string[];
  redes_sociales: any;
  email: string;
  telefono: string | null;
  direccion: string | null;
  rep_nombre: string | null;
  rep_telefono: string | null;
  rep_email: string | null;
  rep_anio_nacimiento: number | null;
  estado: string;
  calificacion_prom: number;
  total_vendido: number;
  created_at: string | Date;
}

interface Props {
  empresa: Empresa;
  productos: Producto[];
  pedidos: PedidoDetalle[];
  resenas: ResenaDetalle[];
}

export default function GlobalEmpresaDetail({ empresa, productos, pedidos, resenas }: Props) {
  const [activeTab, setActiveTab] = useState<"perfil" | "catalogo" | "ventas" | "opiniones">("perfil");
  
  // Search states
  const [searchProduct, setSearchProduct] = useState("");
  const [searchPedido, setSearchPedido] = useState("");
  const [searchResena, setSearchResena] = useState("");

  // Pagination states
  const [prodPage, setProdPage] = useState(1);
  const [pedPage, setPedPage] = useState(1);
  const [resPage, setResPage] = useState(1);
  
  const itemsPerPage = 8;

  // Format currency
  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  // Local KPIs (filtered locally to guarantee absolute precision)
  const totalFacturado = pedidos
    .filter((p) => p.pedidos.estado === "entregado")
    .reduce((acc, curr) => acc + curr.subtotal, 0);
  
  const totalPedidosEntregados = new Set(
    pedidos.filter((p) => p.pedidos.estado === "entregado").map((p) => p.pedido_id)
  ).size;

  const ticketPromedio = totalPedidosEntregados > 0 ? totalFacturado / totalPedidosEntregados : 0;
  
  const totalProductosActivos = productos.filter((p) => p.activo).length;
  
  const ratingPromedio = resenas.length > 0
    ? resenas.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) / resenas.length
    : 0;

  // Filter lists
  const filteredProducts = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchProduct.toLowerCase()) ||
    (p.categorias?.nombre || "").toLowerCase().includes(searchProduct.toLowerCase())
  );

  const filteredPedidos = pedidos.filter((p) => {
    const search = searchPedido.toLowerCase();
    const clienteNombre = `${p.pedidos.usuarios.nombre} ${p.pedidos.usuarios.apellido || ""}`.toLowerCase();
    return (
      p.pedido_id.toString().includes(search) ||
      p.productos.nombre.toLowerCase().includes(search) ||
      clienteNombre.includes(search) ||
      p.pedidos.estado.toLowerCase().includes(search)
    );
  });

  const filteredResenas = resenas.filter((r) => {
    const search = searchResena.toLowerCase();
    const clienteNombre = `${r.pedidos.usuarios.nombre} ${r.pedidos.usuarios.apellido || ""}`.toLowerCase();
    return (
      r.productos.nombre.toLowerCase().includes(search) ||
      clienteNombre.includes(search) ||
      (r.resena || "").toLowerCase().includes(search)
    );
  });

  // Paginated items
  const paginatedProducts = filteredProducts.slice(
    (prodPage - 1) * itemsPerPage,
    prodPage * itemsPerPage
  );

  const paginatedPedidos = filteredPedidos.slice(
    (pedPage - 1) * itemsPerPage,
    pedPage * itemsPerPage
  );

  const paginatedResenas = filteredResenas.slice(
    (resPage - 1) * itemsPerPage,
    resPage * itemsPerPage
  );

  // Status styling map
  const getEstadoBadge = (estado: string) => {
    const est = estado.toLowerCase();
    switch (est) {
      case "aprobado":
      case "entregado":
      case "activo":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "pendiente":
      case "en_camino":
      case "procesando":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "cancelado":
      case "inactivo":
      case "suspendido":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60";
    }
  };

  const parseRedes = (redes: any) => {
    if (!redes) return null;
    try {
      if (typeof redes === "string") {
        return JSON.parse(redes);
      }
      return redes;
    } catch {
      return null;
    }
  };

  const redes = parseRedes(empresa.redes_sociales);

  return (
    <div className="space-y-6 mt-8">
      {/* Divider and Section Title */}
      <div className="border-t border-[#8E1B3A]/20 pt-6">
        <h2 className="font-serif text-2xl font-bold text-[#5A0F24] flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#BC9968]" />
          Panel Integral de la Empresa: <span className="text-[#8E1B3A]">{empresa.nombre_negocio}</span>
        </h2>
        <p className="text-xs text-[#7A5260] mt-1">
          Visualización y analíticas detalladas exclusivas de este negocio. Todos los productos, ventas y comentarios.
        </p>
      </div>

      {/* Local KPIs specifically for the company */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden shadow-sm">
          <span className="absolute top-0 left-0 w-full h-[2px] bg-[#8E1B3A]" />
          <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-semibold">Ventas Empresa</p>
          <p className="font-serif text-lg md:text-xl font-bold text-[#5A0F24] mt-1">{formatBs(totalFacturado)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden shadow-sm">
          <span className="absolute top-0 left-0 w-full h-[2px] bg-[#BC9968]" />
          <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-semibold">Pedidos Entregados</p>
          <p className="font-serif text-lg md:text-xl font-bold text-[#5A0F24] mt-1">{totalPedidosEntregados}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden shadow-sm">
          <span className="absolute top-0 left-0 w-full h-[2px] bg-[#5C3A2E]" />
          <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-semibold">Ticket Medio</p>
          <p className="font-serif text-lg md:text-xl font-bold text-[#5A0F24] mt-1">{formatBs(ticketPromedio)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden shadow-sm">
          <span className="absolute top-0 left-0 w-full h-[2px] bg-[#AB3A50]" />
          <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-semibold">Productos Activos</p>
          <p className="font-serif text-lg md:text-xl font-bold text-[#5A0F24] mt-1">{totalProductosActivos} <span className="text-xs text-gray-400">/ {productos.length}</span></p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden shadow-sm">
          <span className="absolute top-0 left-0 w-full h-[2px] bg-amber-500" />
          <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-semibold">Calif. Promedio</p>
          <p className="font-serif text-lg md:text-xl font-bold text-[#5A0F24] mt-1 flex items-center gap-1">
            {ratingPromedio.toFixed(1)} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden shadow-sm">
          <span className="absolute top-0 left-0 w-full h-[2px] bg-[#185FA5]" />
          <p className="text-[10px] uppercase tracking-wider text-[#7A5260] font-semibold">Total Reseñas</p>
          <p className="font-serif text-lg md:text-xl font-bold text-[#5A0F24] mt-1">{resenas.length}</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="flex border-b border-[#8E1B3A]/10 bg-gray-50/50 overflow-x-auto">
          {[
            { id: "perfil", label: "Perfil de Empresa", icon: Building2 },
            { id: "catalogo", label: "Catálogo de Productos", icon: Package, count: productos.length },
            { id: "ventas", label: "Historial de Ventas", icon: ShoppingCart, count: pedidos.length },
            { id: "opiniones", label: "Opiniones y Calificaciones", icon: Star, count: resenas.length },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#8E1B3A] text-[#8E1B3A] bg-white"
                    : "border-transparent text-gray-500 hover:text-[#8E1B3A] hover:bg-gray-50"
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${
                    isActive ? "bg-[#8E1B3A]/10 text-[#8E1B3A]" : "bg-gray-200/60 text-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {/* TAB 1: PERFIL */}
          {activeTab === "perfil" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card left */}
              <div className="lg:col-span-1 flex flex-col items-center text-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="relative w-28 h-28 rounded-full border-4 border-[#BC9968]/30 overflow-hidden bg-gradient-to-br from-[#5A0F24] to-[#8E1B3A] flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  {empresa.logo_url ? (
                    <img
                      src={empresa.logo_url}
                      alt={empresa.nombre_negocio}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                        const sibling = (e.target as HTMLElement).nextElementSibling;
                        if (sibling) (sibling as HTMLElement).style.display = "flex";
                      }}
                    />
                  ) : null}
                  <span
                    className="absolute inset-0 flex items-center justify-center uppercase font-serif"
                    style={{ display: empresa.logo_url ? "none" : "flex" }}
                  >
                    {empresa.nombre_negocio.slice(0, 2)}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#5A0F24] mt-4">{empresa.nombre_negocio}</h3>
                
                <span className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getEstadoBadge(empresa.estado)}`}>
                  {empresa.estado.toUpperCase()}
                </span>

                <p className="text-xs text-[#7A5260] mt-3 italic max-w-xs">
                  {empresa.descripcion || "Sin descripción disponible."}
                </p>

                <div className="w-full border-t border-gray-100 my-4" />

                <div className="w-full space-y-2.5 text-left text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#BC9968] flex-shrink-0" />
                    <span>Registrado: {formatDate(empresa.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#BC9968] flex-shrink-0" />
                    <span className="truncate">{empresa.email}</span>
                  </div>
                  {empresa.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#BC9968] flex-shrink-0" />
                      <span>{empresa.telefono}</span>
                    </div>
                  )}
                  {empresa.direccion && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#BC9968] mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{empresa.direccion}</span>
                    </div>
                  )}
                </div>

                {redes && Object.keys(redes).length > 0 && (
                  <div className="w-full mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] uppercase font-semibold text-gray-400 text-left mb-2">Redes Sociales</p>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {Object.entries(redes).map(([network, link]: [string, any]) => (
                        <a
                          key={network}
                          href={typeof link === "string" ? link : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-[#8E1B3A]/5 hover:bg-[#8E1B3A]/10 text-xs text-[#8E1B3A] capitalize transition-colors flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          {network}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Representative and detailed info card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Representative details */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                  <h4 className="font-serif text-md font-bold text-[#5A0F24] border-b border-gray-100 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#BC9968]" />
                    Datos del Representante Legal
                  </h4>
                  {empresa.rep_nombre ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-gray-400 font-medium">Nombre Completo</p>
                        <p className="text-gray-800 font-semibold mt-0.5">{empresa.rep_nombre}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Correo Electrónico</p>
                        <p className="text-gray-800 font-semibold mt-0.5">{empresa.rep_email || "No provisto"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Teléfono de Contacto</p>
                        <p className="text-gray-800 font-semibold mt-0.5">{empresa.rep_telefono || "No provisto"}</p>
                      </div>
                      {empresa.rep_anio_nacimiento && (
                        <div>
                          <p className="text-gray-400 font-medium">Año de Nacimiento</p>
                          <p className="text-gray-800 font-semibold mt-0.5">{empresa.rep_anio_nacimiento}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No hay información del representante asignada.</p>
                  )}
                </div>

                {/* Categorías de Regalos */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
                  <h4 className="font-serif text-md font-bold text-[#5A0F24] border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#BC9968]" />
                    Categorías de Especialidad
                  </h4>
                  {empresa.categorias && empresa.categorias.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {empresa.categorias.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#BC9968]/10 text-xs font-medium text-[#7A5A2B] border border-[#BC9968]/20"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Sin categorías registradas en el catálogo del sistema.</p>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-amber-50/50 rounded-xl border border-amber-200/50 p-4 flex gap-3 text-xs text-amber-800 leading-relaxed">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Información de Facturación Directa:</span> Todas las comisiones,
                    impuestos y facturación del negocio son consolidados por PREPE de acuerdo con el contrato y
                    términos de adhesión en su registro el <strong>{formatDate(empresa.created_at)}</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOGO */}
          {activeTab === "catalogo" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar producto por nombre o categoría..."
                    value={searchProduct}
                    onChange={(e) => {
                      setSearchProduct(e.target.value);
                      setProdPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#8E1B3A] transition-colors"
                  />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  Mostrando {filteredProducts.length} de {productos.length} productos
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100 text-xs">
                  <thead className="bg-gray-50 font-semibold text-[#5A0F24]">
                    <tr>
                      <th className="px-4 py-3 text-left">Foto</th>
                      <th className="px-4 py-3 text-left">Nombre</th>
                      <th className="px-4 py-3 text-left">Categoría</th>
                      <th className="px-4 py-3 text-right">Precio Base</th>
                      <th className="px-4 py-3 text-right">Precio Venta</th>
                      <th className="px-4 py-3 text-center">Stock</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-400">
                              {p.imagen_url ? (
                                <img
                                  src={p.imagen_url}
                                  alt={p.nombre}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                    const sibling = (e.target as HTMLElement).nextElementSibling;
                                    if (sibling) (sibling as HTMLElement).style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <Package
                                className="w-5 h-5 text-gray-300"
                                style={{ display: p.imagen_url ? "none" : "block" }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#5A0F24]">
                            <div className="max-w-[200px] truncate" title={p.nombre}>{p.nombre}</div>
                            {p.descripcion && (
                              <p className="text-[10px] text-gray-400 font-normal line-clamp-1 max-w-[200px] mt-0.5">
                                {p.descripcion}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 font-medium">
                            {p.categorias?.nombre || "General"}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">
                            {formatBs(p.precio_base)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#8E1B3A]">
                            {formatBs(p.precio_venta)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                p.stock <= 3
                                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                                  : p.stock <= 10
                                  ? "bg-amber-50 text-amber-600 border border-amber-100"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {p.stock} u.
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getEstadoBadge(p.activo ? "activo" : "inactivo")}`}>
                              {p.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400 italic">
                          No se encontraron productos en el catálogo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredProducts.length > itemsPerPage && (
                <div className="flex justify-between items-center bg-gray-50/50 px-4 py-3.5 rounded-xl border border-gray-100 text-xs">
                  <button
                    onClick={() => setProdPage(prodPage - 1)}
                    disabled={prodPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-lg disabled:opacity-50 text-gray-600 hover:bg-gray-50 transition-all font-semibold cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </button>
                  <span className="text-gray-400 font-medium">
                    Página {prodPage} de {Math.ceil(filteredProducts.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setProdPage(prodPage + 1)}
                    disabled={prodPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-lg disabled:opacity-50 text-gray-600 hover:bg-gray-50 transition-all font-semibold cursor-pointer"
                  >
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VENTAS */}
          {activeTab === "ventas" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar ventas por ID, cliente o producto..."
                    value={searchPedido}
                    onChange={(e) => {
                      setSearchPedido(e.target.value);
                      setPedPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#8E1B3A] transition-colors"
                  />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  Mostrando {filteredPedidos.length} de {pedidos.length} ventas
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100 text-xs">
                  <thead className="bg-gray-50 font-semibold text-[#5A0F24]">
                    <tr>
                      <th className="px-4 py-3 text-left">Pedido ID</th>
                      <th className="px-4 py-3 text-left">Fecha</th>
                      <th className="px-4 py-3 text-left">Cliente</th>
                      <th className="px-4 py-3 text-left">Producto</th>
                      <th className="px-4 py-3 text-center">Cant.</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                      <th className="px-4 py-3 text-center">Estado Pedido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {paginatedPedidos.length > 0 ? (
                      paginatedPedidos.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-mono">
                              #{p.pedido_id}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 font-medium">
                            {formatDate(p.created_at)}
                          </td>
                          <td className="px-4 py-3 text-gray-700 font-semibold">
                            <div>{p.pedidos.usuarios.nombre} {p.pedidos.usuarios.apellido}</div>
                            {p.pedidos.usuarios.email && (
                              <span className="text-[10px] text-gray-400 font-normal truncate block max-w-[150px]">
                                {p.pedidos.usuarios.email}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-[#5A0F24] max-w-[180px] truncate" title={p.productos.nombre}>
                            {p.productos.nombre}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">
                            {p.cantidad}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#8E1B3A]">
                            {formatBs(p.subtotal)}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getEstadoBadge(p.pedidos.estado)}`}>
                              {p.pedidos.estado.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400 italic">
                          No se registraron ventas en esta empresa.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredPedidos.length > itemsPerPage && (
                <div className="flex justify-between items-center bg-gray-50/50 px-4 py-3.5 rounded-xl border border-gray-100 text-xs">
                  <button
                    onClick={() => setPedPage(pedPage - 1)}
                    disabled={pedPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-lg disabled:opacity-50 text-gray-600 hover:bg-gray-50 transition-all font-semibold cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </button>
                  <span className="text-gray-400 font-medium">
                    Página {pedPage} de {Math.ceil(filteredPedidos.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setPedPage(pedPage + 1)}
                    disabled={pedPage === Math.ceil(filteredPedidos.length / itemsPerPage)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-lg disabled:opacity-50 text-gray-600 hover:bg-gray-50 transition-all font-semibold cursor-pointer"
                  >
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OPINIONES */}
          {activeTab === "opiniones" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar opiniones por cliente, producto o comentario..."
                    value={searchResena}
                    onChange={(e) => {
                      setSearchResena(e.target.value);
                      setResPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#8E1B3A] transition-colors"
                  />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  Mostrando {filteredResenas.length} de {resenas.length} opiniones
                </div>
              </div>

              {/* Grid or list of reviews */}
              {paginatedResenas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedResenas.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-[#8E1B3A]/20 transition-all space-y-3 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Rating and date */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3.5 h-3.5 ${
                                  idx < (r.calificacion || 0)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 font-medium">{formatDate(r.created_at)}</span>
                        </div>

                        {/* Review text */}
                        <p className="text-xs text-[#5A0F24] font-medium leading-relaxed italic">
                          &ldquo;{r.resena || "Sin comentarios descriptivos"}&rdquo;
                        </p>
                      </div>

                      {/* Client and product reference */}
                      <div className="border-t border-gray-50 pt-3 mt-2 text-[10px] flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 block font-medium">Cliente</span>
                          <span className="font-semibold text-gray-700">
                            {r.pedidos.usuarios.nombre} {r.pedidos.usuarios.apellido}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 block font-medium">Producto</span>
                          <span className="font-bold text-[#8E1B3A] line-clamp-1 max-w-[140px]" title={r.productos.nombre}>
                            {r.productos.nombre}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 italic text-xs">
                  No se han registrado opiniones de clientes.
                </div>
              )}

              {/* Pagination */}
              {filteredResenas.length > itemsPerPage && (
                <div className="flex justify-between items-center bg-gray-50/50 px-4 py-3.5 rounded-xl border border-gray-100 text-xs mt-4">
                  <button
                    onClick={() => setResPage(resPage - 1)}
                    disabled={resPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-lg disabled:opacity-50 text-gray-600 hover:bg-gray-50 transition-all font-semibold cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </button>
                  <span className="text-gray-400 font-medium">
                    Página {resPage} de {Math.ceil(filteredResenas.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setResPage(resPage + 1)}
                    disabled={resPage === Math.ceil(filteredResenas.length / itemsPerPage)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white rounded-lg disabled:opacity-50 text-gray-600 hover:bg-gray-50 transition-all font-semibold cursor-pointer"
                  >
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
