export function LogExecutionTime(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): void {
  const originalMethod = descriptor.value as (
    ...args: unknown[]
  ) => Promise<unknown>;

  descriptor.value = async function (...args: unknown[]): Promise<unknown> {
    const start = Date.now();
    const className = (target as { constructor: { name: string } }).constructor
      .name;

    console.log(`⏱️  [${className}] Starting ${propertyKey}`);

    try {
      const result = (await originalMethod.apply(this, args)) as unknown;
      const duration = Date.now() - start;
      console.log(
        `✅ [${className}] ${propertyKey} completed in ${duration}ms`,
      );
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(
        `❌ [${className}] ${propertyKey} failed after ${duration}ms:`,
        error,
      );
      throw error;
    }
  };
}
