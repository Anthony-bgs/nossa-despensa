"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.LocalArmazenamento = exports.Grandeza = exports.Categoria = void 0;
var Categoria;
(function (Categoria) {
    Categoria["ALIMENTO"] = "ALIMENTO";
    Categoria["BEBIDA"] = "BEBIDA";
    Categoria["HIGIENE"] = "HIGIENE";
    Categoria["LIMPEZA"] = "LIMPEZA";
    Categoria["OUTROS"] = "OUTROS";
    Categoria["AUTO_CUIDADO"] = "AUTO_CUIDADO";
})(Categoria || (exports.Categoria = Categoria = {}));
var Grandeza;
(function (Grandeza) {
    Grandeza["UNIDADE"] = "UNIDADE";
    Grandeza["KILOGRAMA"] = "KILOGRAMA";
    Grandeza["LITRO"] = "LITRO";
    Grandeza["GRAMA"] = "GRAMA";
    Grandeza["MILILITRO"] = "MILILITRO";
})(Grandeza || (exports.Grandeza = Grandeza = {}));
var LocalArmazenamento;
(function (LocalArmazenamento) {
    LocalArmazenamento["OUTRO"] = "OUTRO";
    LocalArmazenamento["GELADEIRA"] = "GELADEIRA";
    LocalArmazenamento["FREEZER"] = "FREEZER";
    LocalArmazenamento["DESPENSA"] = "DESPENSA";
    LocalArmazenamento["ARMARIO_PIA"] = "ARMARIO_PIA";
    LocalArmazenamento["ARMARIO"] = "ARM\u00C1RIO";
    LocalArmazenamento["ARMARIO_PORTA_DIREITA_ENCIMA"] = "ARMARIO_PORTA_DIREITA_ENCIMA";
    LocalArmazenamento["ARMARIO_PORTA_DIREITA_EMBAIXO"] = "ARMARIO_PORTA_DIREITA_EMBAIXO";
    LocalArmazenamento["ARMARIO_CENTRAL"] = "ARMARIO_CENTRAL";
    LocalArmazenamento["ARMARIO_GAVETA"] = "ARMARIO_GAVETA";
    LocalArmazenamento["BANHEIRO"] = "BANHEIRO";
    LocalArmazenamento["COMODA_COZINHA"] = "COMODA_COZINHA";
    LocalArmazenamento["GUARDA_ROUPA"] = "GUARDA_ROUPA";
})(LocalArmazenamento || (exports.LocalArmazenamento = LocalArmazenamento = {}));
var Status;
(function (Status) {
    Status["EM_FALTA"] = "EM_FALTA";
    Status["EM_ESTOQUE"] = "EM_ESTOQUE";
})(Status || (exports.Status = Status = {}));
//# sourceMappingURL=produto.interface.js.map