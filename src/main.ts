import { ApplicationBootstrapService } from './core/bootstrap/application-bootstrap.service';

async function bootstrap() {
  try {
    await ApplicationBootstrapService.bootstrap();
  } catch (error) {
    console.error('Failed to start API Gateway:', error);
    process.exit(1);
  }
}

void bootstrap();
