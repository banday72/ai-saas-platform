import { cn } from "@/src/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "gradient";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20",
  secondary:
    "bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10",
  outline:
    "border border-white/20 text-slate-200 hover:bg-white/5",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/20",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  gradient: "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 shadow-lg shadow-purple-500/20",
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
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
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
