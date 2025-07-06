import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationBootstrapService } from './core/bootstrap/application-bootstrap.service';

async function bootstrap() {
  try {
    // Create application context to get the bootstrap service
    const app = await NestFactory.create(AppModule);
    const bootstrapService = app.get(ApplicationBootstrapService);

    // Close the temporary app and use the bootstrap service
    await app.close();

    // Use the clean bootstrap service
    await bootstrapService.bootstrap();
  } catch (error) {
    console.error('Failed to start API Gateway:', error);
    process.exit(1);
  }
}

void bootstrap();
