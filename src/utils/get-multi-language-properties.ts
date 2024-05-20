import { getMetadataArgsStorage } from 'typeorm';

export function getMultiLanguageProperties<T>(entity: { new (): T }): string[] {
  const fields: string[] = [];
  const columns = getMetadataArgsStorage().filterColumns(entity);

  for (const column of columns) {
    const specificInterfaceField = Reflect.getMetadata(
      'MultiLanguageProperty',
      entity.prototype,
      column.propertyName,
    );
    if (specificInterfaceField) {
      fields.push(column.propertyName);
    }
  }

  return fields;
}
