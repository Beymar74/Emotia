// steps.tsx — Array de pasos del proceso (necesita JSX → archivo .tsx)
import React from "react";
import { MessageIcon, SparkleIcon, GiftIcon } from "./icons";

export const steps = [
  {
    num:   "01",
    icon:  <MessageIcon />,
    title: "Cuéntanos la historia",
    desc:  "Comparte quién es la persona, qué celebran y qué la hace única. Nuestra IA escucha con atención.",
  },
  {
    num:   "02",
    icon:  <SparkleIcon />,
    title: "La IA encuentra el match",
    desc:  "En segundos, analizamos cientos de opciones artesanales y seleccionamos las más significativas.",
  },
  {
    num:   "03",
    icon:  <GiftIcon />,
    title: "Sorprende de verdad",
    desc:  "Elige tu favorito y lo entregamos con un toque personal que hace la diferencia.",
  },
];
