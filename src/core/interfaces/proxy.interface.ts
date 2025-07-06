export interface IProxyConfiguration {
  configureProxies(app: any): void;
  getProxyRoutes(): ProxyRoute[];
}

export interface IProxyFactory {
  createProxy(route: ProxyRoute): any;
}

export interface ILoggingService {
  log(message: string): void;
  error(message: string, error?: Error): void;
  warn(message: string): void;
  debug(message: string): void;
  verbose(message: string): void;
}

export interface ProxyRoute {
  path: string;
  target: string;
  pathRewrite?: Record<string, string>;
  changeOrigin?: boolean;
}

export interface ProxyMiddlewareOptions {
  target: string;
  changeOrigin?: boolean;
  pathRewrite?: Record<string, string>;
  timeout?: number;
  secure?: boolean;
}
