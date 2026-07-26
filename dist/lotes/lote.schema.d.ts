import mongoose from 'mongoose';
import { Status, StatusValidade } from './lote.interface';
export declare const LoteSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    quantidade: number;
    produto: mongoose.Types.ObjectId;
    statusValidade: StatusValidade;
    status: Status;
    validade?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    quantidade: number;
    produto: mongoose.Types.ObjectId;
    statusValidade: StatusValidade;
    status: Status;
    validade?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    quantidade: number;
    produto: mongoose.Types.ObjectId;
    statusValidade: StatusValidade;
    status: Status;
    validade?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    quantidade: number;
    produto: mongoose.Types.ObjectId;
    statusValidade: StatusValidade;
    status: Status;
    validade?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
