import { cn } from "@/src/lib/utils";

type Variant = "info" | "success" | "warning" | "danger";

const styles: Record<Variant, string> = {
  info: "border-blue-500/20 bg-blue-500/5 text-blue-400",
  success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  warning: "border-amber-500/20 bg-amber-500/5 text-amber-400",
  danger: "border-red-500/20 bg-red-500/5 text-red-400",
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
        "rounded-lg border px-4 py-3 text-sm",
        styles[variant],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
