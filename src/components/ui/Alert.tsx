import { cn } from "@/src/lib/utils";

type Variant = "info" | "success" | "warning" | "danger";

const styles: Record<Variant, string> = {
  info: "border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300",
  success: "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-300",
  danger: "border-red-500/30 bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-300",
};

export function Alert({
  variant = "info",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        styles[variant],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
