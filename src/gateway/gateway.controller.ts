import { All, Controller, HttpStatus, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxyExpress = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/usuario': '' },
});

const proxyNest = createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/api2': '' },
});

@Controller()
export class GatewayController {
  @All('api/usuario/*')
  proxyApiUsuario(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    void proxyExpress(req, res, next);
  }

  @All('api2/*')
  proxyApi2(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    void proxyNest(req, res, next);
  }

  @All('*')
  fallback(@Res() res: Response) {
    res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: 'Ruta no encontrada en el API Gateway' });
  }
}
