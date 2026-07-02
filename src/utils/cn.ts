// Tiny, dependency-free className joiner. Filters out falsy values so you can
// write conditional classes inline:
//   cn("px-4", isActive && "bg-brand-600", disabled ? "opacity-50" : null)
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
