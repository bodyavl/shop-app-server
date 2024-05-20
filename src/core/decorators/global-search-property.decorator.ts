export const GlobalSearchProperty =
  () => (target: any, propertyKey: string) => {
    Reflect.defineMetadata('GlobalSearchProperty', true, target, propertyKey);
  };
