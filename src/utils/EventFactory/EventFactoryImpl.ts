import { IEventFactory } from "@/utils/EventFactory/IEventFactory";
export type EventHandler = (...args: any[]) => void;

export class EventFactoryImpl implements IEventFactory {
  private listeners: Map<string, Set<EventHandler>> | null;

  constructor() {
    this.listeners = new Map();
  }

  subscribe(name: string, handler?: EventHandler): void {
    if (!handler || !this.listeners) return;

    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }

    this.listeners.get(name)!.add(handler);
  }

  unsubscribe(name: string, handler?: EventHandler): void {
    if (!handler || !this.listeners) return;
    if (!this.listeners.has(name)) return;

    const set = this.listeners.get(name)!;
    set.delete(handler);

    if (set.size === 0) {
      this.listeners.delete(name);
    }
  }

  publish(name: string, ...parameters: any[]): void {
    if (!this.listeners || !this.listeners.has(name)) return;

    // C# Task.Run benzeri (fire-and-forget)
    queueMicrotask(() => {
      for (const listener of this.listeners!.get(name)!) {
        try {
          listener(...parameters);
        } catch (err) {
          console.error(`[EventFactory] ${name} handler error`, err);
        }
      }
    });
  }

  hasSubscriptions(name: string): boolean {
    if (!this.listeners) return false;

    return this.listeners.has(name) && this.listeners.get(name)!.size > 0;
  }

  dispose(): void {
    if (!this.listeners) {
      throw new Error("EventFactoryImpl already disposed");
    }

    this.listeners.clear();
    this.listeners = null;
  }
}
