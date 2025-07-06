<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# API Gateway - CocinaIA

Un API Gateway robusto construido con NestJS que sigue principios **SOLID**, **DDD** (Domain-Driven Design) e **IoC** (Inversion of Control).

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── core/                           # Capa de infraestructura
│   ├── domain/                     # Entidades y Value Objects del dominio
│   │   ├── entities/
│   │   │   └── proxy-route.entity.ts
│   │   └── value-objects/
│   │       └── proxy-target.vo.ts
│   ├── interfaces/                 # Interfaces del dominio
│   │   └── proxy.interface.ts
│   ├── logging/                    # Servicios de logging
│   │   └── services/
│   │       └── logging.service.ts
│   ├── proxy/                      # Servicios de proxy
│   │   └── services/
│   │       ├── proxy-configuration.service.ts
│   │       └── proxy-factory.service.ts
│   └── core.module.ts
├── modules/                        # Módulos de la aplicación
│   ├── health/                     # Módulo de health checks
│   │   ├── controllers/
│   │   │   └── health.controller.ts
│   │   ├── services/
│   │   │   └── health.service.ts
│   │   └── health.module.ts
│   └── proxy/                      # Módulo de proxy
│       ├── controllers/
│       │   └── proxy.controller.ts
│       └── proxy.module.ts
├── shared/                         # Utilidades compartidas
│   ├── constants/
│   │   └── api-routes.constants.ts
│   ├── decorators/
│   │   └── log-execution-time.decorator.ts
│   └── exceptions/
│       └── proxy.exceptions.ts
├── app.module.ts                   # Módulo raíz
└── main.ts                         # Punto de entrada
```

## 🚀 Funcionalidades

### 1. Proxy de Rutas

- **Ruta principal**: `http://localhost:3000/api/v1/recipe` → `http://cocinando_express:3001/recipe`
- Reescritura automática de paths
- Manejo de errores robusto
- Logging detallado de peticiones

### 2. Health Checks

- **Basic**: `GET /health` - Estado básico del gateway
- **Detailed**: `GET /health/detailed` - Estado completo incluyendo servicios externos

### 3. Monitoreo de Proxy

- **Routes**: `GET /proxy/routes` - Lista de rutas configuradas
- **Status**: `GET /proxy/status` - Estado operacional del proxy

### 4. Logging Avanzado

- Logs estructurados con NestJS Logger
- Tracking de tiempo de respuesta
- Manejo de errores detallado

## 🔧 Configuración

### Variables de Entorno

```env
# Puerto del gateway
PORT=3000

# URL del servicio Express
EXPRESS_SERVICE_URL=http://cocinando_express:3001

# CORS origins permitidos
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging level
LOG_LEVEL=debug
```

### Docker Compose

El gateway está configurado para funcionar en Docker:

```yaml
api-gateway:
  container_name: api-gateway
  build:
    context: ../api-gateway
    dockerfile: Dockerfile
  env_file:
    - ../api-gateway/.env
  ports:
    - '${PORT:-3000}:3000'
  depends_on:
    - postgres
  command: npm run start:dev
  environment:
    - API_APP=0.0.0.0
    - DEBUG=http-proxy-middleware*
  networks:
    - backend_net
```

## 🏛️ Principios Aplicados

### SOLID Principles

1. **Single Responsibility**: Cada servicio tiene una responsabilidad específica
2. **Open/Closed**: Extensible para nuevas rutas sin modificar código existente
3. **Liskov Substitution**: Interfaces bien definidas para servicios
4. **Interface Segregation**: Interfaces específicas por dominio
5. **Dependency Inversion**: Inyección de dependencias con NestJS

### Domain-Driven Design (DDD)

- **Entidades**: `ProxyRouteEntity` encapsula lógica de negocio
- **Value Objects**: `ProxyTarget` con validaciones específicas
- **Servicios de Dominio**: Lógica de configuración y factory
- **Interfaces**: Contratos bien definidos

### Inversion of Control (IoC)

- Contenedor de dependencias de NestJS
- Inyección por constructor
- Configuración declarativa de módulos

## 🧪 Testing

### Health Check

```bash
curl http://localhost:3000/health
```

### Proxy Test

```bash
curl -X POST http://localhost:3000/api/v1/recipe \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Receta Test","ingredientes":["test"],"pasos":["test"]}'
```

### Proxy Status

```bash
curl http://localhost:3000/proxy/status
```

## 🚦 Comandos

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Build
npm run build

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
npm run lint:fix
```

## 📊 Monitoreo

### Logs

- Todos los requests son loggeados con tiempo de respuesta
- Errores de proxy son capturados y loggeados
- Health checks de servicios externos

### Métricas

- Tiempo de respuesta de proxies
- Estado de servicios externos
- Errores por ruta

## 🔒 Seguridad

- Validación de entrada con ValidationPipe
- CORS configurado
- Headers de seguridad
- Timeout de requests

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
