/* npm imports */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* local imports */
import { ConfigKey } from './config/enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>(ConfigKey.PORT, 4000);
  
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 Banking service running on http://localhost:${port}`);
}
bootstrap();
