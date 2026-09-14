import { cn } from "@/src/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-600/50",
  secondary:
    "bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:bg-slate-800/50",
  outline:
    "border border-slate-700 text-slate-200 hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-300 hover:bg-slate-800",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
