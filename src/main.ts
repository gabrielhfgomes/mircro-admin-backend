import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:lv0gWT4Gh8JA@52.87.173.178:/smartranking'],
      queue: 'admin-backend',
      queueOptions: { durable: true}
    } 
  });
  
  await app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();
