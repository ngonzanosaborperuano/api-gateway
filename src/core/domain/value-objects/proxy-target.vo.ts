export class ProxyTarget {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('Proxy target cannot be empty');
    }

    if (!this.isValidUrl(value)) {
      throw new Error('Proxy target must be a valid URL');
    }

    if (!this.isSupportedProtocol(value)) {
      throw new Error('Proxy target must use http or https protocol');
    }
  }

  private isValidUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  private isSupportedProtocol(value: string): boolean {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  }

  public equals(other: ProxyTarget): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
