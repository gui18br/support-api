export interface Job {
  name: string;
  run(offsetStart: number): Promise<void>;
}
