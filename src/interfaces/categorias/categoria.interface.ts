import { Document } from 'mongoose';
import { Jogador } from 'src/interfaces/jogadores/jogador.interface';

export interface Categoria extends Document {
    readonly categoria: string;
    descricao: string;
    eventos: Array<Evento>;
    jogadores: Array<Jogador>;
}

export interface Evento {
    nome: string;
    operacao: string;
    valor: number;
}