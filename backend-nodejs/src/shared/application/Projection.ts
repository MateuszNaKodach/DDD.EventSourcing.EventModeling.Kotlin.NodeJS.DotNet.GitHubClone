export interface Projection {
  start(): void;
  stop(): Promise<void>;
}
