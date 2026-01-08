import { EventFactoryImpl, EventHandler } from "@/utils/EventFactory/EventFactoryImpl";
import { EventFactoryNames } from "@/utils/EventFactory/EventFactoryNames";

export { EventFactoryNames };

export class DisposedException extends Error {
  constructor(name: string) {
    super(`${name} has been disposed`);
  }
}

export class EventFactory {
  private static eventFactoryImpl: EventFactoryImpl | null =
    new EventFactoryImpl();

  static Subscribe(name: string, handler?: EventHandler): void {
    if (!this.eventFactoryImpl) {
      throw new DisposedException("EventFactory");
    }

    this.eventFactoryImpl.subscribe(name, handler);
  }

  static Unsubscribe(name: string, handler?: EventHandler): void {
    if (!this.eventFactoryImpl) {
      throw new DisposedException("EventFactory");
    }

    this.eventFactoryImpl.unsubscribe(name, handler);
  }

  static Publish(name: string, ...parameters: any[]): void {
    if (!this.eventFactoryImpl) {
      throw new DisposedException("EventFactory");
    }

    this.eventFactoryImpl.publish(name, ...parameters);
  }

  static HasSubscriptions(name: string): boolean {
    if (!this.eventFactoryImpl) {
      throw new DisposedException("EventFactory");
    }

    return this.eventFactoryImpl.hasSubscriptions(name);
  }

  static Dispose(): void {
    if (!this.eventFactoryImpl) {
      throw new DisposedException("EventFactory");
    }

    this.eventFactoryImpl.dispose();
    this.eventFactoryImpl = null;
  }
}
