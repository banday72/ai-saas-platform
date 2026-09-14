import { cn } from "@/src/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-black hover:bg-amber-400 shadow-sm shadow-amber-500/20",
  secondary:
    "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700",
  outline:
    "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white",
  ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-sm rounded-xl",
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
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
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
