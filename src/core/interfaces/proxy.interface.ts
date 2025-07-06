export interface ProxyRoute {
  path: string;
  target: string;
  pathRewrite?: Record<string, string>;
}

export interface IProxyService {
  configureRoute(route: ProxyRoute): void;
  getMiddleware(path: string): any;
}
