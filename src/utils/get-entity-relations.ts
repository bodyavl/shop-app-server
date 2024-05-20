import {
  EntityTarget,
  FindOptionsRelations,
  getMetadataArgsStorage,
} from 'typeorm';

export function getEntityRelations<T>(
  entity: EntityTarget<T>,
): FindOptionsRelations<T> {
  const relations = getMetadataArgsStorage()
    .relations.filter(
      (relation) =>
        relation.target === entity && relation.relationType !== 'one-to-many',
    )
    .reduce((acc, relation) => {
      acc[relation.propertyName] = true;
      return acc;
    }, {});

  return relations;
}
