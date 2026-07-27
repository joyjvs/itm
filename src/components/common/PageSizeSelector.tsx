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
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-400">Mostrar:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-400">por página</span>
    </div>
  );
};
