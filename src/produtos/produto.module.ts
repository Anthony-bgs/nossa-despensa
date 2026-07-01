import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProdutoService } from "./produto.service";
import { ProdutoController } from "./produto.controller";
import { ProdutoSchema } from "./produto.schema";
import { LoteModule } from "../lotes/lote.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Produto', schema: ProdutoSchema }]),
    forwardRef(() => LoteModule),
  ],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [ProdutoService]
})
export class ProdutoModule {}
