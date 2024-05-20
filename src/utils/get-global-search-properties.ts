import { getMetadataArgsStorage } from 'typeorm';

export function getGlobalSearchProperties<T>(entity: {
  new (): T;
}): (keyof T)[] {
  const fields: (keyof T)[] = [];
  const columns = getMetadataArgsStorage().columns.filter(
    (column) => column.target === entity,
  );

  for (const column of columns) {
    const specificInterfaceField = Reflect.getMetadata(
      'GlobalSearchProperty',
      entity.prototype,
      column.propertyName,
    );
    if (specificInterfaceField) {
      fields.push(column.propertyName as keyof T);
    }
  }

  return fields;
}
