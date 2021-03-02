import { Body, Controller, Get, Logger, Param, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria.interface';


const ackErrors: string[] = ['E11000']

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: Categoria, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`categoria: ${JSON.stringify(categoria)}`);
      await this.appService.criarCategoria(categoria);
      //Delete msg from rabbitmq
      await channel.ack(originalMsg);
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

      if(filterAckError) {
        await channel.ack(originalMsg)
      }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if(_id) {
        return await this.appService.consultarCategoriaPeloId(_id)
      } else {
        return await this.appService.consultarTodasCategorias();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id = data.id;
      const categoria: Categoria = data.categoria;
      await this.appService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMsg);
    } catch(error) {
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

      if(filterAckError) {
        await channel.ack(originalMsg)
      }
    } 


  }

}
