import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Health Cron Worker')
    .setDescription('Applicaton for checking the health of the services')
    .setVersion('1.0')
    .setContact(
      'Bratislava Inovations',
      'https://inovacie.bratislava.sk',
      'inovacie@bratislava.sk',
    )
    .addServer('https://localhost:' + port + '/')
    .addServer('https://nest-health-worker.dev.bratislava.sk/')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.getHttpAdapter().get('/spec-json', (req, res) => res.json(document));

  await app.listen(port);
  console.log(`Nest is running on port: ${port}`);
}
bootstrap();
