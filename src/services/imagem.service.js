import model from '../models/imagem.model.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';

import produtoService from './produto.service.js';

class ImagemService {
    //#region IMAGENS
    
      async adicionarImagem(produtoId, file) {
        if (!file) {
          throw new Error('Arquivo não enviado', { cause: 400 });
        }
    
        const produto = await produtoService._buscarProdutoPorId(produtoId);
    
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          throw new Error('Tipo de arquivo não suportado', { cause: 400 });
        }
    
        const uploadFolder = path.resolve(process.cwd(), 'uploads', 'produtos', produtoId.toString());
        await fs.mkdir(uploadFolder, { recursive: true });
    
        const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
        const filename = `${uuidv4()}${extension}`;
        const outputPath = path.join(uploadFolder, filename);
    
        const sharp = (await import('sharp')).default;
        const metadata = await sharp(file.buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .toFile(outputPath);
    
        const relativePath = path.join('uploads', 'produtos', produtoId.toString(), filename).replace(/\\/g, '/');
        //const url = `${process.env.APP_URL || ''}/${relativePath}`;
        const url = relativePath;
    
        const imagem = await model.create({
          produto: produtoId,
          filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: outputPath,
          url,
          width: metadata.width,
          height: metadata.height
        });
    
        produto.images.push(imagem._id);
        await produto.save();
    
        return imagem;
      }
    
      async listarImagens(produtoId) {
        await produtoService._buscarProdutoPorId(produtoId);
        return await model.find({ produto: produtoId }).select('-path');
      }
    
      async removerImagem(produtoId, imagemId) {
        const imagem = await model.findById(imagemId);
        if (!imagem || imagem.produto.toString() !== produtoId) {
          throw new Error('Imagem não encontrada', { cause: 404 });
        }
    
        try {
          await fs.unlink(imagem.path);
        } catch (err) {
          // se não existir, ok, continua
        }
    
        await model.findByIdAndDelete(imagemId);
        await model.findByIdAndUpdate(produtoId, { $pull: { images: imagemId } });
    
        return { mensagem: 'Imagem removida com sucesso' };
      }
    
      //#endregion
}

export default new ImagemService();