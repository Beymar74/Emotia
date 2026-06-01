"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Plus, XCircle, Loader2, Image as ImageIcon, Calendar, Trash2 } from "lucide-react";
import {
  toggleDesignStatus,
  crearDesign,
  crearFechaEspecial,
  actualizarFechaEspecial,
  toggleFechaEspecialStatus,
  eliminarFechaEspecial,
} from "../actions";
import { subirImagenCloudinaryAction } from "@/app/admin/actions/upload";

export type TarjetaDB = {
  id: number;
  nombre: string;
  design_url: string;
  color_acento: string;
  color_suave: string;
  color_marco: string;
  color_mensaje: string;
  activo: boolean;
};

export type EmpaqueDB = {
  id: number;
  nombre: string;
  preview_url: string;
  descripcion: string | null;
  activo: boolean;
};

export type EnvolturaDB = {
  id: number;
  nombre: string;
  preview_url: string;
  descripcion: string | null;
  activo: boolean;
};

export type ListonDB = {
  id: number;
  nombre: string;
  preview_url: string;
  descripcion: string | null;
  activo: boolean;
};

export type FechaEspecial = {
  id: number;
  fecha: Date;
  titulo: string;
  design_ids: number[];
  activo: boolean;
};

type Section = "todos" | "tarjetas" | "cajas" | "envolturas" | "listones";
type DesignSection = Exclude<Section, "todos">;

interface PersonalizacionClientProps {
  tarjetas: TarjetaDB[];
  empaques: EmpaqueDB[];
  envolturas: EnvolturaDB[];
  listones: ListonDB[];
  fechasEspeciales: FechaEspecial[];
  resumen: {
    totalDiseños: number;
    totalTarjetas: number;
    totalCajas: number;
    totalEnvolturas: number;
    totalListones: number;
  };
}

type DesignItem = {
  id: number;
  selectionKey: number;
  nombre: string;
  preview_url: string;
  activo: boolean;
  section: DesignSection;
  descripcion?: string | null;
  color_acento?: string;
  color_suave?: string;
  color_marco?: string;
  color_mensaje?: string;
};

type ScheduleDraft = {
  id: number | null;
  date: string;
  label: string;
  designIds: number[];
  mode: "create" | "view" | "edit";
};

type BoliviaSpecialDate = {
  dateKey: string;
  label: string;
  kind: "feriado" | "conmemoracion" | "popular";
};

const DESIGN_SECTION_OFFSETS: Record<DesignSection, number> = {
  tarjetas: 1_000_000,
  cajas: 2_000_000,
  envolturas: 3_000_000,
  listones: 4_000_000,
};

const BOLIVIA_TIME_ZONE = "America/La_Paz";

function encodeDesignSelectionKey(section: DesignSection, id: number) {
  return DESIGN_SECTION_OFFSETS[section] + id;
}

function decodeDesignSelectionKey(value: number): { section: DesignSection; id: number } | null {
  if (value >= DESIGN_SECTION_OFFSETS.listones) {
    return { section: "listones", id: value - DESIGN_SECTION_OFFSETS.listones };
  }
  if (value >= DESIGN_SECTION_OFFSETS.envolturas) {
    return { section: "envolturas", id: value - DESIGN_SECTION_OFFSETS.envolturas };
  }
  if (value >= DESIGN_SECTION_OFFSETS.cajas) {
    return { section: "cajas", id: value - DESIGN_SECTION_OFFSETS.cajas };
  }
  if (value >= DESIGN_SECTION_OFFSETS.tarjetas) {
    return { section: "tarjetas", id: value - DESIGN_SECTION_OFFSETS.tarjetas };
  }

  return null;
}

function getBoliviaDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOLIVIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function getBoliviaDateKey(date: Date) {
  const { year, month, day } = getBoliviaDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function createCalendarDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day, 12));
}

function parseDateKeyToCalendarDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return createCalendarDate(year, month - 1, day);
}

function formatBoliviaLongDate(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: BOLIVIA_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function addDaysUtc(date: Date, days: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days, 12));
}

function getWesternEasterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return createCalendarDate(year, month, day);
}

function buildBoliviaSpecialDates(year: number) {
  const specialDates: BoliviaSpecialDate[] = [
    { dateKey: `${year}-01-01`, label: "Año Nuevo", kind: "feriado" },
    { dateKey: `${year}-02-14`, label: "San Valentín / Amor y amistad", kind: "popular" },
    { dateKey: `${year}-03-08`, label: "Día de la Mujer", kind: "conmemoracion" },
    { dateKey: `${year}-03-19`, label: "Día del Padre", kind: "conmemoracion" },
    { dateKey: `${year}-03-23`, label: "Día del Mar", kind: "conmemoracion" },
  ];

  const easterSunday = getWesternEasterSunday(year);
  const carnivalMonday = addDaysUtc(easterSunday, -48);
  const carnivalTuesday = addDaysUtc(easterSunday, -47);
  const goodFriday = addDaysUtc(easterSunday, -2);
  const corpusChristi = addDaysUtc(easterSunday, 60);

  specialDates.push(
    { dateKey: getBoliviaDateKey(carnivalMonday), label: "Carnaval", kind: "feriado" },
    { dateKey: getBoliviaDateKey(carnivalTuesday), label: "Carnaval", kind: "feriado" },
    { dateKey: getBoliviaDateKey(goodFriday), label: "Viernes Santo", kind: "feriado" },
    { dateKey: `${year}-04-12`, label: "Día del Niño", kind: "conmemoracion" },
    { dateKey: `${year}-05-01`, label: "Día del Trabajo", kind: "feriado" },
    { dateKey: `${year}-05-10`, label: "Día del Periodista", kind: "conmemoracion" },
    { dateKey: `${year}-05-27`, label: "Día de la Madre", kind: "conmemoracion" },
    { dateKey: `${year}-06-06`, label: "Día del Maestro", kind: "conmemoracion" },
    { dateKey: getBoliviaDateKey(corpusChristi), label: "Corpus Christi", kind: "feriado" },
    { dateKey: `${year}-06-21`, label: "Año Nuevo Andino Amazónico Chaqueño", kind: "feriado" },
    { dateKey: `${year}-07-23`, label: "Día de la Amistad", kind: "popular" },
    { dateKey: `${year}-08-06`, label: "Día de la Independencia", kind: "feriado" },
    { dateKey: `${year}-09-21`, label: "Primavera, Estudiante y Juventud", kind: "popular" },
    { dateKey: `${year}-09-21`, label: "Flores amarillas", kind: "popular" },
    { dateKey: `${year}-10-11`, label: "Día de la Mujer Boliviana", kind: "conmemoracion" },
    { dateKey: `${year}-11-02`, label: "Todos los Difuntos", kind: "feriado" },
    { dateKey: `${year}-12-25`, label: "Navidad", kind: "feriado" },
  );

  if (year === 2026) {
    specialDates.push(
      { dateKey: "2026-01-02", label: "Feriado adicional de Año Nuevo", kind: "feriado" },
      { dateKey: "2026-01-23", label: "Estado Plurinacional de Bolivia", kind: "feriado" },
      { dateKey: "2026-06-05", label: "Feriado adicional", kind: "feriado" },
      { dateKey: "2026-06-22", label: "Año Nuevo Andino Amazónico Chaqueño", kind: "feriado" },
      { dateKey: "2026-08-07", label: "Feriado adicional", kind: "feriado" },
    );
  } else {
    specialDates.push(
      { dateKey: `${year}-01-22`, label: "Estado Plurinacional de Bolivia", kind: "feriado" },
    );
  }

  return specialDates;
}

const sectionLabels: Record<Section, string> = {
  todos: "Todos",
  tarjetas: "Tarjetas",
  cajas: "Cajas",
  envolturas: "Envolturas",
  listones: "Listones",
};

const sectionDisplay: Record<DesignSection, string> = {
  tarjetas: "Tarjetas",
  cajas: "Cajas",
  envolturas: "Envolturas",
  listones: "Listones",
};

const ALL_DESIGN_SECTIONS: DesignSection[] = ["tarjetas", "cajas", "envolturas", "listones"];
const SCHEDULE_CREATE_SECTIONS: DesignSection[] = ["tarjetas", "envolturas"];

export default function PersonalizacionClient({
  tarjetas,
  empaques,
  envolturas,
  listones,
  fechasEspeciales,
  resumen,
}: PersonalizacionClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [seccion, setSeccion] = useState<Section>("todos");
  const [modalSection, setModalSection] = useState<DesignSection>("tarjetas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    color_acento: "#A53E6C",
    color_suave: "#FFF3F7",
    color_marco: "#D46A92",
    color_mensaje: "#000000",
  });
  const [formError, setFormError] = useState("");
  const [dateError, setDateError] = useState("");
  const [scheduleDate, setScheduleDate] = useState<ScheduleDraft | null>(null);
  const [selectedDesignKeys, setSelectedDesignKeys] = useState<number[]>([]);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [allowedModalSections, setAllowedModalSections] = useState<DesignSection[]>(ALL_DESIGN_SECTIONS);

  const scheduledDates = useMemo(
    () => new Map(fechasEspeciales.map((fecha) => [getBoliviaDateKey(fecha.fecha), fecha] as const)),
    [fechasEspeciales]
  );
  const weekDayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const todayParts = getBoliviaDateParts(new Date());
  const todayKey = getBoliviaDateKey(new Date());
  const calendarMonths = Array.from({ length: 12 }, (_, offset) => {
    const monthIndex = todayParts.month - 1 + offset;
    const year = todayParts.year + Math.floor(monthIndex / 12);
    const month = ((monthIndex % 12) + 12) % 12;
    return { year, month };
  });
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const currentMonth = calendarMonths[currentMonthIndex] ?? calendarMonths[0] ?? { year: todayParts.year, month: todayParts.month - 1 };
  const monthOptions = calendarMonths.map(({ year, month }, index) => ({ index, label: `${monthNames[month]} ${year}` }));
  const canGoPrev = currentMonthIndex > 0;
  const canGoNext = currentMonthIndex < calendarMonths.length - 1;
  const boliviaSpecialDateMap = Array.from(new Set(calendarMonths.map(({ year }) => year)))
    .flatMap((year) => buildBoliviaSpecialDates(year))
    .reduce((acc, event) => {
      const current = acc.get(event.dateKey) ?? [];
      acc.set(event.dateKey, [...current, event]);
      return acc;
    }, new Map<string, BoliviaSpecialDate[]>());

  const generateMonthGrid = (year: number, month: number) => {
    const firstDay = createCalendarDate(year, month, 1);
    const daysInMonth = createCalendarDate(year, month + 1, 0).getUTCDate();
    const firstWeekday = firstDay.getUTCDay();
    const totalCells = firstWeekday + daysInMonth;
    const rows = Math.ceil(totalCells / 7);

    return Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const dayNumber = rowIndex * 7 + dayIndex - firstWeekday + 1;
        if (dayNumber < 1 || dayNumber > daysInMonth) {
          return null;
        }
        return { date: createCalendarDate(year, month, dayNumber), dayNumber };
      })
    );
  };

  const openScheduleModal = (date: string, label: string, fechaProgramada?: FechaEspecial) => {
    const storedDesignIds = fechaProgramada?.design_ids ?? [];
    setScheduleDate({
      id: fechaProgramada?.id ?? null,
      date,
      label,
      designIds: storedDesignIds,
      mode: fechaProgramada ? "view" : "create",
    });
    setSelectedDesignKeys(normalizeScheduleDesignIds(storedDesignIds));
    setDateError("");
  };

  const closeScheduleModal = () => {
    setCalendarModalOpen(false);
    setScheduleDate(null);
    setSelectedDesignKeys([]);
    setDateError("");
  };

  const handleScheduleSpecialDate = async () => {
    if (!scheduleDate) return;
    setDateError("");
    const uniqueSelectedDesignKeys = Array.from(new Set(selectedDesignKeys));

    startTransition(async () => {
      const result = scheduleDate.id
        ? await actualizarFechaEspecial(scheduleDate.id, {
            fecha: scheduleDate.date,
            titulo: scheduleDate.label,
            designIds: uniqueSelectedDesignKeys,
          })
        : await crearFechaEspecial({
            fecha: scheduleDate.date,
            titulo: scheduleDate.label,
            designIds: uniqueSelectedDesignKeys,
          });
      if (result.success) {
        setScheduleDate(null);
        setSelectedDesignKeys([]);
        router.refresh();
      } else {
        setDateError(result.message || "Error al programar la fecha especial.");
      }
    });
  };

  const designItems: DesignItem[] = [
    ...tarjetas.map<DesignItem>((t) => ({
      id: t.id,
      selectionKey: encodeDesignSelectionKey("tarjetas", t.id),
      nombre: t.nombre,
      preview_url: t.design_url,
      activo: t.activo,
      section: "tarjetas",
      color_acento: t.color_acento,
      color_suave: t.color_suave,
      color_marco: t.color_marco,
      color_mensaje: t.color_mensaje,
    })),
    ...empaques.map<DesignItem>((e) => ({
      id: e.id,
      selectionKey: encodeDesignSelectionKey("cajas", e.id),
      nombre: e.nombre,
      preview_url: e.preview_url,
      activo: e.activo,
      section: "cajas",
      descripcion: e.descripcion,
    })),
    ...envolturas.map<DesignItem>((e) => ({
      id: e.id,
      selectionKey: encodeDesignSelectionKey("envolturas", e.id),
      nombre: e.nombre,
      preview_url: e.preview_url,
      activo: e.activo,
      section: "envolturas",
      descripcion: e.descripcion,
    })),
    ...listones.map<DesignItem>((l) => ({
      id: l.id,
      selectionKey: encodeDesignSelectionKey("listones", l.id),
      nombre: l.nombre,
      preview_url: l.preview_url,
      activo: l.activo,
      section: "listones",
      descripcion: l.descripcion,
    })),
  ];

  const scheduleDesignItems = designItems.filter((item) => item.section === "tarjetas" || item.section === "envolturas");

  const normalizeScheduleDesignIds = (storedDesignIds: number[]) =>
    normalizeStoredDesignIds(storedDesignIds).filter((selectionKey) =>
      scheduleDesignItems.some((item) => item.selectionKey === selectionKey)
    );

  const normalizeStoredDesignIds = (storedDesignIds: number[]) => {
    const normalized: number[] = [];

    for (const storedId of storedDesignIds) {
      const decoded = decodeDesignSelectionKey(storedId);
      if (decoded) {
        normalized.push(storedId);
        continue;
      }

      const match = designItems.find((item) => item.id === storedId);
      if (match) {
        normalized.push(match.selectionKey);
      }
    }

    return normalized;
  };

  const selectedDesignItems = scheduleDesignItems.filter((item) => selectedDesignKeys.includes(item.selectionKey));

  const filteredItems = seccion === "todos" ? designItems : designItems.filter((item) => item.section === seccion);

  const handleToggle = (item: DesignItem) => {
    startTransition(async () => {
      await toggleDesignStatus(item.id, item.section, item.activo);
      router.refresh();
    });
  };

  const handleCrear = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!archivoImagen) {
      setFormError("Por favor selecciona una imagen para la personalización.");
      return;
    }

    startTransition(async () => {
      const formDataUpload = new FormData();
      formDataUpload.append("file", archivoImagen);

      const uploadRes = await subirImagenCloudinaryAction(formDataUpload);
      if (uploadRes?.error || !uploadRes?.url) {
        setFormError(uploadRes?.error || "Error al subir la imagen.");
        return;
      }

      const designPayload = modalSection === "tarjetas"
        ? {
            section: "tarjetas" as const,
            nombre: formData.nombre.trim(),
            preview_url: uploadRes.url,
            color_acento: formData.color_acento,
            color_suave: formData.color_suave,
            color_marco: formData.color_marco,
            color_mensaje: formData.color_mensaje,
          }
        : {
            section: modalSection,
            nombre: formData.nombre.trim(),
            preview_url: uploadRes.url,
            descripcion: formData.descripcion.trim(),
          };

      const res = await crearDesign(designPayload);

      if (res.success) {
        setIsModalOpen(false);
        setFormData({
          nombre: "",
          descripcion: "",
          color_acento: "#A53E6C",
          color_suave: "#FFF3F7",
          color_marco: "#D46A92",
          color_mensaje: "#000000",
        });
        setArchivoImagen(null);
        router.refresh();
      } else {
        setFormError(res.message || "Error desconocido.");
      }
    });
  };

  const handleToggleFecha = (id: number, activo: boolean) => {
    startTransition(async () => {
      await toggleFechaEspecialStatus(id, activo);
      router.refresh();
    });
  };

  const handleEliminarFecha = (id: number) => {
    startTransition(async () => {
      await eliminarFechaEspecial(id);
      if (scheduleDate?.id === id) {
        closeScheduleModal();
      }
      router.refresh();
    });
  };

  const openDesignModal = (sections: DesignSection[], defaultSection: DesignSection) => {
    setAllowedModalSections(sections);
    setModalSection(defaultSection);
    setIsModalOpen(true);
    setFormError("");
    setArchivoImagen(null);
  };

  const openCreateDesignModal = () => {
    openDesignModal(SCHEDULE_CREATE_SECTIONS, "tarjetas");
  };

  const openGeneralDesignModal = () => {
    openDesignModal(ALL_DESIGN_SECTIONS, "tarjetas");
  };

  return (
    <div className="space-y-6 relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E1B3A]" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 bg-white p-5 rounded-2xl border border-[#8E1B3A]/10 shadow-sm">
          <p className="text-[10px] tracking-[.24em] uppercase text-[#7A5260] font-bold mb-2">Total de personalizaciones</p>
          <p className="text-4xl font-serif font-bold text-[#5A0F24]">{resumen.totalDiseños}</p>
          <p className="mt-2 text-sm text-[#7A5260]">Incluye tarjetas, cajas, envolturas y listones.</p>
        </div>
        {[
          { label: "Tarjetas", value: resumen.totalTarjetas },
          { label: "Cajas", value: resumen.totalCajas },
          { label: "Envolturas", value: resumen.totalEnvolturas },
          { label: "Listones", value: resumen.totalListones },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-[#8E1B3A]/10 shadow-sm">
            <p className="text-[10px] tracking-[.24em] uppercase text-[#7A5260] font-bold mb-2">{stat.label}</p>
            <p className="text-3xl font-serif font-bold text-[#5A0F24]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#8E1B3A]/5 bg-[#FDFBF9]/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Personalización por sección</h3>
              <p className="mt-1 text-sm text-[#7A5260]">Filtra entre todas las secciones o administra solo tarjetas, cajas, envolturas o listones.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openGeneralDesignModal}
                aria-label="Crear nueva personalización"
                className="inline-flex items-center gap-2 bg-[#8E1B3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6e152d] transition-colors shadow-sm"
              >
                <Plus size={16} /> Crear personalización
              </button>
              <button
                onClick={() => setCalendarModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#7A2A3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#5f2130] transition-colors shadow-sm"
              >
                <Calendar size={16} /> Programar fecha especial
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-[#8E1B3A]/10 bg-[#FCF8F5]">
          <div className="flex flex-wrap gap-2">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSeccion(key as Section)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition ${seccion === key ? "bg-[#8E1B3A] text-white" : "bg-white text-[#7A5260] border border-[#8E1B3A]/10 hover:bg-[#FDFBF9]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#FDFBF9]/30">
                {['Visualización', 'Nombre', 'Sección', 'Estado', 'Acciones'].map((header) => (
                  <th key={header} className="px-5 py-3 text-[10px] tracking-[2px] uppercase text-[#7A5260] font-bold border-b border-[#8E1B3A]/5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E1B3A]/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#7A5260]">
                    No hay personalizaciones en esta sección.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={`${item.section}-${item.id}`} className="hover:bg-[#FDFBF9] transition-colors">
                    <td className="px-5 py-3 w-24">
                      {item.preview_url ? (
                        <div className="relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden border border-[#8E1B3A]/10 flex-shrink-0">
                          <Image src={item.preview_url} alt={item.nombre} fill className="object-cover" sizes="64px" />
                        </div>
                      ) : (
                        <div className="w-16 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-[#2A0E18]">{item.nombre}</td>
                    <td className="px-5 py-3 text-sm text-[#7A5260] uppercase tracking-wide">{sectionDisplay[item.section]}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.activo ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                        {item.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggle(item)}
                        className="text-[11px] px-3 py-1.5 rounded-lg font-medium bg-[#F1EFE8] border border-[#8E1B3A]/10 text-[#7A5260] hover:bg-[#E5E0D8] transition-colors"
                      >
                        {item.activo ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {calendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeScheduleModal}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-4 p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#5A0F24]">Calendario de programación</h3>
                <p className="text-sm text-[#7A5260]">Selecciona cualquier fecha futura para programarla y elegir diseños.</p>
              </div>
              <button
                onClick={closeScheduleModal}
                className="text-[#7A5260] hover:text-[#5A0F24]"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_.95fr]">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
                  <div className="rounded-3xl border border-[#8E1B3A]/10 bg-[#FCF8F5] p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[.26em] text-[#7A5260]">Leyenda</p>
                    <div className="mt-3 space-y-2 text-sm text-[#7A5260]">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#8E1B3A] block" />
                        <span>Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#5A0F24] block" />
                        <span>Fecha programada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#D8D0C6] block" />
                        <span>Fecha pasada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#C98A1C] block" />
                        <span>Feriado Bolivia</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!canGoPrev}
                      onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                      className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${canGoPrev ? "border-[#8E1B3A] bg-white text-[#5A0F24] hover:bg-[#FCF8F5]" : "border-[#E5E0D8] bg-[#F7F3EE] text-[#AE9D94] cursor-not-allowed"}`}
                    >
                      ‹
                    </button>
                    <select
                      value={currentMonthIndex}
                      onChange={(e) => setCurrentMonthIndex(Number(e.target.value))}
                      className="rounded-full border border-[#8E1B3A]/10 bg-white px-4 py-2 text-sm text-[#5A0F24] focus:outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
                    >
                      {monthOptions.map((option) => (
                        <option key={option.index} value={option.index}>{option.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!canGoNext}
                      onClick={() => setCurrentMonthIndex((prev) => Math.min(calendarMonths.length - 1, prev + 1))}
                      className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${canGoNext ? "border-[#8E1B3A] bg-white text-[#5A0F24] hover:bg-[#FCF8F5]" : "border-[#E5E0D8] bg-[#F7F3EE] text-[#AE9D94] cursor-not-allowed"}`}
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#8E1B3A]/10 bg-[#FCF8F5] p-5 shadow-sm">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#5A0F24]">{monthNames[currentMonth.month]} {currentMonth.year}</p>
                      <p className="text-xs uppercase tracking-[.26em] text-[#7A5260]">Calendario de programación</p>
                    </div>
                    <p className="text-sm text-[#7A5260]">Haz clic en cualquier fecha futura para programarla.</p>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[.22em] text-[#7A5260]">
                    {weekDayNames.map((day) => (
                      <div key={day} className="py-2">{day}</div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
                    {generateMonthGrid(currentMonth.year, currentMonth.month).flat().map((date, index) => {
                      if (!date) {
                        return <div key={index} className="h-16 rounded-2xl bg-[#F7F3EE]" />;
                      }
                      const dateKey = getBoliviaDateKey(date.date);
                      const scheduledDate = scheduledDates.get(dateKey);
                      const isScheduled = Boolean(scheduledDate);
                      const isPast = dateKey < todayKey;
                      const isToday = dateKey === todayKey;
                      const specialDates = boliviaSpecialDateMap.get(dateKey) ?? [];
                      const specialTitle = specialDates.map((event) => event.label).join(" · ");
                      const primarySpecialDate = specialDates[0];
                      return (
                        <button
                          type="button"
                          key={dateKey}
                          onClick={() => {
                            if (isPast) {
                              return;
                            }

                            if (scheduledDate) {
                              openScheduleModal(dateKey, scheduledDate.titulo || "Fecha programada", scheduledDate);
                              return;
                            }

                            openScheduleModal(dateKey, isToday ? "Hoy" : "Fecha disponible");
                          }}
                          disabled={isPast || isPending}
                          className={`relative h-16 rounded-2xl border p-2 text-left transition ${
                            isScheduled
                              ? "border-[#5A0F24] bg-[#F4EDE6] ring-1 ring-[#5A0F24]/15 hover:bg-[#F0E7DD]"
                              : primarySpecialDate
                                ? "border-[#C98A1C] bg-[#FFF9E7] hover:bg-[#FFF4D5]"
                                : isPast
                                  ? "border-transparent bg-[#F7F3EE] text-[#AE9D94] cursor-not-allowed"
                                  : "border-[#8E1B3A] bg-white hover:bg-[#FCF8F5]"
                          }`}
                          title={specialTitle || scheduledDate?.titulo || `Fecha ${dateKey}`}
                        >
                          <span className={`block text-base font-semibold ${isScheduled ? "text-[#5A0F24]" : isPast ? "text-[#AE9D94]" : "text-[#5A0F24]"}`}>{date.dayNumber}</span>
                          {isToday && (
                            <span className="absolute left-2 top-2 rounded-full bg-[#8E1B3A] px-2 py-0.5 text-[10px] font-semibold text-white">Hoy</span>
                          )}
                          {primarySpecialDate && !isScheduled && (
                            <span className="absolute right-2 top-2 rounded-full bg-[#C98A1C] px-2 py-0.5 text-[10px] font-semibold text-white">
                              {primarySpecialDate.kind === "feriado" ? "Feriado" : "Especial"}
                            </span>
                          )}
                          {isScheduled && (
                            <span className="mt-1 block truncate text-[10px] leading-4 text-[#7A5260]">
                              {scheduledDate?.titulo || "Fecha programada"}
                            </span>
                          )}
                          {!isScheduled && primarySpecialDate && (
                            <span className="mt-1 block truncate text-[10px] leading-4 text-[#9A6B10]">
                              {specialDates.length > 1 ? `${primarySpecialDate.label} +${specialDates.length - 1}` : primarySpecialDate.label}
                            </span>
                          )}
                          {isScheduled && (
                            <span className="absolute right-2 top-2 rounded-full bg-[#5A0F24] px-2 py-0.5 text-[10px] font-semibold text-white">Programada</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-[#8E1B3A]/10 bg-[#FCF8F5] p-5 shadow-sm">
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[.26em] text-[#7A5260]">Programar fecha</p>
                    <h4 className="mt-2 font-serif text-lg font-bold text-[#5A0F24]">
                      {scheduleDate ? scheduleDate.label : "Selecciona una fecha del calendario"}
                    </h4>
                    <p className="mt-1 text-sm text-[#7A5260]">
                      {scheduleDate
                        ? formatBoliviaLongDate(parseDateKeyToCalendarDate(scheduleDate.date))
                        : "Cuando elijas una fecha futura, aquí podrás seleccionar los diseños que estarán habilitados."}
                    </p>
                  </div>

                  {!scheduleDate ? (
                    <div className="rounded-2xl border border-dashed border-[#8E1B3A]/15 bg-white px-4 py-6 text-sm text-[#7A5260]">
                      Las fechas ya programadas se muestran abajo dentro de este mismo modal.
                    </div>
                  ) : scheduleDate.mode === "view" ? (
                    <>
                      <div className="rounded-2xl border border-[#8E1B3A]/10 bg-white px-4 py-4 mb-4">
                        <p className="text-[10px] uppercase tracking-[.24em] text-[#7A5260]">Estado</p>
                        <p className="mt-2 text-sm font-semibold text-[#5A0F24]">Esta fecha ya fue programada.</p>
                        <p className="mt-1 text-sm text-[#7A5260]">
                          Tiene {selectedDesignItems.length} diseño{selectedDesignItems.length === 1 ? "" : "s"} asociado{selectedDesignItems.length === 1 ? "" : "s"}.
                        </p>
                      </div>

                      <div className="grid gap-2 max-h-72 overflow-auto mb-4">
                        {selectedDesignItems.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-[#8E1B3A]/15 bg-white px-4 py-6 text-sm text-[#7A5260]">
                            No hay diseños asociados a esta fecha todavía.
                          </div>
                        ) : (
                          selectedDesignItems.map((item) => (
                            <div key={`${item.section}-${item.id}`} className="flex items-center gap-3 rounded-xl border border-[#8E1B3A]/10 bg-white p-3">
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#8E1B3A]/10 bg-[#F7F3EE]">
                                {item.preview_url ? (
                                  <Image src={item.preview_url} alt={item.nombre} fill className="object-cover" sizes="48px" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[#AE9D94]">
                                    <ImageIcon size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#2A0E18]">{item.nombre}</div>
                                <div className="text-xs text-[#7A5260]">{sectionDisplay[item.section]}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.activo ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                                {item.activo ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setScheduleDate((prev) => (prev ? { ...prev, mode: "edit" } : prev))}
                          className="px-4 py-2 bg-[#FAF3EC] text-[#7A5260] rounded-lg"
                        >
                          Editar programación
                        </button>
                        <button
                          type="button"
                          onClick={() => scheduleDate.id && handleEliminarFecha(scheduleDate.id)}
                          className="px-4 py-2 bg-[#FBF0F0] text-[#A32D2D] rounded-lg"
                        >
                          Eliminar fecha
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm text-[#7A5260]">Selecciona los diseños que quieres habilitar para esta fecha.</p>
                        <button
                          type="button"
                          onClick={openCreateDesignModal}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#8E1B3A]/10 bg-white px-3 py-2 text-sm font-medium text-[#8E1B3A] hover:bg-[#FAF7F5] transition-colors"
                        >
                          <Plus size={14} />
                          Crear diseño
                        </button>
                      </div>
                      <div className="grid gap-2 max-h-72 overflow-auto mb-4">
                        {scheduleDesignItems.map((item) => {
                          const isChecked = selectedDesignKeys.includes(item.selectionKey);
                          return (
                            <label
                              key={`${item.section}-${item.id}`}
                              className={`flex items-center gap-3 rounded-xl border p-3 transition ${isChecked ? "border-[#8E1B3A]/30 bg-[#FAF7F5]" : "border-[#8E1B3A]/10 bg-white hover:bg-[#FAF7F5]"}`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDesignKeys((prev) => [...prev, item.selectionKey]);
                                  } else {
                                    setSelectedDesignKeys((prev) => prev.filter((key) => key !== item.selectionKey));
                                  }
                                }}
                              />
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#8E1B3A]/10 bg-[#F7F3EE]">
                                {item.preview_url ? (
                                  <Image src={item.preview_url} alt={item.nombre} fill className="object-cover" sizes="48px" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[#AE9D94]">
                                    <ImageIcon size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#2A0E18]">{item.nombre}</div>
                                <div className="text-xs text-[#7A5260]">{sectionDisplay[item.section]}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {dateError && <div className="bg-[#FBF0F0] text-[#A32D2D] px-3 py-2 rounded-lg text-sm mb-3">{dateError}</div>}

                  {scheduleDate && scheduleDate.mode !== "view" && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (scheduleDate.mode === "edit" && scheduleDate.id) {
                            setScheduleDate((prev) => (prev ? { ...prev, mode: "view" } : prev));
                            setSelectedDesignKeys(normalizeScheduleDesignIds(scheduleDate.designIds));
                            setDateError("");
                            return;
                          }

                          setScheduleDate(null);
                          setSelectedDesignKeys([]);
                          setDateError("");
                        }}
                        className="px-4 py-2 bg-[#FAF3EC] text-[#7A5260] rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleScheduleSpecialDate}
                        disabled={isPending}
                        className="px-4 py-2 bg-[#8E1B3A] text-white rounded-lg disabled:opacity-50"
                      >
                        {scheduleDate.mode === "edit" ? "Actualizar programación" : "Programar"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-[#8E1B3A]/10 bg-[#FCF8F5] p-5 shadow-sm">
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[.26em] text-[#7A5260]">Fechas programadas</p>
                    <h4 className="mt-2 font-serif text-lg font-bold text-[#5A0F24]">Calendario activo</h4>
                  </div>

                  <div className="space-y-3 max-h-[26rem] overflow-auto pr-1">
                      {fechasEspeciales.length === 0 ? (
                      <p className="text-sm text-[#7A5260]">No hay fechas especiales programadas todavía.</p>
                    ) : (
                      fechasEspeciales.map((fecha) => {
                        const formatted = formatBoliviaLongDate(fecha.fecha);
                        return (
                          <div key={fecha.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#8E1B3A]/10 bg-white p-4">
                            <div>
                              <p className="text-sm font-semibold text-[#5A0F24]">{fecha.titulo || "Fecha especial"}</p>
                              <p className="text-sm text-[#7A5260]">{formatted}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleFecha(fecha.id, fecha.activo)}
                                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition ${fecha.activo ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}
                              >
                                {fecha.activo ? "Activo" : "Inactivo"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEliminarFecha(fecha.id)}
                                className="p-2 rounded-lg border border-[#8E1B3A]/10 text-[#7A5260] hover:bg-[#F7F3EE] transition-colors"
                                aria-label="Eliminar fecha especial"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setArchivoImagen(null); setFormError(""); }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#8E1B3A]/10 flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#5A0F24]">Nueva personalización</h2>
                <p className="text-sm text-[#7A5260]">Elige la sección y carga la imagen de la personalización.</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setArchivoImagen(null); setFormError(""); }} className="text-[#7A5260] hover:text-[#5A0F24]">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleCrear} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="bg-[#FBF0F0] text-[#A32D2D] p-3 rounded-lg text-sm">{formError}</div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A5260]">Sección</span>
                  <select
                    value={modalSection}
                    onChange={(e) => setModalSection(e.target.value as DesignSection)}
                    className="mt-2 w-full border border-[#8E1B3A]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
                  >
                    {allowedModalSections.map((key) => (
                      <option key={key} value={key}>{sectionDisplay[key]}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A5260]">Nombre de la personalización</span>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Vintage, Minimalista..."
                    className="mt-2 w-full border border-[#8E1B3A]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
                  />
                </label>
              </div>

              {modalSection !== "tarjetas" && (
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A5260]">Descripción</span>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción breve (opcional)"
                    className="mt-2 w-full min-h-[84px] resize-none border border-[#8E1B3A]/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B3A]/20"
                  />
                </label>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A5260] mb-1">Imagen de la personalización</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setArchivoImagen(file);
                    }
                  }}
                  className="block w-full text-sm text-[#7A5260]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#FAF3EC] file:text-[#8E1B3A]
                    hover:file:bg-[#E5E0D8] transition-colors cursor-pointer"
                />
                <p className="text-[10px] text-gray-500 mt-2">Formatos: JPG, PNG, WEBP. Max 5MB.</p>
              </div>

              <div className="pt-4 border-t border-[#8E1B3A]/10 flex flex-col gap-3 sm:flex-row sm:justify-end mt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setArchivoImagen(null); setFormError(""); }}
                  className="px-4 py-2 text-sm font-medium text-[#7A5260] bg-[#FAF3EC] rounded-lg hover:bg-[#E5E0D8] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#8E1B3A] rounded-lg hover:bg-[#6e152d] transition-colors disabled:opacity-50"
                >
                  Guardar {sectionDisplay[modalSection]}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
