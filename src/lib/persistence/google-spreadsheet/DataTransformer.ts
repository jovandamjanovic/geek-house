export interface DataTransformer<TEntity, TRow = TEntity> {
  rowToEntity: (row: string[]) => TRow;
  entityToRow: (entity: TEntity) => string[];
}
