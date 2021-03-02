import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categorias/categoria.interface';
import { Jogador } from './interfaces/jogadores/jogador.interface';
import { Model } from 'mongoose';

@Injectable()
export class AppService {

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    @InjectModel('Jogador') readonly jogadorModel: Model<Jogador>) {}

  private logger = new Logger(AppService.name);

  async criarCategoria(categoria: Categoria): Promise<Categoria>{
    try {
      const categoriaCriada = new this.categoriaModel(categoria);
      return await categoriaCriada.save();
    }catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message)
    }
  }

  async consultarCategoriaPeloId(_id: string): Promise<Array<Categoria>> {
    try {
      return await this.categoriaModel.find({_id}).populate("jogadores").exec();
    } catch (error) {
      this.logger.error(`error: ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate("jogadores").exec();
  }

  async atualizarCategoria(_id: string, categoria: Categoria): Promise<void> {
    try {
      await this.categoriaModel.findOneAndUpdate({_id}, {$set: categoria}).exec()
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
