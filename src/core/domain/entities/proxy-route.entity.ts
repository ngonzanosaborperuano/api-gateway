export class ProxyRouteEntity {
  constructor(
    public readonly path: string,
    public readonly target: string,
    public readonly pathRewrite?: Record<string, string>,
    public readonly changeOrigin: boolean = true,
    public readonly timeout: number = 30000,
    public readonly secure: boolean = false,
  ) {
    this.validatePath(path);
    this.validateTarget(target);
  }

  private validatePath(path: string): void {
    if (!path || !path.startsWith('/')) {
      throw new Error('Path must start with "/"');
    }
  }

  private validateTarget(target: string): void {
    if (!target || !this.isValidUrl(target)) {
      throw new Error('Target must be a valid URL');
    }
  }

  private isValidUrl(target: string): boolean {
    try {
      new URL(target);
      return true;
    } catch {
      return false;
    }
  }

  public getRewrittenPath(originalPath: string): string {
    if (!this.pathRewrite) {
      return originalPath;
    }

    let rewrittenPath = originalPath;
    for (const [pattern, replacement] of Object.entries(this.pathRewrite)) {
      const regex = new RegExp(pattern);
      rewrittenPath = rewrittenPath.replace(regex, replacement);
    }

    return rewrittenPath;
  }

  public isHealthy(): boolean {
    // En una implementación real, esto podría hacer una verificación de salud
    return true;
  }
}
