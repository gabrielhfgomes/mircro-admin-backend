import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule} from '@nestjs/mongoose';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';
import { CategoriaSchema } from './interfaces/categorias/categoria.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:qS7JWE9YFFZHmvak@cluster0.zmmp7.mongodb.net/sradmdatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }),
    MongooseModule.forFeature([
      {name: 'Jogador', schema: JogadorSchema},
      {name: 'Categoria', schema: CategoriaSchema}
    ])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
