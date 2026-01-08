export interface IEventFactory {
  subscribe(name: string, handler?: (...args: any[]) => void): void;
  unsubscribe(name: string, handler?: (...args: any[]) => void): void;
  publish(name: string, ...parameters: any[]): void;
  hasSubscriptions(name: string): boolean;
  dispose(): void;
}
