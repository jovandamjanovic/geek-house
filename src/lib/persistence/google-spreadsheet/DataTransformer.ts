export interface DataTransformer<TEntity> {
    rowToEntity: (row: string[]) => TEntity;
    entityToRow: (entity: TEntity) => string[];
}