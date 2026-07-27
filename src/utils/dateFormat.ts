// Utilidades para formateo de fechas
export const formatDate = (
  date: string | Date,
  format: "full" | "date" | "time" = "date",
): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "Fecha inválida";
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  if (format === "date") {
    return `${day}/${month}/${year}`;
  }

  if (format === "time") {
    return `${hours}:${minutes}`;
  }

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatRelativeDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora mismo";
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;

  return formatDate(date);
};

export const isToday = (date: string | Date): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export const isPast = (date: string | Date): boolean => {
  return new Date(date) < new Date();
};

export const isFuture = (date: string | Date): boolean => {
  return new Date(date) > new Date();
};
