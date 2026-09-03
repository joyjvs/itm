interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  options?: number[];
}

export const PageSizeSelector = ({
  value,
  onChange,
  options = [5, 10, 20, 50],
}: PageSizeSelectorProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <label htmlFor="page-size-selector" className="font-medium">
        Mostrar
      </label>
      <select
        id="page-size-selector"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-primary"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span>por página</span>
    </div>
  );
};
