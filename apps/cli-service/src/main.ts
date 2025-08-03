// src/cli.ts
import { CommandFactory } from 'nest-commander';
import { AppCliModule } from './app-cli.module';

async function bootstrap() {
  await CommandFactory.run(AppCliModule, {
    logger: ['error', 'warn', 'log'],
    errorHandler: (err) => {
      console.error('❌ Command failed:', err.message);
      process.exit(1);
    },
  });
}

bootstrap().catch((err) => {
  console.error('❌ CLI bootstrap failed:', err);
  process.exit(1);
});
