import React from "react";
import cn from "../../utils/cn";

type IconActionVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive";

interface IconActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: IconActionVariant;
  children: React.ReactNode;
}

const variantClasses: Record<IconActionVariant, string> = {
  default:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
  primary:
    "text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300",
  success:
    "text-green-600 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-950 dark:hover:text-green-300",
  warning:
    "text-orange-600 hover:bg-orange-50 hover:text-orange-800 dark:text-orange-400 dark:hover:bg-orange-950 dark:hover:text-orange-300",
  destructive:
    "text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300",
};

const IconActionButton = React.forwardRef<
  HTMLButtonElement,
  IconActionButtonProps
>(
  (
    {
      label,
      variant = "default",
      type = "button",
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "group relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </button>
  ),
);

IconActionButton.displayName = "IconActionButton";

export default IconActionButton;
