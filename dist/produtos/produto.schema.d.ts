import mongoose from "mongoose";
import { Categoria, Grandeza, LocalArmazenamento, Status } from "./produto.interface";
export declare const ProdutoSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: Status;
    nome: string;
    categoria: Categoria;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    localArmazenamento: LocalArmazenamento;
    estoqueTotal: number;
    lotes: mongoose.Types.ObjectId[];
    images: mongoose.Types.ObjectId[];
    marca?: string | null | undefined;
    codigoBarras?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    status: Status;
    nome: string;
    categoria: Categoria;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    localArmazenamento: LocalArmazenamento;
    estoqueTotal: number;
    lotes: mongoose.Types.ObjectId[];
    images: mongoose.Types.ObjectId[];
    marca?: string | null | undefined;
    codigoBarras?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    status: Status;
    nome: string;
    categoria: Categoria;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    localArmazenamento: LocalArmazenamento;
    estoqueTotal: number;
    lotes: mongoose.Types.ObjectId[];
    images: mongoose.Types.ObjectId[];
    marca?: string | null | undefined;
    codigoBarras?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    status: Status;
    nome: string;
    categoria: Categoria;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    localArmazenamento: LocalArmazenamento;
    estoqueTotal: number;
    lotes: mongoose.Types.ObjectId[];
    images: mongoose.Types.ObjectId[];
    marca?: string | null | undefined;
    codigoBarras?: string | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
