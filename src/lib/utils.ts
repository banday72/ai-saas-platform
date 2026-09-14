export type ClassValue = string | number | false | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const parts: string[] = [];
  const flatten = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(flatten);
    } else {
      parts.push(String(value).trim());
    }
  };
  inputs.forEach(flatten);
  return parts.filter(Boolean).join(" ");
}
