import { HttpException, HttpStatus } from '@nestjs/common';

export class ProxyConfigurationError extends HttpException {
  constructor(message: string) {
    super(
      `Proxy Configuration Error: ${message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ProxyTargetUnreachableError extends HttpException {
  constructor(target: string) {
    super(`Proxy target unreachable: ${target}`, HttpStatus.BAD_GATEWAY);
  }
}

export class InvalidProxyRouteError extends HttpException {
  constructor(route: string) {
    super(`Invalid proxy route: ${route}`, HttpStatus.BAD_REQUEST);
  }
}

export class ProxyTimeoutError extends HttpException {
  constructor(timeout: number) {
    super(
      `Proxy request timeout after ${timeout}ms`,
      HttpStatus.GATEWAY_TIMEOUT,
    );
  }
}
