import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProdutoModel from './src/models/produto.model.js';
import LoteModel from './src/models/lote.model.js';
import { LocalizacaoProduto, StatusProduto } from './src/helpers/produto.enum.js';

// Carregar variáveis de ambiente
dotenv.config();

const migrateLotes = async () => {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado ao MongoDB');

        // Buscar produtos que têm lotes embedded (array de objetos)
        const produtos = await ProdutoModel.find({
            localArmazenamento: /banheiro/i
        });

        console.log(`📊 Encontrados ${produtos.length} produtos a serem alterados`);

        let totalLotesMigrados = 0;

        for (const produto of produtos) {
            
            // Atualizar produto para usar referências
            await ProdutoModel.findByIdAndUpdate(produto._id, {
                localArmazenamento: LocalizacaoProduto.BANHEIRO,
            });

            console.log(`✅ Produto ${produto.nome}: atualizados`);
        }

        console.log(`🎉 Migração concluída: ${totalLotesMigrados} lotes migrados de ${produtos.length} produtos`);

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