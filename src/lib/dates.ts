/** Todas las fechas "ISO" en este módulo son cadenas YYYY-MM-DD (comparables lexicográficamente). */

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(isoDate: string, delta: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + delta);
  return date.toISOString().slice(0, 10);
}

export function isFuture(isoDate: string): boolean {
  return isoDate > todayIso();
}

/** YYYY-MM-DD -> dd-mm-aaaa */
export function toSlug(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
}

/** dd-mm-aaaa -> YYYY-MM-DD, o null si el slug no tiene ese formato */
export function slugToIso(slug: string): string | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(slug);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

/**
 * Día del año (1-365), estable entre años bisiestos y no bisiestos.
 * Se calcula mes/día contra un año de referencia no bisiesto, así que el 29 de
 * febrero reutiliza el número del 28 y el resto del calendario no se corre
 * (evita que el 30 y 31 de diciembre terminen mostrando la misma entrada).
 */
export function dayOfYear(isoDate: string = todayIso()): number {
  const [, monthStr, dayStr] = isoDate.split("-");
  const month = Number(monthStr);
  const day = month === 2 && dayStr === "29" ? 28 : Number(dayStr);

  const REFERENCE_YEAR = 2001;
  const start = Date.UTC(REFERENCE_YEAR, 0, 1);
  const current = Date.UTC(REFERENCE_YEAR, month - 1, day);
  return Math.floor((current - start) / 86_400_000) + 1;
}

/** La Caminata de la Virgen de la Encarnación recorre 276 días, del 25 de marzo a Navidad. */
export const CAMINATA_ENCARNACION_TOTAL_DIAS = 276;

/**
 * Día del recorrido (1-276) para la fecha dada.
 * El ciclo arranca cada 25 de marzo; fuera de esa ventana (26 dic - 24 mar) se
 * sigue contando en bucle desde el 25 de marzo anterior, para que "puedes
 * incorporarte cualquier día" tenga siempre un día válido que mostrar.
 */
export function caminataEncarnacionDay(isoDate: string = todayIso()): number {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = Number(yearStr);
  const current = Date.UTC(year, Number(monthStr) - 1, Number(dayStr));

  const startThisYear = Date.UTC(year, 2, 25);
  const referenceStart = current >= startThisYear ? startThisYear : Date.UTC(year - 1, 2, 25);

  const elapsed = Math.floor((current - referenceStart) / 86_400_000);
  return (elapsed % CAMINATA_ENCARNACION_TOTAL_DIAS) + 1;
}

/** N (1-276) -> dia-NNN, mismo formato de slug que usa la colección de fortaleza. */
export function caminataEncarnacionSlug(day: number): string {
  return `dia-${String(day).padStart(3, "0")}`;
}
