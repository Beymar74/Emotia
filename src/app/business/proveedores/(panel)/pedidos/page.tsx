"use client";

import React, { useEffect, useState } from "react";
import { 
  Clock, Package, CheckCircle, Truck, 
  MessageSquare, MapPin, ChevronRight,
  AlertTriangle, Eye, X, FileText, ImageIcon
} from "lucide-react";
import {
  obtenerPedidosProveedor,
  avanzarEstadoPedidoProveedor,
} from "./actions";
import {
  exportarPedidosProveedorExcel,
  exportarPedidosProveedorPDF,
} from "../../../utils/exportExcel_Pdf";
interface Pedido {
  id: number;
  pedidoId: number;
  codigo: string;
  cliente: string;
  producto: string;
  imagen: string | null;
  personalizacion: string | null;
  direccion: string;
  total: number;
  estado: "pendiente" | "en_preparacion" | "listo" | "entregado";
  fecha: string;
  productos: {
    detalleId: number;
    nombre: string;
    imagen: string | null;
    personalizacion: string | null;
    total: number;
  }[];
}

export default function PedidosPage() {
  // Datos simulados con las imágenes de Unsplash coherentes con el Catálogo
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvanzando, setIsAvanzando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRapido, setFiltroRapido] = useState<
    "todos" | "con_mensaje" | "pendientes" | "en_proceso" | "listos" | "entregados"
  >("todos");
  const [vista, setVista] = useState<"kanban" | "tabla">("kanban");
  const [limitePorColumna, setLimitePorColumna] = useState(10);
  const [mostrarMenuExportar, setMostrarMenuExportar] = useState(false);
  useEffect(() => {
  setLimitePorColumna(10);
}, [busqueda, filtroRapido, vista]);
  const cargarPedidos = async () => {
  setIsLoading(true);

  try {
    const data = await obtenerPedidosProveedor();
    setPedidos(data as Pedido[]);
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    alert("No se pudieron cargar los pedidos.");
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    cargarPedidos();
  }, []);

  const [pedidoAConfirmar, setPedidoAConfirmar] = useState<Pedido | null>(null);
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);

  const columnas = [
  {
    titulo: "Nuevos / Pendientes",
    estado: "pendiente",
    color: "border-red-200",
    bg: "bg-red-50",
    icon: <Clock size={18} className="text-red-600" />,
    btnText: "Preparar Pedido",
  },
  {
    titulo: "En Preparación",
    estado: "en_preparacion",
    color: "border-orange-200",
    bg: "bg-orange-50",
    icon: <Package size={18} className="text-orange-600" />,
    btnText: "Marcar Listo",
  },
  {
    titulo: "Listos para Envío",
    estado: "listo",
    color: "border-blue-200",
    bg: "bg-blue-50",
    icon: <Truck size={18} className="text-blue-600" />,
    btnText: "Marcar Entregado",
  },
  {
    titulo: "Completados",
    estado: "entregado",
    color: "border-green-200",
    bg: "bg-gray-100",
    icon: <CheckCircle size={18} className="text-[#1A1A1A]" />,
    btnText: "",
  },
] as const;

  const solicitarAvance = (pedido: Pedido) => setPedidoAConfirmar(pedido);

  const confirmarAvance = async () => {
  if (!pedidoAConfirmar || isAvanzando) return;

  setIsAvanzando(true);

  try {
    const resultado = await avanzarEstadoPedidoProveedor(pedidoAConfirmar.id);

    if (!resultado.success) {
      alert(resultado.message || "No se pudo avanzar el pedido.");
      setPedidoAConfirmar(null);
      return;
    }

    await cargarPedidos();
    setPedidoAConfirmar(null);
  } catch (error) {
    console.error("Error al avanzar pedido:", error);
    alert("Ocurrió un error al actualizar el pedido.");
  } finally {
    setIsAvanzando(false);
  }
};

  const getSiguienteEstado = (estadoActual: string) => {
  const labels: Record<string, string> = {
    pendiente: "En preparación",
    en_preparacion: "Listo",
    listo: "Entregado",
  };

  return labels[estadoActual] || "Completado";
};
const getEstadoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    en_preparacion: "En preparación",
    listo: "Listo",
    en_camino: "En camino",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };

  return labels[estado] || estado;
};

const getEstadoClassName = (estado: string) => {
  const classes: Record<string, string> = {
    pendiente: "bg-red-50 text-red-700 border-red-200",
    en_preparacion: "bg-orange-50 text-orange-700 border-orange-200",
    listo: "bg-blue-50 text-blue-700 border-blue-200",
    en_camino: "bg-indigo-50 text-indigo-700 border-indigo-200",
    entregado: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelado: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return classes[estado] || "bg-gray-100 text-gray-700 border-gray-200";
};
const pedidosFiltrados = pedidos.filter((pedido) => {
  const textoBusqueda = busqueda.toLowerCase().trim();

  const coincideBusqueda =
    textoBusqueda.length === 0 ||
    pedido.codigo.toLowerCase().includes(textoBusqueda) ||
    pedido.cliente.toLowerCase().includes(textoBusqueda) ||
    pedido.producto.toLowerCase().includes(textoBusqueda);

  const coincideFiltro =
    filtroRapido === "todos" ||
    (filtroRapido === "con_mensaje" && Boolean(pedido.personalizacion)) ||
    (filtroRapido === "pendientes" && pedido.estado === "pendiente") ||
    (filtroRapido === "en_proceso" && pedido.estado === "en_preparacion") ||
    (filtroRapido === "listos" && pedido.estado === "listo") ||
    (filtroRapido === "entregados" && pedido.estado === "entregado");

  return coincideBusqueda && coincideFiltro;
});
const obtenerDescripcionFiltros = () => {
  const partes = [];

  if (busqueda.trim()) {
    partes.push(`Búsqueda: ${busqueda}`);
  }

  if (filtroRapido !== "todos") {
    partes.push(`Filtro: ${filtroRapido}`);
  }

  return partes.length > 0 ? partes.join(" | ") : "Sin filtros";
};
const exportarExcel = async () => {
  await exportarPedidosProveedorExcel(
    pedidosFiltrados,
    obtenerDescripcionFiltros()
  );
};

const exportarPDF = async () => {
  await exportarPedidosProveedorPDF(
    pedidosFiltrados,
    obtenerDescripcionFiltros()
  );
};
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
  <div>
    <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
      Catálogo de Productos
    </h1>
    <p className="text-[#B0B0B0] mt-1 font-medium">
      Gestiona tu inventario, precios, personalización y recomendación inteligente.
    </p>
  </div>

  <div className="relative">
    <button
      onClick={() => setMostrarMenuExportar((actual) => !actual)}
      disabled={pedidosFiltrados.length === 0}
      className="flex items-center gap-2 bg-[#8E1B3A] text-[#F5E6D0] px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#5A0F24] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      Exportar
      <ChevronRight
        size={14}
        className={`transition-transform ${
          mostrarMenuExportar ? "rotate-90" : ""
        }`}
      />
    </button>

    {mostrarMenuExportar && (
      <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-30">
        <button
          onClick={async () => {
            await exportarExcel();
            setMostrarMenuExportar(false);
          }}
          className="w-full text-left px-4 py-3 text-xs font-bold text-[#3D0A1A] hover:bg-[#F5E6D0]"
        >
          Exportar Excel
        </button>

        <button
          onClick={async () => {
            await exportarPDF();
            setMostrarMenuExportar(false);
          }}
          className="w-full text-left px-4 py-3 text-xs font-bold text-[#3D0A1A] hover:bg-[#F5E6D0]"
        >
          Exportar PDF
        </button>
      </div>
    )}
  </div>
</div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
  <div className="flex-1">
    <input
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      placeholder="Buscar por código, cliente o producto..."
      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#8E1B3A] focus:ring-2 focus:ring-[#8E1B3A]/10"
    />
  </div>

  <div className="flex flex-wrap gap-2">
    {[
      ["todos", "Todos"],
      ["pendientes", "Pendientes"],
      ["en_proceso", "En preparación"],
      ["listos", "Listos"],
      ["entregados", "Entregados"],
      ["con_mensaje", "Con mensaje"],
    ].map(([value, label]) => (
      <button
        key={value}
        onClick={() => setFiltroRapido(value as typeof filtroRapido)}
        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
          filtroRapido === value
            ? "bg-[#8E1B3A] text-white border-[#8E1B3A]"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
      >
        {label}
      </button>
    ))}
  </div>

 <div className="flex flex-wrap gap-2">
  <button
    onClick={() => setVista(vista === "kanban" ? "tabla" : "kanban")}
    className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-50"
  >
    Vista: {vista === "kanban" ? "Kanban" : "Tabla"}
  </button>

  <button
    onClick={cargarPedidos}
    disabled={isLoading}
    className="px-3 py-2 rounded-lg text-xs font-bold bg-[#BC9968] text-[#3D0A1A] hover:bg-[#F5E6D0] disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {isLoading ? "Actualizando..." : "Actualizar"}
  </button>
</div>
</div>
      {vista === "kanban" ? (
  <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 items-start">
    
  {columnas.map((columna) => {
    const pedidosColumna = pedidosFiltrados.filter(
      (p) => p.estado === columna.estado
    );

    const pedidosVisibles = pedidosColumna.slice(0, limitePorColumna);

    return (
      <div
        key={columna.estado}
        className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col max-h-[75vh] overflow-hidden"
      >
        <div
          className={`p-4 border-b ${columna.color} ${columna.bg} rounded-t-2xl flex justify-between items-center sticky top-0 z-10`}
        >
          <div className="flex items-center gap-2 font-bold text-gray-800">
            {columna.icon}
            {columna.titulo}
          </div>

          <span className="bg-white text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm">
            {pedidosColumna.length}
          </span>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-gray-50/30">
          {pedidosColumna.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl">
              No hay pedidos en esta etapa
            </div>
          ) : (
            <>
              {pedidosVisibles.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#BC9968]/20 group-hover:bg-[#BC9968] transition-colors" />

                  <div className="flex justify-between items-start mb-3 mt-1">
                    <span className="text-xs font-black text-[#8E1B3A] bg-[#F5E6D0] px-2 py-1 rounded-md tracking-wider">
                      {pedido.codigo}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setPedidoDetalle(pedido)}
                        className="text-gray-400 hover:text-[#8E1B3A] transition-colors bg-gray-50 hover:bg-[#F5E6D0] p-1.5 rounded-lg"
                        title="Ver detalles completos"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                      {pedido.imagen ? (
                        <img
                          src={pedido.imagen}
                          alt={pedido.producto}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
  <h3 className="font-bold text-[#1A1A1A] text-sm leading-tight mb-1">
    {pedido.productos.length === 1
      ? pedido.productos[0].nombre
      : `${pedido.productos.length} productos`}
  </h3>

  {pedido.productos.length > 1 && (
    <div className="mt-1 space-y-0.5">
      {pedido.productos.slice(0, 3).map((producto) => (
        <p
          key={producto.detalleId}
          className="text-[11px] text-gray-500 truncate"
        >
          • {producto.nombre}
        </p>
      ))}

      {pedido.productos.length > 3 && (
        <p className="text-[11px] text-gray-400">
          +{pedido.productos.length - 3} productos más
        </p>
      )}
    </div>
  )}

  <p className="text-xs text-gray-600 font-medium mt-1">
    👤 {pedido.cliente}
  </p>
</div>
                  </div>

                  {pedido.personalizacion && (
                    <div className="bg-yellow-50 border border-yellow-200 p-2.5 rounded-lg mb-3 flex items-start gap-2">
                      <MessageSquare
                        size={14}
                        className="text-yellow-600 mt-0.5 shrink-0"
                      />
                      <p className="text-xs font-bold text-yellow-800 leading-snug line-clamp-2">
                        {pedido.personalizacion}
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-2 text-xs text-gray-500 mb-4 flex-1">
                    <MapPin size={14} className="shrink-0 mt-0.5" />
                    <span className="leading-tight line-clamp-2">
                      {pedido.direccion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                    <div className="text-sm font-black text-[#3D0A1A]">
                      Bs. {pedido.total}
                    </div>

                    {pedido.estado !== "entregado" && (
                      <button
                        onClick={() => solicitarAvance(pedido)}
                        className="flex items-center gap-1 text-xs font-bold text-white bg-[#BC9968] hover:bg-[#9A7A48] px-3 py-1.5 rounded-lg transition-colors active:scale-95 shadow-sm"
                      >
                        {columna.btnText} <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {pedidosColumna.length > limitePorColumna && (
                <button
                  onClick={() => setLimitePorColumna((actual) => actual + 10)}
                  className="w-full py-2 text-xs font-bold text-[#8E1B3A] bg-white border border-dashed border-[#BC9968]/50 rounded-lg hover:bg-[#F5E6D0]/40 transition-colors"
                >
                  Ver más ({pedidosColumna.length - limitePorColumna} restantes)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  })}
</div>
) : (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
          <tr>
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-right min-w-[120px]">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pedidosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                No hay pedidos que coincidan con los filtros.
              </td>
            </tr>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-[#8E1B3A] align-middle">
                  {pedido.codigo}
                </td>
                <td className="px-4 py-3 text-gray-700 align-middle">{pedido.cliente}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[520px] align-middle">
  {pedido.productos.length === 1 ? (
    <span className="line-clamp-1 break-words">
      {pedido.productos[0].nombre}
    </span>
  ) : (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-800 whitespace-nowrap">
        {pedido.productos.length} productos
      </span>

      <span className="text-xs text-gray-400 truncate">
        {pedido.productos.map((producto) => producto.nombre).join(" · ")}
      </span>
    </div>
  )}
</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${getEstadoClassName(
                      pedido.estado
                    )}`}
                  >
                    {getEstadoLabel(pedido.estado)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold align-middle">
                  Bs. {pedido.total}
                </td>
                <td className="px-4 py-3 text-right min-w-[120px] align-middle">
                  <button
                    onClick={() => setPedidoDetalle(pedido)}
                    className="text-xs font-bold text-[#8E1B3A] hover:underline whitespace-nowrap"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
      {/* --- MODAL CONFIRMACIÓN (Se mantiene igual) --- */}
      {pedidoAConfirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D0A1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                <AlertTriangle size={32} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-2">
                ¿Avanzar a "{getSiguienteEstado(pedidoAConfirmar.estado)}"?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Estás cambiando el estado de <span className="font-bold text-[#8E1B3A]">{pedidoAConfirmar.id}</span>. 
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left">
                <p className="text-xs font-semibold text-gray-700 flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 shrink-0" />
                  El cliente recibirá una notificación automática.
                </p>
                <p className="text-xs font-semibold text-gray-700 flex items-start gap-2 mt-2">
                  <AlertTriangle size={16} className="text-red-500 shrink-0" />
                  <span className="text-red-600">Atención: Acción irreversible.</span>
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setPedidoAConfirmar(null)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200">Cancelar</button>
              <button
  onClick={confirmarAvance}
  disabled={isAvanzando}
  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#BC9968] text-white hover:bg-[#9A7A48] disabled:opacity-60 disabled:cursor-not-allowed"
>
  {isAvanzando ? "Actualizando..." : "Confirmar Avance"}
</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETALLES --- */}
{pedidoDetalle && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fb]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#F5E6D0] text-[#8E1B3A] rounded-xl flex items-center justify-center">
            <FileText size={20} />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#3D0A1A]">
              Detalle del Pedido
            </h2>
            <p className="text-xs text-gray-500 font-bold">
              {pedidoDetalle.codigo}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPedidoDetalle(null)}
          className="p-2 text-gray-400 hover:text-gray-700 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Información del Cliente
          </p>
          <p className="font-bold text-gray-800">{pedidoDetalle.cliente}</p>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
            <MapPin size={14} /> {pedidoDetalle.direccion}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Productos del pedido
          </p>

          <div className="space-y-3">
            {pedidoDetalle.productos.map((producto) => (
              <div
                key={producto.detalleId}
                className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100"
              >
                {producto.imagen ? (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-12 h-12 rounded-md object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A1A1A] text-sm line-clamp-2">
                    {producto.nombre}
                  </p>

                  {producto.personalizacion && (
                    <p className="text-xs text-yellow-700 mt-1 line-clamp-2">
                      “{producto.personalizacion}”
                    </p>
                  )}
                </div>

                <p className="font-black text-[#8E1B3A] shrink-0">
                  Bs. {producto.total}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3">
            <span className="text-sm font-bold text-gray-500">
              Total proveedor
            </span>
            <span className="text-lg font-black text-[#8E1B3A]">
              Bs. {pedidoDetalle.total}
            </span>
          </div>
        </div>

        {pedidoDetalle.productos.some((producto) => producto.personalizacion) && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Instrucciones especiales
            </p>

            <div className="space-y-2">
              {pedidoDetalle.productos
                .filter((producto) => producto.personalizacion)
                .map((producto) => (
                  <div
                    key={`mensaje-${producto.detalleId}`}
                    className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3"
                  >
                    <MessageSquare
                      size={18}
                      className="text-yellow-600 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-yellow-900 mb-1">
                        {producto.nombre}
                      </p>
                      <p className="text-sm font-semibold text-yellow-800 whitespace-pre-wrap">
                        {producto.personalizacion}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
        <button
          onClick={() => setPedidoDetalle(null)}
          className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#8E1B3A] text-white hover:bg-[#5A0F24]"
        >
          Cerrar Detalles
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}