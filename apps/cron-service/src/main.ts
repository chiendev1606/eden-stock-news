import { NestFactory } from '@nestjs/core';
import { CronServiceModule } from './cron-service.module';
import { CronServiceService } from './cron-service.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CronServiceModule);
  const cronService = app.get(CronServiceService);
  await cronService.getVnDirectNews();
}
bootstrap();
