import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: Categoria) {
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`)
  }
}
