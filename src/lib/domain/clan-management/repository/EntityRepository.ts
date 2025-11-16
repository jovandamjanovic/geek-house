export interface EntityRepository<T> {
  save(entity: T): Promise<T>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<T | null>;

  findAll(): Promise<T[]>;
}
