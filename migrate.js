import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProdutoModel from './src/models/produto.model.js';
import LoteModel from './src/models/lote.model.js';
import { StatusProduto } from './src/helpers/produto.enum.js';

// Carregar variáveis de ambiente
dotenv.config();

const migrateLotes = async () => {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado ao MongoDB');

        // Buscar produtos que têm lotes embedded (array de objetos)
        const produtosComLotesEmbedded = await ProdutoModel.find({
            lotes: { $exists: true, $type: 'array', $ne: [] },
            'lotes.0': { $exists: true }
        });

        console.log(`📊 Encontrados ${produtosComLotesEmbedded.length} produtos com lotes embedded`);

        let totalLotesMigrados = 0;

        for (const produto of produtosComLotesEmbedded) {
            const lotesIds = [];

            for (const loteData of produto.lotes) {
                // Criar lote separado
                const newLote = {
                    produto: produto._id,
                    quantidade: loteData.quantidade,
                    validade: loteData.validade,
                    numero: loteData.numero,
                    status: loteData.status
                }
                const lote = await LoteModel.create(newLote);
                lotesIds.push(lote._id);
                totalLotesMigrados++;
            }

            // Atualizar produto para usar referências
            await ProdutoModel.findByIdAndUpdate(produto._id, {
                lotes: lotesIds,
                status: produto.lotes.length > 0 ? StatusProduto.EM_ESTOQUE : StatusProduto.EM_FALTA
            });

            console.log(`✅ Produto ${produto.nome}: ${produto.lotes.length} lotes migrados`);
        }

        // Adicionar campo images: [] se não existir
        const produtosSemImages = await ProdutoModel.countDocuments({ images: { $exists: false } });
        if (produtosSemImages > 0) {
            await ProdutoModel.updateMany(
                { images: { $exists: false } },
                { $set: { images: [] } }
            );
            console.log(`✅ Adicionado campo 'images' a ${produtosSemImages} produtos`);
        }

        console.log(`🎉 Migração concluída: ${totalLotesMigrados} lotes migrados de ${produtosComLotesEmbedded.length} produtos`);

        // Desconectar
        await mongoose.disconnect();
        console.log('🔌 Desconectado do MongoDB');

    } catch (error) {
        console.error('❌ Erro durante migração:', error);
        process.exit(1);
    }
};

// Executar migração
migrateLotes();