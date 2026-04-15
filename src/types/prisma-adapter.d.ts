// Declaración de tipo para paquetes que solo existen dentro del contenedor Docker
// Esto silencia errores del IDE en la máquina host

declare module '@prisma/adapter-pg' {
  export class PrismaPg {
    constructor(options: { connectionString: string });
  }
}
