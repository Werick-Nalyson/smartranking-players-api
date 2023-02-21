import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './commom/filters/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Realizar configuração do Timezone

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(8080);
}
bootstrap();
