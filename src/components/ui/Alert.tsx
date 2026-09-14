import { cn } from "@/src/lib/utils";

type Variant = "info" | "success" | "warning" | "danger";

const styles: Record<Variant, string> = {
  info: "border-blue-500/50 bg-blue-500/10 text-blue-300",
  success: "border-green-500/50 bg-green-500/10 text-green-300",
  warning: "border-amber-500/50 bg-amber-500/10 text-amber-300",
  danger: "border-red-500/50 bg-red-500/10 text-red-300",
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
