"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  ImageIcon,
  X,
  PackagePlus,
  Loader2,
  UploadCloud,
} from "lucide-react";

import {
  obtenerProductosProveedor,
  obtenerCategoriasProductos,
  crearProductoProveedor,
  actualizarProductoProveedor,
  cambiarEstadoProductoProveedor,
  eliminarProductoProveedor,
  DatosProductoProveedor,
} from "./actions";

interface Categoria {
  id: number;
  nombre: string;
}

interface ProductoVista {
  id: number;
  nombre: string;
  descripcion: string;
  categoriaId: number | null;
  categoria: string;
  precioBase: string;
  precioVenta: string;
  stock: number;
  imagenUrl: string | null;
  ocasiones: string[];
  personalidades: string[];
  generoDestinatario: string;
  edadMin: string;
  edadMax: string;
  permiteMensaje: boolean;
  permiteEmpaque: boolean;
  activo: boolean;
}

const FORM_INICIAL: DatosProductoProveedor = {
  nombre: "",
  descripcion: "",
  categoriaId: null,
  precioBase: "",
  precioVenta: "",
  stock: "",
  imagenUrl: null,
  ocasiones: [],
  personalidades: [],
  generoDestinatario: "cualquiera",
  edadMin: "",
  edadMax: "",
  permiteMensaje: true,
  permiteEmpaque: false,
  activo: true,
};

const OCASIONES = [
  "cumpleaños",
  "aniversario",
  "navidad",
  "graduación",
  "amistad",
  "amor",
  "día de la madre",
  "día del padre",
  "agradecimiento",
];

const PERSONALIDADES = [
  "romántico",
  "divertido",
  "elegante",
  "creativo",
  "gamer",
  "foodie",
  "minimalista",
  "kawaii",
  "detallista",
];

export default function ProductosPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productos, setProductos] = useState<ProductoVista[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const [productoEditando, setProductoEditando] = useState<ProductoVista | null>(null);
  const [formData, setFormData] = useState<DatosProductoProveedor>(FORM_INICIAL);

  const cargarDatos = async () => {
    setIsLoading(true);

    const [productosDB, categoriasDB] = await Promise.all([
      obtenerProductosProveedor(),
      obtenerCategoriasProductos(),
    ]);

    setProductos(productosDB as ProductoVista[]);
    setCategorias(categoriasDB);

    setIsLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(producto.id).includes(searchTerm);

    const coincideCategoria =
      filtroCategoria === "Todas" || producto.categoria === filtroCategoria;

    return coincideBusqueda && coincideCategoria;
  });

  const toggleArray = (campo: "ocasiones" | "personalidades", valor: string) => {
    setFormData((prev) => {
      const actual = prev[campo] || [];
      const existe = actual.includes(valor);

      return {
        ...prev,
        [campo]: existe ? actual.filter((v) => v !== valor) : [...actual, valor],
      };
    });
  };

  const abrirModalNuevo = () => {
    setProductoEditando(null);
    setFormData({
      ...FORM_INICIAL,
      categoriaId: categorias[0]?.id || null,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const abrirModalEditar = (producto: ProductoVista) => {
    setProductoEditando(producto);
    setFormData({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoriaId: producto.categoriaId,
      precioBase: producto.precioBase,
      precioVenta: producto.precioVenta,
      stock: String(producto.stock),
      imagenUrl: producto.imagenUrl,
      ocasiones: producto.ocasiones,
      personalidades: producto.personalidades,
      generoDestinatario: producto.generoDestinatario,
      edadMin: producto.edadMin,
      edadMax: producto.edadMax,
      permiteMensaje: producto.permiteMensaje,
      permiteEmpaque: producto.permiteEmpaque,
      activo: producto.activo,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      imagenUrl: previewUrl,
    }));

    const body = new FormData();
    body.append("file", file);

    try {
      setIsUploadingImage(true);

      const response = await fetch("/api/business/proveedores/upload-producto", {
        method: "POST",
        body,
      });

      const result = await response.json();

      if (!result.success) {
        setErrorMsg(result.error || "No se pudo subir la imagen.");
        setFormData((prev) => ({
          ...prev,
          imagenUrl: productoEditando?.imagenUrl || null,
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imagenUrl: result.url,
      }));
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      setErrorMsg("Ocurrió un error al subir la imagen.");
      setFormData((prev) => ({
        ...prev,
        imagenUrl: productoEditando?.imagenUrl || null,
      }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGuardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    setErrorMsg("");

    const resultado = productoEditando
      ? await actualizarProductoProveedor(formData)
      : await crearProductoProveedor(formData);

    setIsSaving(false);

    if (!resultado.success) {
      setErrorMsg(resultado.error || "No se pudo guardar el producto.");
      return;
    }

    setIsModalOpen(false);
    await cargarDatos();
  };

  const toggleActivo = async (id: number) => {
    const resultado = await cambiarEstadoProductoProveedor(id);

    if (!resultado.success) {
      alert(resultado.error || "No se pudo cambiar el estado.");
      return;
    }

    await cargarDatos();
  };

  const handleEliminar = async (id: number, nombre: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar "${nombre}" de tu catálogo?`
    );

    if (!confirmar) return;

    const resultado = await eliminarProductoProveedor(id);

    if (!resultado.success) {
      alert(resultado.error || "No se pudo eliminar el producto.");
      return;
    }

    await cargarDatos();
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8E1B3A]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="text-[#B0B0B0] mt-1 font-medium">
            Gestiona tu inventario, precios, personalización y recomendación inteligente.
          </p>
        </div>

        <button
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-[#8E1B3A] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#5A0F24] transition-all shadow-lg shadow-[#8E1B3A]/20 active:scale-95"
        >
          <Plus size={18} /> Añadir Producto
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC9968]/50 focus:border-[#BC9968] transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="appearance-none w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <option value="Todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#B0B0B0] text-[11px] uppercase tracking-[0.15em] font-black bg-gray-50/50">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <tr
                    key={producto.id}
                    className="hover:bg-[#F5E6D0]/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                          {producto.imagenUrl ? (
                            <img
                              src={producto.imagenUrl}
                              alt={producto.nombre}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-[#1A1A1A]">
                            {producto.nombre}
                          </div>
                          <div className="text-xs text-[#BC9968] font-semibold">
                            PRD-{String(producto.id).padStart(4, "0")}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {producto.categoria}
                    </td>

                    <td className="px-6 py-4 font-bold text-[#3D0A1A]">
                      Bs. {producto.precioVenta}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          producto.stock > 0
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-50 text-red-600 border border-red-100"
                        }`}
                      >
                        {producto.stock > 0 ? `${producto.stock} und.` : "Agotado"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActivo(producto.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          producto.activo ? "bg-[#8E1B3A]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            producto.activo ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirModalEditar(producto)}
                          className="p-2 text-gray-400 hover:text-[#BC9968] hover:bg-[#F5E6D0]/50 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>

                        <button
                          onClick={() => handleEliminar(producto.id, producto.nombre)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <PackagePlus size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="font-bold text-gray-700 text-lg">
                      No hay productos
                    </p>
                    <p className="text-sm mt-1">
                      Añade tu primer producto para empezar a vender.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D0A1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f9fb]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#F5E6D0] text-[#8E1B3A] rounded-xl flex items-center justify-center">
                  {productoEditando ? <Edit3 size={20} /> : <PackagePlus size={20} />}
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#3D0A1A]">
                    {productoEditando ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Configura los detalles para tu catálogo.
                  </p>
                </div>
              </div>

              <button
                onClick={() => !isSaving && setIsModalOpen(false)}
                disabled={isSaving}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {errorMsg && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                  {errorMsg}
                </div>
              )}

              <form id="productForm" onSubmit={handleGuardarProducto} className="space-y-8">
                <section>
                  <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    1. Información básica
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Nombre del producto *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.nombre}
                        onChange={(e) =>
                          setFormData({ ...formData, nombre: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descripcion}
                        onChange={(e) =>
                          setFormData({ ...formData, descripcion: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none resize-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Categoría *
                      </label>
                      <select
                        value={formData.categoriaId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoriaId: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none bg-white"
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    2. Precio e inventario
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Precio base / costo *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={formData.precioBase}
                        onChange={(e) =>
                          setFormData({ ...formData, precioBase: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Precio venta *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={formData.precioVenta}
                        onChange={(e) =>
                          setFormData({ ...formData, precioVenta: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    3. Imagen principal
                  </h3>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                      formData.imagenUrl
                        ? "border-gray-200 bg-gray-50 p-2"
                        : "border-gray-300 hover:bg-gray-50 hover:border-[#BC9968] p-8"
                    }`}
                  >
                    {formData.imagenUrl ? (
                      <>
                        <img
                          src={formData.imagenUrl}
                          alt="Preview"
                          className="w-full h-56 object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <p className="text-white font-bold flex items-center gap-2">
                            <UploadCloud size={18} />
                            {isUploadingImage ? "Subiendo..." : "Cambiar imagen"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-14 w-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                          <ImageIcon size={28} />
                        </div>
                        <p className="text-sm font-bold text-[#1A1A1A]">
                          Haz clic para subir una foto
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG o WEBP. Máximo 4MB.
                        </p>
                      </>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    4. Personalización
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <input
                        type="checkbox"
                        checked={formData.permiteMensaje}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permiteMensaje: e.target.checked,
                          })
                        }
                      />
                      <span className="font-bold text-sm text-gray-700">
                        Permite mensaje personalizado
                      </span>
                    </label>

                    <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <input
                        type="checkbox"
                        checked={formData.permiteEmpaque}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permiteEmpaque: e.target.checked,
                          })
                        }
                      />
                      <span className="font-bold text-sm text-gray-700">
                        Permite empaque premium
                      </span>
                    </label>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-[#8E1B3A] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                    5. Recomendación inteligente
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Ocasiones
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {OCASIONES.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleArray("ocasiones", item)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                              formData.ocasiones.includes(item)
                                ? "bg-[#3D0A1A] text-white"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Personalidades
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PERSONALIDADES.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleArray("personalidades", item)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                              formData.personalidades.includes(item)
                                ? "bg-[#3D0A1A] text-white"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Género destinatario
                        </label>
                        <select
                          value={formData.generoDestinatario}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              generoDestinatario: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none bg-white"
                        >
                          <option value="cualquiera">Cualquiera</option>
                          <option value="mujer">Mujer</option>
                          <option value="hombre">Hombre</option>
                          <option value="niño">Niño</option>
                          <option value="niña">Niña</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Edad mínima
                        </label>
                        <input
                          type="number"
                          value={formData.edadMin}
                          onChange={(e) =>
                            setFormData({ ...formData, edadMin: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Edad máxima
                        </label>
                        <input
                          type="number"
                          value={formData.edadMax}
                          onChange={(e) =>
                            setFormData({ ...formData, edadMax: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200"
              >
                Cancelar
              </button>

              <button
                form="productForm"
                type="submit"
                disabled={isSaving || isUploadingImage}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-[#8E1B3A] text-white hover:bg-[#5A0F24] shadow-md disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    Guardando... <Loader2 size={16} className="animate-spin" />
                  </>
                ) : productoEditando ? (
                  "Guardar Cambios"
                ) : (
                  "Añadir al Catálogo"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}