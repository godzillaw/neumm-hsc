// Global TypeScript types for neumm-hsc

export type GTagFunction = (
  command: "config" | "event" | "js" | "set",
  targetId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>
) => void;

declare global {
  interface Window {
    gtag: GTagFunction;
  }
}
